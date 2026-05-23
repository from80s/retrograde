import Database from 'better-sqlite3';
import AdmZip from 'adm-zip';
import { ungzip } from 'node-gzip';
import CRC32 from 'crc-32';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';

// ─── Inicialização ────────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

export function initRomDatabase(dbPath: string) {
  _db = new Database(dbPath, { readonly: true });
  _db.pragma('journal_mode = WAL');
  (_db as any)._byCrc32 = _db.prepare('SELECT * FROM roms WHERE crc32 = ? LIMIT 1');
  (_db as any)._bySha1  = _db.prepare('SELECT * FROM roms WHERE sha1  = ? LIMIT 1');
  (_db as any)._byMd5   = _db.prepare('SELECT * FROM roms WHERE md5   = ? LIMIT 1');
}

export function closeRomDatabase() {
  _db?.close();
  _db = null;
}

export function isDbReady(): boolean {
  return _db !== null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetectionResult {
  file: string;
  system: string | null;
  name: string | null;
  source: string | null;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  matchedBy: string | null;
  hashes: { crc32: string; sha1: string; md5: string } | null;
  error: string | null;
}

export interface RomEntry {
  buffer: Buffer;
  innerName: string;
  innerExt: string;
}

// ─── Magic Bytes ──────────────────────────────────────────────────────────────

const MAGIC_SIGNATURES: { system: string; offset: number; bytes: number[] }[] = [
  { system: 'NES',        offset: 0x000, bytes: [0x4E, 0x45, 0x53, 0x1A] },
  { system: 'N64',        offset: 0x000, bytes: [0x80, 0x37, 0x12, 0x40] },
  { system: 'N64 (Z64)',  offset: 0x000, bytes: [0x37, 0x80, 0x40, 0x12] },
  { system: 'N64 (V64)',  offset: 0x000, bytes: [0x40, 0x12, 0x37, 0x80] },
  { system: 'Atari Lynx', offset: 0x000, bytes: [0x4C, 0x59, 0x4E, 0x58] },
  { system: 'PS1',        offset: 0x000, bytes: [0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00] },
  { system: 'GameCube',   offset: 0x01C, bytes: [0xC2, 0x33, 0x9F, 0x3D] },
  { system: 'Wii',        offset: 0x018, bytes: [0x5D, 0x1C, 0x9E, 0xA3] },
  { system: 'MegaDrive',  offset: 0x100, bytes: [0x53, 0x45, 0x47, 0x41] },
  { system: 'GBA',        offset: 0x004, bytes: [0x24, 0xFF, 0xAE, 0x51] },
  { system: 'NDS',        offset: 0x0C0, bytes: [0x24, 0xFF, 0xAE, 0x51] },
  { system: 'MasterSystem', offset: 0x7FF0, bytes: [0x54, 0x4D, 0x52, 0x20, 0x53, 0x45, 0x47, 0x41] },
  { system: 'GB/GBC',     offset: 0x104, bytes: [0xCE, 0xED, 0x66, 0x66] },
  { system: 'Dreamcast',  offset: 0x000, bytes: [0x53, 0x45, 0x47, 0x41, 0x20, 0x53, 0x45, 0x47, 0x41, 0x4B, 0x41, 0x54, 0x41, 0x4E, 0x41] },
  { system: 'Sega Saturn', offset: 0x000, bytes: [0x53, 0x45, 0x47, 0x41, 0x20, 0x53, 0x45, 0x47, 0x41, 0x53, 0x41, 0x54, 0x55, 0x52, 0x4E] },
];

// ─── Extension → System Name (fallback) ──────────────────────────────────────

const EXTENSION_MAP: Record<string, string> = {
  '.nes': 'NES',  '.fds': 'FDS',
  '.sfc': 'SNES', '.smc': 'SNES', '.fig': 'SNES', '.swc': 'SNES', '.bs': 'SNES',
  '.gb':  'GB',   '.gbc': 'GBC', '.gba': 'GBA',
  '.n64': 'N64',  '.z64': 'N64', '.v64': 'N64', '.ndd': 'N64',
  '.nds': 'NDS',  '.dsi': 'NDS',
  '.3ds': '3DS',  '.cia': '3DS', '.3dsx': '3DS', '.cxi': '3DS', '.app': '3DS',
  '.gcm': 'GameCube', '.gcz': 'GameCube', '.ciso': 'GameCube',
  '.wbfs': 'Wii', '.rvz': 'Wii',
  '.wux': 'Wii U', '.wud': 'Wii U', '.rpx': 'Wii U',
  '.nsp': 'Switch', '.xci': 'Switch', '.nca': 'Switch', '.nro': 'Switch', '.nso': 'Switch',
  '.gen': 'MegaDrive', '.md': 'MegaDrive', '.smd': 'MegaDrive',
  '.32x': '32X',
  '.sms': 'MasterSystem',
  '.gg': 'GameGear',
  '.sat': 'Sega Saturn', '.iso': '',
  '.gdi': 'Dreamcast', '.cdi': 'Dreamcast',
  '.cue': '', '.bin': '', '.ccd': '', '.img': '', '.mdf': '', '.ecm': '', '.cbn': '',
  '.pbp': 'PSP', '.cso': 'PSP',
  '.pce': 'PCEngine', '.sgx': 'PCEngine',
  '.ws': 'WonderSwan', '.wsc': 'WonderSwan Color',
  '.vb': 'VirtualBoy', '.vboy': 'VirtualBoy',
  '.ngp': 'SNK - NeoGeo Pocket', '.ngc': 'SNK - NeoGeo Pocket Color',
  '.a26': 'Atari - 2600', '.a52': 'Atari - 5200', '.a78': 'Atari - 7800',
  '.lnx': '', '.lyx': 'Atari - Lynx (LYX)',
  '.jag': '', '.j64': '', '.abs': '', '.cof': '',
  '.col': 'ColecoVision', '.int': 'Intellivision', '.vec': 'Vectrex',
  '.d64': 'C64', '.crt': 'C64', '.prg': 'C64', '.g64': 'C64', '.t64': 'C64', '.x64': 'C64',
  '.adf': 'Amiga', '.adz': 'Amiga', '.ipf': 'Amiga', '.hdf': 'Amiga', '.hdz': 'Amiga',
  '.st': 'Atari - ST', '.stx': 'Atari - ST', '.msa': 'Atari - ST',
  '.atr': 'Atari - 8-bit Family', '.atx': 'Atari - 8-bit Family',
  '.mx1': 'MSX', '.mx2': 'MSX2',
  '.z80': 'ZXSpectrum', '.scl': 'ZXSpectrum', '.trd': 'ZXSpectrum', '.tzx': 'ZXSpectrum', '.tap': '',
  '.p': 'ZX81', '.t81': 'ZX81',
  '.vpk': 'PSVita',
  '.ps3': 'PS3', '.pkg': 'PS3', '.rap': 'PS3',
  '.ps2': 'PS2',
  '.do': 'Apple II', '.po': 'Apple II', '.nib': 'Apple II',
  '.2mg': 'Apple IIGS',
  '.chf': 'Fairchild - Channel F',
  '.mgw': 'Nintendo - Game & Watch',
  '.min': 'Nintendo - Pokemon Mini',
  '.sv': 'Watara - Supervision',
  '.p8': 'PICO-8', '.png': 'PICO-8',
  '.tic': 'TIC-80',
  '.wasm': 'WASM-4',
  '.nx': 'LowRes NX',
  '.d88': '', '.tfd': '', '.hdd': '', '.nhd': '', '.hdi': '',
  '.2d': 'Sharp - X1 (Waveform)', '.2hd': 'Sharp - X1 (Waveform)', '.dx1': 'Sharp - X1 (Waveform)',
  '.toc': 'PC-FX',
  '.ssd': 'BBC Micro',
  '.cdt': 'Amstrad - CPC (Misc)', '.dsk': '', '.cpr': '', '.sna': '', '.voc': '', '.cas': '', '.kcr': '',
  '.wad': '', '.iwad': '', '.doom': '',
  '.daphne': '', '.m2v': '', '.ogg': '',
  '.svm': '',
  '.exe': '', '.com': '', '.bat': '', '.conf': '', '.ins': '', '.raw': '', '.vhd': '',
  '.zip': '', '.7z': '',
  '.xiso': 'Xbox',
  '.xex': 'Xbox 360',
  '.neo': 'Neo Geo',
  '.lst': 'Sega NAOMI',
  '.sg': 'Sega - SG-1000',
};

// ─── DB System Name → Extension Key (for systems.json lookup) ────────────────

const DB_SYSTEM_TO_EXT: Record<string, string> = {
  'NES': '.nes',
  'SNES': '.sfc',
  'GBA': '.gba',
  'GB': '.gb',
  'GBC': '.gbc',
  'N64': '.n64',
  'NDS': '.nds',
  '3DS': '.3ds',
  'GameCube': '.gcm',
  'Wii': '.wbfs',
  'MegaDrive': '.gen',
  '32X': '.32x',
  'MasterSystem': '.sms',
  'GameGear': '.gg',
  'Dreamcast': '.gdi',
  'Sega Saturn': '.sat',
  'Sega - SG-1000': '.sg',
  'PCEngine': '.pce',
  'VirtualBoy': '.vb',
  'WonderSwan': '.ws',
  'WonderSwan Color': '.wsc',
  'SNK - NeoGeo Pocket': '.ngp',
  'SNK - NeoGeo Pocket Color': '.ngc',
  'Neo Geo': '.neo',
  'Atari - 2600': '.a26',
  'Atari - 5200': '.a52',
  'Atari - 7800': '.a78',
  'AtariJaguar': '.jag',
  'Atari - Lynx (BLL)': '.lnx',
  'Atari - Lynx (LNX)': '.lnx',
  'Atari - Lynx (LYX)': '.lnx',
  'ColecoVision': '.col',
  'Intellivision': '.int',
  'Vectrex': '.vec',
  'C64': '.d64',
  'Amiga': '.adf',
  'Atari - ST': '.st',
  'Atari - 8-bit Family': '.atr',
  'MSX': '.mx1',
  'MSX2': '.mx2',
  'ZXSpectrum': '.z80',
  'ZX81': '.p',
  'Fairchild - Channel F': '.chf',
  'Nintendo - Game & Watch': '.mgw',
  'Nintendo - Pokemon Mini': '.min',
  'Watara - Supervision': '.sv',
  'PICO-8': '.p8',
  'TIC-80': '.tic',
  'WASM-4': '.wasm',
  'PS1': '.bin',
  'PS2': '.ps2',
  'PS3': '.ps3',
  'PSP': '.cso',
  'PSVita': '.vpk',
  'Switch': '.nsp',
  'Wii U': '.wux',
  'PC-FX': '.toc',
  'Sharp - X1 (Waveform)': '.2d',
  'Apple II': '.do',
  'Apple IIGS': '.2mg',
  'BBC Micro': '.ssd',
  'Xbox': '.xiso',
  'Xbox 360': '.xex',
  'Amstrad - CPC (Flux)': '.dsk',
  'Amstrad - CPC (Misc)': '.dsk',
  'Acorn - Archimedes': '.ssd',
  'LowRes NX': '.nx',
  'Sega NAOMI': '.lst',
  'ScummVM': '.svm',
  'Daphne': '.daphne',
  'Doom': '.wad',
  'FDS': '.fds',
  'Apple - II (A2R)': '.do',
  'Apple - II (WOZ)': '.do',
  'Apple - IIe (Kryoflux)': '.do',
  'Apple - IIGS (A2R)': '.2mg',
  'Apple - IIGS (WOZ)': '.2mg',
  'Apple - I (Tapes)': '.do',
  'IBM - PC and Compatibles (Digital) (Desura)': '.exe',
  'IBM - PC and Compatibles (Digital) (Groupees)': '.exe',
  'IBM - PC and Compatibles (Flux)': '.exe',
  'IBM - PC and Compatibles (SCP)': '.exe',
  'Non-Redump - Microsoft - Xbox': '.xiso',
  'Microsoft - Xbox 360 (Digital)': '.xex',
  'Non-Redump - Microsoft - Xbox 360': '.xex',
  'Arcade': '.zip',
  'GB/GBC': '.gb',
  'N64 (Z64)': '.n64',
  'N64 (V64)': '.n64',
};

// ─── Hashes ───────────────────────────────────────────────────────────────────

function computeHashes(buffer: Buffer): { crc32: string; sha1: string; md5: string } {
  const crc32 = (CRC32.buf(buffer) >>> 0).toString(16).padStart(8, '0');
  const sha1  = crypto.createHash('sha1').update(buffer).digest('hex');
  const md5   = crypto.createHash('md5').update(buffer).digest('hex');
  return { crc32, sha1, md5 };
}

// ─── Extração ─────────────────────────────────────────────────────────────────

async function extractEntries(filePath: string): Promise<RomEntry[]> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.zip') {
    const zip = new AdmZip(filePath);
    return zip.getEntries()
      .filter(e => !e.isDirectory)
      .map(e => ({
        buffer:   e.getData(),
        innerName: e.entryName,
        innerExt: path.extname(e.entryName).toLowerCase(),
      }));
  }

  if (ext === '.gz') {
    const buf = await ungzip(fs.readFileSync(filePath));
    const inner = path.basename(filePath, '.gz');
    return [{ buffer: buf, innerName: inner, innerExt: path.extname(inner).toLowerCase() }];
  }

  return [{
    buffer:   fs.readFileSync(filePath),
    innerName: path.basename(filePath),
    innerExt: ext,
  }];
}

