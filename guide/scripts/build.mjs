import { readFileSync, writeFileSync, cpSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '../.vercel/output');
const places = JSON.parse(readFileSync(path.join(root, 'content/places.json'), 'utf8'));
const itinerary = JSON.parse(readFileSync(path.join(root, 'content/itinerary.json'), 'utf8'));
for (const name of readdirSync(path.join(root, 'content')).filter(n => n.startsWith('places-') && n.endsWith('.json')).sort()) {
  const edits = JSON.parse(readFileSync(path.join(root, 'content', name), 'utf8'));
  for (const [id, place] of Object.entries(edits)) {
    if (!(id in places)) throw new Error(`Unknown place: ${id}`);
    places[id] = place;
  }
}

// Preserve the deployed application; replace only its two embedded content datasets.
let count = 0;
const app = readFileSync(path.join(root, 'original-app.js'), 'utf8').replace(
  /JSON\.parse\(('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")\)/g,
  () => `JSON.parse(${JSON.stringify(JSON.stringify([itinerary, places][count++]))})`,
);
if (count !== 2) throw new Error(`Expected two embedded datasets, found ${count}`);
const mapsKey = process.env.GOOGLE_MAPS_BROWSER_KEY || readFileSync(path.join(root, '../.vercel/maps-browser-key.txt'), 'utf8').trim();
if (!/^AIza[0-9A-Za-z_-]{35}$/.test(mapsKey)) throw new Error('Missing Google Maps browser key');
const finalApp = app.replaceAll('__GOOGLE_MAPS_BROWSER_KEY__', mapsKey);
const digest = createHash('sha256').update(finalApp).digest('hex').slice(0, 12);
const filename = `assets/index-guide-${digest}.js`;
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(path.join(root, 'original-static'), path.join(output, 'static'), { recursive: true });

writeFileSync(path.join(output, 'static', filename), finalApp);
const htmlPath = path.join(output, 'static/index.html');
const html = readFileSync(htmlPath, 'utf8').replace('assets/index-jp079b5e62.js', filename);
writeFileSync(htmlPath, html);
const swPath = path.join(output, 'static/sw.js');
const htmlRevision = createHash('md5').update(html).digest('hex');
writeFileSync(swPath, readFileSync(swPath, 'utf8')
  .replaceAll('assets/index-jp079b5e62.js', filename)
  .replace(/(url:"index.html",revision:")[^"]+/, `$1${htmlRevision}`));
writeFileSync(path.join(output, 'config.json'), JSON.stringify({ version: 3, routes: [{ handle: 'filesystem' }, { src: '/.*', dest: '/index.html' }] }, null, 2) + '\n');
console.log(`Built ${Object.keys(places).length} places: ${filename}`);
