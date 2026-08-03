import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const indexPath = resolve(root, 'docs', 'index.html');

try {
  await access(indexPath, constants.R_OK);
} catch {
  throw new Error('GitHub Pages source index is missing: docs/index.html');
}

const [index, manifest] = await Promise.all([
  readFile(indexPath, 'utf8'),
  readFile(resolve(root, 'sources.json'), 'utf8'),
]);
const sourceCount = JSON.parse(manifest).sources.length;
const required = [
  '<title>AgeVend Vape Vending Law Research Sources</title>',
  'https://agevend.com/vape-vending-laws-by-state.html',
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

console.log(`Source index verified against ${sourceCount} manifest entries.`);
