import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import unzipper from 'unzipper';
import SevenZip from '7zip-min';
import * as tar from 'tar';
import zlib from 'zlib';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const isDev = process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL;

console.log('[RetroGrade] Starting app...');
console.log('[RetroGrade] isDev:', isDev);
console.log('[RetroGrade] app.getAppPath():', app.getAppPath());
console.log('[RetroGrade] __dirname:', __dirname);

const DATA_DIR = path.join(app.getAppPath(), 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');
const CLASSICS_PATH = path.join(DATA_DIR, 'classics.json');
const GENRE_PATH = path.join(DATA_DIR, 'genre.json');
const PROTECTED_GAMES_PATH = path.join(DATA_DIR, 'protected_games.json');
const CLASSIC_GAMES_PATH = path.join(DATA_DIR, 'classic_games.json');
const SYSTEMS_PATH = path.join(DATA_DIR, 'systems.json');
const STATS_PATH = path.join(DATA_DIR, 'curator_stats.json');
const PACKAGE_PATH = path.join(app.getAppPath(), 'package.json');

const iconPath = path.join(app.getAppPath(), 'assets', 'images', 'RetroGrade_icon_app_256x256.png');
const appIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;

let mainWindow: BrowserWindow | null = null;
let igdbToken: { access_token: string; expires_at: number } | null = null;

const GENERIC_EXTENSIONS = new Set(['.iso', '.bin', '.chd', '.gdi', '.cue', '.pbp', '.cso', '.rvz', '.gcm', '.wbfs', '.wux', '.7z', '.zip']);

interface SystemHint {
  keywords: string[];
  system: string;
}

const SYSTEM_HINTS: SystemHint[] = [
  { keywords: ['ps2', 'playstation 2', 'playstation2', 'ps two'], system: '.ps2' },
  { keywords: ['psx', 'playstation', 'ps1', 'ps one'], system: '.bin' },
  { keywords: ['saturn', 'sega saturn'], system: '.sat' },
  { keywords: ['dreamcast', 'dc', 'katana'], system: '.gdi' },
  { keywords: ['gamecube', 'gc', 'cube'], system: '.gcm' },
  { keywords: ['wii'], system: '.wbfs' },
  { keywords: ['wiiu', 'wii u'], system: '.wux' },
  { keywords: ['psp'], system: '.cso' },
  { keywords: ['ps3'], system: '.iso' },
  { keywords: ['nes', 'famicom'], system: '.nes' },
  { keywords: ['snes', 'super nintendo', 'super famicom'], system: '.sfc' },
  { keywords: ['n64', 'nintendo 64'], system: '.n64' },
  { keywords: ['gb', 'game boy'], system: '.gb' },
  { keywords: ['gba', 'game boy advance'], system: '.gba' },
  { keywords: ['gbc', 'game boy color'], system: '.gbc' },
  { keywords: ['nds', 'nintendo ds'], system: '.nds' },
  { keywords: ['3ds', 'nintendo 3ds'], system: '.3ds' },
  { keywords: ['genesis', 'mega drive', 'megadrive'], system: '.gen' },
  { keywords: ['mastersystem', 'master system', 'sms'], system: '.sms' },
  { keywords: ['gamegear', 'game gear'], system: '.gg' },
  { keywords: ['32x', 'sega 32x'], system: '.32x' },
  { keywords: ['segacd', 'mega cd', 'sega cd'], system: '.bin' },
  { keywords: ['neogeo', 'neo geo'], system: '.neo' },
  { keywords: ['atari2600', 'atari 2600'], system: '.a26' },
  { keywords: ['atari5200', 'atari 5200'], system: '.a52' },
  { keywords: ['atari7800', 'atari 7800'], system: '.a78' },
  { keywords: ['jaguar', 'atari jaguar'], system: '.jag' },
  { keywords: ['lynx', 'atari lynx'], system: '.lnx' },
];

function inferSystemFromFolder(folderPath: string): string | null {
  const folderName = path.basename(folderPath).toLowerCase();
  const parentName = path.basename(path.dirname(folderPath)).toLowerCase();
  const context = `${parentName} ${folderName}`;

  for (const hint of SYSTEM_HINTS) {
    if (hint.keywords.some((kw) => context.includes(kw))) {
      return hint.system;
    }
  }

  return null;
}

async function identifySystemFromFile(filePath: string, ext: string): Promise<string | null> {
  try {
    const fd = await fs.open(filePath, 'r');
    const header = Buffer.alloc(512);
    await fs.read(fd, header, 0, 512, 0);
    await fs.close(fd);

    const headerStr = header.toString('ascii', 0, 64).replace(/\0/g, '');

    // Magic numbers e assinaturas conhecidas
    if (headerStr.includes('SEGA SEGASATURN')) return '.sat';
    if (headerStr.includes('SEGA SEGAKATANA') || headerStr.includes('SEGA ENTERPRISES')) return '.gdi';
    if (headerStr.includes('SEGA MEGA DRIVE') || headerStr.includes('SEGA GENESIS')) return '.gen';
    if (headerStr.includes('SEGA MASTER SYSTEM')) return '.sms';
    if (headerStr.includes('SEGA GAME GEAR')) return '.gg';
    if (headerStr.includes('SEGA 32X')) return '.32x';
    if (headerStr.includes('SEGA CD')) return '.bin';
    if (headerStr.includes('SEGA SG-1000')) return '.sg';

    if (headerStr.includes('Nintendo') || headerStr.includes('NINTENDO')) {
      if (headerStr.includes('GameCube') || headerStr.includes('GAMECUBE')) return '.gcm';
      if (headerStr.includes('Wii')) return '.wbfs';
      if (headerStr.includes('Wii U')) return '.wux';
      if (headerStr.includes('3DS')) return '.3ds';
      if (headerStr.includes('DS')) return '.nds';
      if (headerStr.includes('64') || headerStr.includes('N64')) return '.n64';
      if (headerStr.includes('SNES') || headerStr.includes('Super Famicom')) return '.sfc';
      if (headerStr.includes('NES') || headerStr.includes('Famicom')) return '.nes';
      if (headerStr.includes('Game Boy Advance')) return '.gba';
      if (headerStr.includes('Game Boy Color')) return '.gbc';
      if (headerStr.includes('Game Boy')) return '.gb';
    }

    // PlayStation detection
    if (headerStr.includes('PS-X EXE') || headerStr.includes('Sony Computer Entertainment')) return '.bin';
    if (headerStr.includes('PlayStation 2') || headerStr.includes('PS2')) return '.ps2';
    if (headerStr.includes('PSP') || headerStr.includes('PlayStation Portable')) return '.cso';

    // Atari detection
    if (headerStr.includes('ATARI')) {
      if (headerStr.includes('JAGUAR')) return '.jag';
      if (headerStr.includes('LYNX')) return '.lnx';
      if (headerStr.includes('ST')) return '.st';
      if (headerStr.includes('2600')) return '.a26';
      if (headerStr.includes('5200')) return '.a52';
      if (headerStr.includes('7800')) return '.a78';
    }

    // Neo Geo
    if (headerStr.includes('NEOGEO') || headerStr.includes('SNK')) return '.neo';

    // CHD files - usar tamanho como heurística
    if (ext === '.chd' && headerStr.startsWith('MCompr')) {
      const stat = await fs.stat(filePath);
      const sizeMB = stat.size / (1024 * 1024);
      if (sizeMB > 100) return '.ps2';
      if (sizeMB > 20) return '.psx';
      if (sizeMB > 5) return '.sat';
      return '.psx';
    }

    // GCM/GameCube - verificar magic number no offset 0x1C
    if (ext === '.gcm' || ext === '.iso') {
      if (header.length > 0x20) {
        const magic = header.toString('ascii', 0x1C, 0x20);
        if (magic.startsWith('G1') || magic.startsWith('G2') || magic.startsWith('G3')) return '.gcm';
        if (magic.startsWith('R3') || magic.startsWith('S3') || magic.startsWith('L3')) return '.wbfs';
      }
    }

    // WBFS - Wii
    if (ext === '.wbfs' || headerStr.startsWith('WBFS')) return '.wbfs';

    // RVZ - Dolphin (GameCube/Wii)
    if (ext === '.rvz') {
      if (header.toString('ascii', 0, 4) === 'RVZ') return '.gcm';
    }

    // PBP - PSP
    if (ext === '.pbp' && header.toString('ascii', 0, 4) === '\0PBP') return '.cso';

    // CSO - PSP
    if (ext === '.cso' && header.toString('ascii', 0, 4) === 'CISO') return '.cso';

    // Análise por tamanho do arquivo como fallback
    const stat = await fs.stat(filePath);
    const sizeMB = stat.size / (1024 * 1024);

    if (ext === '.iso' || ext === '.bin') {
      if (sizeMB > 1000) return '.ps2';
      if (sizeMB > 200) return '.bin';
      if (sizeMB > 50) return '.sat';
      if (sizeMB > 10) return '.bin';
      return '.bin';
    }

    // Fallback para pasta como última opção
    return inferSystemFromFolder(path.dirname(filePath));
  } catch {
    return inferSystemFromFolder(path.dirname(filePath));
  }
}

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  const indexHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');

  console.log('[RetroGrade] preloadPath:', preloadPath);
  console.log('[RetroGrade] indexHtmlPath:', indexHtmlPath);
  console.log('[RetroGrade] preload exists:', fs.existsSync(preloadPath));
  console.log('[RetroGrade] index.html exists:', fs.existsSync(indexHtmlPath));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#09090b',
    frame: false,
    icon: appIcon,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(indexHtmlPath);
  }

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('[RetroGrade] Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('[RetroGrade] DOM ready');
  });

  mainWindow.on('ready-to-show', () => {
    console.log('[RetroGrade] Window ready to show');
    mainWindow?.show();
  });
}

