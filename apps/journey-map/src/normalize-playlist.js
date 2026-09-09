import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const playlistDir = process.argv[2];
if (!playlistDir) throw new Error('Usage: node normalize-playlist.js <playlist-dir>');

const UNIFIED_SITE_URL = 'https://broskmenmi.github.io/editorial-engine/';
const spotifyPath = path.join(playlistDir, 'spotify.json');
const annotationsPath = path.join(playlistDir, 'journey-annotations.json');
const modelPath = path.join(playlistDir, 'journey-map.json');
const svgPath = path.join(playlistDir, 'journey-map.svg');

const [spotify, annotations, model] = await Promise.all([
  fs.readFile(spotifyPath, 'utf8').then(JSON.parse),
  fs.readFile(annotationsPath, 'utf8').then(JSON.parse),
  fs.readFile(modelPath, 'utf8').then(JSON.parse),
]);

const title = spotify.playlistName ?? annotations.playlistTitle ?? model.playlist?.title ?? annotations.playlistSlug;
const posixDir = playlistDir.split(path.sep).join('/');
const detailed = annotations.detailedSite ?? {};
const detailedSiteStatus = detailed.status ?? model.playlist?.detailedSiteStatus ?? 'NOT_PUBLISHED';

const visualization = {
  schemaVersion: 1,
  defaultView: 'felt',
  principle: 'Direction and listener-state change first; no universal scalar energy axis.',
  layers: {
    feeling: ['pressure', 'propulsion', 'openness', 'tension', 'temperature'],
    groove: ['pulseClarity', 'swing', 'rhythmicStability', 'density', 'weightDistribution'],
    structure: ['continuity', 'mutation', 'interruption', 'arrival', 'release'],
    tempo: ['bpm', 'durationMs'],
  },
  evidenceClasses: ['LISTENER_REPORT', 'MEASURED_AUDIO', 'ATTRIBUTED_SOURCE_DESCRIPTION', 'EDITORIAL_INTERPRETATION', 'UNKNOWN'],
};

