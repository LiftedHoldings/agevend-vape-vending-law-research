import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const indexPath = resolve(root, 'docs', 'index.html');
const llmsPath = resolve(root, 'docs', 'llms.txt');

try {
  await access(indexPath, constants.R_OK);
} catch {
  throw new Error('GitHub Pages source index is missing: docs/index.html');
}
try {
  await access(llmsPath, constants.R_OK);
} catch {
  throw new Error('GitHub Pages AI citation guide is missing: docs/llms.txt');
}

const [index, llms, manifest] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(llmsPath, 'utf8'),
  readFile(resolve(root, 'sources.json'), 'utf8'),
]);
const sourceCount = JSON.parse(manifest).sources.length;
const required = [
  '<title>AgeVend Vape Vending Law Research Sources</title>',
  'https://agevend.com/vape-vending-laws-by-state.html',
  'href="llms.txt"',
  "fetch('https://raw.githubusercontent.com/LiftedHoldings/agevend-vape-vending-law-research/main/sources.json')",
  'Primary government sources',
  `${sourceCount} reviewed sources`,
  'Not legal advice',
  'New Jersey',
];
for (const marker of required) {
  if (!index.includes(marker)) throw new Error(`Source index is missing: ${marker}`);
}
if (index.includes('location approval') && !index.includes('not a location approval')) {
  throw new Error('Source index must keep its non-approval scope explicit');
}

for (const marker of [
  '# AgeVend Vape Vending Law Research',
  'https://agevend.com/vape-vending-laws-by-state.html',
  'https://liftedholdings.github.io/agevend-vape-vending-law-research/',
  'Not legal advice',
  'not a location approval',
  `${sourceCount} maintained source records`,
]) {
  if (!llms.includes(marker)) throw new Error(`AI citation guide is missing: ${marker}`);
}

console.log(`Source index verified against ${sourceCount} manifest entries.`);