app.whenReady().then(async () => {
  // Initialize data files if they don't exist
  try {
    await fs.ensureDir(DATA_DIR);
    
    if (!fs.existsSync(CONFIG_PATH)) {
      await fs.writeJson(CONFIG_PATH, {
        IGDB_CLIENT_ID: '',
        IGDB_CLIENT_SECRET: '',
        TGDB_API_KEY: '',
        minRating: 60,
        action: 'move'
      }, { spaces: 2 });
    }
    
    if (!fs.existsSync(CLASSICS_PATH)) {
      await fs.writeJson(CLASSICS_PATH, [], { spaces: 2 });
    }
    
    if (!fs.existsSync(GENRE_PATH)) {
      await fs.writeJson(GENRE_PATH, [], { spaces: 2 });
    }
    
    if (!fs.existsSync(PROTECTED_GAMES_PATH)) {
      await fs.writeJson(PROTECTED_GAMES_PATH, [], { spaces: 2 });
    }
    
    if (!fs.existsSync(STATS_PATH)) {
      await fs.writeJson(STATS_PATH, [], { spaces: 2 });
    }
  } catch (err) {
    console.error('[RetroGrade] Error initializing data files:', err);
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('read-version', async () => {
  try {
    const pkg = await fs.readJson(PACKAGE_PATH);
    return pkg.version;
  } catch {
    return '0.0.0';
  }
});

ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('test-api-connections', async () => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config) {
    return { igdb: { status: 'error' as const, message: 'Configuração não encontrada' }, tgdb: { status: 'error' as const, message: 'Configuração não encontrada' } };
  }

  const results: { igdb: { status: 'pending' | 'success' | 'error'; message: string }; tgdb: { status: 'pending' | 'success' | 'error'; message: string } } = {
    igdb: { status: 'pending', message: 'Testando...' },
    tgdb: { status: 'pending', message: 'Testando...' },
  };

  // Test IGDB
  try {
    if (!config.IGDB_CLIENT_ID || !config.IGDB_CLIENT_SECRET) {
      results.igdb = { status: 'error', message: 'Credenciais não configuradas' };
    } else {
      const response = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        null,
        {
          params: {
            client_id: config.IGDB_CLIENT_ID,
            client_secret: config.IGDB_CLIENT_SECRET,
            grant_type: 'client_credentials',
          },
          timeout: 10000,
        }
      );
      if (response.data.access_token) {
        results.igdb = { status: 'success', message: 'Conexão estabelecida' };
      } else {
        results.igdb = { status: 'error', message: 'Token não recebido' };
      }
    }
  } catch (error: any) {
    results.igdb = { status: 'error', message: error.response?.status === 401 ? 'Credenciais inválidas' : 'Erro de conexão' };
  }

  // Test TGDB
  try {
    if (!config.TGDB_API_KEY) {
      results.tgdb = { status: 'error', message: 'API Key não configurada' };
    } else {
      const response = await axios.get(
        'https://api.thegamesdb.net/v1/Platforms/ByPlatformName',
        {
          params: {
            apikey: config.TGDB_API_KEY,
            name: 'Nintendo Entertainment System',
          },
          timeout: 10000,
        }
      );
      if (response.data.data) {
        results.tgdb = { status: 'success', message: 'Conexão estabelecida' };
      } else {
        results.tgdb = { status: 'error', message: 'Resposta inesperada' };
      }
    }
  } catch (error: any) {
    results.tgdb = { status: 'error', message: error.response?.status === 401 ? 'API Key inválida' : 'Erro de conexão' };
  }

  return results;
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Selecionar pasta de ROMs',
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('read-config', async () => {
  try {
    return await fs.readJson(CONFIG_PATH);
  } catch {
    return null;
  }
});

ipcMain.handle('save-config', async (_, config) => {
  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 });
  return true;
});

ipcMain.handle('read-classics', async () => {
  try {
    const classics = await fs.readJson(CLASSICS_PATH);
    return classics.sort((a: string, b: string) => a.localeCompare(b));
  } catch {
    return [];
  }
});

ipcMain.handle('addClassic', async (_, name: string) => {
  const classics = await fs.readJson(CLASSICS_PATH).catch(() => []);
  if (!classics.includes(name)) {
    classics.push(name);
    await fs.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
  }
  return classics;
});

ipcMain.handle('removeClassic', async (_, name: string) => {
  let classics = await fs.readJson(CLASSICS_PATH).catch(() => []);
  classics = classics.filter((c: string) => c !== name);
  await fs.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
  return classics;
});

ipcMain.handle('addClassics', async (_, names: string[]) => {
  let classics: string[] = await fs.readJson(CLASSICS_PATH).catch(() => []);
  const added: string[] = [];
  for (const name of names) {
    if (!classics.includes(name)) {
      classics.push(name);
      added.push(name);
    }
  }
  if (added.length > 0) {
    await fs.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
  }
  return { classics, added };
});

ipcMain.handle('read-classic-games', async () => {
  try {
    return await fs.readJson(CLASSIC_GAMES_PATH);
  } catch {
    return { platforms: {} };
  }
});

ipcMain.handle('fetch-game-cover', async (_, gameName: string) => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config?.IGDB_CLIENT_ID || !config?.IGDB_CLIENT_SECRET) {
    return null;
  }
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields cover.url, name; limit 1;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        timeout: 10000,
      }
    );
    if (response.data.length > 0 && response.data[0].cover?.url) {
      let url = response.data[0].cover.url;
      // IGDB returns URLs with "//images.igdb.com/..." - prepend https:
      if (url.startsWith('//')) {
        url = 'https:' + url;
      }
      // Replace t_thumb with t_cover_small for better quality thumbnails
      url = url.replace('t_thumb', 't_cover_small');
      return url;
    }
    return null;
  } catch {
    return null;
  }
});

ipcMain.handle('read-genres', async () => {
  try {
    const genres = await fs.readJson(GENRE_PATH);
    return genres.sort((a: string, b: string) => a.localeCompare(b));
  } catch {
    return [];
  }
});

ipcMain.handle('addGenre', async (_, genre: string) => {
  const genres = await fs.readJson(GENRE_PATH).catch(() => []);
  if (!genres.includes(genre)) {
    genres.push(genre);
    await fs.writeJson(GENRE_PATH, genres, { spaces: 2 });
  }
  return genres;
});

ipcMain.handle('removeGenre', async (_, genre: string) => {
  let genres = await fs.readJson(GENRE_PATH).catch(() => []);
  genres = genres.filter((g: string) => g !== genre);
  await fs.writeJson(GENRE_PATH, genres, { spaces: 2 });
  return genres;
});

ipcMain.handle('read-protected-games', async () => {
  try {
    const games = await fs.readJson(PROTECTED_GAMES_PATH);
    return games.sort((a: string, b: string) => a.localeCompare(b));
  } catch {
    return [];
  }
});

ipcMain.handle('add-protected-game', async (_, gameName: string) => {
  const games = await fs.readJson(PROTECTED_GAMES_PATH).catch(() => []);
  if (!games.includes(gameName)) {
    games.push(gameName);
    await fs.writeJson(PROTECTED_GAMES_PATH, games, { spaces: 2 });
  }
  return games;
});

ipcMain.handle('remove-protected-game', async (_, gameName: string) => {
  let games = await fs.readJson(PROTECTED_GAMES_PATH).catch(() => []);
  games = games.filter((g: string) => g !== gameName);
  await fs.writeJson(PROTECTED_GAMES_PATH, games, { spaces: 2 });
  return games;
});

ipcMain.handle('validate-game-name', async (_, gameName: string) => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config) {
    return { valid: false, message: 'Configure as credenciais de API primeiro' };
  }

  // Try IGDB first
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields name; limit 1;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        timeout: 10000,
      }
    );
    if (response.data.length > 0) {
      return { valid: true, message: `Jogo encontrado: "${response.data[0].name}"` };
    }
  } catch {
    // Ignore IGDB errors, try TGDB
  }

  // Try TGDB
  try {
    const response = await axios.get(
      'https://api.thegamesdb.net/v1/Games/ByGameName',
      {
        params: {
          apikey: config.TGDB_API_KEY,
          name: gameName,
        },
        timeout: 10000,
      }
    );
    if (response.data.data && response.data.data.length > 0) {
      return { valid: true, message: `Jogo encontrado: "${response.data.data[0].game_title}"` };
    }
  } catch {
    // Ignore TGDB errors
  }

  return { valid: false, message: 'Jogo não encontrado nas APIs' };
});

