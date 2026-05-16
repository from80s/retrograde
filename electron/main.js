"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const axios_1 = __importDefault(require("axios"));
const isDev = process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL;
console.log('[RetroGrade] Starting app...');
console.log('[RetroGrade] isDev:', isDev);
console.log('[RetroGrade] app.getAppPath():', electron_1.app.getAppPath());
console.log('[RetroGrade] __dirname:', __dirname);
const DATA_DIR = path_1.default.join(electron_1.app.getAppPath(), 'data');
const CONFIG_PATH = path_1.default.join(DATA_DIR, 'config.json');
const CLASSICS_PATH = path_1.default.join(DATA_DIR, 'classics.json');
const SYSTEMS_PATH = path_1.default.join(DATA_DIR, 'systems.json');
const STATS_PATH = path_1.default.join(DATA_DIR, 'curator_stats.json');
const PACKAGE_PATH = path_1.default.join(electron_1.app.getAppPath(), 'package.json');
const iconPath = path_1.default.join(electron_1.app.getAppPath(), 'assets', 'images', 'RetroGrade_icon_app_256x256.png');
const appIcon = fs_extra_1.default.existsSync(iconPath) ? electron_1.nativeImage.createFromPath(iconPath) : undefined;
let mainWindow = null;
let igdbToken = null;
function createWindow() {
    const preloadPath = path_1.default.join(__dirname, 'preload.js');
    const indexHtmlPath = path_1.default.join(__dirname, '..', 'dist', 'index.html');
    console.log('[RetroGrade] preloadPath:', preloadPath);
    console.log('[RetroGrade] indexHtmlPath:', indexHtmlPath);
    console.log('[RetroGrade] preload exists:', fs_extra_1.default.existsSync(preloadPath));
    console.log('[RetroGrade] index.html exists:', fs_extra_1.default.existsSync(indexHtmlPath));
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
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
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.handle('read-version', async () => {
    try {
        const pkg = await fs_extra_1.default.readJson(PACKAGE_PATH);
        return pkg.version;
    }
    catch {
        return '0.0.0';
    }
});
electron_1.ipcMain.handle('test-api-connections', async () => {
    const config = await fs_extra_1.default.readJson(CONFIG_PATH).catch(() => null);
    if (!config) {
        return { igdb: { status: 'error', message: 'Configuração não encontrada' }, tgdb: { status: 'error', message: 'Configuração não encontrada' } };
    }
    const results = {
        igdb: { status: 'pending', message: 'Testando...' },
        tgdb: { status: 'pending', message: 'Testando...' },
    };
    // Test IGDB
    try {
        if (!config.IGDB_CLIENT_ID || !config.IGDB_CLIENT_SECRET) {
            results.igdb = { status: 'error', message: 'Credenciais não configuradas' };
        }
        else {
            const response = await axios_1.default.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: config.IGDB_CLIENT_ID,
                    client_secret: config.IGDB_CLIENT_SECRET,
                    grant_type: 'client_credentials',
                },
                timeout: 10000,
            });
            if (response.data.access_token) {
                results.igdb = { status: 'success', message: 'Conexão estabelecida' };
            }
            else {
                results.igdb = { status: 'error', message: 'Token não recebido' };
            }
        }
    }
    catch (error) {
        results.igdb = { status: 'error', message: error.response?.status === 401 ? 'Credenciais inválidas' : 'Erro de conexão' };
    }
    // Test TGDB
    try {
        if (!config.TGDB_API_KEY) {
            results.tgdb = { status: 'error', message: 'API Key não configurada' };
        }
        else {
            const response = await axios_1.default.get('https://api.thegamesdb.net/v1/Platforms/ByPlatformName', {
                params: {
                    apikey: config.TGDB_API_KEY,
                    name: 'Nintendo Entertainment System',
                },
                timeout: 10000,
            });
            if (response.data.data) {
                results.tgdb = { status: 'success', message: 'Conexão estabelecida' };
            }
            else {
                results.tgdb = { status: 'error', message: 'Resposta inesperada' };
            }
        }
    }
    catch (error) {
        results.tgdb = { status: 'error', message: error.response?.status === 401 ? 'API Key inválida' : 'Erro de conexão' };
    }
    return results;
});
electron_1.ipcMain.handle('select-folder', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Selecionar pasta de ROMs',
    });
    return result.canceled ? null : result.filePaths[0];
});
electron_1.ipcMain.handle('read-config', async () => {
    try {
        return await fs_extra_1.default.readJson(CONFIG_PATH);
    }
    catch {
        return null;
    }
});
electron_1.ipcMain.handle('save-config', async (_, config) => {
    await fs_extra_1.default.writeJson(CONFIG_PATH, config, { spaces: 2 });
    return true;
});
electron_1.ipcMain.handle('read-classics', async () => {
    try {
        return await fs_extra_1.default.readJson(CLASSICS_PATH);
    }
    catch {
        return [];
    }
});
electron_1.ipcMain.handle('addClassic', async (_, name) => {
    const classics = await fs_extra_1.default.readJson(CLASSICS_PATH).catch(() => []);
    if (!classics.includes(name)) {
        classics.push(name);
        await fs_extra_1.default.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
    }
    return classics;
});
electron_1.ipcMain.handle('removeClassic', async (_, name) => {
    let classics = await fs_extra_1.default.readJson(CLASSICS_PATH).catch(() => []);
    classics = classics.filter((c) => c !== name);
    await fs_extra_1.default.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
    return classics;
});
electron_1.ipcMain.handle('validate-game-name', async (_, gameName) => {
    const config = await fs_extra_1.default.readJson(CONFIG_PATH).catch(() => null);
    if (!config) {
        return { valid: false, message: 'Configure as credenciais de API primeiro' };
    }
    // Try IGDB first
    try {
        const token = await getIGDBToken(config);
        const response = await axios_1.default.post('https://api.igdb.com/v4/games', `search "${gameName}"; fields name; limit 1;`, {
            headers: {
                'Client-ID': config.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
            timeout: 10000,
        });
        if (response.data.length > 0) {
            return { valid: true, message: `Jogo encontrado: "${response.data[0].name}"` };
        }
    }
    catch {
        // Ignore IGDB errors, try TGDB
    }
    // Try TGDB
    try {
        const response = await axios_1.default.get('https://api.thegamesdb.net/v1/Games/ByGameName', {
            params: {
                apikey: config.TGDB_API_KEY,
                name: gameName,
            },
            timeout: 10000,
        });
        if (response.data.data && response.data.data.length > 0) {
            return { valid: true, message: `Jogo encontrado: "${response.data.data[0].game_title}"` };
        }
    }
    catch {
        // Ignore TGDB errors
    }
    return { valid: false, message: 'Jogo não encontrado nas APIs' };
});
electron_1.ipcMain.handle('read-systems', async () => {
    try {
        return await fs_extra_1.default.readJson(SYSTEMS_PATH);
    }
    catch {
        return {};
    }
});
electron_1.ipcMain.handle('read-stats', async () => {
    try {
        return await fs_extra_1.default.readJson(STATS_PATH);
    }
    catch {
        return [];
    }
});
electron_1.ipcMain.handle('save-stats', async (_, stats) => {
    await fs_extra_1.default.writeJson(STATS_PATH, stats, { spaces: 2 });
    return true;
});
async function getIGDBToken(config) {
    if (igdbToken && Date.now() < igdbToken.expires_at) {
        return igdbToken.access_token;
    }
    const response = await axios_1.default.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: config.IGDB_CLIENT_ID,
            client_secret: config.IGDB_CLIENT_SECRET,
            grant_type: 'client_credentials',
        },
    });
    igdbToken = {
        access_token: response.data.access_token,
        expires_at: Date.now() + (response.data.expires_in - 60) * 1000,
    };
    return igdbToken.access_token;
}
async function searchIGDB(gameName, platformId, config) {
    try {
        const token = await getIGDBToken(config);
        const response = await axios_1.default.post('https://api.igdb.com/v4/games', `search "${gameName}"; fields rating; where platforms = [${platformId}]; limit 1;`, {
            headers: {
                'Client-ID': config.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
        });
        if (response.data.length > 0 && response.data[0].rating) {
            return response.data[0].rating;
        }
        return null;
    }
    catch {
        return null;
    }
}
async function searchTGDB(gameName, platformId, config) {
    try {
        const response = await axios_1.default.get(`https://api.thegamesdb.net/v1/Games/ByGameName`, {
            params: {
                apikey: config.TGDB_API_KEY,
                name: gameName,
                platform: platformId,
            },
        });
        if (response.data.data && response.data.data.length > 0) {
            const game = response.data.data[0];
            if (game.ratings && game.ratings.thegamesdb) {
                return parseFloat(game.ratings.thegamesdb) * 10;
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
async function getGameRating(gameName, systemInfo, config) {
    const igdbRating = await searchIGDB(gameName, systemInfo.igdb, config);
    if (igdbRating !== null) {
        return igdbRating;
    }
    const tgdbRating = await searchTGDB(gameName, systemInfo.tgdb, config);
    return tgdbRating;
}
electron_1.ipcMain.handle('start-curation', async (_, options) => {
    const { folder, minRating, action } = options;
    const config = await fs_extra_1.default.readJson(CONFIG_PATH);
    const classics = await fs_extra_1.default.readJson(CLASSICS_PATH);
    const systems = await fs_extra_1.default.readJson(SYSTEMS_PATH);
    const stats = {
        pasta: folder,
        total_encontrado: 0,
        preservados_classicos: 0,
        removidos: 0,
        mantidos_por_nota: 0,
        data: new Date().toLocaleString('pt-BR'),
    };
    const romFiles = [];
    async function scanDirectory(dir) {
        const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                await scanDirectory(fullPath);
            }
            else {
                const ext = path_1.default.extname(entry.name).toLowerCase();
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
    const dirGroups = new Map();
    for (const file of romFiles) {
        if (!dirGroups.has(file.parentDir)) {
            dirGroups.set(file.parentDir, []);
        }
        dirGroups.get(file.parentDir).push(file);
    }
    // Process each directory group
    const processedDirs = new Set();
    let fileIndex = 0;
    for (const [parentDir, files] of dirGroups) {
        if (processedDirs.has(parentDir))
            continue;
        // Check if this is a single-ROM folder (folder name matches ROM name)
        const folderName = path_1.default.basename(parentDir).toLowerCase();
        const isSingleRomFolder = files.length === 1 && folderName === path_1.default.basename(files[0].name, files[0].ext).toLowerCase();
        // Determine action for this group
        let groupAction = 'keep';
        for (const file of files) {
            const fileName = path_1.default.basename(file.name, path_1.default.extname(file.name)).toLowerCase();
            const isClassic = classics.some((classic) => fileName.includes(classic.toLowerCase()));
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
                });
                continue;
            }
            const rating = await getGameRating(path_1.default.basename(file.name, path_1.default.extname(file.name)), file.system, config);
            if (rating === null || rating >= minRating) {
                stats.mantidos_por_nota++;
                mainWindow?.webContents.send('curation-progress', {
                    type: 'file',
                    index: fileIndex++,
                    fileName: file.name,
                    system: file.system.name,
                    status: 'kept',
                    rating: rating,
                });
            }
            else {
                stats.removidos++;
                groupAction = 'remove';
                mainWindow?.webContents.send('curation-progress', {
                    type: 'file',
                    index: fileIndex++,
                    fileName: file.name,
                    system: file.system.name,
                    status: 'removed',
                    rating: rating,
                });
            }
        }
        // If it's a single-ROM folder and should be removed, remove/move the entire folder
        if (isSingleRomFolder && groupAction === 'remove') {
            if (action === 'move') {
                const removedDir = path_1.default.join(folder, 'removidos');
                await fs_extra_1.default.ensureDir(removedDir);
                await fs_extra_1.default.move(parentDir, path_1.default.join(removedDir, path_1.default.basename(parentDir)), { overwrite: true });
            }
            else {
                await fs_extra_1.default.remove(parentDir);
            }
            processedDirs.add(parentDir);
        }
        processedDirs.add(parentDir);
    }
    const allStats = await fs_extra_1.default.readJson(STATS_PATH).catch(() => []);
    allStats.push(stats);
    await fs_extra_1.default.writeJson(STATS_PATH, allStats, { spaces: 2 });
    mainWindow?.webContents.send('curation-progress', {
        type: 'complete',
        stats,
    });
    return stats;
});
