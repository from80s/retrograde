import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';

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
const SYSTEMS_PATH = path.join(DATA_DIR, 'systems.json');
const STATS_PATH = path.join(DATA_DIR, 'curator_stats.json');
const PACKAGE_PATH = path.join(app.getAppPath(), 'package.json');

const iconPath = path.join(app.getAppPath(), 'assets', 'images', 'RetroGrade_icon_app_256x256.png');
const appIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;

let mainWindow: BrowserWindow | null = null;
let igdbToken: { access_token: string; expires_at: number } | null = null;

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
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#09090b',
      symbolColor: '#22d3ee',
    },
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
    return await fs.readJson(CLASSICS_PATH);
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

ipcMain.handle('read-genres', async () => {
  try {
    return await fs.readJson(GENRE_PATH);
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
    return await fs.readJson(PROTECTED_GAMES_PATH);
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
        if (systems[ext]) {
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
            ext,
            system: ext,
            systemName: systems[ext].name,
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
        if (systems[ext]) {
          romFiles.push({
            path: fullPath,
            name: entry.name,
            ext,
            system: systems[ext],
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
        if (systems[ext]) {
          const stat = await fs.stat(fullPath);
          romFiles.push({
            path: fullPath,
            name: entry.name,
            ext,
            system: systems[ext],
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
