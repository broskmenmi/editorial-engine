import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const playlistDir = process.argv[2];
if (!playlistDir) throw new Error('Usage: node normalize-playlist.js <playlist-dir>');

const spotifyPath = path.join(playlistDir, 'spotify.json');
const annotationsPath = path.join(playlistDir, 'journey-annotations.json');
const modelPath = path.join(playlistDir, 'journey-map.json');
const svgPath = path.join(playlistDir, 'journey-map.svg');

const [spotify, annotations, model, svg] = await Promise.all([
  fs.readFile(spotifyPath, 'utf8').then(JSON.parse),
  fs.readFile(annotationsPath, 'utf8').then(JSON.parse),
  fs.readFile(modelPath, 'utf8').then(JSON.parse),
  fs.readFile(svgPath, 'utf8'),
]);

const title = spotify.playlistName ?? annotations.playlistTitle ?? model.playlist?.title ?? annotations.playlistSlug;
const posixDir = playlistDir.split(path.sep).join('/');
const detailed = annotations.detailedSite ?? {};

model.playlist = {
  ...model.playlist,
  slug: annotations.playlistSlug ?? model.playlist?.slug,
  title,
  storyModel: annotations.storyModel ?? model.playlist?.storyModel,
  storyHeightMeaning: annotations.storyHeightMeaning ?? model.playlist?.storyHeightMeaning,
  compactMapPath: `${posixDir}/journey-map.svg`,
  sitesPromptPath: `${posixDir}/sites-prompt.md`,
  detailedSiteStatus: detailed.status ?? model.playlist?.detailedSiteStatus ?? 'NOT_PUBLISHED',
  detailedSiteUrl: detailed.url ?? model.playlist?.detailedSiteUrl ?? null,
};

let normalizedSvg = svg;
const previousTitle = 'GROOVE OVER NOISE';
if (title !== previousTitle) normalizedSvg = normalizedSvg.split(previousTitle).join(title);

await Promise.all([
  fs.writeFile(modelPath, `${JSON.stringify(model, null, 2)}\n`, 'utf8'),
  fs.writeFile(svgPath, normalizedSvg, 'utf8'),
]);
