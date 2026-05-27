/**
 * Scraper Wikipedia aprimorado — busca infobox de cada sistema
 * e faz merge sem sobrescrever dados existentes.
 *
 * Uso: node scripts/scrape_wikipedia.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '..', 'data', 'systems_metadata.json');
const UA = 'RetroGrade/1.0 (wiki scraper; +https://github.com/retrograde)';
const DELAY = 1200;

/* ---------------------------------------------------------- */
/*  Tradução de geração                                        */
/* ---------------------------------------------------------- */
const GEN_MAP = {
  first: '1ª Geração', second: '2ª Geração', third: '3ª Geração',
  fourth: '4ª Geração', fifth: '5ª Geração', sixth: '6ª Geração',
  seventh: '7ª Geração', eighth: '8ª Geração', ninth: '9ª Geração',
};

function translateGen(v) {
  if (!v) return v;
  const key = v.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return GEN_MAP[key] || v;
}

/* ---------------------------------------------------------- */
/*  Decodificação de entidades HTML                             */
/* ---------------------------------------------------------- */
function decode(str) {
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

/* ---------------------------------------------------------- */
/*  Mapeamento nome → título Wikipedia                          */
/* ---------------------------------------------------------- */
const WIKIPEDIA_TITLES = {
  'Nintendo 3DS': 'Nintendo 3DS',
  'Atari 2600': 'Atari 2600',
  'Atari 5200': 'Atari 5200',
  'Atari 7800': 'Atari 7800',
  'Atari Jaguar': 'Atari Jaguar',
  'Sony PlayStation': 'PlayStation (console)',
  'SNES': 'Super Nintendo Entertainment System',
  'Dreamcast': 'Dreamcast',
  'Fairchild Channel F': 'Fairchild Channel F',
  'GameCube': 'GameCube',
  'ColecoVision': 'ColecoVision',
  'Sony PSP': 'PlayStation Portable',
  'Apple II': 'Apple II',
  'Nintendo DS': 'Nintendo DS',
  'Game Boy': 'Game Boy',
  'Game Boy Advance': 'Game Boy Advance',
  'Game Boy Color': 'Game Boy Color',
  'Sega 32X': '32X',
  'Sega Genesis': 'Sega Genesis',
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
  'Xbox': 'Xbox (console)',
  'Sega Saturn': 'Sega Saturn',
  'Master System': 'Master System',
  'Sega SG-1000': 'SG-1000',
  'PC Engine': 'TurboGrafx-16',
  'Virtual Boy': 'Virtual Boy',
  'Vectrex': 'Vectrex',
  'Intellivision': 'Intellivision',
  'Atari Lynx': 'Atari Lynx',
  'Atari ST': 'Atari ST',
  'MSX': 'MSX',
  'MSX2': 'MSX2',
  'Neo Geo Pocket': 'Neo Geo Pocket',
  'Neo Geo Pocket Color': 'Neo Geo Pocket',
  'PlayStation Vita': 'PlayStation Vita',
  'WonderSwan': 'WonderSwan',
  'WonderSwan Color': 'WonderSwan',
  '3DO Interactive Multiplayer': '3DO',
  'Commodore 64': 'Commodore 64',
  'Amiga': 'Amiga',
  'Sinclair ZX Spectrum': 'ZX Spectrum',
  'Sharp X1': 'Sharp X1',
  'PC-88': 'PC-8800 series',
  'PC-98': 'PC-98',
  'Atari 800': 'Atari 8-bit computers',
  'Coleco Adam': 'Coleco Adam',
  'BBC Micro': 'BBC Micro',
  'Commodore VIC-20': 'VIC-20',
  'PC Engine CD / TurboGrafx-CD': 'TurboGrafx-CD',
  'Sega CD / Mega-CD': 'Sega CD',
  'SuperGrafx': 'PC Engine SuperGrafx',
  'PC-FX': 'PC-FX',
  'Sharp X68000': 'X68000',
  'Famicom Disk System': 'Famicom Disk System',
  'Game & Watch': 'Game & Watch',
  'Pokémon Mini': 'Pokémon Mini',
  'Atari Jaguar CD': 'Atari Jaguar CD',
  'Sega NAOMI': 'Sega NAOMI',
  'Neo Geo CD': 'Neo Geo CD',
  'Watara Supervision': 'Watara Supervision',
  'SuFami Turbo': 'SuFami Turbo',
  'Amstrad CPC': 'Amstrad CPC',
  'Commodore Amiga CD32': 'Amiga CD32',
  'Apple IIGS': 'Apple IIGS',
  'Sinclair ZX81': 'ZX81',
};

/* ---------------------------------------------------------- */
/*  Fetch + parse do infobox                                   */
/* ---------------------------------------------------------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const seenTooMany = new Set();

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(`API error: ${json.error.info || JSON.stringify(json.error)}`);
  return json;
}

/** Resolve redirects via Query API */
async function resolveRedirect(title) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&titles='
    + encodeURIComponent(title) + '&redirects=1&format=json&formatversion=2';
  const data = await fetchJson(url);
  const pages = data?.query?.pages || [];
  if (pages.length > 0) {
    return pages[0].title || title;
  }
  return title;
}

/** Busca o HTML do infobox via Parse API */
async function fetchInfoboxHtml(title) {
  const resolved = await resolveRedirect(title);
  const url = 'https://en.wikipedia.org/w/api.php?action=parse&page='
    + encodeURIComponent(resolved) + '&prop=text&format=json&formatversion=2';
  const data = await fetchJson(url);
  const html = data?.parse?.text || '';
  if (typeof html === 'string') return html;
  return null;
}

