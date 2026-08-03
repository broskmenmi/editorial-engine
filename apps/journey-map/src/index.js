import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';
const DEFAULT_DURATION_MS = 6 * 60 * 1000;

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((value) => value.trim());
}

function parseLedger(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.includes('| # |') && line.includes('Spotify URI'));
  if (headerIndex < 0) throw new Error('Ledger table not found.');

  const headers = splitRow(lines[headerIndex]);
  const indexes = {
    position: headers.indexOf('#'),
    artist: headers.indexOf('Artist'),
    track: headers.indexOf('Track'),
    uri: headers.indexOf('Spotify URI'),
    bpm: headers.indexOf('BPM'),
    role: headers.indexOf('Structural role'),
    added: headers.indexOf('Added'),
  };

  for (const [name, index] of Object.entries(indexes)) {
    if (index < 0) throw new Error(`Ledger column missing: ${name}`);
  }

  const rows = [];
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim().startsWith('|')) break;
    const cells = splitRow(line);
    const position = Number.parseInt(cells[indexes.position], 10);
    const bpm = Number.parseFloat(cells[indexes.bpm]);
    const uri = cells[indexes.uri];
    if (!Number.isInteger(position) || !Number.isFinite(bpm) || !/^spotify:track:[A-Za-z0-9]{22}$/.test(uri)) {
      throw new Error(`Invalid ledger row ${index + 1}.`);
    }
    rows.push({
      position,
      artist: cells[indexes.artist],
      track: cells[indexes.track],
      uri,
      bpm,
      role: cells[indexes.role],
      added: cells[indexes.added],
    });
  }

  rows.forEach((row, index) => {
    if (row.position !== index + 1) throw new Error('Ledger positions must be consecutive.');
  });
  return rows;
}

function stableHash(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function shortLabel(value, max = 22) {
  const text = String(value);
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function refreshAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !refreshToken) return null;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body?.access_token) {
    throw new Error(`Spotify token refresh failed (${response.status}).`);
  }
  return body.access_token;
}

