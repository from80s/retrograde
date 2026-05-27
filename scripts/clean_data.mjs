/**
 * Limpeza completa dos metadados:
 * 1. Remove lixo CSS/HTML (.mw-parser-output, <style>, etc.)
 * 2. Limpa launch_price: só USD ou BRL
 * 3. Remove curiosidades em inglês (mantém só pt-br)
 * 4. Remove tags HTML, decodifica entidades
 * 5. Limpa textos com lixo
 * 6. Busca descrições em pt-br via Wikipedia PT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '..', 'data', 'systems_metadata.json');
const UA = 'RetroGrade/1.0 (cleaner; +https://github.com/retrograde)';
const DELAY = 800;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fetchJson = async url => {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/* ---- CSS/HTML garbage patterns ---- */
const CSS_REMOVE = [
  /\.mw-parser-output[\s\S]*?\}/g,
  /<style[\s\S]*?<\/style>/gi,
  /<link[\s\S]*?\/?>/gi,
  /<[\/]?(div|span|table|tr|td|th|tbody|thead|style|link)[^>]*>/gi,
];

function stripGarbage(str) {
  if (!str) return str;
  let s = String(str);
  for (const pat of CSS_REMOVE) s = s.replace(pat, '');
  s = s.replace(/&#\d+;/g, m => {
    const n = parseInt(m.slice(2, -1));
    return n >= 32 && n <= 126 ? String.fromCharCode(n) : ' ';
  });
  s = s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  s = s.replace(/\[\d+\]/g, '');
  s = s.replace(/\[citation needed\]/gi, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/* ---- Launch price cleaner ---- */
function cleanPrice(str) {
  if (!str) return str;
  let s = stripGarbage(str);
  const priceParts = [];
  const usdRe = /(?:US)?\$\s*[\d,]+(?:\.\d{2})?(?:\s*-\s*[\d,]+(?:\.\d{2})?)?/g;
  let m;
  while ((m = usdRe.exec(s)) !== null) {
    const after = s.substring(m.index + m[0].length, m.index + m[0].length + 40);
    if (/equivalent|today|202[0-9]|20[0-9]{2}/i.test(after)) continue;
    priceParts.push(m[0].trim());
  }
  const brl = s.match(/R\$\s*[\d.,]+/g);
  if (brl) priceParts.push(...brl.map(p => p.trim()));
  return priceParts.length > 0 ? priceParts.join(' / ') : null;
}

/* ---- Check if text is English (vs Portuguese) ---- */
function isEnglish(str) {
  if (!str || str.length < 20) return false;
  // Se tem caracteres acentuados portugueses, é PT
  if (/[àâáãéêíóôõúûçÀÂÃÉÊÍÓÔÕÚÛÇ]/g.test(str)) return false;
  // Se começa com determinante PT comum, é PT
  if (/^(O\s|A\s|Os\s|As\s|Em\s|Para\s|Por\s|Com\s|De\s|Do\s|Da\s|No\s|Na\s|Um\s|Uma\s|Pelo|Pela|Neste|Nesta|Entre)/i.test(str)) return false;
  // Se começa com padrão típico de inglês, é EN
  if (/^(The\s|This\s|That\s|These\s|Those\s|It\s|Its\s|An?\s|Codename|Developed|Manufactured|Released)/i.test(str)) return true;
  // Fallback: se começa com maiúscula e sem acentos, provavelmente EN
  if (/^[A-Z]/.test(str)) return true;
  return false;
}

/* ---- Fetch Portuguese Wikipedia summary ---- */
const WIKI_PT_TITLES = {
  'Nintendo 3DS': 'Nintendo 3DS',
  'Atari 2600': 'Atari 2600',
  'Atari 5200': 'Atari 5200',
  'Atari 7800': 'Atari 7800',
  'Atari Jaguar': 'Atari Jaguar',
  'Sony PlayStation': 'PlayStation',
  'SNES': 'Super Nintendo Entertainment System',
  'Dreamcast': 'Dreamcast',
  'Fairchild Channel F': 'Fairchild Channel F',
  'GameCube': 'Nintendo GameCube',
  'ColecoVision': 'ColecoVision',
  'Sony PSP': 'PlayStation Portable',
  'Apple II': 'Apple II',
  'Nintendo DS': 'Nintendo DS',
  'Game Boy': 'Game Boy',
  'Game Boy Advance': 'Game Boy Advance',
  'Game Boy Color': 'Game Boy Color',
  'Sega Genesis': 'Mega Drive',
  'Game Gear': 'Game Gear',
  'Nintendo 64': 'Nintendo 64',
  'Nintendo Switch': 'Nintendo Switch',
  'Neo Geo': 'Neo Geo',
  'NES': 'Nintendo Entertainment System',
  'PlayStation 2': 'PlayStation 2',
  'PlayStation 3': 'PlayStation 3',
  'Wii': 'Wii',
  'Wii U': 'Wii U',
  'Xbox 360': 'Xbox 360',
  'Xbox': 'Xbox',
  'Sega Saturn': 'Sega Saturn',
  'Master System': 'Master System',
  'PC Engine': 'PC Engine',
  'Virtual Boy': 'Virtual Boy',
  'Vectrex': 'Vectrex',
  'Intellivision': 'Intellivision',
  'Atari Lynx': 'Atari Lynx',
  'Atari ST': 'Atari ST',
  'MSX': 'MSX',
  'PlayStation Vita': 'PlayStation Vita',
  'WonderSwan': 'WonderSwan',
  'Commodore 64': 'Commodore 64',
  'Amiga': 'Amiga',
  'Sinclair ZX Spectrum': 'ZX Spectrum',
  'BBC Micro': 'BBC Micro',
  'PC-FX': 'PC-FX',
  'Sharp X68000': 'X68000',
  'Amstrad CPC': 'Amstrad CPC',
  'Atari 800': 'Atari 800',
  'Coleco Adam': 'Coleco Adam',
  'Commodore VIC-20': 'VIC-20',
  '3DO Interactive Multiplayer': '3DO',
  'Sega SG-1000': 'SG-1000',
  'Sega 32X': '32X',
  'Atari Jaguar CD': 'Atari Jaguar CD',
  'Famicom Disk System': 'Famicom Disk System',
  'Sharp X1': 'Sharp X1',
  'WonderSwan Color': 'WonderSwan Color',
  'PC-88': 'PC-88',
  'PC-98': 'PC-98',
  'Sinclair ZX81': 'ZX81',
  'Watara Supervision': 'Console Watara Supervision',
  'Commodore Amiga CD32': 'Amiga CD32',
  'Apple IIGS': 'Apple IIGS',
  'SuFami Turbo': 'SuFami Turbo',
  'Sega CD / Mega-CD': 'Sega CD',
  'Neo Geo CD': 'Neo Geo CD',
  'Neo Geo Pocket': 'Neo Geo Pocket',
  'SuperGrafx': 'PC Engine SuperGrafx',
  'MSX2': 'MSX2',
  'Sony PlayStation 2': 'PlayStation 2',
  'ColecoVision': 'ColecoVision',
};

async function fetchPtDescription(name) {
  const enTitle = WIKI_PT_TITLES[name];
  if (!enTitle) return null;
  try {
    const url = 'https://pt.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(enTitle);
    const data = await fetchJson(url);
    const extract = data?.extract || '';
    if (extract.length < 60) return null;
    return extract;
  } catch {
    return null;
  }
}

/* ---- Main ---- */
async function main() {
  let raw = fs.readFileSync(DATA_PATH, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const data = JSON.parse(raw);
  let cleanedCount = 0;
  let translated = 0;
  let priceCleaned = 0;

  for (const sys of data.systems) {
    // ── Clean all string fields ──
    const textFields = ['description', 'manufacturer', 'type', 'generation', 'cpu', 'memory', 'storage', 'media', 'os', 'display', 'graphics', 'sound', 'connectivity', 'launch_price', 'units_sold', 'predecessor', 'successor', 'online_services', 'best_selling_game', 'release_dates', 'discontinued'];
    for (const f of textFields) {
      if (typeof sys[f] === 'string') {
        const cleanedVal = stripGarbage(sys[f]);
        if (cleanedVal !== sys[f]) { sys[f] = cleanedVal; cleanedCount++; }
      }
    }

    // ── Clean launch_price ──
    if (sys.launch_price) {
      const old = sys.launch_price;
      sys.launch_price = cleanPrice(sys.launch_price);
      if (sys.launch_price !== old) priceCleaned++;
      if (sys.launch_price && sys.launch_price.length === 0) delete sys.launch_price;
    }

    // ── Clean curiosities ──
    if (Array.isArray(sys.curiosities)) {
      const filtered = sys.curiosities.filter(c => !isEnglish(c));
      sys.curiosities = filtered.map(c => stripGarbage(c)).filter(c => c.length > 0);
    }

    // ── Translate description to PT if English ──
    if (sys.description && isEnglish(sys.description)) {
      const ptDesc = await fetchPtDescription(sys.name);
      if (ptDesc) {
        sys.description = stripGarbage(ptDesc);
        translated++;
        await sleep(DELAY);
      }
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`CSS/HTML removido: ${cleanedCount} campos`);
  console.log(`Preços limpos: ${priceCleaned}`);
  console.log(`Descrições traduzidas via Wikipedia PT: ${translated}`);
}

main().catch(e => { console.error(e); process.exit(1); });
