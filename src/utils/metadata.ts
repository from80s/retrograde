import metadata from '../../data/systems_metadata.json';

type MetadataSystem = {
  id: string;
  tgdb_id: number;
  igdb_id: number;
  name: string;
  manufacturer: string;
  release_year: number;
  origin_country: string;
  description: string;
  curiosities: string[];
  supported_extensions: string[];
  emulators: string[];
  generation: string;
  type?: string;
  cpu?: string;
  memory?: string;
  storage?: string;
  media?: string;
  os?: string;
  display?: string;
  graphics?: string;
  sound?: string;
  connectivity?: string;
  launch_price?: string;
  units_sold?: string;
  predecessor?: string;
  successor?: string;
  online_services?: string;
  best_selling_game?: string;
  release_dates?: string;
  discontinued?: string;
  lifespan?: string;
  top_games?: {
    name: string;
    slug: string;
    rating: number | null;
    cover_path: string | null;
  }[];
};

const NAME_ALIAS: Record<string, string> = {
  'Commodore Amiga': 'Amiga',
  'MSX / MSX2': 'MSX',
  'Nintendo 64 / 64DD': 'Nintendo 64',
  'PC Engine / TurboGrafx-16': 'PC Engine',
  'PlayStation': 'Sony PlayStation',
  'PlayStation Portable': 'Sony PSP',
  'Sega Dreamcast': 'Dreamcast',
  'Sega Game Gear': 'Game Gear',
  'Sega Genesis / Mega Drive': 'Sega Genesis',
  'Sega Master System': 'Master System',
  'SNES / Super Famicom': 'SNES',
  'ZX Spectrum': 'Sinclair ZX Spectrum',
  'WonderSwan / Color': 'WonderSwan',
  'Arcade': 'Arcade',
  'GameCube': 'GameCube',
  'Game & Watch': 'Game & Watch',
  'Neo Geo Pocket / Color': 'Neo Geo Pocket Color',
  'Atari Jaguar / CD': 'Atari Jaguar',
};

const metadataByName = new Map<string, MetadataSystem>();
for (const sys of (metadata as { systems: MetadataSystem[] }).systems) {
  metadataByName.set(sys.name, sys);
}

export function getSystemMetadata(name: string): MetadataSystem | undefined {
  const alias = NAME_ALIAS[name];
  return metadataByName.get(alias ?? name);
}

export function getSupportedExtensions(name: string): string[] {
  const meta = getSystemMetadata(name);
  return meta?.supported_extensions ?? [];
}

const HARDWARE_IMAGE_NAMES = new Set([
  'Amiga', 'Amstrad CPC', 'Apple II', 'Apple IIGS', 'Arcade',
  'Atari 2600', 'Atari 5200', 'Atari 7800', 'Atari 800',
  'Atari Jaguar CD', 'Atari Jaguar', 'Atari Lynx', 'Atari ST',
  'BBC Micro', 'ColecoVision', 'Commodore 64', 'Daphne', 'Doom',
  'DOS', 'Dreamcast', 'Fairchild Channel F', 'Famicom Disk System',
  'Game & Watch', 'Game Boy Advance', 'Game Boy Color', 'Game Boy',
  'GameCube',
]);

export function getHardwareUrl(name: string): string | null {
  const meta = getSystemMetadata(name);
  if (!meta || !HARDWARE_IMAGE_NAMES.has(meta.name)) return null;
  return `system/hardwares/${encodeURIComponent(meta.name)}.png`;
}

export function getLogoUrl(name: string): string | null {
  const mapping: Record<string, string> = {
    '3DO Interactive Multiplayer': '3do',
    'Amstrad CPC': 'amstradcpc',
    'Apple II': 'apple2',
    'Apple IIGS': 'apple2gs',
    'Arcade': 'arcade',
    'Atari 2600': 'atari2600',
    'Atari 5200': 'atari5200',
    'Atari 7800': 'atari7800',
    'Atari 800': 'atari800',
    'Atari Jaguar / CD': 'atarijaguar',
    'Atari Lynx': 'atarilynx',
    'Atari ST': 'atarist',
    'BBC Micro': 'bbcmicro',
    'Coleco Adam': 'adam',
    'ColecoVision': 'colecovision',
    'Commodore 64': 'c64',
    'Commodore Amiga': 'amiga',
    'Commodore Amiga CD32': 'amigacd32',
    'Commodore VIC-20': 'vic20',
    'Daphne': 'daphne',
    'DOS': 'dos',
    'Fairchild Channel F': 'channelf',
    'Game & Watch': 'gameandwatch',
    'Game Boy': 'gb',
    'Game Boy Advance': 'gba',
    'Game Boy Color': 'gbc',
    'GameCube': 'gc',
    'Intellivision': 'intellivision',
    'LowRes NX': 'lowresnx',
    'MAME': 'mame',
    'MSX / MSX2': 'msx',
    'Neo Geo': 'neogeo',
    'Neo Geo CD': 'neogeocd',
    'Neo Geo Pocket / Color': 'ngpc',
    'NES': 'nes',
    'Nintendo 3DS': 'n3ds',
    'Nintendo 64 / 64DD': 'n64',
    'Nintendo DS': 'nds',
    'Nintendo Switch': 'switch',
    'PC Engine / TurboGrafx-16': 'pcengine',
    'PC Engine CD / TurboGrafx-CD': 'pcenginecd',
    'PC-88': 'pc88',
    'PC-98': 'pc98',
    'PC-FX': 'pcfx',
    'PICO-8': 'pico8',
    'PlayStation': 'psx',
    'PlayStation 2': 'ps2',
    'PlayStation 3': 'ps3',
    'PlayStation Portable': 'psp',
    'PlayStation Vita': 'psvita',
    'Pokémon Mini': 'pokemini',
    'ScummVM': 'scummvm',
    'Sega 32X': 'sega32x',
    'Sega CD / Mega-CD': 'segacd',
    'Sega Dreamcast': 'dreamcast',
    'Sega Game Gear': 'gamegear',
    'Sega Genesis / Mega Drive': 'genesis',
    'Sega Master System': 'mastersystem',
    'Sega NAOMI': 'naomi',
    'Sega Saturn': 'saturn',
    'Sega SG-1000': 'sg-1000',
    'Sharp X1': 'x1',
    'Sharp X68000': 'x68000',
    'SNES / Super Famicom': 'snes',
    'SuperGrafx': 'supergrafx',
    'SuFami Turbo': 'sufami',
    'TIC-80': 'tic80',
    'Vectrex': 'vectrex',
    'Virtual Boy': 'virtualboy',
    'WASM-4': 'wasm4',
    'Watara Supervision': 'supervision',
    'Wii': 'wii',
    'Wii U': 'wiiu',
    'WonderSwan / Color': 'wonderswan',
    'Xbox': 'xbox',
    'Xbox 360': 'xbox360',
    'ZX Spectrum': 'zxspectrum',
    'Sinclair ZX81': 'zx81',
  };
  const key = mapping[name];
  return key ? `system/logos/${key}.svg` : null;
}