async function fetchDurations(rows, warnings) {
  try {
    const token = await refreshAccessToken();
    if (!token) {
      warnings.push('Spotify credentials were unavailable; elapsed time uses fallback durations.');
      return new Map();
    }

    const result = new Map();
    const ids = rows.map((row) => row.uri.split(':').at(-1));
    for (let index = 0; index < ids.length; index += 50) {
      const batch = ids.slice(index, index + 50);
      const response = await fetch(`${API_BASE}/tracks?ids=${encodeURIComponent(batch.join(','))}&market=SE`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(`Spotify track metadata failed (${response.status}).`);
      for (const track of body?.tracks ?? []) {
        if (track?.uri && Number.isFinite(track.duration_ms)) result.set(track.uri, track.duration_ms);
      }
    }
    return result;
  } catch (error) {
    warnings.push(`${error instanceof Error ? error.message : String(error)} Elapsed time uses fallback durations.`);
    return new Map();
  }
}

function normalizeAnnotations(rows, annotations, warnings) {
  const bandLevels = new Map((annotations.storyBands ?? []).map((band) => [band.id, band.level]));
  const chapterOrder = new Map((annotations.chapters ?? []).map((chapter) => [chapter.id, chapter.order]));

  const normalized = rows.map((row) => {
    const annotation = annotations.tracks?.[row.uri];
    if (!annotation) {
      warnings.push(`Missing annotation for ${row.artist} — ${row.track}; fallback role was used.`);
      return {
        ...row,
        chapter: 'unmapped',
        chapterOrder: 999,
        storyBand: 'threshold',
        storyLevel: 3.4,
        status: 'provisional',
        labels: ['auto-mapped'],
      };
    }

    const storyLevel = bandLevels.get(annotation.storyBand);
    if (!Number.isFinite(storyLevel)) throw new Error(`Unknown story band for ${row.uri}: ${annotation.storyBand}`);
    return {
      ...row,
      chapter: annotation.chapter,
      chapterOrder: chapterOrder.get(annotation.chapter) ?? 999,
      storyBand: annotation.storyBand,
      storyLevel,
      status: annotation.status ?? 'accepted',
      labels: annotation.labels ?? [],
    };
  });

  const ledgerUris = new Set(rows.map((row) => row.uri));
  for (const uri of Object.keys(annotations.tracks ?? {})) {
    if (!ledgerUris.has(uri)) warnings.push(`Annotation exists outside the current ledger: ${uri}`);
  }
  return normalized;
}

function buildChapters(tracks, chapterDefinitions) {
  const definitionMap = new Map((chapterDefinitions ?? []).map((chapter) => [chapter.id, chapter]));
  const chapters = [];
  let current = null;

  for (const track of tracks) {
    if (!current || current.id !== track.chapter) {
      if (current) chapters.push(current);
      const definition = definitionMap.get(track.chapter) ?? { label: track.chapter, order: 999 };
      current = {
        id: track.chapter,
        label: definition.label,
        order: definition.order,
        startPosition: track.position,
        endPosition: track.position,
        startMs: track.startMs,
        endMs: track.endMs,
      };
    } else {
      current.endPosition = track.position;
      current.endMs = track.endMs;
    }
  }
  if (current) chapters.push(current);
  return chapters;
}

function buildTransitions(tracks, annotations) {
  const protectedPairs = new Set((annotations.protected?.handoffs ?? []).map((pair) => pair.join('→')));
  const frozenUris = new Set((annotations.discussions ?? []).flatMap((discussion) => discussion.frozenUris ?? []));
  const transitions = [];
  for (let index = 0; index < tracks.length - 1; index += 1) {
    const from = tracks[index];
    const to = tracks[index + 1];
    transitions.push({
      fromUri: from.uri,
      toUri: to.uri,
      fromPosition: from.position,
      toPosition: to.position,
      bpmDelta: to.bpm - from.bpm,
      protected: protectedPairs.has(`${from.uri}→${to.uri}`),
      frozen: frozenUris.has(from.uri) && frozenUris.has(to.uri),
    });
  }
  return transitions;
}

function makeSmoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let pathValue = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    pathValue += ` C ${midX.toFixed(1)} ${current.y.toFixed(1)}, ${midX.toFixed(1)} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return pathValue;
}

function renderSvg(model) {
  const width = 1800;
  const height = 980;
  const plot = { left: 90, right: 1710, top: 185, bottom: 655 };
  const bpmPlot = { top: 760, bottom: 865 };
  const plotWidth = plot.right - plot.left;
  const totalDuration = Math.max(model.totals.durationMs, 1);
  const storyMin = 0.5;
  const storyMax = 7.2;
  const bpmMin = model.totals.bpmMin - 2;
  const bpmMax = model.totals.bpmMax + 2;

  const xForMs = (ms) => plot.left + (ms / totalDuration) * plotWidth;
  const yForStory = (level) => plot.bottom - ((level - storyMin) / (storyMax - storyMin)) * (plot.bottom - plot.top);
  const yForBpm = (bpm) => bpmPlot.bottom - ((bpm - bpmMin) / (bpmMax - bpmMin)) * (bpmPlot.bottom - bpmPlot.top);

  const storyPoints = model.tracks.map((track) => ({
    x: xForMs(track.midpointMs),
    y: yForStory(track.storyLevel),
    track,
  }));
  const bpmPoints = model.tracks.map((track) => ({ x: xForMs(track.midpointMs), y: yForBpm(track.bpm), track }));

  const storyPath = makeSmoothPath(storyPoints);
  const bpmPath = makeSmoothPath(bpmPoints);
  const latestAddedDate = model.totals.latestAddedDate;
  const keyTrack = (track) => track.labels.includes('opener')
    || track.labels.includes('first-local-crest')
    || track.labels.includes('deeper-crest')
    || track.labels.includes('main-summit')
    || track.labels.includes('closer')
    || track.added === latestAddedDate;

  const chapterPalette = ['#101923', '#12151d', '#101923', '#15131b', '#111820', '#131419'];
  const chapterRects = model.chapters.map((chapter, index) => {
    const x = xForMs(chapter.startMs);
    const endX = xForMs(chapter.endMs);
    return `<g>
      <rect x="${x.toFixed(1)}" y="${plot.top}" width="${Math.max(1, endX - x).toFixed(1)}" height="${plot.bottom - plot.top}" fill="${chapterPalette[index % chapterPalette.length]}" opacity="0.82"/>
      <text x="${(x + 10).toFixed(1)}" y="${plot.top + 24}" fill="#8d98a6" font-size="17" font-family="Inter,Arial,sans-serif" letter-spacing="1.2">${escapeXml(chapter.label.toUpperCase())}</text>
    </g>`;
  }).join('\n');

  const frozenRects = model.discussions.flatMap((discussion) => {
    const frozenTracks = model.tracks.filter((track) => discussion.frozenUris.includes(track.uri));
    if (frozenTracks.length === 0) return [];
    const start = Math.min(...frozenTracks.map((track) => track.startMs));
    const end = Math.max(...frozenTracks.map((track) => track.endMs));
    const x = xForMs(start);
    const endX = xForMs(end);
    return [`<g>
      <rect x="${x.toFixed(1)}" y="${plot.top}" width="${(endX - x).toFixed(1)}" height="${plot.bottom - plot.top}" fill="#c98a2e" opacity="0.08" stroke="#c98a2e" stroke-width="2" stroke-dasharray="8 7"/>
      <text x="${(x + 12).toFixed(1)}" y="${plot.bottom - 14}" fill="#dba44c" font-size="15" font-family="Inter,Arial,sans-serif">FROZEN DISCUSSION</text>
    </g>`];
  }).join('\n');

  const contourOffsets = [18, 11, 6].map((offset, index) => {
    const points = storyPoints.map((point) => ({ x: point.x, y: point.y + offset }));
    return `<path d="${makeSmoothPath(points)}" fill="none" stroke="#45617c" stroke-width="${index === 0 ? 1 : 1.4}" opacity="${0.12 + index * 0.05}"/>`;
  }).join('\n');

  const markers = storyPoints.map(({ x, y, track }) => {
    const status = track.status;
    const fill = status === 'protected' ? '#61a9ff'
      : status === 'frozen' ? '#d79a42'
        : status === 'provisional' ? '#111820'
          : '#aeb8c4';
    const stroke = status === 'provisional' ? '#8d98a6'
      : status === 'frozen' ? '#e4ad5e'
        : status === 'protected' ? '#8bc1ff'
          : '#d6dce3';
    const radius = track.labels.includes('main-summit') ? 10 : 7;
    const today = track.added === latestAddedDate;
    const halo = today ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius + 8}" fill="none" stroke="#61a9ff" stroke-width="2" opacity="0.52"/>` : '';
    const label = keyTrack(track)
      ? `<g>
          <line x1="${x.toFixed(1)}" y1="${(y - radius - 3).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y - 36).toFixed(1)}" stroke="#647181" stroke-width="1"/>
          <text x="${x.toFixed(1)}" y="${(y - 44).toFixed(1)}" text-anchor="middle" fill="#dfe5eb" font-size="15" font-family="Inter,Arial,sans-serif">${escapeXml(shortLabel(track.track, 20))}</text>
          <text x="${x.toFixed(1)}" y="${(y - 27).toFixed(1)}" text-anchor="middle" fill="#778495" font-size="12" font-family="Inter,Arial,sans-serif">${escapeXml(shortLabel(track.artist, 22))}</text>
        </g>`
      : '';
    return `<g>
      ${halo}
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" fill="${status === 'provisional' ? '#cbd3dc' : '#0d1117'}" font-size="10" font-weight="700" font-family="Inter,Arial,sans-serif">${track.position}</text>
      ${label}
    </g>`;
  }).join('\n');

  const protectedTransition = model.transitions.filter((transition) => transition.protected).map((transition) => {
    const from = model.tracks[transition.fromPosition - 1];
    const to = model.tracks[transition.toPosition - 1];
    const x1 = xForMs(from.midpointMs);
    const x2 = xForMs(to.midpointMs);
    const y = plot.top - 30;
    return `<g>
      <path d="M ${x1.toFixed(1)} ${y} L ${x1.toFixed(1)} ${y - 10} L ${x2.toFixed(1)} ${y - 10} L ${x2.toFixed(1)} ${y}" fill="none" stroke="#61a9ff" stroke-width="2"/>
      <text x="${((x1 + x2) / 2).toFixed(1)}" y="${y - 17}" text-anchor="middle" fill="#7ebaff" font-size="13" font-family="Inter,Arial,sans-serif">PROTECTED HANDOFF</text>
    </g>`;
  }).join('\n');

  const timeTicks = [];
  const tickMs = 30 * 60 * 1000;
  for (let ms = 0; ms <= totalDuration; ms += tickMs) {
    const x = xForMs(ms);
    timeTicks.push(`<line x1="${x.toFixed(1)}" y1="${plot.bottom}" x2="${x.toFixed(1)}" y2="${bpmPlot.bottom}" stroke="#27313d" stroke-width="1"/>`);
    timeTicks.push(`<text x="${x.toFixed(1)}" y="${bpmPlot.bottom + 27}" text-anchor="middle" fill="#697687" font-size="13" font-family="Inter,Arial,sans-serif">${Math.round(ms / 60000)}m</text>`);
  }

  const bpmMarkers = bpmPoints.map(({ x, y, track }) => `<g>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#8392a3"/>
    <text x="${x.toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="middle" fill="#657284" font-size="10" font-family="Inter,Arial,sans-serif">${track.bpm}</text>
  </g>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">GROOVE OVER NOISE journey map</title>
  <desc id="desc">A time-scaled editorial story landscape with BPM trajectory, chapters, protected anchors, provisional roles, and frozen discussion regions.</desc>
  <rect width="${width}" height="${height}" fill="#0b0e12"/>
  <rect x="30" y="30" width="1740" height="920" rx="18" fill="#0d1117" stroke="#252d37"/>
  <text x="90" y="90" fill="#edf1f5" font-size="46" font-weight="750" font-family="Inter,Arial,sans-serif" letter-spacing="1.2">GROOVE OVER NOISE</text>
  <text x="90" y="125" fill="#7f8b99" font-size="19" font-family="Inter,Arial,sans-serif">Journey map · ${model.totals.trackCount} tracks · ${escapeXml(formatDuration(model.totals.durationMs))} · ${model.totals.bpmMin}–${model.totals.bpmMax} BPM</text>
  <text x="1710" y="92" text-anchor="end" fill="#607083" font-size="14" font-family="Inter,Arial,sans-serif">Story height is editorial, not measured audio energy</text>
  ${chapterRects}
  ${frozenRects}
  ${timeTicks.join('\n')}
  <line x1="${plot.left}" y1="${plot.bottom}" x2="${plot.right}" y2="${plot.bottom}" stroke="#35404d"/>
  ${contourOffsets}
  <path d="${storyPath}" fill="none" stroke="#d9e0e7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${storyPath}" fill="none" stroke="#6088b1" stroke-width="10" opacity="0.12" stroke-linecap="round"/>
  ${protectedTransition}
  ${markers}
  <text x="${plot.left}" y="${bpmPlot.top - 22}" fill="#8f9baa" font-size="17" font-family="Inter,Arial,sans-serif" letter-spacing="1">MEASURED BPM</text>
  <path d="${bpmPath}" fill="none" stroke="#607b99" stroke-width="2.5" opacity="0.92"/>
  ${bpmMarkers}
  <line x1="${plot.left}" y1="${bpmPlot.bottom}" x2="${plot.right}" y2="${bpmPlot.bottom}" stroke="#35404d"/>
  <g transform="translate(90,925)" font-family="Inter,Arial,sans-serif" font-size="13">
    <circle cx="0" cy="0" r="6" fill="#61a9ff"/><text x="14" y="4" fill="#8e9aa8">protected</text>
    <circle cx="105" cy="0" r="6" fill="#111820" stroke="#8d98a6" stroke-width="2"/><text x="119" y="4" fill="#8e9aa8">provisional</text>
    <circle cx="222" cy="0" r="6" fill="#d79a42"/><text x="236" y="4" fill="#8e9aa8">frozen discussion</text>
    <circle cx="385" cy="0" r="12" fill="none" stroke="#61a9ff" stroke-width="2" opacity="0.52"/><circle cx="385" cy="0" r="6" fill="#aeb8c4"/><text x="404" y="4" fill="#8e9aa8">latest addition</text>
  </g>
  <text x="1710" y="929" text-anchor="end" fill="#596677" font-size="12" font-family="Inter,Arial,sans-serif">Generated ${escapeXml(model.generatedAt)}</text>
</svg>`;
}

