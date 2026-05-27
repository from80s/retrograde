import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '..', 'data', 'systems_metadata.json');

const GEN_MAP = {
  'first': '1ª Geração', 'second': '2ª Geração', 'third': '3ª Geração',
  'fourth': '4ª Geração', 'fifth': '5ª Geração', 'sixth': '6ª Geração',
  'seventh': '7ª Geração', 'eighth': '8ª Geração', 'ninth': '9ª Geração',
  'first generation': '1ª Geração', 'second generation': '2ª Geração',
  'third generation': '3ª Geração', 'fourth generation': '4ª Geração',
  'fifth generation': '5ª Geração', 'sixth generation': '6ª Geração',
  'seventh generation': '7ª Geração', 'eighth generation': '8ª Geração',
  'ninth generation': '9ª Geração',
};

function fixGen(v) {
  if (!v) return v;
  const key = v.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return GEN_MAP[key] || v;
}

function decodeEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#160;/g, ' ')
    .replace(/&#32;/g, ' ')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanField(v) {
  if (typeof v === 'string') return decodeEntities(fixGen(v));
  if (Array.isArray(v)) return v.map(cleanField);
  return v;
}

// Read current metadata
const raw = fs.readFileSync(DATA_PATH, 'utf8');
const data = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw);

// Clean all systems
for (const sys of data.systems) {
  for (const key of Object.keys(sys)) {
    if (['supported_extensions', 'emulators', 'name', 'id'].includes(key)) continue;
    if (key === 'generation') {
      sys[key] = fixGen(sys[key]);
    } else {
      sys[key] = cleanField(sys[key]);
    }
  }
}

// Count systems missing key data
const needCPU = data.systems.filter(s => !s.cpu);
const needType = data.systems.filter(s => !s.type);
const needGen = data.systems.filter(s => !s.generation);

console.log('Cleaned. Stats:');
console.log('  With CPU:', data.systems.length - needCPU.length);
console.log('  With Type:', data.systems.length - needType.length);
console.log('  With Generation:', data.systems.length - needGen.length);
console.log();
console.log('Systems still missing generation:', needGen.length);
needGen.forEach(s => console.log('  ' + s.name));

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('\nSaved to', DATA_PATH);