/** Extrai campos do infobox a partir do HTML */
function parseInfobox(html) {
  if (!html) return {};

  // Procurar tabela com classe infobox
  const tableMatch = html.match(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>[\s\S]*?<\/table>/i);
  if (!tableMatch) return {};

  const table = tableMatch[0];
  const rows = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

  const result = {};

  for (const row of rows) {
    const headerMatch = row.match(/<th[^>]*class="infobox-label"[^>]*>([\s\S]*?)<\/th>/i);
    const dataMatch = row.match(/<td[^>]*class="infobox-data"[^>]*>([\s\S]*?)<\/td>/i);
    if (!headerMatch || !dataMatch) continue;

    const label = headerMatch[1].replace(/<[^>]+>/g, '').trim().toLowerCase();
    let value = dataMatch[1]
      .replace(/<br\s*\/?>/gi, ', ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!value) continue;

    // Mapear label → campo
    switch (label) {
      case 'manufacturer':
        result.manufacturer = value;
        break;
      case 'type':
        result.type = value;
        break;
      case 'generation':
        result.generation = translateGen(value);
        break;
      case 'released':
      case 'lifespan':
      case 'release date':
        result.release_dates = value;
        break;
      case 'introductory price':
        result.launch_price = value;
        break;
      case 'discontinued':
        result.discontinued = value;
        break;
      case 'units sold':
        result.units_sold = value;
        break;
      case 'media':
        result.media = value;
        break;
      case 'os':
      case 'operating system':
        result.os = value;
        break;
      case 'cpu':
        result.cpu = value;
        break;
      case 'memory':
        result.memory = value;
        break;
      case 'storage':
        result.storage = value;
        break;
      case 'display':
        result.display = value;
        break;
      case 'graphics':
        result.graphics = value;
        break;
      case 'sound':
        result.sound = value;
        break;
      case 'connectivity':
        result.connectivity = value;
        break;
      case 'online services':
        result.online_services = value;
        break;
      case 'best-selling game':
        result.best_selling_game = value;
        break;
      case 'predecessor':
        result.predecessor = value;
        break;
      case 'successor':
        result.successor = value;
        break;
      case 'cpu speed':
        result.cpu = value; // fallback
        break;
    }
  }

  return result;
}

/** Busca curiosidades via REST API summary */
async function fetchCuriosities(title) {
  try {
    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
      + encodeURIComponent(title);
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const extract = data?.extract || '';
    if (extract.length < 60) return null;
    return extract;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------- */
/*  Main                                                       */
/* ---------------------------------------------------------- */
async function main() {
  console.log('Lendo metadados...');
  let raw = fs.readFileSync(DATA_PATH, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const data = JSON.parse(raw);

  const entries = Object.entries(WIKIPEDIA_TITLES);
  let succeeded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < data.systems.length; i++) {
    const system = data.systems[i];
    const title = WIKIPEDIA_TITLES[system.name];

    if (!title) {
      console.log(`[${i + 1}/${data.systems.length}] ${system.name}: ignorado (sem página definida)`);
      skipped++;
      continue;
    }

    const label = `[${i + 1}/${data.systems.length}] ${system.name}`;

    try {
      const html = await fetchInfoboxHtml(title);
      const scraped = parseInfobox(html);
      const fields = Object.keys(scraped);

      if (fields.length > 0) {
        // Merge sem sobrescrever dados existentes
        for (const key of fields) {
          if (!system[key]) {
            system[key] = decode(scraped[key]);
          }
        }
        succeeded++;
        console.log(`${label}: OK — ${fields.join(', ')}`);
      } else {
        // Tenta sem formatversion=2 como fallback
        try {
          const urlFallback = 'https://en.wikipedia.org/w/api.php?action=parse&page='
            + encodeURIComponent(title) + '&prop=text&format=json';
          const fbData = await fetchJson(urlFallback);
          const fbHtml = fbData?.parse?.text?.['*'] || '';
          const fbScraped = parseInfobox(fbHtml);
          const fbFields = Object.keys(fbScraped);
          if (fbFields.length > 0) {
            for (const key of fbFields) {
              if (!system[key]) system[key] = decode(fbScraped[key]);
            }
            succeeded++;
            console.log(`${label}: OK (fallback) — ${fbFields.join(', ')}`);
          } else {
            failed++;
            console.log(`${label}: OK — sem dados`);
          }
        } catch {
          failed++;
          console.log(`${label}: OK — sem dados`);
        }
      }

      // Curiosidades (resumo)
      if (!system.curiosities) {
        try {
          const extract = await fetchCuriosities(title);
          if (extract) {
            system.curiosities = [decode(extract)];
          }
        } catch { /* silêncio */ }
        await sleep(400);
      }

    } catch (err) {
      if (err.message?.includes('too many requests') || err.message?.includes('429')) {
        console.log(`${label}: RATE LIMITED — esperando 30s...`);
        await sleep(30000);
        continue;
      }
      console.log(`${label}: ERRO — ${err.message}`);
      failed++;
    }

    await sleep(DELAY + Math.random() * 600);
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`\nFinalizado. OK: ${succeeded}, sem dados: ${failed}, ignorados: ${skipped}`);
}

main().catch(e => { console.error(e); process.exit(1); });
