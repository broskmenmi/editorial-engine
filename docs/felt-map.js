(() => {
  'use strict';

  const ROOT = 'https://raw.githubusercontent.com/broskmenmi/editorial-engine/main/playlists/';
  const configs = [
    { slug: 'groove-over-noise', title: 'GROOVE OVER NOISE' },
    { slug: 'strange-gait', title: 'STRANGE GAIT' },
  ];

  const groups = {
    feeling: [
      ['pressure', 'Pressure'], ['propulsion', 'Propulsion'], ['openness', 'Openness'], ['tension', 'Tension'], ['temperature', 'Temperature'],
    ],
    groove: [
      ['pulseClarity', 'Pulse clarity'], ['swing', 'Swing'], ['rhythmicStability', 'Rhythmic stability'], ['density', 'Density'], ['weightDistribution', 'Weight'],
    ],
    structure: [
      ['continuity', 'Continuity'], ['mutation', 'Mutation'], ['interruption', 'Interruption'], ['arrival', 'Arrival'], ['release', 'Release'],
    ],
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const human = value => String(value ?? '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const clock = ms => {
    if (!finite(ms)) return 'unknown time';
    const minutes = Math.round(ms / 60000);
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
  };

  function meaningfulLabel(track) {
    const labels = track.labels || [];
    const reject = /^(track-\d+|explore-run-|repair-run-|whole-journey-|listener-added$|protected-ending$|discussion-region$)/i;
    return labels.find(label => !reject.test(label)) || null;
  }

  function direction(track) {
    return track.felt?.direction || (meaningfulLabel(track) ? human(meaningfulLabel(track)) : human(track.role || track.storyBand || 'state not yet described'));
  }

  function provenance(track) {
    return human(track.felt?.evidence?.class || (track.felt?.direction ? 'editorial interpretation' : 'editorial fallback'));
  }

  function dimension(track, key) {
    const raw = track.felt?.dimensions?.[key];
    if (raw == null) return { value: 'unknown', evidence: 'unknown' };
    if (typeof raw === 'string') return { value: human(raw), evidence: human(track.felt?.evidence?.class || 'editorial interpretation') };
    return {
      value: human(raw.value ?? raw.state ?? 'unknown'),
      evidence: human(raw.evidenceClass ?? track.felt?.evidence?.class ?? 'editorial interpretation'),
    };
  }

  function grooveWords(track) {
    const words = (track.labels || []).filter(label => /(groove|swing|pulse|rhythm|broken|funk|lock|stagger|drum|percussion|re-ground)/i.test(label));
    return words.length ? words.map(human).join(' · ') : 'No groove mechanics are documented for this track yet.';
  }

  function lesson(track, view) {
    const text = `${direction(track)} ${(track.labels || []).join(' ')}`.toLowerCase();
    if (view === 'tempo') return 'BPM is tempo metadata, not an energy score. Perceived speed also depends on subdivision, pulse clarity, syncopation, density and where rhythmic weight lands.';
    if (/swing|stagger/.test(text)) return 'Swing changes where events sit between the main beats. The BPM can remain identical while the body experiences a looser, heavier or more unstable forward motion.';
    if (/broken|fracture|unpredictable|redirection|deformation/.test(text)) return 'A broken groove does not automatically stop propulsion. The ear can keep a larger pulse while kicks or percussion move away from the most obvious grid positions.';
    if (/reset|re-ground|consolidat|lock/.test(text)) return 'Re-grounding is powerful because stability is relational: a plain pulse can feel dramatically stronger after the ear has spent time tracking ambiguity or displacement.';
    if (/release|decompress|dissolution/.test(text)) return 'Release is not simply lower BPM or lower loudness. It can come from fewer competing events, more space, reduced harmonic or rhythmic demand, or a clearer pulse.';
    if (/build|rise|intensif|accumul|summit/.test(text)) return 'Pressure and density are different variables. A sequence can accumulate tension through repetition, withheld resolution or rhythmic insistence without simply adding more sound.';
    if (/mutation|transform|machine-to-hand|overture/.test(text)) return 'Structural mutation changes the listener’s grammar while a track is playing. That can make the next transition feel earned before the next track even starts.';
    return 'In techno, flow is often carried by relationships between pulse, repetition, tension and attention rather than by stylistic sameness. Listen for what survives the change, not only what changes.';
  }

  function renderDimensions(track, view) {
    if (view === 'tempo') {
      return `<div class="felt-dims"><div class="felt-dim"><span class="felt-dim-name">BPM</span><span class="felt-dim-value">${finite(track.bpm) ? esc(track.bpm) : 'unknown'}</span><span class="felt-dim-ev">metadata</span></div><div class="felt-dim"><span class="felt-dim-name">Duration</span><span class="felt-dim-value">${esc(clock(track.durationMs))}</span><span class="felt-dim-ev">metadata</span></div></div>`;
    }
    if (view === 'structure') {
      return `<div class="felt-dims"><div class="felt-dim"><span class="felt-dim-name">Chapter</span><span class="felt-dim-value">${esc(human(track.chapter))}</span><span class="felt-dim-ev">editorial</span></div><div class="felt-dim"><span class="felt-dim-name">Story state</span><span class="felt-dim-value">${esc(human(track.storyBand))}</span><span class="felt-dim-ev">editorial</span></div><div class="felt-dim"><span class="felt-dim-name">Role</span><span class="felt-dim-value">${esc(track.role || 'unknown')}</span><span class="felt-dim-ev">editorial</span></div></div>`;
    }
    return `<div class="felt-dims">${groups[view].map(([key, label]) => {
      const item = dimension(track, key);
      const unknown = item.value === 'unknown';
      return `<div class="felt-dim"><span class="felt-dim-name">${esc(label)}</span><span class="felt-dim-value ${unknown ? 'felt-unknown' : ''}">${esc(item.value)}</span><span class="felt-dim-ev">${esc(item.evidence)}</span></div>`;
    }).join('')}</div>`;
  }

  function renderCard(track, index, selected, view) {
    const viewLine = view === 'tempo'
      ? `${finite(track.bpm) ? `${track.bpm} BPM` : 'BPM unknown'}`
      : view === 'structure'
        ? `${human(track.chapter)} · ${human(track.storyBand)}`
        : view === 'groove'
          ? grooveWords(track)
          : direction(track);
    const state = track.status === 'frozen' ? 'frozen' : track.status === 'protected' || track.protected ? 'protected' : '';
    return `<li><button type="button" class="felt-card ${state}" data-felt-index="${index}" aria-pressed="${index === selected}" aria-label="Track ${track.position}: ${esc(track.artist)} — ${esc(track.track)}">
      <span class="felt-no">TRACK ${String(track.position).padStart(2, '0')}</span>
      <span class="felt-track">${esc(track.track)}<span class="felt-artist">${esc(track.artist)}</span></span>
      <span class="felt-vector">${esc(viewLine)}</span>
      <span class="felt-meta"><span>${finite(track.bpm) ? `${track.bpm} BPM` : 'BPM —'}</span><span class="felt-provenance">${esc(provenance(track))}</span></span>
    </button></li>`;
  }

  function renderContext(model, index) {
    const start = Math.max(0, index - 2);
    const end = Math.min(model.tracks.length, index + 3);
    return `<div class="felt-context" aria-label="Five-track context">${model.tracks.slice(start, end).map((track, offset) => {
      const absolute = start + offset;
      return `<div class="felt-context-item ${absolute === index ? 'current' : ''}"><span>${absolute === index ? 'HERE' : `#${track.position}`}</span><strong title="${esc(track.track)}">${esc(track.track)}</strong><span>${esc(track.artist)}</span></div>`;
    }).join('')}</div>`;
  }

  function install(config, model) {
    const section = document.getElementById(config.slug);
    if (!section || section.querySelector('[data-felt-shell]')) return;
    const workspace = section.querySelector('.workspace');
    if (!workspace) return;
    workspace.classList.add('felt-workspace-legacy');

    const shell = document.createElement('section');
    shell.className = 'felt-shell';
    shell.dataset.feltShell = 'true';
    workspace.parentNode.insertBefore(shell, workspace);

    const state = { selected: 0, view: 'feeling' };
    const latest = model.totals?.latestAddedDate;
    if (latest) {
      const latestIndex = model.tracks.findIndex(track => track.added === latest);
      if (latestIndex >= 0) state.selected = latestIndex;
    }

    function paint() {
      const track = model.tracks[state.selected];
      const tabs = [['feeling', 'Feeling'], ['groove', 'Groove'], ['structure', 'Structure'], ['tempo', 'Tempo']];
      const incoming = model.transitions?.find(edge => edge.toUri === track.uri);
      const outgoing = model.transitions?.find(edge => edge.fromUri === track.uri);
      const inDelta = incoming && finite(incoming.bpmDelta) ? `${incoming.bpmDelta > 0 ? '+' : ''}${incoming.bpmDelta}` : '—';
      const outDelta = outgoing && finite(outgoing.bpmDelta) ? `${outgoing.bpmDelta > 0 ? '+' : ''}${outgoing.bpmDelta}` : '—';
      const summary = track.felt?.summary || track.role || `Editorial direction: ${direction(track)}.`;
      shell.innerHTML = `<div class="felt-head"><div><p class="felt-kicker">Default journey view · evidence-bound</p><h3>What happens to the listener?</h3><p>Direction first. Groove mechanics and structure explain why. Tempo stays separate. Unknown qualities are left unknown instead of being converted into fake energy scores.</p></div></div>
        <div class="felt-tabs" role="group" aria-label="${esc(config.title)} journey views">${tabs.map(([key, label]) => `<button type="button" class="felt-tab" data-felt-view="${key}" aria-pressed="${state.view === key}">${label}</button>`).join('')}</div>
        <div class="felt-rail-wrap" tabindex="0" role="region" aria-label="Scrollable felt journey"><ol class="felt-rail">${model.tracks.map((item, index) => renderCard(item, index, state.selected, state.view)).join('')}</ol></div>
        <div class="felt-detail"><div class="felt-panel"><p class="felt-kicker">TRACK ${String(track.position).padStart(2, '0')} / ${model.tracks.length}</p><h4>${esc(track.track)} <span class="felt-artist">${esc(track.artist)}</span></h4><p class="felt-direction">→ ${esc(direction(track))}</p><p>${esc(summary)}</p>${renderContext(model, state.selected)}<p class="felt-position">Whole journey: ${esc(human(track.chapter))} · starts ${esc(clock(track.startMs))} · incoming BPM Δ ${esc(inDelta)} · outgoing BPM Δ ${esc(outDelta)}.</p></div>
          <div class="felt-panel"><p class="felt-kicker">${esc(state.view)} lens</p>${state.view === 'groove' ? `<p>${esc(grooveWords(track))}</p>` : ''}${renderDimensions(track, state.view)}<p class="felt-lesson"><strong>Techno lens.</strong> ${esc(lesson(track, state.view))}</p><p class="felt-position">Provenance: ${esc(provenance(track))}. Unknown means the repository does not currently have lawful support for that quality.</p></div></div>`;

      shell.querySelectorAll('[data-felt-view]').forEach(button => button.addEventListener('click', () => { state.view = button.dataset.feltView; paint(); }));
      shell.querySelectorAll('[data-felt-index]').forEach(button => button.addEventListener('click', () => { state.selected = Number(button.dataset.feltIndex); paint(); requestAnimationFrame(() => shell.querySelector(`[data-felt-index="${state.selected}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' })); }));
    }
    paint();
  }

  configs.forEach(async config => {
    try {
      const response = await fetch(`${ROOT}${config.slug}/journey-map.json`, { cache: 'no-store' });
      if (!response.ok) return;
      const model = await response.json();
      let attempts = 0;
      const mountWhenReady = () => {
        if (document.getElementById(config.slug)?.querySelector('.workspace')) return install(config, model);
        if (attempts++ < 40) window.setTimeout(mountWhenReady, 50);
      };
      mountWhenReady();
    } catch (_) {
      // The original journey renderer owns the playlist-level load error state.
    }
  });
})();
