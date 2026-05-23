import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DB = path.join(__dirname, "..", "temp", "rom_database.sqlite");
const OUTPUT_DB = path.join(__dirname, "..", "assets", "rom_database_optimized.sqlite");
const SYSTEMS_JSON = path.join(__dirname, "..", "data", "systems.json");

const SYSTEMS_JSON_TO_DB = {
  "Sega 32X":                  ["32X"],
  "Nintendo 3DS":              ["3DS"],
  "Nintendo Switch":           [],
  "Arcade/MAME":               ["Arcade"],
  "Atari 2600":                ["Atari - 2600"],
  "Atari 5200":                ["Atari - 5200"],
  "Atari 7800":                ["Atari - 7800"],
  "Atari Jaguar":              ["Atari - Jaguar (J64)", "Atari - Jaguar (JAG)", "Atari - Jaguar (ROM)", "AtariJaguar"],
  "Atari Jaguar CD":           ["AtariJaguar"],
  "Amiga":                     ["Amiga"],
  "Atari 800":                 ["Atari - 8-bit Family", "Atari - 8-bit Family (Kryoflux)"],
  "Amstrad CPC":               ["Amstrad - CPC (Flux)", "Amstrad - CPC (Misc)"],
  "Sony PlayStation":          ["PS1"],
  "Sony PlayStation 2":        ["PS2"],
  "PlayStation 2":             ["PS2"],
  "PlayStation 3":             ["PS3"],
  "PlayStation Vita":          ["PSVita"],
  "SNES":                      ["SNES"],
  "Super Famicom":             ["SNES"],
  "Dreamcast":                 ["Dreamcast"],
  "GameCube":                  ["GameCube"],
  "GameCube/Wii":              ["GameCube", "Wii"],
  "ColecoVision":              ["ColecoVision"],
  "DOS":                       [
    "IBM - PC and Compatibles (Digital) (Desura)",
    "IBM - PC and Compatibles (Digital) (Groupees)",
    "IBM - PC and Compatibles (Digital) (JAST USA)",
    "IBM - PC and Compatibles (Digital) (Misc)",
    "IBM - PC and Compatibles (Digital) (Misc) (Hentai)",
    "IBM - PC and Compatibles (Digital) (Steam) (Hentai)",
    "IBM - PC and Compatibles (Digital) (Unknown)",
    "IBM - PC and Compatibles (Digital) (Updates and DLC)",
    "IBM - PC and Compatibles (Flash Media)",
    "IBM - PC and Compatibles (Flux)",
    "IBM - PC and Compatibles (IPF)",
    "IBM - PC and Compatibles (LooseFilesArchive)",
    "IBM - PC and Compatibles (SCP)",
  ],
  "Game Boy":                  ["GB"],
  "Game Boy Advance":          ["GBA"],
  "Game Boy Color":            ["GBC"],
  "Mega Drive":                ["MegaDrive"],
  "Sega Genesis":              ["MegaDrive"],
  "Game Gear":                 ["GameGear"],
  "PC-88":                     ["PC88"],
  "PC-98":                     ["PC98"],
  "PC-88/PC-98":               ["PC88", "PC98"],
  "Sharp X1":                  ["Sharp - X1 (Waveform)"],
  "Famicom Disk System":       ["Nintendo - Family Computer Disk System (FDS)", "Nintendo - Family Computer Disk System (QD)"],
  "NES":                       ["NES"],
  "Nintendo 64":               ["N64"],
  "Nintendo DS":               ["NDS"],
  "Neo Geo":                   [],
  "Neo Geo Pocket":            ["SNK - NeoGeo Pocket"],
  "Neo Geo Pocket Color":      ["SNK - NeoGeo Pocket Color"],
  "Apple II":                  [
    "Apple - II (A2R)", "Apple - II (WOZ)", "Apple - II (Waveform)",
    "Apple - II Plus (Flux)", "Apple - II Plus (WOZ)",
    "Apple - IIe (A2R)", "Apple - IIe (Kryoflux)", "Apple - IIe (WOZ)",
    "Apple - I (Tapes)",
  ],
  "Apple IIGS":                ["Apple - IIGS (A2R)", "Apple - IIGS (WOZ)"],
  "Sony PSP":                  ["PSP"],
  "PC Engine":                 ["PCEngine"],
  "Pokémon Mini":              ["Nintendo - Pokemon Mini"],
  "Atari ST":                  ["Atari - ST", "Atari - ST (Flux)"],
  "MSX":                       ["MSX"],
  "MSX2":                      ["MSX2"],
  "Sega Saturn":               ["Saturn"],
  "Master System":             ["MasterSystem"],
  "Sega SG-1000":              ["Sega - SG-1000"],
  "Atari Lynx":                ["Atari - Lynx (BLL)", "Atari - Lynx (LNX)", "Atari - Lynx (LYX)"],
  "Virtual Boy":               ["VirtualBoy"],
  "Wii":                       ["Wii"],
  "Wii U":                     [],
  "WonderSwan":                ["WonderSwan"],
  "WonderSwan Color":          ["WonderSwanColor"],
  "Xbox":                      ["Non-Redump - Microsoft - Xbox"],
  "Xbox 360":                  ["Microsoft - Xbox 360 (Digital)", "Non-Redump - Microsoft - Xbox 360"],
  "Intellivision":             ["Intellivision"],
  "Vectrex":                   ["Vectrex"],
  "Commodore 64":              ["C64"],
  "BBC Micro":                 ["Acorn - Archimedes"],
  "Sinclair ZX Spectrum":      ["ZXSpectrum"],
  "Sinclair ZX81":             [],
  "Doom":                      [],
  "Daphne":                    [],
  "Game & Watch":              ["Nintendo - Game & Watch"],
  "LowRes NX":                 [],
  "PICO-8":                    [],
  "Sega NAOMI":                [],
  "ScummVM":                   [],
  "TIC-80":                    [],
  "WASM-4":                    [],
  "Watara Supervision":        ["Watara - Supervision"],
  "PC-FX":                     [],
  "Fairchild Channel F":       ["Fairchild - Channel F"],
};