ipcMain.handle('read-systems', async () => {
  try {
    return await fs.readJson(SYSTEMS_PATH);
  } catch {
    return {};
  }
});

ipcMain.handle('read-stats', async () => {
  try {
    return await fs.readJson(STATS_PATH);
  } catch {
    return [];
  }
});

ipcMain.handle('save-stats', async (_, stats) => {
  await fs.writeJson(STATS_PATH, stats, { spaces: 2 });
  return true;
});

async function getIGDBToken(config: any): Promise<string> {
  if (igdbToken && Date.now() < igdbToken.expires_at) {
    return igdbToken.access_token;
  }

  const response = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    null,
    {
      params: {
        client_id: config.IGDB_CLIENT_ID,
        client_secret: config.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    }
  );

  igdbToken = {
    access_token: response.data.access_token,
    expires_at: Date.now() + (response.data.expires_in - 60) * 1000,
  };

  return igdbToken.access_token;
}

async function searchIGDB(gameName: string, platformId: number, config: any): Promise<{ rating: number | null; genres: string[] }> {
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields rating, genres.name; where platforms = [${platformId}]; limit 1;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      }
    );

    if (response.data.length > 0) {
      const game = response.data[0];
      const genres = game.genres ? game.genres.map((g: any) => g.name) : [];
      return {
        rating: game.rating || null,
        genres,
      };
    }
    return { rating: null, genres: [] };
  } catch {
    return { rating: null, genres: [] };
  }
}

async function searchTGDB(gameName: string, platformId: number, config: any): Promise<{ rating: number | null; genres: string[] }> {
  try {
    const response = await axios.get(
      `https://api.thegamesdb.net/v1/Games/ByGameName`,
      {
        params: {
          apikey: config.TGDB_API_KEY,
          name: gameName,
          platform: platformId,
        },
      }
    );

    if (response.data.data && response.data.data.length > 0) {
      const game = response.data.data[0];
      let rating = null;
      if (game.ratings && game.ratings.thegamesdb) {
        rating = parseFloat(game.ratings.thegamesdb) * 10;
      }
      const genres = game.genres ? game.genres.split(',').map((g: string) => g.trim()) : [];
      return { rating, genres };
    }
    return { rating: null, genres: [] };
  } catch {
    return { rating: null, genres: [] };
  }
}

async function getGameRating(gameName: string, systemInfo: any, config: any): Promise<{ rating: number | null; genres: string[] }> {
  const igdbResult = await searchIGDB(gameName, systemInfo.igdb, config);
  const tgdbResult = await searchTGDB(gameName, systemInfo.tgdb, config);

  // Unificar notas: pegar a maior entre IGDB e TGDB
  const ratings = [igdbResult.rating, tgdbResult.rating].filter((r): r is number => r !== null);
  const bestRating = ratings.length > 0 ? Math.max(...ratings) : null;

  // Combinar gêneros de ambas as APIs (remover duplicatas)
  const allGenres = [...igdbResult.genres, ...tgdbResult.genres];
  const uniqueGenres = [...new Set(allGenres.map(g => g.toLowerCase()))].map(g =>
    allGenres.find(ag => ag.toLowerCase() === g)!
  );

  return { rating: bestRating, genres: uniqueGenres };
}

async function searchTGDBById(gameId: number, config: any, include: string[] = ['boxart']): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.thegamesdb.net/v1/Games/ByGameID`,
      {
        params: {
          apikey: config.TGDB_API_KEY,
          id: gameId,
          include: include.join(','),
        },
        timeout: 15000,
      }
    );
    if (response.data.data && response.data.data.games && response.data.data.games.length > 0) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function searchTGDBAssets(gameName: string, platformId: number, config: any): Promise<{
  boxart: string | null;
  screenshots: string[];
  fanart: string[];
  banner: string | null;
  logo: string | null;
  videos: { url: string; title: string }[];
  gameTitle: string | null;
  overview: string | null;
  releaseDate: string | null;
  developer: string | null;
  publisher: string | null;
}> {
  const emptyResult = {
    boxart: null,
    screenshots: [],
    fanart: [],
    banner: null,
    logo: null,
    videos: [],
    gameTitle: null,
    overview: null,
    releaseDate: null,
    developer: null,
    publisher: null,
  };

  if (!config.TGDB_API_KEY) return emptyResult;

  try {
    const searchResponse = await axios.get(
      `https://api.thegamesdb.net/v1/Games/ByGameName`,
      {
        params: {
          apikey: config.TGDB_API_KEY,
          name: gameName,
          platform: platformId,
          include: 'boxart,screenshot,fanart,banner,logo,clearlogo',
        },
        timeout: 15000,
      }
    );

    if (!searchResponse.data.data || !searchResponse.data.data.games || searchResponse.data.data.games.length === 0) {
      return emptyResult;
    }

    const game = searchResponse.data.data.games[0];
    const gameId = game.id;
    const include = searchResponse.data.include || {};
    const baseUrl = 'https://cdn.thegamesdb.net/images/';

    const boxartData = include.boxart?.data?.[gameId] || [];
    const frontBoxart = boxartData.find((b: any) => b.side === 'front');
    const boxartUrl = frontBoxart
      ? `${baseUrl}medium/${frontBoxart.filename}`
      : null;

    const screenshotData = include.screenshot?.data?.[gameId] || [];
    const screenshots = screenshotData.slice(0, 5).map((s: any) => `${baseUrl}medium/${s.filename}`);

    const fanartData = include.fanart?.data?.[gameId] || [];
    const fanart = fanartData.slice(0, 5).map((f: any) => `${baseUrl}original/${f.filename}`);

    const bannerData = include.banner?.data?.[gameId] || [];
    const banner = bannerData.length > 0 ? `${baseUrl}medium/${bannerData[0].filename}` : null;

    const logoData = include.logo?.data?.[gameId] || include.clearlogo?.data?.[gameId] || [];
    const logo = logoData.length > 0 ? `${baseUrl}medium/${logoData[0].filename}` : null;

    let videos: { url: string; title: string }[] = [];
    try {
      const videoResponse = await axios.get(
        `https://api.thegamesdb.net/v1/Games/ByGameID`,
        {
          params: {
            apikey: config.TGDB_API_KEY,
            id: gameId,
            include: 'gamevideo',
          },
          timeout: 10000,
        }
      );
      const videoInclude = videoResponse.data.include || {};
      const videoData = videoInclude.gamevideo?.data?.[gameId] || [];
      videos = videoData.slice(0, 3).map((v: any) => ({
        url: v.url || `https://cdn.thegamesdb.net/videos/${v.filename}`,
        title: v.title || `Vídeo ${v.id}`,
      }));
    } catch {
      // Vídeos não críticos, falha silenciosa
    }

    return {
      boxart: boxartUrl,
      screenshots,
      fanart,
      banner,
      logo,
      videos,
      gameTitle: game.game_title || null,
      overview: game.overview || null,
      releaseDate: game.release_date || null,
      developer: game.developers && game.developers.length > 0 ? game.developers[0].name : null,
      publisher: game.publishers && game.publishers.length > 0 ? game.publishers[0].name : null,
    };
  } catch {
    return emptyResult;
  }
}

async function searchTGDBFullDetails(gameName: string, platformId: number, config: any): Promise<any> {
  if (!config.TGDB_API_KEY) return null;

  try {
    const response = await axios.get(
      `https://api.thegamesdb.net/v1/Games/ByGameName`,
      {
        params: {
          apikey: config.TGDB_API_KEY,
          name: gameName,
          platform: platformId,
          include: 'boxart,screenshot,fanart,banner,logo,clearlogo,genres,art',
        },
        timeout: 15000,
      }
    );

    if (!response.data.data || !response.data.data.games || response.data.data.games.length === 0) {
      return null;
    }

    return response.data;
  } catch {
    return null;
  }
}

ipcMain.handle('fetch-tgdb-assets', async (_, gameName: string, platformId: number) => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config || !config.TGDB_API_KEY) {
    return { error: 'TGDB_API_KEY não configurada' };
  }

  const assets = await searchTGDBAssets(gameName, platformId, config);
  return assets;
});

ipcMain.handle('fetch-tgdb-details', async (_, gameName: string, platformId: number) => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config || !config.TGDB_API_KEY) {
    return { error: 'TGDB_API_KEY não configurada' };
  }

  const details = await searchTGDBFullDetails(gameName, platformId, config);
  return details;
});

ipcMain.handle('search-tgdb-by-id', async (_, gameId: number, include: string[] = ['boxart']) => {
  const config = await fs.readJson(CONFIG_PATH).catch(() => null);
  if (!config || !config.TGDB_API_KEY) {
    return { error: 'TGDB_API_KEY não configurada' };
  }

  const result = await searchTGDBById(gameId, config, include);
  return result;
});