// ─── Magic bytes ──────────────────────────────────────────────────────────────

function detectByMagicBytes(buffer: Buffer): string | null {
  for (const sig of MAGIC_SIGNATURES) {
    if (buffer.length < sig.offset + sig.bytes.length) continue;
    if (sig.bytes.every((b, i) => buffer[sig.offset + i] === b)) {
      const mapped = DB_SYSTEM_TO_EXT[sig.system];
      if (mapped) return mapped;
      return sig.system;
    }
  }
  return null;
}

// ─── Lookup SQLite ────────────────────────────────────────────────────────────

function lookupByHash(hashes: { crc32: string; sha1: string; md5: string }): any | null {
  if (!_db) return null;
  const db = _db as any;
  return (
    db._byCrc32.get(hashes.crc32) ||
    db._bySha1.get(hashes.sha1)   ||
    db._byMd5.get(hashes.md5)     ||
    null
  );
}

// ─── Extension → Extension key ──────────────────────────────────────────────

function extToSystemKey(ext: string): string | null {
  const dbSystem = EXTENSION_MAP[ext];
  if (!dbSystem) return null;
  // If EXTENSION_MAP directly gives us a key
  const mapped = DB_SYSTEM_TO_EXT[dbSystem];
  if (mapped) return mapped;
  // Check if dbSystem itself is already a key
  return dbSystem !== '' ? dbSystem : null;
}

