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

app.whenReady().then(() => {
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

async function searchIGDB(gameName: string, platformId: number, config: any): Promise<number | null> {
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields rating; where platforms = [${platformId}]; limit 1;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      }
    );

    if (response.data.length > 0 && response.data[0].rating) {
      return response.data[0].rating;
    }
    return null;
  } catch {
    return null;
  }
}

async function searchTGDB(gameName: string, platformId: number, config: any): Promise<number | null> {
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
      if (game.ratings && game.ratings.thegamesdb) {
        return parseFloat(game.ratings.thegamesdb) * 10;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function getGameRating(gameName: string, systemInfo: any, config: any): Promise<number | null> {
  const igdbRating = await searchIGDB(gameName, systemInfo.igdb, config);
  if (igdbRating !== null) {
    return igdbRating;
  }

  const tgdbRating = await searchTGDB(gameName, systemInfo.tgdb, config);
  return tgdbRating;
}

ipcMain.handle('start-curation', async (_, options: { folder: string; minRating: number; action: 'move' | 'delete' }) => {
  const { folder, minRating, action } = options;
  const config = await fs.readJson(CONFIG_PATH);
  const classics = await fs.readJson(CLASSICS_PATH);
  const systems = await fs.readJson(SYSTEMS_PATH);

  const stats = {
    pasta: folder,
    total_encontrado: 0,
    preservados_classicos: 0,
    removidos: 0,
    mantidos_por_nota: 0,
    data: new Date().toLocaleString('pt-BR'),
  };

  const romFiles: { path: string; name: string; ext: string; system: any }[] = [];

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

  for (let i = 0; i < romFiles.length; i++) {
    const file = romFiles[i];
    const fileName = path.basename(file.name, path.extname(file.name)).toLowerCase();

    const isClassic = classics.some((classic: string) =>
      fileName.includes(classic.toLowerCase())
    );

    if (isClassic) {
      stats.preservados_classicos++;
      mainWindow?.webContents.send('curation-progress', {
        type: 'file',
        index: i,
        fileName: file.name,
        system: file.system.name,
        status: 'classic',
        rating: null,
      });
      continue;
    }

    const rating = await getGameRating(
      path.basename(file.name, path.extname(file.name)),
      file.system,
      config
    );

    if (rating === null || rating >= minRating) {
      stats.mantidos_por_nota++;
      mainWindow?.webContents.send('curation-progress', {
        type: 'file',
        index: i,
        fileName: file.name,
        system: file.system.name,
        status: 'kept',
        rating: rating,
      });
    } else {
      stats.removidos++;
      if (action === 'move') {
        const removedDir = path.join(folder, 'removidos');
        await fs.ensureDir(removedDir);
        await fs.move(file.path, path.join(removedDir, file.name), { overwrite: true });
      } else {
        await fs.remove(file.path);
      }
      mainWindow?.webContents.send('curation-progress', {
        type: 'file',
        index: i,
        fileName: file.name,
        system: file.system.name,
        status: 'removed',
        rating: rating,
      });
    }
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