const RETROARCH_PATHS = [
  path.join(process.env.LOCALAPPDATA || '', 'RetroArch'),
  path.join(process.env.APPDATA || '', 'RetroArch'),
  'C:\\RetroArch',
  'C:\\Games\\RetroArch',
  path.join(process.env.ProgramFiles || 'C:\\Program Files', 'RetroArch'),
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'RetroArch'),
  path.join(process.env.USERPROFILE || '', 'RetroArch'),
  path.join(process.env.USERPROFILE || '', 'Desktop', 'RetroArch'),
  path.join(process.env.USERPROFILE || '', 'Downloads', 'RetroArch-Win64'),
  path.join(process.env.USERPROFILE || '', 'Downloads', 'RetroArch-Win32'),
];

const ESDE_PATHS = [
  path.join(process.env.LOCALAPPDATA || '', 'ES-DE'),
  path.join(process.env.APPDATA || '', 'EmulationStation'),
  'C:\\ES-DE',
  'C:\\Games\\ES-DE',
  path.join(process.env.ProgramFiles || 'C:\\Program Files', 'ES-DE'),
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'ES-DE'),
  path.join(process.env.USERPROFILE || '', 'ES-DE'),
];

const STEAM_LIBRARIES = [
  path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Steam', 'steamapps', 'common'),
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Steam', 'steamapps', 'common'),
];

async function findSteamLibrary(folderName: string): Promise<string | null> {
  for (const lib of STEAM_LIBRARIES) {
    const fullPath = path.join(lib, folderName);
    if (await fs.pathExists(fullPath)) return fullPath;
  }
  return null;
}

async function queryRegistry(regPath: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`reg query "${regPath}" /v InstallLocation 2>nul`);
    const match = stdout.match(/InstallLocation\s+REG_SZ\s+(.+)/i);
    if (match && match[1]) {
      const installPath = match[1].trim();
      if (await fs.pathExists(installPath)) return installPath;
    }
  } catch {
    // Registry query failed, ignore
  }
  return null;
}

async function findExecutableInDir(dir: string, exeName: string): Promise<string | null> {
  const exePath = path.join(dir, exeName);
  if (await fs.pathExists(exePath)) return dir;
  return null;
}

async function findInstallation(paths: string[], exeName?: string): Promise<string | null> {
  for (const p of paths) {
    if (exeName) {
      const found = await findExecutableInDir(p, exeName);
      if (found) return found;
    } else if (await fs.pathExists(p)) {
      return p;
    }
  }
  return null;
}

ipcMain.handle('detect-installations', async () => {
  let retroarchPath = await findInstallation(RETROARCH_PATHS, 'RetroArch.exe');

  if (!retroarchPath) {
    const steamRetroarch = await findSteamLibrary('RetroArch');
    if (steamRetroarch) retroarchPath = steamRetroarch;
  }

  if (!retroarchPath) {
    const regPath = await queryRegistry('HKLM\\SOFTWARE\\RetroArch');
    if (regPath) retroarchPath = regPath;
  }

  if (!retroarchPath) {
    const regPath = await queryRegistry('HKLM\\SOFTWARE\\WOW6432Node\\RetroArch');
    if (regPath) retroarchPath = regPath;
  }

  let esdePath = await findInstallation(ESDE_PATHS, 'ES-DE.exe');

  if (!esdePath) {
    const steamEsde = await findSteamLibrary('EmulationStation-DE');
    if (steamEsde) esdePath = steamEsde;
  }

  if (!esdePath) {
    const regPath = await queryRegistry('HKLM\\SOFTWARE\\ES-DE');
    if (regPath) esdePath = regPath;
  }

  if (!esdePath) {
    const regPath = await queryRegistry('HKLM\\SOFTWARE\\WOW6432Node\\ES-DE');
    if (regPath) esdePath = regPath;
  }

  return {
    retroarch: retroarchPath ? { found: true, path: retroarchPath, method: 'filesystem' } : { found: false, path: null },
    esde: esdePath ? { found: true, path: esdePath, method: 'filesystem' } : { found: false, path: null },
  };
});

