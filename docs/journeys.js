(() => {
  'use strict';
  const ROOT = 'https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/';
  const configs = [
    { slug: 'groove-over-noise', cls: 'gon', title: 'GROOVE OVER NOISE', number: '01', intro: 'Waves of pressure. A gradual release. Groove before noise.' },
    { slug: 'strange-gait', cls: 'sg', title: 'STRANGE GAIT', number: '02', intro: 'The music may change character. The flow must not feel accidental.' },
  ];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const clock = ms => {
    if (!finite(ms)) return 'Unknown';
    const seconds = Math.round(ms / 1000), minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  };
  const duration = ms => {
    if (!finite(ms)) return 'Unknown';
    const minutes = Math.round(ms / 60000);
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  };
  const approximate = track => /fallback|estimate/i.test(track.durationSource || '') || !track.durationSource;
  const delta = value => finite(value) ? `${value > 0 ? '+' : ''}${value} BPM` : 'BPM unknown';
  const spotifyHref = track => /^spotify:track:[A-Za-z0-9]{22}$/.test(track.uri || '') ? `https://open.spotify.com/track/${track.uri.split(':')[2]}` : null;
  const mount = document.getElementById('mount');

  function createSection(config) {
    const section = document.createElement('section');
    section.id = config.slug;
    section.className = `playlist ${config.cls}`;
    section.setAttribute('aria-labelledby', `${config.slug}-title`);
    section.innerHTML = `
      <header class="playlist-head">
        <div><p class="eyebrow">${config.number} / Ordered listening</p>
          <h2 id="${config.slug}-title">${esc(config.title)}</h2>
          <p class="playlist-intro">${esc(config.intro)}</p></div>
        <dl class="stats" data-stats aria-label="Playlist statistics"></dl>
      </header>
      <div class="loading" data-loading role="status">Loading the journey…</div>
      <div class="error-panel" data-error role="alert" hidden></div>
      <div data-content hidden>
        <div class="workspace">
          <div class="map-panel">
            <div class="toolbar" role="group" aria-label="${esc(config.title)} chart layers">
              <span class="toolbar-label">Show</span>
              <button class="layer" data-layer="story" aria-pressed="true">Story</button>
              <button class="layer" data-layer="bpm" aria-pressed="true">BPM</button>
              <button class="layer" data-layer="chapters" aria-pressed="true">Chapters</button>
              <button class="layer" data-layer="states" aria-pressed="true">States</button>
            </div>
            <div class="chart-scroll" tabindex="0" role="region" aria-label="Scrollable ${esc(config.title)} timeline">
              <svg class="chart" role="group" aria-label="${esc(config.title)}: select a track to inspect its place in the journey"></svg>
            </div>
            <div class="state-legend" data-legend>
              <span><i></i>Provisional</span><span><i class="protected-key"></i>Protected track</span>
              <span><i class="frozen-key"></i>Frozen</span><span><i class="handoff-key"></i>Protected handoff</span>
            </div>
            <p class="chart-caption">Story is editorial interpretation, not measured energy. BPM is shown on its own scale.</p>
          </div>
          <aside class="track-detail" data-detail aria-label="Selected track details" tabindex="-1"></aside>
        </div>
        <ul class="chapter-list" data-chapters aria-label="Journey chapters"></ul>
        <p class="data-warning" data-warning hidden></p>
        <details class="track-panel">
          <summary>Track list <span class="track-count" data-count></span></summary>
          <ol class="track-list" data-tracks></ol>
        </details>
        <div class="evidence-note"><p data-time-note></p><p data-updated></p></div>
      </div>`;
    mount.appendChild(section);
    return section;
  }

  function init(config) {
    const el = createSection(config), q = selector => el.querySelector(selector);
    const state = { model: null, selected: 0, estimated: false, layers: { story: true, bpm: true, chapters: true, states: true } };

    function select(index, focusTarget) {
      state.selected = Math.max(0, Math.min(state.model.tracks.length - 1, index));
      renderDetail(); renderChart(); updateRows();
      if (focusTarget === 'point') {
        const point = q(`[data-point="${state.selected}"]`);
        point?.focus({ preventScroll: true });
        point?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } else if (focusTarget === 'detail') {
        q('[data-detail]').focus({ preventScroll: true });
        q('[data-detail]').scrollIntoView({ block: 'nearest' });
      }
    }

    function renderMeta() {
      const m = state.model, known = m.tracks.map(t => t.bpm).filter(finite);
      const range = known.length ? `${Math.min(...known)}–${Math.max(...known)}` : 'Unknown';
      const stats = [['Tracks', m.tracks.length], [state.estimated ? 'Estimated length' : 'Duration', `${state.estimated ? '≈ ' : ''}${duration(m.totals.durationMs)}`], ['BPM range', range]];
      q('[data-stats]').innerHTML = stats.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('');
      q('[data-count]').textContent = `· ${m.tracks.length} tracks`;
      q('[data-time-note]').textContent = state.estimated ? 'Estimated timeline · one or more track durations use fallback values.' : 'Elapsed time and BPM from track metadata.';
      const date = new Date(m.generatedAt);
      q('[data-updated]').textContent = Number.isNaN(date.valueOf()) ? 'Map update time unavailable' : `Map updated ${date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`;
      const warnings = (m.warnings || []).map(w => typeof w === 'string' ? w : w.message || '').filter(Boolean);
      q('[data-warning]').hidden = !warnings.length;
      q('[data-warning]').textContent = warnings.join(' ');
    }

    function renderChapters() {
      const m = state.model;
      q('[data-chapters]').innerHTML = (m.chapters || []).map(ch => {
        const tracks = m.tracks.filter(t => t.chapter === ch.id);
        const estimated = tracks.some(approximate);
        return `<li><span class="chapter-name">${esc(ch.label)}</span><span class="chapter-meta">${ch.startPosition}–${ch.endPosition} · ${estimated ? '≈ ' : ''}${duration(ch.endMs - ch.startMs)}</span></li>`;
      }).join('');
    }

    function renderDetail() {
      const m = state.model, t = m.tracks[state.selected];
      if (!t) { q('[data-detail]').innerHTML = '<p class="detail-placeholder">No canonical tracks yet.</p>'; return; }
      const chapter = m.chapters?.find(ch => ch.id === t.chapter);
      const incoming = m.transitions?.find(edge => edge.toUri === t.uri);
      const outgoing = m.transitions?.find(edge => edge.fromUri === t.uri);
      const handoff = (edge, direction) => {
        const other = edge && m.tracks.find(track => track.uri === (direction === 'From' ? edge.fromUri : edge.toUri));
        return `<div class="handoff"><span class="handoff-label">${direction === 'From' ? 'Previous track' : 'Next track'}</span>${other ? `${esc(other.track)}<small>${delta(edge.bpmDelta)}</small>${edge.protected ? '<small class="protected-note">Protected handoff</small>' : ''}${edge.frozen ? '<small>Frozen region</small>' : ''}` : (direction === 'From' ? 'Opening track' : 'End of current sequence')}</div>`;
      };
      const status = t.status === 'frozen' ? 'frozen' : t.protected ? 'protected' : t.status || 'Unknown';
      const url = spotifyHref(t);
      q('[data-detail]').innerHTML = `
        <div class="detail-top"><span class="detail-number">TRACK ${String(t.position).padStart(2, '0')} / ${m.tracks.length}</span>
          <div class="stepper"><button data-step="-1" aria-label="Previous track" ${state.selected === 0 ? 'disabled' : ''}>‹</button><button data-step="1" aria-label="Next track" ${state.selected === m.tracks.length - 1 ? 'disabled' : ''}>›</button></div></div>
        <h3>${esc(t.track)}</h3><p class="detail-artist">${esc(t.artist)}</p>
        <span class="status ${esc(status)}">${esc(status)}${t.status === 'frozen' && t.protected ? ' · protected' : ''}</span>
        <p class="detail-role">${esc(t.role)}</p>
        <dl class="detail-facts"><div><dt>BPM · metadata</dt><dd>${finite(t.bpm) ? t.bpm : 'Unknown'}</dd></div>
          <div><dt>${approximate(t) ? 'Estimated duration' : 'Duration'}</dt><dd>${approximate(t) ? '≈ ' : ''}${clock(t.durationMs)}</dd></div>
          <div><dt>Chapter</dt><dd>${esc(chapter?.label || t.chapter || 'Unassigned')}</dd></div>
          <div><dt>${state.estimated ? 'Estimated start' : 'Elapsed start'}</dt><dd>${state.estimated ? '≈ ' : ''}${clock(t.startMs)}</dd></div></dl>
        <div class="handoffs">${handoff(incoming, 'From')}${handoff(outgoing, 'To')}</div>
        <details class="detail-evidence"><summary>Evidence & labels</summary><p>Duration source: ${esc(t.durationSource || 'Unknown')}.</p><p>${esc((t.labels || []).join(' · ') || 'No additional labels.')}</p><p>Roles and chapter labels are editorial interpretation.</p></details>
        ${url ? `<a class="spotify-link" href="${url}" target="_blank" rel="noopener noreferrer">Open on Spotify ↗</a>` : ''}`;
      q('[data-detail]').querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
        const step = Number(button.dataset.step);
        select(state.selected + step);
        const replacement = q(`[data-step="${step}"]`);
        (replacement.disabled ? q(`[data-step="${-step}"]`) : replacement).focus({ preventScroll: true });
      }));
    }

    function updateRows() {
      q('[data-tracks]').querySelectorAll('[data-track]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.track) === state.selected)));
    }
    function renderTracks() {
      q('[data-tracks]').innerHTML = state.model.tracks.map((t, index) => `<li><button class="track-row" data-track="${index}" aria-pressed="${index === state.selected}" aria-label="Track ${t.position}: ${esc(t.artist)} — ${esc(t.track)}. Show details.">
        <span class="track-number">${String(t.position).padStart(2, '0')}</span>
        <span><span class="track-title">${esc(t.track)}</span><span class="track-artist">${esc(t.artist)}</span></span>
        <span class="row-status ${esc(t.status)}" ${state.layers.states ? '' : 'style="visibility:hidden"'}>${esc(t.status)}</span>
        <span class="track-tempo">${finite(t.bpm) ? t.bpm : '—'}<small>BPM</small></span>
        <span class="track-duration">${approximate(t) ? '≈' : ''}${clock(t.durationMs)}</span></button></li>`).join('');
    }

    function renderChart() {
      if (!state.model) return;
      const m = state.model, ts = m.tracks, svg = q('.chart');
      if (!ts.length) { svg.innerHTML = ''; return; }
      const minWidth = Math.max(780, ts.length * 30 + 100);
      svg.style.minWidth = `${minWidth}px`;
      const W = Math.max(minWidth, q('.chart-scroll').clientWidth), H = svg.clientHeight || 430;
      const left = 48, right = W - 34, width = right - left;
      const total = m.totals.durationMs;
      const x = t => left + (t.midpointMs / total) * width;
      const edgeX = ms => left + (ms / total) * width;
      const storyTop = 64, storyBottom = H * .46, tempoTop = H * .65, tempoBottom = H - 76, rail = H - 46;
      const stories = ts.map(t => t.storyLevel).filter(finite), bpms = ts.map(t => t.bpm).filter(finite);
      const minS = Math.min(...stories, 0), maxS = Math.max(...stories, 1) + .5;
      const minB = bpms.length ? Math.min(...bpms) - 2 : 0, maxB = bpms.length ? Math.max(...bpms) + 2 : 1;
      const yS = t => storyBottom - ((t.storyLevel - minS) / (maxS - minS)) * (storyBottom - storyTop);
      const yB = t => tempoBottom - ((t.bpm - minB) / (maxB - minB)) * (tempoBottom - tempoTop);
      const path = (field, y) => { let connected = false; return ts.map(t => {
        if (!finite(t[field])) { connected = false; return ''; }
        const d = `${connected ? 'L' : 'M'}${x(t).toFixed(2)},${y(t).toFixed(2)}`; connected = true; return d;
      }).join(' '); };
      const selected = ts[state.selected];
      let out = `<title>${esc(config.title)} journey</title><desc>Separate editorial story and BPM lanes. Use arrow keys to move between tracks. ${state.estimated ? 'The time axis is estimated.' : 'The horizontal axis is elapsed time.'} The complete sequence is also available in the track list.</desc>`;
      if (state.layers.chapters) (m.chapters || []).forEach((ch, index) => {
        const a = edgeX(ch.startMs), b = edgeX(ch.endMs);
        if (index % 2 === 0) out += `<rect class="chapter-band" x="${a}" y="34" width="${b-a}" height="${rail-18}"/>`;
        out += `<line class="chapter-line" x1="${a}" x2="${a}" y1="34" y2="${rail+16}"/>`;
      });
      out += `<rect class="selected-band" x="${edgeX(selected.startMs)}" y="34" width="${edgeX(selected.endMs)-edgeX(selected.startMs)}" height="${rail-18}"/>`;
      if (state.layers.story) {
        out += `<text class="lane-label" x="${left}" y="24">Editorial story</text><line class="grid" x1="${left}" x2="${right}" y1="${storyBottom}" y2="${storyBottom}"/>`;
        out += `<path class="story-line" d="${path('storyLevel', yS)}"/>`;
      }
      if (state.layers.bpm) {
        out += `<text class="lane-label" x="${left}" y="${tempoTop-20}">BPM · metadata</text>`;
        [minB, Math.round((minB+maxB)/2), maxB].forEach(value => {
          const yy = yB({ bpm: value });
          out += `<line class="grid" x1="${left}" x2="${right}" y1="${yy}" y2="${yy}"/><text x="${left-10}" y="${yy+4}" text-anchor="end">${value}</text>`;
        });
        out += `<path class="tempo-line" d="${path('bpm', yB)}"/>`;
      }
      if (state.layers.states) (m.transitions || []).filter(edge => edge.protected).forEach(edge => {
        const from = ts.find(t => t.uri === edge.fromUri), to = ts.find(t => t.uri === edge.toUri);
        if (from && to) out += `<line x1="${x(from)}" x2="${x(to)}" y1="${rail-18}" y2="${rail-18}" stroke="var(--blue)" stroke-width="3"><title>Protected handoff: ${esc(from.track)} → ${esc(to.track)}</title></line>`;
      });
      ts.forEach((t, index) => {
        const xx = x(t), yy = state.layers.story && finite(t.storyLevel) ? yS(t) : state.layers.bpm && finite(t.bpm) ? yB(t) : rail-30;
        const frozen = state.layers.states && t.status === 'frozen', protectedTrack = state.layers.states && t.protected;
        const color = frozen ? 'var(--amber)' : protectedTrack ? 'var(--blue)' : index === state.selected ? 'var(--accent)' : '#abb0b8';
        let mark = `<circle cx="${xx}" cy="${yy}" r="4" fill="${index === state.selected ? color : 'var(--surface)'}" stroke="${color}" stroke-width="1.5"/>`;
        if (frozen) mark = `<rect x="${xx-4}" y="${yy-4}" width="8" height="8" fill="${color}"/>`;
        else if (protectedTrack) mark = `<path d="M${xx},${yy-6} l6,6 -6,6 -6,-6 Z" fill="${color}"/>`;
        out += `<g class="point ${index === state.selected ? 'selected' : ''}" data-point="${index}" tabindex="${index === state.selected ? '0' : '-1'}" role="button" aria-pressed="${index === state.selected}" aria-label="Track ${t.position}: ${esc(t.artist)} — ${esc(t.track)}${state.layers.states ? `, ${esc(t.status)}` : ''}"><rect class="hit" x="${xx-14}" y="${Math.min(yy-22,rail-22)}" width="28" height="${rail-Math.min(yy-22,rail-22)+22}" fill="transparent" rx="3"/>${mark}<text class="point-label" x="${xx}" y="${rail+4}" text-anchor="middle">${t.position}</text></g>`;
      });
      [0, .25, .5, .75, 1].forEach((progress, index) => {
        out += `<text x="${left+progress*width}" y="${H-10}" text-anchor="${index === 0 ? 'start' : index === 4 ? 'end' : 'middle'}">${state.estimated ? '≈ ' : ''}${clock(total*progress)}</text>`;
      });
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = out;
    }

    q('.toolbar').addEventListener('click', event => {
      const button = event.target.closest('[data-layer]'); if (!button || !state.model) return;
      state.layers[button.dataset.layer] = !state.layers[button.dataset.layer];
      button.setAttribute('aria-pressed', String(state.layers[button.dataset.layer]));
      q('[data-legend]').hidden = !state.layers.states;
      q('[data-chapters]').hidden = !state.layers.chapters;
      renderChart(); renderTracks();
    });
    q('[data-tracks]').addEventListener('click', event => {
      const button = event.target.closest('[data-track]'); if (button) select(Number(button.dataset.track), 'detail');
    });
    q('.chart').addEventListener('click', event => {
      const point = event.target.closest('[data-point]'); if (point) select(Number(point.dataset.point), 'point');
    });
    q('.chart').addEventListener('keydown', event => {
      const point = event.target.closest('[data-point]'); if (!point) return;
      const index = Number(point.dataset.point);
      const moves = { ArrowRight: index+1, ArrowLeft: index-1, ArrowDown: index+1, ArrowUp: index-1, Home: 0, End: state.model.tracks.length-1, Enter: index, ' ': index };
      if (event.key in moves) { event.preventDefault(); select(moves[event.key], 'point'); }
    });
    new ResizeObserver(() => { if (state.model) renderChart(); }).observe(q('.chart-scroll'));

    async function load() {
      q('[data-loading]').hidden = false; q('[data-error]').hidden = true;
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(`${ROOT}${config.slug}/journey-map.json`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error(`Data request failed (${response.status}).`);
        const model = await response.json();
        if (model.playlist?.slug !== config.slug || !Array.isArray(model.tracks) || !model.totals) throw new Error('The journey data does not match this playlist.');
        if (model.tracks.length && (!finite(model.totals.durationMs) || model.totals.durationMs <= 0 || model.tracks.some(t => !finite(t.startMs) || !finite(t.endMs) || !finite(t.midpointMs)))) throw new Error('The journey timeline is incomplete.');
        state.model = model; state.estimated = model.tracks.some(approximate);
        renderMeta(); renderDetail(); renderChapters(); renderTracks();
        q('[data-content]').hidden = false;
        if (!model.tracks.length) { q('.map-panel').hidden = true; q('[data-detail]').innerHTML = '<p class="empty">No canonical tracks yet.</p>'; }
        renderChart();
      } catch (error) {
        q('[data-error]').hidden = false;
        q('[data-error]').innerHTML = `<strong>This journey could not load.</strong><br>${esc(error.name === 'AbortError' ? 'The data request timed out.' : error.message)}<button data-retry>Try again</button>`;
        q('[data-retry]').addEventListener('click', load, { once: true });
      } finally { clearTimeout(timeout); q('[data-loading]').hidden = true; }
    }
    load();
    return el;
  }
  const sections = configs.map(init);
  const links = [...document.querySelectorAll('.nav-link')];
  const updateNavigation = () => {
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 160) || sections[0];
    links.forEach(link => { if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  };
  let queued = false;
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; updateNavigation(); }); } }, { passive: true });
  updateNavigation();
})();