const systemsJson = JSON.parse(fs.readFileSync(SYSTEMS_JSON, "utf-8"));
const systemNames = [...new Set(Object.values(systemsJson).map(v => v.name))];

const systemsToKeep = new Set();
for (const name of systemNames) {
  const dbSystems = SYSTEMS_JSON_TO_DB[name];
  if (dbSystems) dbSystems.forEach(s => systemsToKeep.add(s));
}

console.log(`Sistemas a manter: ${systemsToKeep.size}`);
console.log([...systemsToKeep].join("\n"));

const src = new Database(INPUT_DB, { readonly: true });

const allSystems = src.prepare("SELECT DISTINCT system FROM roms ORDER BY system").all();
console.log(`\nSistemas no banco original: ${allSystems.length}`);

if (fs.existsSync(OUTPUT_DB)) fs.unlinkSync(OUTPUT_DB);
const dst = new Database(OUTPUT_DB);
dst.pragma("journal_mode = WAL");
dst.pragma("synchronous = NORMAL");
dst.pragma("page_size = 4096");

dst.exec(`
  CREATE TABLE roms (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT NOT NULL,
    system  TEXT NOT NULL,
    source  TEXT NOT NULL,
    dat_file TEXT NOT NULL,
    size    INTEGER,
    crc32   TEXT,
    md5     TEXT,
    sha1    TEXT
  );
`);

const placeholder = [...systemsToKeep].map(() => "?").join(",");
const rows = src.prepare(
  `SELECT name, system, source, dat_file, size, crc32, md5, sha1
   FROM roms
   WHERE system IN (${placeholder})`
).all([...systemsToKeep]);

console.log(`\nROMs a migrar: ${rows.length.toLocaleString()}`);

const insert = dst.prepare(
  `INSERT INTO roms (name, system, source, dat_file, size, crc32, md5, sha1)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const insertAll = dst.transaction((rows) => {
  for (const r of rows) {
    insert.run(r.name, r.system, r.source, r.dat_file, r.size, r.crc32, r.md5, r.sha1);
  }
});

insertAll(rows);

console.log("Criando índices...");
dst.exec(`
  CREATE INDEX idx_crc32  ON roms(crc32);
  CREATE INDEX idx_sha1   ON roms(sha1);
  CREATE INDEX idx_md5    ON roms(md5);
  CREATE INDEX idx_system ON roms(system);
`);

console.log("Compactando banco (VACUUM)...");
dst.exec("VACUUM");

src.close();
dst.close();

const sizeBefore = fs.statSync(INPUT_DB).size;
const sizeAfter  = fs.statSync(OUTPUT_DB).size;
console.log(`\nConcluído`);
console.log(`   Antes:  ${(sizeBefore / 1024 / 1024).toFixed(1)} MB`);
console.log(`   Depois: ${(sizeAfter  / 1024 / 1024).toFixed(1)} MB`);
console.log(`   Redução: ${(100 - (sizeAfter / sizeBefore) * 100).toFixed(0)}%`);
console.log(`   Banco salvo em: ${OUTPUT_DB}`);