function sanitizeRetroArchName(name: string): string {
  return name.replace(/[&*/:`<>?\\|]/g, '_');
}

async function downloadImageToBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(response.data);
  } catch {
    return null;
  }
}

async function convertToPng(buffer: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  return sharp(buffer).png().toBuffer();
}

ipcMain.handle('export-assets-retroarch', async (_, options: {
  targetDir: string;
  playlistName: string;
  gameName: string;
  assets: { boxart: string | null; screenshots: string[]; fanart: string[] };
}) => {
  const { targetDir, playlistName, gameName, assets } = options;
  const systemFolder = path.join(targetDir, 'thumbnails', playlistName);
  const results: { type: string; status: string; path?: string; error?: string }[] = [];

  const boxartDir = path.join(systemFolder, 'Named_Boxarts');
  const snapsDir = path.join(systemFolder, 'Named_Snaps');
  const titlesDir = path.join(systemFolder, 'Named_Titles');

  await fs.ensureDir(boxartDir);
  await fs.ensureDir(snapsDir);
  await fs.ensureDir(titlesDir);

  const safeName = sanitizeRetroArchName(gameName);

  if (assets.boxart) {
    const buffer = await downloadImageToBuffer(assets.boxart);
    if (buffer) {
      const pngBuffer = await convertToPng(buffer);
      const filePath = path.join(boxartDir, `${safeName}.png`);
      await fs.writeFile(filePath, pngBuffer);
      results.push({ type: 'boxart', status: 'success', path: filePath });
    } else {
      results.push({ type: 'boxart', status: 'error', error: 'Falha no download' });
    }
  }

  for (let i = 0; i < Math.min(assets.screenshots.length, 3); i++) {
    const buffer = await downloadImageToBuffer(assets.screenshots[i]);
    if (buffer) {
      const pngBuffer = await convertToPng(buffer);
      const dir = i === 0 ? snapsDir : titlesDir;
      const filePath = path.join(dir, `${safeName}.png`);
      await fs.writeFile(filePath, pngBuffer);
      results.push({ type: i === 0 ? 'screenshot' : 'title', status: 'success', path: filePath });
    }
  }

  const successCount = results.filter(r => r.status === 'success').length;
  return { successCount, total: results.length, results };
});

const ESDE_SYSTEM_NAMES: Record<string, string> = {
  '7': 'nes', '6': 'snes', '3': 'n64', '2': 'gc', '9': 'wii', '38': 'wiiu',
  '4': 'gb', '5': 'gba', '41': 'gbc', '8': 'nds', '4912': '3ds', '4971': 'switch',
  '10': 'psx', '11': 'ps2', '13': 'psp', '39': 'psvita',
  '18': 'megadrive', '36': 'megadrive', '17': 'saturn', '16': 'dreamcast',
  '35': 'mastersystem', '20': 'gamegear', '33': 'sega32x', '21': 'segacd',
  '24': 'neogeo', '23': 'mame', '1': 'pc', '14': 'xbox', '15': 'xbox360',
  '4913': 'zxspectrum', '4911': 'amiga', '40': 'c64',
  '28': 'atarijaguar', '4937': 'atarist', '31': 'colecovision', '32': 'intellivision',
  '4939': 'vectrex', '4929': 'msx', '4942': 'appleii', '4949': 'sg1000', '4955': 'pcecd',
  '4947': 'amigacd32', '4943': 'atari800', '4956': 'neogeocd',
  '22': 'atari2600', '26': 'atari5200', '27': 'atari7800', '4924': 'atarilynx',
  '4918': 'virtualboy', '4925': 'wonderswan', '4922': 'neogeopocket', '34': 'pcengine',
  '4936': 'fds', '29': 'segagenesis', '4957': 'pokemini',
};

ipcMain.handle('export-assets-esde', async (_, options: {
  targetDir: string;
  systemId: number;
  gameName: string;
  assets: { boxart: string | null; screenshots: string[]; fanart: string[]; banner: string | null; logo: string | null; overview: string | null; releaseDate: string | null; developer: string | null; publisher: string | null };
}) => {
  const { targetDir, systemId, gameName, assets } = options;
  const systemName = ESDE_SYSTEM_NAMES[String(systemId)] || `system_${systemId}`;
  const mediaDir = path.join(targetDir, 'media', systemName);
  const gamelistDir = path.join(targetDir, 'gamelists', systemName);

  await fs.ensureDir(mediaDir);
  await fs.ensureDir(gamelistDir);

  const safeName = gameName.replace(/[^a-zA-Z0-9À-ÿ\s\-_]/g, '').replace(/\s+/g, '_').substring(0, 100);
  const results: { type: string; status: string; path?: string; error?: string }[] = [];

  if (assets.boxart) {
    const buffer = await downloadImageToBuffer(assets.boxart);
    if (buffer) {
      const filePath = path.join(mediaDir, `${safeName}-image.png`);
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'boxart', status: 'success', path: filePath });
    } else {
      results.push({ type: 'boxart', status: 'error', error: 'Falha no download' });
    }
  }

  if (assets.screenshots.length > 0) {
    const buffer = await downloadImageToBuffer(assets.screenshots[0]);
    if (buffer) {
      const filePath = path.join(mediaDir, `${safeName}-thumbnail.png`);
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'screenshot', status: 'success', path: filePath });
    }
  }

  if (assets.fanart.length > 0) {
    const buffer = await downloadImageToBuffer(assets.fanart[0]);
    if (buffer) {
      const filePath = path.join(mediaDir, `${safeName}-fanart.png`);
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'fanart', status: 'success', path: filePath });
    }
  }

  const gameEntry = {
    path: `./${gameName}`,
    name: gameName,
    desc: assets.overview || '',
    image: assets.boxart ? `./media/${systemName}/${safeName}-image.png` : '',
    releasedate: assets.releaseDate || '',
    developer: assets.developer || '',
    publisher: assets.publisher || '',
  };

  const gamelistPath = path.join(gamelistDir, 'gamelist.xml');
  let existingContent = '';
  if (await fs.pathExists(gamelistPath)) {
    existingContent = await fs.readFile(gamelistPath, 'utf-8');
  }

  const gameXml = `  <game>\n    <path>${escapeXml(gameEntry.path)}</path>\n    <name>${escapeXml(gameEntry.name)}</name>\n    <desc>${escapeXml(gameEntry.desc)}</desc>\n    <image>${escapeXml(gameEntry.image)}</image>\n    <releasedate>${escapeXml(gameEntry.releasedate)}</releasedate>\n    <developer>${escapeXml(gameEntry.developer)}</developer>\n    <publisher>${escapeXml(gameEntry.publisher)}</publisher>\n  </game>`;

  if (existingContent.includes(`<name>${escapeXml(gameEntry.name)}</name>`)) {
    const updated = existingContent.replace(
      new RegExp(`<game>[\\s\\S]*?<name>${escapeXml(gameEntry.name)}</name>[\\s\\S]*?</game>`),
      gameXml
    );
    await fs.writeFile(gamelistPath, updated);
  } else {
    if (!existingContent.includes('<gameList>')) {
      await fs.writeFile(gamelistPath, `<gameList>\n${gameXml}\n</gameList>`);
    } else {
      const updated = existingContent.replace('</gameList>', `${gameXml}\n</gameList>`);
      await fs.writeFile(gamelistPath, updated);
    }
  }

  results.push({ type: 'gamelist', status: 'success', path: gamelistPath });

  const successCount = results.filter(r => r.status === 'success').length;
  return { successCount, total: results.length, results, systemName };
});

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

ipcMain.handle('export-assets-manual', async (_, options: {
  targetDir: string;
  gameName: string;
  assets: { boxart: string | null; screenshots: string[]; fanart: string[]; banner: string | null; logo: string | null };
}) => {
  const { targetDir, gameName, assets } = options;
  const gameDir = path.join(targetDir, sanitizeFileName(gameName));
  await fs.ensureDir(gameDir);

  const results: { type: string; status: string; path?: string; error?: string }[] = [];

  if (assets.boxart) {
    const buffer = await downloadImageToBuffer(assets.boxart);
    if (buffer) {
      const filePath = path.join(gameDir, 'boxart.png');
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'boxart', status: 'success', path: filePath });
    } else {
      results.push({ type: 'boxart', status: 'error', error: 'Falha no download' });
    }
  }

  for (let i = 0; i < assets.screenshots.length; i++) {
    const buffer = await downloadImageToBuffer(assets.screenshots[i]);
    if (buffer) {
      const filePath = path.join(gameDir, `screenshot_${i + 1}.png`);
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'screenshot', status: 'success', path: filePath });
    }
  }

  for (let i = 0; i < Math.min(assets.fanart.length, 3); i++) {
    const buffer = await downloadImageToBuffer(assets.fanart[i]);
    if (buffer) {
      const filePath = path.join(gameDir, `fanart_${i + 1}.png`);
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'fanart', status: 'success', path: filePath });
    }
  }

  if (assets.banner) {
    const buffer = await downloadImageToBuffer(assets.banner);
    if (buffer) {
      const filePath = path.join(gameDir, 'banner.png');
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'banner', status: 'success', path: filePath });
    }
  }

  if (assets.logo) {
    const buffer = await downloadImageToBuffer(assets.logo);
    if (buffer) {
      const filePath = path.join(gameDir, 'logo.png');
      await fs.writeFile(filePath, buffer);
      results.push({ type: 'logo', status: 'success', path: filePath });
    }
  }

  const successCount = results.filter(r => r.status === 'success').length;
  return { successCount, total: results.length, results, gameDir };
});

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

async function getPathSize(filePath: string): Promise<number> {
  const stat = await fs.stat(filePath);
  if (stat.isDirectory()) {
    const entries = await fs.readdir(filePath);
    let size = 0;
    for (const entry of entries) {
      size += await getPathSize(path.join(filePath, entry));
    }
    return size;
  }
  return stat.size;
}

async function searchIGDBFull(gameName: string, platformId: number, config: any): Promise<any> {
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields name, rating, genres.name, release_dates.y, version_title; where platforms = [${platformId}]; limit 5;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      }
    );

    if (response.data.length > 0) {
      const game = response.data[0];
      return {
        name: game.name || gameName,
        rating: game.rating || null,
        genres: game.genres ? game.genres.map((g: any) => g.name) : [],
        year: game.release_dates && game.release_dates.length > 0 ? game.release_dates[0].y : null,
        version: game.version_title || '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

function extractRegionTags(fileName: string): string[] {
  const regionPattern = /\((USA|World|Europe|Japan|Asia|Brazil|Korea|Australia|Canada|France|Germany|Spain|Italy|UK|Scandinavia|Netherlands|Sweden|Norway|Finland|Denmark|Portugal|Russia|China|Taiwan|Hong Kong|Mexico|Argentina|Chile|Colombia|Peru|Venezuela|Ecuador|Bolivia|Paraguay|Uruguay|Costa Rica|Panama|Guatemala|Honduras|El Salvador|Nicaragua|Dominican Republic|Cuba|Puerto Rico|Jamaica|Trinidad|Barbados|Bahamas|Haiti|Guyana|Suriname|French Guiana|Falkland Islands|South Georgia|Antarctica)\)/gi;
  const matches = fileName.match(regionPattern);
  return matches ? matches.map(m => m.replace(/[()]/g, '')) : [];
}

function getBaseRomName(fileName: string): string {
  return fileName
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface ScanRomInfo {
  path: string;
  fileName: string;
  baseName: string;
  ext: string;
  system: string;
  systemName: string;
  size: number;
  parentDir: string;
  regionTags: string[];
  metadata?: {
    name: string;
    rating: number | null;
    genres: string[];
    year: number | null;
    version: string;
  };
  protectionStatus: {
    isClassic: boolean;
    isGenreProtected: boolean;
    isUserProtected: boolean;
  };
}

ipcMain.handle('scan-folder', async (_, folder: string) => {
  const config = await fs.readJson(CONFIG_PATH);
  const classics = await fs.readJson(CLASSICS_PATH);
  const protectedGenres = await fs.readJson(GENRE_PATH).catch(() => []);
  const protectedGames = await fs.readJson(PROTECTED_GAMES_PATH).catch(() => []);
  const systems = await fs.readJson(SYSTEMS_PATH);

  const romFiles: ScanRomInfo[] = [];

  // Phase 1: Filesystem scan (fast, no API calls)
  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        let systemExt = ext;
        let systemInfo = systems[ext];

        // Para extensões genéricas, analisar o header do arquivo PRIMEIRO
        // A detecção por conteúdo tem prioridade sobre o mapeamento por extensão
        if (GENERIC_EXTENSIONS.has(ext)) {
          const identified = await identifySystemFromFile(fullPath, ext);
          if (identified && systems[identified]) {
            systemExt = identified;
            systemInfo = systems[identified];
          } else if (!systemInfo) {
            // Se não identificou pelo conteúdo e não tem na lista, tenta inferir pela pasta
            const folderSystem = inferSystemFromFolder(dir);
            if (folderSystem && systems[folderSystem]) {
              systemExt = folderSystem;
              systemInfo = systems[folderSystem];
            }
          }
        }

        if (systemInfo) {
          const fileName = path.basename(entry.name, ext);
          const baseName = getBaseRomName(fileName);
          const regionTags = extractRegionTags(fileName);
          const stat = await fs.stat(fullPath);

          const isClassic = classics.some((classic: string) =>
            fileName.toLowerCase().includes(classic.toLowerCase())
          );

          const isUserProtected = protectedGames.some((game: string) =>
            fileName.toLowerCase().includes(game.toLowerCase())
          );

          romFiles.push({
            path: fullPath,
            fileName: entry.name,
            baseName,
            ext: systemExt,
            system: systemExt,
            systemName: systemInfo.name,
            size: stat.size,
            parentDir: dir,
            regionTags,
            protectionStatus: {
              isClassic,
              isGenreProtected: false,
              isUserProtected,
            },
          });
        }
      }
    }
  }

  await scanDirectory(folder);

  // Send progress: filesystem scan complete
  mainWindow?.webContents.send('scan-progress', {
    phase: 'scan',
    progress: 50,
    total: romFiles.length,
  });

  // Phase 2: Metadata fetch (slower, API calls)
  const hasIGDB = config?.IGDB_CLIENT_ID && config?.IGDB_CLIENT_SECRET;
  if (hasIGDB) {
    const totalBatches = Math.ceil(romFiles.length / 5);
    for (let i = 0; i < romFiles.length; i += 5) {
      const batch = romFiles.slice(i, i + 5);
      const promises = batch.map(async (rom) => {
        const metadata = await searchIGDBFull(rom.baseName, systems[rom.system].igdb, config);
        if (metadata) {
          rom.metadata = metadata;
          const isGenreProtected = protectedGenres.some((genre: string) =>
            metadata.genres.some((g: string) => g.toLowerCase().includes(genre.toLowerCase()))
          );
          rom.protectionStatus.isGenreProtected = isGenreProtected;
        }
      });
      await Promise.all(promises);
      
      const batchIndex = Math.floor(i / 5);
      const progress = 50 + Math.round((batchIndex / totalBatches) * 50);
      mainWindow?.webContents.send('scan-progress', {
        phase: 'metadata',
        progress,
        current: i + batch.length,
        total: romFiles.length,
      });
      
      if (i + 5 < romFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  } else {
    mainWindow?.webContents.send('scan-progress', {
      phase: 'metadata',
      progress: 100,
      current: romFiles.length,
      total: romFiles.length,
    });
  }

  // Group by system
  const grouped: Record<string, ScanRomInfo[]> = {};
  for (const rom of romFiles) {
    if (!grouped[rom.systemName]) {
      grouped[rom.systemName] = [];
    }
    grouped[rom.systemName].push(rom);
  }

  // Detect clones/duplicates
  const cloneGroups: { baseName: string; roms: ScanRomInfo[]; preferredRegion: string | null }[] = [];
  const processedBases = new Set<string>();

  for (const rom of romFiles) {
    if (processedBases.has(rom.baseName)) continue;
    const duplicates = romFiles.filter(r => r.baseName === rom.baseName && r.path !== rom.path);
    if (duplicates.length > 0) {
      const allInGroup = [rom, ...duplicates];
      const regions = allInGroup.flatMap(r => r.regionTags);
      const preferredRegion = regions.find(r => r === 'USA' || r === 'World') || regions[0] || null;
      cloneGroups.push({
        baseName: rom.baseName,
        roms: allInGroup,
        preferredRegion,
      });
      allInGroup.forEach(r => processedBases.add(r.baseName));
    }
  }

  return {
    total: romFiles.length,
    grouped,
    cloneGroups,
    hasIGDB,
  };
});

ipcMain.handle('start-curation', async (_, options: { folder: string; minRating: number; action: 'move' | 'delete' }) => {
  const { folder, minRating, action } = options;
  const config = await fs.readJson(CONFIG_PATH);
  const classics = await fs.readJson(CLASSICS_PATH);
  const protectedGenres = await fs.readJson(GENRE_PATH).catch(() => []);
  const protectedGames = await fs.readJson(PROTECTED_GAMES_PATH).catch(() => []);
  const systems = await fs.readJson(SYSTEMS_PATH);

  const stats = {
    pasta: folder,
    total_encontrado: 0,
    preservados_classicos: 0,
    removidos: 0,
    mantidos_por_nota: 0,
    bytes_removed: 0,
    data: new Date().toLocaleString('pt-BR'),
    sistemas: {} as Record<string, number>,
  };

  interface RomFile {
    path: string;
    name: string;
    ext: string;
    system: any;
    parentDir: string;
  }

  const romFiles: RomFile[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        let systemExt = ext;
        let systemInfo = systems[ext];

        // Para extensões genéricas, analisar o header do arquivo PRIMEIRO
        if (GENERIC_EXTENSIONS.has(ext)) {
          const identified = await identifySystemFromFile(fullPath, ext);
          if (identified && systems[identified]) {
            systemExt = identified;
            systemInfo = systems[identified];
          } else if (!systemInfo) {
            const folderSystem = inferSystemFromFolder(dir);
            if (folderSystem && systems[folderSystem]) {
              systemExt = folderSystem;
              systemInfo = systems[folderSystem];
            }
          }
        }

        if (systemInfo) {
          romFiles.push({
            path: fullPath,
            name: entry.name,
            ext: systemExt,
            system: systemInfo,
            parentDir: dir,
          });
        }
      }
    }
  }

  await scanDirectory(folder);
  stats.total_encontrado = romFiles.length;

  mainWindow?.webContents.send('curation-progress', {
    type: 'init',
    total: romFiles.length,
  });

  // Group ROMs by parent directory
  const dirGroups = new Map<string, RomFile[]>();
  for (const file of romFiles) {
    if (!dirGroups.has(file.parentDir)) {
      dirGroups.set(file.parentDir, []);
    }
    dirGroups.get(file.parentDir)!.push(file);
  }

  // Process each directory group
  const processedDirs = new Set<string>();
  let fileIndex = 0;

  for (const [parentDir, files] of dirGroups) {
    if (processedDirs.has(parentDir)) continue;

    // Check if this is a single-ROM folder (folder name matches ROM name)
    const folderName = path.basename(parentDir).toLowerCase();
    const isSingleRomFolder = files.length === 1 && folderName === path.basename(files[0].name, files[0].ext).toLowerCase();

    // Determine action for this group
    let groupAction: 'keep' | 'remove' = 'keep';

    for (const file of files) {
      const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase();
      const sysExt = file.ext;
      stats.sistemas[sysExt] = (stats.sistemas[sysExt] || 0) + 1;

      const isClassic = classics.some((classic: string) =>
        fileName.includes(classic.toLowerCase())
      );

      if (isClassic) {
        groupAction = 'keep';
        stats.preservados_classicos++;
        mainWindow?.webContents.send('curation-progress', {
          type: 'file',
          index: fileIndex++,
          fileName: file.name,
          system: file.system.name,
          status: 'classic',
          rating: null,
          genres: [],
        });
        continue;
      }

      const isUserProtected = protectedGames.some((game: string) =>
        fileName.includes(game.toLowerCase())
      );

      if (isUserProtected) {
        groupAction = 'keep';
        stats.preservados_classicos++;
        mainWindow?.webContents.send('curation-progress', {
          type: 'file',
          index: fileIndex++,
          fileName: file.name,
          system: file.system.name,
          status: 'classic',
          rating: null,
          genres: [],
        });
        continue;
      }

      const result = await getGameRating(
        path.basename(file.name, path.extname(file.name)),
        file.system,
        config
      );

      const isProtectedGenre = protectedGenres.some((genre: string) =>
        result.genres.some((g: string) => g.toLowerCase().includes(genre.toLowerCase()))
      );

      if (result.rating === null || result.rating >= minRating || isProtectedGenre) {
        stats.mantidos_por_nota++;
        mainWindow?.webContents.send('curation-progress', {
          type: 'file',
          index: fileIndex++,
          fileName: file.name,
          system: file.system.name,
          status: isProtectedGenre ? 'classic' : 'kept',
          rating: result.rating,
          genres: result.genres,
        });
      } else {
        stats.removidos++;
        groupAction = 'remove';
        mainWindow?.webContents.send('curation-progress', {
          type: 'file',
          index: fileIndex++,
          fileName: file.name,
          system: file.system.name,
          status: 'removed',
          rating: result.rating,
          genres: result.genres,
        });
      }
    }

    // If it's a single-ROM folder and should be removed, remove/move the entire folder
    if (isSingleRomFolder && groupAction === 'remove') {
      const dirSize = await getPathSize(parentDir);
      stats.bytes_removed += dirSize;
      if (action === 'move') {
        const removedDir = path.join(folder, 'removidos');
        await fs.ensureDir(removedDir);
        await fs.move(parentDir, path.join(removedDir, path.basename(parentDir)), { overwrite: true });
      } else {
        await fs.remove(parentDir);
      }
      processedDirs.add(parentDir);
    }

    processedDirs.add(parentDir);
  }

  const allStats = await fs.readJson(STATS_PATH).catch(() => []);
  allStats.push(stats);
  await fs.writeJson(STATS_PATH, allStats, { spaces: 2 });

  mainWindow?.webContents.send('curation-progress', {
    type: 'complete',
    stats,
  });

  return stats;
});

ipcMain.handle('simulate-curation', async (_, options: { folder: string; minRating: number; action: 'move' | 'delete' }) => {
  const { folder, minRating, action } = options;
  const config = await fs.readJson(CONFIG_PATH);
  const classics = await fs.readJson(CLASSICS_PATH);
  const protectedGenres = await fs.readJson(GENRE_PATH).catch(() => []);
  const protectedGames = await fs.readJson(PROTECTED_GAMES_PATH).catch(() => []);
  const systems = await fs.readJson(SYSTEMS_PATH);

  interface SimRomFile {
    path: string;
    name: string;
    ext: string;
    system: any;
    parentDir: string;
    size: number;
  }

  const romFiles: SimRomFile[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        let systemExt = ext;
        let systemInfo = systems[ext];

        // Para extensões genéricas, analisar o header do arquivo PRIMEIRO
        if (GENERIC_EXTENSIONS.has(ext)) {
          const identified = await identifySystemFromFile(fullPath, ext);
          if (identified && systems[identified]) {
            systemExt = identified;
            systemInfo = systems[identified];
          } else if (!systemInfo) {
            const folderSystem = inferSystemFromFolder(dir);
            if (folderSystem && systems[folderSystem]) {
              systemExt = folderSystem;
              systemInfo = systems[folderSystem];
            }
          }
        }

        if (systemInfo) {
          const stat = await fs.stat(fullPath);
          romFiles.push({
            path: fullPath,
            name: entry.name,
            ext: systemExt,
            system: systemInfo,
            parentDir: dir,
            size: stat.size,
          });
        }
      }
    }
  }

  await scanDirectory(folder);

  // Group ROMs by parent directory
  const dirGroups = new Map<string, SimRomFile[]>();
  for (const file of romFiles) {
    if (!dirGroups.has(file.parentDir)) {
      dirGroups.set(file.parentDir, []);
    }
    dirGroups.get(file.parentDir)!.push(file);
  }

  const simulationResults: {
    fileName: string;
    system: string;
    status: 'classic' | 'kept' | 'removed';
    rating: number | null;
    genres: string[];
    size: number;
    action: 'move' | 'delete' | 'none';
    targetPath?: string;
  }[] = [];

  const processedDirs = new Set<string>();
  let totalSizeAffected = 0;

  for (const [parentDir, files] of dirGroups) {
    if (processedDirs.has(parentDir)) continue;

    const folderName = path.basename(parentDir).toLowerCase();
    const isSingleRomFolder = files.length === 1 && folderName === path.basename(files[0].name, files[0].ext).toLowerCase();

    let groupAction: 'keep' | 'remove' = 'keep';

    for (const file of files) {
      const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase();

      const isClassic = classics.some((classic: string) =>
        fileName.includes(classic.toLowerCase())
      );

      if (isClassic) {
        groupAction = 'keep';
        simulationResults.push({
          fileName: file.name,
          system: file.system.name,
          status: 'classic',
          rating: null,
          genres: [],
          size: file.size,
          action: 'none',
        });
        continue;
      }

      const isUserProtected = protectedGames.some((game: string) =>
        fileName.includes(game.toLowerCase())
      );

      if (isUserProtected) {
        groupAction = 'keep';
        simulationResults.push({
          fileName: file.name,
          system: file.system.name,
          status: 'classic',
          rating: null,
          genres: [],
          size: file.size,
          action: 'none',
        });
        continue;
      }

      const result = await getGameRating(
        path.basename(file.name, path.extname(file.name)),
        file.system,
        config
      );

      const isProtectedGenre = protectedGenres.some((genre: string) =>
        result.genres.some((g: string) => g.toLowerCase().includes(genre.toLowerCase()))
      );

      if (result.rating === null || result.rating >= minRating || isProtectedGenre) {
        simulationResults.push({
          fileName: file.name,
          system: file.system.name,
          status: isProtectedGenre ? 'classic' : 'kept',
          rating: result.rating,
          genres: result.genres,
          size: file.size,
          action: 'none',
        });
      } else {
        groupAction = 'remove';
        simulationResults.push({
          fileName: file.name,
          system: file.system.name,
          status: 'removed',
          rating: result.rating,
          genres: result.genres,
          size: file.size,
          action: action,
          targetPath: action === 'move' ? path.join(folder, 'removidos', file.name) : undefined,
        });
        totalSizeAffected += file.size;
      }
    }

    if (isSingleRomFolder && groupAction === 'remove') {
      const dirSize = await getPathSize(parentDir);
      totalSizeAffected += dirSize;
      processedDirs.add(parentDir);
    }

    processedDirs.add(parentDir);
  }

  return {
    results: simulationResults,
    totalFiles: romFiles.length,
    totalSizeAffected,
    action,
  };
});

ipcMain.handle('delete-removed-folder', async (_, folder: string) => {
  const removedDir = path.join(folder, 'removidos');
  if (await fs.pathExists(removedDir)) {
    await fs.remove(removedDir);
    return true;
  }
  return false;
});

const COMPRESSED_EXTENSIONS = new Set(['.zip', '.7z', '.rar', '.tar', '.gz', '.tar.gz']);

function isCompressedFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.tar.gz')) return true;
  for (const ext of COMPRESSED_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

function getExtension(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.tar.gz')) return '.tar.gz';
  return path.extname(lower);
}

function determineConcurrency(files: { size: number }[]): number {
  if (files.length === 0) return 1;
  const maxSize = Math.max(...files.map((f: { size: number }) => f.size));
  const totalSize = files.reduce((sum: number, f: { size: number }) => sum + f.size, 0);
  if (maxSize > 2 * 1024 * 1024 * 1024) return 1;
  if (totalSize > 10 * 1024 * 1024 * 1024) return 1;
  if (totalSize > 5 * 1024 * 1024 * 1024) return 2;
  if (maxSize < 100 * 1024 * 1024) return 3;
  return 2;
}

async function extractZipFile(
  zipPath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  const directory = await unzipper.Open.file(zipPath);
  const files = directory.files.filter((f: any) => f.type === 'File');
  const totalSize = files.reduce((sum: number, f: any) => sum + (f.uncompressedSize || 0), 0);
  let extractedSize = 0;
  let fileCount = 0;

  for (const file of files) {
    const outputPath = path.join(outputDir, file.path);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const stream = file.stream();
      const writeStream = fs.createWriteStream(outputPath);
      stream.pipe(writeStream);
      writeStream.on('finish', () => {
        extractedSize += file.uncompressedSize || 0;
        fileCount++;
        onProgress({
          type: 'file-progress',
          fileName: file.path,
          progress: totalSize > 0 ? (extractedSize / totalSize) * 100 : 0,
          extractedSize,
          totalSize,
        });
        resolve();
      });
      writeStream.on('error', reject);
      stream.on('error', reject);
    });
  }

  return { extractedSize, fileCount };
}

async function extract7zFile(
  archivePath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  const entries = await new Promise<any[]>((resolve, reject) => {
    SevenZip.list(archivePath, (err: Error | null, result: any[] | undefined) => {
      if (err) reject(err);
      else resolve(result || []);
    });
  });

  const files = entries.filter((e: any) => e.method !== undefined);
  const totalSize = files.reduce((sum, e) => sum + (e.size || 0), 0);

  await new Promise<void>((resolve, reject) => {
    SevenZip.unpack(archivePath, outputDir, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });

  onProgress({
    type: 'file-progress',
    fileName: path.basename(archivePath),
    progress: 100,
    extractedSize: totalSize,
    totalSize,
  });

  return { extractedSize: totalSize, fileCount: files.length };
}

async function extractRarFile(
  archivePath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  const entries = await new Promise<any[]>((resolve, reject) => {
    SevenZip.list(archivePath, (err: Error | null, result: any[] | undefined) => {
      if (err) reject(err);
      else resolve(result || []);
    });
  });

  const files = entries.filter((e: any) => e.method !== undefined);
  const totalSize = files.reduce((sum: number, e: any) => sum + (e.size || 0), 0);

  await new Promise<void>((resolve, reject) => {
    SevenZip.unpack(archivePath, outputDir, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });

  onProgress({
    type: 'file-progress',
    fileName: path.basename(archivePath),
    progress: 100,
    extractedSize: totalSize,
    totalSize,
  });

  return { extractedSize: totalSize, fileCount: files.length };
}

async function extractTarFile(
  tarPath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  let fileCount = 0;
  let extractedSize = 0;

  await tar.x({
    file: tarPath,
    cwd: outputDir,
    onentry: (entry: any) => {
      if (entry.type === 'File') {
        fileCount++;
        extractedSize += entry.size || 0;
        onProgress({
          type: 'file-progress',
          fileName: entry.path,
          progress: 0,
          extractedSize,
          totalSize: 0,
        });
      }
    },
  });

  onProgress({
    type: 'file-progress',
    fileName: path.basename(tarPath),
    progress: 100,
    extractedSize,
    totalSize: extractedSize,
  });

  return { extractedSize, fileCount };
}

async function extractGzFile(
  gzPath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  const baseName = path.basename(gzPath, '.gz');
  const outputPath = path.join(outputDir, baseName);

  await new Promise<void>((resolve, reject) => {
    const readStream = fs.createReadStream(gzPath);
    const writeStream = fs.createWriteStream(outputPath);
    const gunzip = zlib.createGunzip();

    let extractedSize = 0;
    readStream.pipe(gunzip).pipe(writeStream);

    gunzip.on('data', (chunk: Buffer) => {
      extractedSize += chunk.length;
      onProgress({
        type: 'file-progress',
        fileName: baseName,
        progress: 0,
        extractedSize,
        totalSize: 0,
      });
    });

    writeStream.on('finish', () => resolve());
    readStream.on('error', reject);
    gunzip.on('error', reject);
    writeStream.on('error', reject);
  });

  const stat = await fs.stat(outputPath);
  onProgress({
    type: 'file-progress',
    fileName: baseName,
    progress: 100,
    extractedSize: stat.size,
    totalSize: stat.size,
  });

  return { extractedSize: stat.size, fileCount: 1 };
}

async function extractTarGzFile(
  tarGzPath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  let fileCount = 0;
  let extractedSize = 0;

  await tar.x({
    file: tarGzPath,
    cwd: outputDir,
    onentry: (entry: any) => {
      if (entry.type === 'File') {
        fileCount++;
        extractedSize += entry.size || 0;
        onProgress({
          type: 'file-progress',
          fileName: entry.path,
          progress: 0,
          extractedSize,
          totalSize: 0,
        });
      }
    },
  });

  onProgress({
    type: 'file-progress',
    fileName: path.basename(tarGzPath),
    progress: 100,
    extractedSize,
    totalSize: extractedSize,
  });

  return { extractedSize, fileCount };
}

async function extractFile(
  filePath: string,
  outputDir: string,
  onProgress: (data: { type: string; fileName: string; progress: number; extractedSize: number; totalSize: number }) => void
): Promise<{ extractedSize: number; fileCount: number }> {
  const ext = getExtension(filePath);
  switch (ext) {
    case '.zip': return extractZipFile(filePath, outputDir, onProgress);
    case '.7z': return extract7zFile(filePath, outputDir, onProgress);
    case '.rar': return extractRarFile(filePath, outputDir, onProgress);
    case '.tar': return extractTarFile(filePath, outputDir, onProgress);
    case '.gz': return extractGzFile(filePath, outputDir, onProgress);
    case '.tar.gz': return extractTarGzFile(filePath, outputDir, onProgress);
    default: throw new Error(`Formato não suportado: ${ext}`);
  }
}

let extractionCancelled = false;

ipcMain.handle('cancel-extraction', async () => {
  extractionCancelled = true;
  return true;
});

async function countEntries(dir: string): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await countEntries(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

ipcMain.handle('scan-compressed', async (_, folder: string) => {
  const files: { path: string; name: string; size: number; ext: string }[] = [];
  const totalEntries = await countEntries(folder);
  let scannedEntries = 0;

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      scannedEntries++;
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (isCompressedFile(entry.name)) {
        const stat = await fs.stat(fullPath);
        files.push({
          path: fullPath,
          name: entry.name,
          size: stat.size,
          ext: getExtension(entry.name),
        });
      }
      const progress = totalEntries > 0 ? Math.round((scannedEntries / totalEntries) * 100) : 0;
      mainWindow?.webContents.send('scan-compressed-progress', {
        type: 'scan',
        progress,
        scanned: scannedEntries,
        total: totalEntries,
        found: files.length,
      });
    }
  }

  await scanDirectory(folder);
  return files;
});

ipcMain.handle('start-extraction', async (_, options: {
  files: { path: string; name: string; size: number; ext: string }[];
  mode: 'in-place' | 'own-folder';
  deleteAfter: boolean;
}) => {
  const { files, mode, deleteAfter } = options;
  extractionCancelled = false;

  const results: {
    name: string;
    status: 'success' | 'error' | 'cancelled';
    compressedSize: number;
    extractedSize: number;
    fileCount: number;
    error?: string;
  }[] = [];

  const concurrency = determineConcurrency(files);
  const queue = [...files];
  const running: Promise<void>[] = [];
  let index = 0;

  async function processFile(file: { path: string; name: string; size: number; ext: string }, idx: number) {
    const outputDir = mode === 'own-folder'
      ? path.join(path.dirname(file.path), file.name.replace(/\.[^.]+$/, '').replace(/\.tar$/, ''))
      : path.dirname(file.path);

    mainWindow?.webContents.send('extraction-progress', {
      type: 'file-start',
      fileName: file.name,
      index: idx,
      total: files.length,
      compressedSize: file.size,
    });

    try {
      const result = await extractFile(file.path, outputDir, (progress) => {
        mainWindow?.webContents.send('extraction-progress', {
          index: idx,
          total: files.length,
          compressedSize: file.size,
          ...progress,
        });
      });

      if (deleteAfter) {
        await fs.remove(file.path);
      }

      results.push({
        name: file.name,
        status: 'success',
        compressedSize: file.size,
        extractedSize: result.extractedSize,
        fileCount: result.fileCount,
      });

      mainWindow?.webContents.send('extraction-progress', {
        type: 'file-complete',
        fileName: file.name,
        index: idx,
        total: files.length,
        extractedSize: result.extractedSize,
        fileCount: result.fileCount,
      });
    } catch (error: any) {
      results.push({
        name: file.name,
        status: 'error',
        compressedSize: file.size,
        extractedSize: 0,
        fileCount: 0,
        error: error.message,
      });

      mainWindow?.webContents.send('extraction-progress', {
        type: 'file-error',
        fileName: file.name,
        index: idx,
        total: files.length,
        error: error.message,
      });
    }
  }

  while (queue.length > 0 || running.length > 0) {
    while (running.length < concurrency && queue.length > 0) {
      if (extractionCancelled) {
        while (queue.length > 0) {
          const file = queue.shift()!;
          results.push({ name: file.name, status: 'cancelled', compressedSize: file.size, extractedSize: 0, fileCount: 0 });
        }
        break;
      }
      const file = queue.shift()!;
      const idx = index++;
      const promise = processFile(file, idx).then(() => {
        const i = running.indexOf(promise);
        if (i > -1) running.splice(i, 1);
      });
      running.push(promise);
    }

    if (running.length > 0) {
      await Promise.race(running);
    }
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const cancelledCount = results.filter(r => r.status === 'cancelled').length;
  const totalExtracted = results.reduce((sum, r) => sum + r.extractedSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalFiles = results.reduce((sum, r) => sum + r.fileCount, 0);

  mainWindow?.webContents.send('extraction-progress', {
    type: 'complete',
    results,
    successCount,
    errorCount,
    cancelledCount,
    totalExtracted,
    totalCompressed,
    totalFiles,
  });

  return {
    results,
    successCount,
    errorCount,
    cancelledCount,
    totalExtracted,
    totalCompressed,
    totalFiles,
  };
});

const ORPHAN_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
  '.pdf', '.txt', '.nfo', '.md', '.sfv', '.m3u', '.dat',
  '.log', '.cfg', '.ini',
]);

const ROM_EXTENSIONS = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(app.getAppPath(), 'data', 'systems.json'), 'utf-8'))));

function getBaseNameWithoutExt(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function similarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  const costs: number[] = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer[i - 1] !== shorter[j - 1]) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longer.length - costs[shorter.length]) / longer.length;
}

ipcMain.handle('scan-orphan-files', async (_, folder: string) => {
  const romFiles = new Set<string>();
  const orphanFiles: { path: string; name: string; size: number; ext: string; category: string }[] = [];

  async function scanDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (ROM_EXTENSIONS.has(ext)) {
          romFiles.add(getBaseNameWithoutExt(entry.name));
        } else if (ORPHAN_EXTENSIONS.has(ext)) {
          const stat = await fs.stat(fullPath);
          let category = 'outro';
          if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) category = 'imagem';
          else if (['.pdf'].includes(ext)) category = 'manual';
          else if (['.txt', '.nfo', '.md'].includes(ext)) category = 'texto';
          else if (['.sfv', '.m3u', '.dat'].includes(ext)) category = 'metadado';
          else if (['.log', '.cfg', '.ini'].includes(ext)) category = 'config';

          orphanFiles.push({
            path: fullPath,
            name: entry.name,
            size: stat.size,
            ext,
            category,
          });
        }
      }
    }
  }

  await scanDirectory(folder);

  const orphans = orphanFiles.filter((file) => {
    const baseName = getBaseNameWithoutExt(file.name);
    for (const romBase of romFiles) {
      if (similarity(baseName, romBase) > 0.85) return false;
    }
    return true;
  });

  return orphans;
});

ipcMain.handle('delete-orphan-files', async (_, files: { path: string }[]) => {
  let deleted = 0;
  let freedBytes = 0;
  for (const file of files) {
    try {
      const stat = await fs.stat(file.path);
      freedBytes += stat.size;
      await fs.remove(file.path);
      deleted++;
    } catch {
      // skip if already deleted or inaccessible
    }
  }
  return { deleted, freedBytes };
});