// ─── API pública ──────────────────────────────────────────────────────────────

export async function detectRom(filePath: string): Promise<DetectionResult> {
  const result: DetectionResult = {
    file: filePath,
    system: null,
    name: null,
    source: null,
    confidence: 'unknown',
    matchedBy: null,
    hashes: null,
    error: null,
  };

  let entries: RomEntry[];
  try {
    entries = await extractEntries(filePath);
  } catch (e: any) {
    result.error = e.message;
    return result;
  }

  for (const entry of entries) {
    const hashes = _db ? computeHashes(entry.buffer) : null;
    if (hashes && !result.hashes) result.hashes = hashes;

    // Camada 1: hash lookup no SQLite (ALTA confiança) — só se DB disponível
    if (hashes && _db) {
      const match = lookupByHash(hashes);
      if (match) {
        const extKey = DB_SYSTEM_TO_EXT[match.system] || match.system;
        result.system = extKey;
        result.name = match.name;
        result.source = match.source;
        result.confidence = 'high';
        const db = _db as any;
        result.matchedBy = `hash:${
          db._byCrc32.get(hashes.crc32) ? 'crc32' :
          db._bySha1.get(hashes.sha1) ? 'sha1' : 'md5'
        }`;
        return result;
      }
    }

    // Camada 2: magic bytes (MÉDIA confiança)
    if (!result.system) {
      const magic = detectByMagicBytes(entry.buffer);
      if (magic) {
        result.system = magic;
        result.confidence = 'medium';
        result.matchedBy = 'magic_bytes';
      }
    }

    // Camada 3: extensão interna (BAIXA confiança)
    if (!result.system && entry.innerExt) {
      const extKey = extToSystemKey(entry.innerExt);
      if (extKey && extKey !== '') {
        result.system = extKey;
        result.confidence = 'low';
        result.matchedBy = 'extension';
      }
    }
  }

  return result;
}

export async function detectRoms(filePaths: string[], concurrency = 4): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];
  for (let i = 0; i < filePaths.length; i += concurrency) {
    const batch = filePaths.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(detectRom));
    results.push(...batchResults);
  }
  return results;
}