function human(value) {
  return String(value ?? '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function short(value, max = 22) {
  const text = String(value ?? '');
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function meaningfulLabel(track) {
  const labels = track.labels ?? [];
  const reject = /^(track-\d+|explore-run-|repair-run-|whole-journey-|listener-added$|protected-ending$|discussion-region$)/i;
  return labels.find((label) => !reject.test(label)) ?? null;
}

function normalizedFelt(track) {
  const annotation = annotations.tracks?.[track.uri] ?? {};
  const raw = annotation.felt ?? {};
  const fallback = meaningfulLabel(track) ? human(meaningfulLabel(track)) : human(track.role || track.storyBand || 'state not yet described');
  const explicit = Boolean(raw.direction || raw.summary || raw.dimensions);
  return {
    summary: raw.summary ?? null,
    direction: raw.direction ?? fallback,
    dimensions: raw.dimensions ?? {},
    evidence: raw.evidence ?? {
      class: explicit ? 'EDITORIAL_INTERPRETATION' : 'EDITORIAL_INTERPRETATION',
      note: explicit
        ? 'Playlist annotation. See canonical annotation provenance.'
        : 'Fallback direction phrase derived from an existing editorial label/role; not audio analysis.',
    },
  };
}

model.playlist = {
  ...model.playlist,
  slug: annotations.playlistSlug ?? model.playlist?.slug,
  title,
  storyModel: annotations.storyModel ?? model.playlist?.storyModel,
  storyHeightMeaning: annotations.storyHeightMeaning ?? model.playlist?.storyHeightMeaning,
  compactMapPath: `${posixDir}/journey-map.svg`,
  sitesPromptPath: `${posixDir}/sites-prompt.md`,
  detailedSiteStatus,
  detailedSiteUrl: detailedSiteStatus === 'NOT_PUBLISHED' ? null : UNIFIED_SITE_URL,
};
model.visualization = visualization;
model.tracks = (model.tracks ?? []).map((track) => ({ ...track, felt: normalizedFelt(track) }));

function renderDirectionSvg() {
  const width = 1800;
  const height = 920;
  const left = 95;
  const right = 1710;
  const ribbonTop = 235;
  const ribbonHeight = 205;
  const chapterTop = 500;
  const chapterHeight = 62;
  const bpmTop = 665;
  const bpmBottom = 785;
  const total = Math.max(model.totals?.durationMs ?? 1, 1);
  const xFor = (ms) => left + (ms / total) * (right - left);
  const knownBpm = model.tracks.map((track) => track.bpm).filter(Number.isFinite);
  const minBpm = knownBpm.length ? Math.min(...knownBpm) - 2 : 0;
  const maxBpm = knownBpm.length ? Math.max(...knownBpm) + 2 : 1;
  const spanBpm = Math.max(maxBpm - minBpm, 1);
  const yBpm = (bpm) => bpmBottom - ((bpm - minBpm) / spanBpm) * (bpmBottom - bpmTop);

  const chapterColors = ['#111821', '#14161d', '#111821', '#17141c', '#121920', '#15151b'];
  const chapterRects = (model.chapters ?? []).map((chapter, index) => {
    const x = xFor(chapter.startMs);
    const end = xFor(chapter.endMs);
    return `<g><rect x="${x.toFixed(1)}" y="${chapterTop}" width="${Math.max(1, end - x).toFixed(1)}" height="${chapterHeight}" fill="${chapterColors[index % chapterColors.length]}"/><text x="${(x + 8).toFixed(1)}" y="${chapterTop + 37}" fill="#8b96a3" font-size="13" font-family="Inter,Arial,sans-serif" letter-spacing="1">${escapeXml(short(chapter.label.toUpperCase(), 22))}</text></g>`;
  }).join('');

  const latest = model.totals?.latestAddedDate;
  const blocks = model.tracks.map((track, index) => {
    const x = xFor(track.startMs);
    const end = xFor(track.endMs);
    const w = Math.max(5, end - x);
    const status = track.status === 'frozen' ? 'frozen' : track.status === 'protected' || track.protected ? 'protected' : 'default';
    const stroke = status === 'frozen' ? '#c39045' : status === 'protected' ? '#6fa6d8' : track.added === latest ? '#a493b1' : '#3b444f';
    const fill = status === 'frozen' ? '#261e13' : status === 'protected' ? '#12202d' : index % 2 ? '#12161c' : '#101419';
    const labelY = ribbonTop + 34 + (index % 3) * 58;
    const direction = track.felt?.direction || 'unknown';
    return `<g><rect x="${x.toFixed(1)}" y="${ribbonTop}" width="${w.toFixed(1)}" height="${ribbonHeight}" fill="${fill}" stroke="${stroke}" stroke-width="${track.added === latest ? 2.5 : 1}"/><text x="${(x + 7).toFixed(1)}" y="${ribbonTop + 20}" fill="#6f7b88" font-size="11" font-family="Inter,Arial,sans-serif">${String(track.position).padStart(2, '0')}</text>${w > 48 ? `<text x="${(x + 7).toFixed(1)}" y="${labelY}" fill="#d7dce2" font-size="12" font-family="Inter,Arial,sans-serif">${escapeXml(short(direction, Math.max(7, Math.floor(w / 7))))}</text>` : ''}</g>`;
  }).join('');

  const protectedHandoffs = (model.transitions ?? []).filter((edge) => edge.protected).map((edge) => {
    const from = model.tracks[edge.fromPosition - 1];
    const to = model.tracks[edge.toPosition - 1];
    const x1 = xFor(from.midpointMs);
    const x2 = xFor(to.midpointMs);
    return `<path d="M ${x1.toFixed(1)} ${ribbonTop - 20} L ${x1.toFixed(1)} ${ribbonTop - 32} L ${x2.toFixed(1)} ${ribbonTop - 32} L ${x2.toFixed(1)} ${ribbonTop - 20}" fill="none" stroke="#6fa6d8" stroke-width="2"/>`;
  }).join('');

  const bpmPoints = model.tracks.filter((track) => Number.isFinite(track.bpm)).map((track) => `${xFor(track.midpointMs).toFixed(1)},${yBpm(track.bpm).toFixed(1)}`);
  const bpmLine = bpmPoints.length > 1 ? `<polyline points="${bpmPoints.join(' ')}" fill="none" stroke="#7f8b99" stroke-width="2"/>` : '';
  const bpmDots = model.tracks.map((track) => Number.isFinite(track.bpm) ? `<circle cx="${xFor(track.midpointMs).toFixed(1)}" cy="${yBpm(track.bpm).toFixed(1)}" r="3" fill="#a6afb9"/>` : '').join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)} felt journey map</title>
  <desc id="desc">Evidence-bound direction ribbon across elapsed time, with structure and BPM kept separate. Direction words are editorial or sourced language; no vertical coordinate represents energy.</desc>
  <rect width="${width}" height="${height}" fill="#0b0e12"/>
  <rect x="30" y="30" width="1740" height="850" rx="18" fill="#0d1117" stroke="#252d37"/>
  <text x="95" y="92" fill="#edf1f5" font-size="42" font-family="Inter,Arial,sans-serif" font-weight="650">${escapeXml(title)}</text>
  <text x="95" y="126" fill="#8b95a2" font-size="16" font-family="Inter,Arial,sans-serif" letter-spacing="1.4">FELT MAP · DIRECTION FIRST · EVIDENCE BOUND</text>
  <text x="95" y="172" fill="#66717e" font-size="14" font-family="Inter,Arial,sans-serif">No universal energy axis. Track language describes direction/state; BPM remains measured metadata.</text>
  <text x="95" y="219" fill="#9aa4af" font-size="13" font-family="Inter,Arial,sans-serif">DIRECTION ACROSS TIME</text>
  ${blocks}
  ${protectedHandoffs}
  <text x="95" y="488" fill="#737e8a" font-size="12" font-family="Inter,Arial,sans-serif">STRUCTURE · SECONDARY EDITORIAL LENS</text>
  ${chapterRects}
  <text x="95" y="640" fill="#737e8a" font-size="12" font-family="Inter,Arial,sans-serif">TEMPO · METADATA</text>
  <line x1="${left}" x2="${right}" y1="${bpmBottom}" y2="${bpmBottom}" stroke="#2c343e"/>
  ${bpmLine}${bpmDots}
  <text x="95" y="836" fill="#626d78" font-size="13" font-family="Inter,Arial,sans-serif">Direction fallback may come from existing editorial roles/labels. UNKNOWN dimensions stay unknown; see the detailed site for provenance and five-track context.</text>
</svg>`;
}

await Promise.all([
  fs.writeFile(modelPath, `${JSON.stringify(model, null, 2)}\n`, 'utf8'),
  fs.writeFile(svgPath, renderDirectionSvg(), 'utf8'),
]);