async function main() {
  const repoRoot = path.resolve(option('--repo-root', process.cwd()));
  const playlistDir = path.resolve(repoRoot, option('--playlist-dir', 'playlists/groove-over-noise'));
  const ledgerPath = path.join(playlistDir, 'ledger.md');
  const annotationsPath = path.join(playlistDir, 'journey-annotations.json');
  const outputJsonPath = path.join(playlistDir, 'journey-map.json');
  const outputSvgPath = path.join(playlistDir, 'journey-map.svg');

  const [ledgerMarkdown, annotations] = await Promise.all([
    fs.readFile(ledgerPath, 'utf8'),
    readJson(annotationsPath),
  ]);

  const warnings = [];
  const ledgerRows = parseLedger(ledgerMarkdown);
  const durationMap = await fetchDurations(ledgerRows, warnings);
  const annotatedRows = normalizeAnnotations(ledgerRows, annotations, warnings);

  let elapsedMs = 0;
  const tracks = annotatedRows.map((track) => {
    const durationMs = durationMap.get(track.uri) ?? DEFAULT_DURATION_MS;
    const startMs = elapsedMs;
    const endMs = startMs + durationMs;
    elapsedMs = endMs;
    return {
      ...track,
      durationMs,
      durationSource: durationMap.has(track.uri) ? 'spotify-metadata' : 'fallback-six-minutes',
      startMs,
      endMs,
      midpointMs: startMs + durationMs / 2,
      spotifyUrl: `https://open.spotify.com/track/${track.uri.split(':').at(-1)}`,
    };
  });

  const latestAddedDate = tracks.map((track) => track.added).sort().at(-1) ?? null;
  const chapters = buildChapters(tracks, annotations.chapters);
  const transitions = buildTransitions(tracks, annotations);
  const protectedUris = new Set([
    annotations.protected?.opener,
    ...(annotations.protected?.ending ?? []),
    ...(annotations.protected?.handoffs ?? []).flat(),
  ].filter(Boolean));

  const model = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      ledgerPath: path.relative(repoRoot, ledgerPath),
      annotationsPath: path.relative(repoRoot, annotationsPath),
      ledgerFingerprint: stableHash(ledgerMarkdown),
      annotationsFingerprint: stableHash(JSON.stringify(annotations)),
    },
    playlist: {
      slug: annotations.playlistSlug,
      title: 'GROOVE OVER NOISE',
      storyModel: annotations.storyModel,
      storyHeightMeaning: annotations.storyHeightMeaning,
      compactMapPath: 'playlists/groove-over-noise/journey-map.svg',
      sitesPromptPath: 'playlists/groove-over-noise/sites-prompt.md',
      detailedSiteStatus: 'SITES_READY_NOT_DEPLOYED',
    },
    totals: {
      trackCount: tracks.length,
      durationMs: elapsedMs,
      durationLabel: formatDuration(elapsedMs),
      bpmMin: Math.min(...tracks.map((track) => track.bpm)),
      bpmMax: Math.max(...tracks.map((track) => track.bpm)),
      latestAddedDate,
    },
    chapters,
    tracks: tracks.map((track) => ({
      ...track,
      protected: protectedUris.has(track.uri),
      progressStart: track.startMs / elapsedMs,
      progressEnd: track.endMs / elapsedMs,
      progressMidpoint: track.midpointMs / elapsedMs,
    })),
    transitions,
    protected: annotations.protected,
    discussions: annotations.discussions ?? [],
    externalCandidates: (annotations.discussions ?? []).flatMap((discussion) => discussion.externalCandidates ?? []),
    warnings,
  };

  const svg = renderSvg(model);
  await Promise.all([
    fs.writeFile(outputJsonPath, `${JSON.stringify(model, null, 2)}\n`, 'utf8'),
    fs.writeFile(outputSvgPath, svg, 'utf8'),
  ]);

  console.log(JSON.stringify({
    trackCount: model.totals.trackCount,
    duration: model.totals.durationLabel,
    chapters: model.chapters.length,
    warnings: model.warnings,
    outputs: [outputJsonPath, outputSvgPath],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
