"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const axios_1 = __importDefault(require("axios"));
const unzipper_1 = __importDefault(require("unzipper"));
const _7zip_min_1 = __importDefault(require("7zip-min"));
const tar = __importStar(require("tar"));
const zlib_1 = __importDefault(require("zlib"));
const isDev = process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL;
console.log('[RetroGrade] Starting app...');
console.log('[RetroGrade] isDev:', isDev);
console.log('[RetroGrade] app.getAppPath():', electron_1.app.getAppPath());
console.log('[RetroGrade] __dirname:', __dirname);
const DATA_DIR = path_1.default.join(electron_1.app.getAppPath(), 'data');
const CONFIG_PATH = path_1.default.join(DATA_DIR, 'config.json');
const CLASSICS_PATH = path_1.default.join(DATA_DIR, 'classics.json');
const GENRE_PATH = path_1.default.join(DATA_DIR, 'genre.json');
const PROTECTED_GAMES_PATH = path_1.default.join(DATA_DIR, 'protected_games.json');
const CLASSIC_GAMES_PATH = path_1.default.join(DATA_DIR, 'classic_games.json');
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
electron_1.app.whenReady().then(async () => {
    // Initialize data files if they don't exist
    try {
        await fs_extra_1.default.ensureDir(DATA_DIR);
        if (!fs_extra_1.default.existsSync(CONFIG_PATH)) {
            await fs_extra_1.default.writeJson(CONFIG_PATH, {
                IGDB_CLIENT_ID: '',
                IGDB_CLIENT_SECRET: '',
                TGDB_API_KEY: '',
                minRating: 60,
                action: 'move'
            }, { spaces: 2 });
        }
        if (!fs_extra_1.default.existsSync(CLASSICS_PATH)) {
            await fs_extra_1.default.writeJson(CLASSICS_PATH, [], { spaces: 2 });
        }
        if (!fs_extra_1.default.existsSync(GENRE_PATH)) {
            await fs_extra_1.default.writeJson(GENRE_PATH, [], { spaces: 2 });
        }
        if (!fs_extra_1.default.existsSync(PROTECTED_GAMES_PATH)) {
            await fs_extra_1.default.writeJson(PROTECTED_GAMES_PATH, [], { spaces: 2 });
        }
        if (!fs_extra_1.default.existsSync(STATS_PATH)) {
            await fs_extra_1.default.writeJson(STATS_PATH, [], { spaces: 2 });
        }
    }
    catch (err) {
        console.error('[RetroGrade] Error initializing data files:', err);
    }
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
electron_1.ipcMain.handle('addClassics', async (_, names) => {
    let classics = await fs_extra_1.default.readJson(CLASSICS_PATH).catch(() => []);
    const added = [];
    for (const name of names) {
        if (!classics.includes(name)) {
            classics.push(name);
            added.push(name);
        }
    }
    if (added.length > 0) {
        await fs_extra_1.default.writeJson(CLASSICS_PATH, classics, { spaces: 2 });
    }
    return { classics, added };
});
electron_1.ipcMain.handle('read-classic-games', async () => {
    try {
        return await fs_extra_1.default.readJson(CLASSIC_GAMES_PATH);
    }
    catch {
        return { platforms: {} };
    }
});
electron_1.ipcMain.handle('fetch-game-cover', async (_, gameName) => {
    const config = await fs_extra_1.default.readJson(CONFIG_PATH).catch(() => null);
    if (!config?.IGDB_CLIENT_ID || !config?.IGDB_CLIENT_SECRET) {
        return null;
    }
    try {
        const token = await getIGDBToken(config);
        const response = await axios_1.default.post('https://api.igdb.com/v4/games', `search "${gameName}"; fields cover.url, name; limit 1;`, {
            headers: {
                'Client-ID': config.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
            timeout: 10000,
        });
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
    }
    catch {
        return null;
    }
});
electron_1.ipcMain.handle('read-genres', async () => {
    try {
        return await fs_extra_1.default.readJson(GENRE_PATH);
    }
    catch {
        return [];
    }
});
electron_1.ipcMain.handle('addGenre', async (_, genre) => {
    const genres = await fs_extra_1.default.readJson(GENRE_PATH).catch(() => []);
    if (!genres.includes(genre)) {
        genres.push(genre);
        await fs_extra_1.default.writeJson(GENRE_PATH, genres, { spaces: 2 });
    }
    return genres;
});
electron_1.ipcMain.handle('removeGenre', async (_, genre) => {
    let genres = await fs_extra_1.default.readJson(GENRE_PATH).catch(() => []);
    genres = genres.filter((g) => g !== genre);
    await fs_extra_1.default.writeJson(GENRE_PATH, genres, { spaces: 2 });
    return genres;
});
electron_1.ipcMain.handle('read-protected-games', async () => {
    try {
        return await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH);
    }
    catch {
        return [];
    }
});
electron_1.ipcMain.handle('add-protected-game', async (_, gameName) => {
    const games = await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH).catch(() => []);
    if (!games.includes(gameName)) {
        games.push(gameName);
        await fs_extra_1.default.writeJson(PROTECTED_GAMES_PATH, games, { spaces: 2 });
    }
    return games;
});
electron_1.ipcMain.handle('remove-protected-game', async (_, gameName) => {
    let games = await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH).catch(() => []);
    games = games.filter((g) => g !== gameName);
    await fs_extra_1.default.writeJson(PROTECTED_GAMES_PATH, games, { spaces: 2 });
    return games;
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
        const response = await axios_1.default.post('https://api.igdb.com/v4/games', `search "${gameName}"; fields rating, genres.name; where platforms = [${platformId}]; limit 1;`, {
            headers: {
                'Client-ID': config.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
        });
        if (response.data.length > 0) {
            const game = response.data[0];
            const genres = game.genres ? game.genres.map((g) => g.name) : [];
            return {
                rating: game.rating || null,
                genres,
            };
        }
        return { rating: null, genres: [] };
    }
    catch {
        return { rating: null, genres: [] };
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
            let rating = null;
            if (game.ratings && game.ratings.thegamesdb) {
                rating = parseFloat(game.ratings.thegamesdb) * 10;
            }
            const genres = game.genres ? game.genres.split(',').map((g) => g.trim()) : [];
            return { rating, genres };
        }
        return { rating: null, genres: [] };
    }
    catch {
        return { rating: null, genres: [] };
    }
}
async function getGameRating(gameName, systemInfo, config) {
    const igdbResult = await searchIGDB(gameName, systemInfo.igdb, config);
    const tgdbResult = await searchTGDB(gameName, systemInfo.tgdb, config);
    // Unificar notas: pegar a maior entre IGDB e TGDB
    const ratings = [igdbResult.rating, tgdbResult.rating].filter((r) => r !== null);
    const bestRating = ratings.length > 0 ? Math.max(...ratings) : null;
    // Combinar gêneros de ambas as APIs (remover duplicatas)
    const allGenres = [...igdbResult.genres, ...tgdbResult.genres];
    const uniqueGenres = [...new Set(allGenres.map(g => g.toLowerCase()))].map(g => allGenres.find(ag => ag.toLowerCase() === g));
    return { rating: bestRating, genres: uniqueGenres };
}
async function getPathSize(filePath) {
    const stat = await fs_extra_1.default.stat(filePath);
    if (stat.isDirectory()) {
        const entries = await fs_extra_1.default.readdir(filePath);
        let size = 0;
        for (const entry of entries) {
            size += await getPathSize(path_1.default.join(filePath, entry));
        }
        return size;
    }
    return stat.size;
}
async function searchIGDBFull(gameName, platformId, config) {
    try {
        const token = await getIGDBToken(config);
        const response = await axios_1.default.post('https://api.igdb.com/v4/games', `search "${gameName}"; fields name, rating, genres.name, release_dates.y, version_title; where platforms = [${platformId}]; limit 5;`, {
            headers: {
                'Client-ID': config.IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`,
                'Content-Type': 'text/plain',
            },
        });
        if (response.data.length > 0) {
            const game = response.data[0];
            return {
                name: game.name || gameName,
                rating: game.rating || null,
                genres: game.genres ? game.genres.map((g) => g.name) : [],
                year: game.release_dates && game.release_dates.length > 0 ? game.release_dates[0].y : null,
                version: game.version_title || '',
            };
        }
        return null;
    }
    catch {
        return null;
    }
}
function extractRegionTags(fileName) {
    const regionPattern = /\((USA|World|Europe|Japan|Asia|Brazil|Korea|Australia|Canada|France|Germany|Spain|Italy|UK|Scandinavia|Netherlands|Sweden|Norway|Finland|Denmark|Portugal|Russia|China|Taiwan|Hong Kong|Mexico|Argentina|Chile|Colombia|Peru|Venezuela|Ecuador|Bolivia|Paraguay|Uruguay|Costa Rica|Panama|Guatemala|Honduras|El Salvador|Nicaragua|Dominican Republic|Cuba|Puerto Rico|Jamaica|Trinidad|Barbados|Bahamas|Haiti|Guyana|Suriname|French Guiana|Falkland Islands|South Georgia|Antarctica)\)/gi;
    const matches = fileName.match(regionPattern);
    return matches ? matches.map(m => m.replace(/[()]/g, '')) : [];
}
function getBaseRomName(fileName) {
    return fileName
        .replace(/\(.*?\)/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
electron_1.ipcMain.handle('scan-folder', async (_, folder) => {
    const config = await fs_extra_1.default.readJson(CONFIG_PATH);
    const classics = await fs_extra_1.default.readJson(CLASSICS_PATH);
    const protectedGenres = await fs_extra_1.default.readJson(GENRE_PATH).catch(() => []);
    const protectedGames = await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH).catch(() => []);
    const systems = await fs_extra_1.default.readJson(SYSTEMS_PATH);
    const romFiles = [];
    // Phase 1: Filesystem scan (fast, no API calls)
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
                    const fileName = path_1.default.basename(entry.name, ext);
                    const baseName = getBaseRomName(fileName);
                    const regionTags = extractRegionTags(fileName);
                    const stat = await fs_extra_1.default.stat(fullPath);
                    const isClassic = classics.some((classic) => fileName.toLowerCase().includes(classic.toLowerCase()));
                    const isUserProtected = protectedGames.some((game) => fileName.toLowerCase().includes(game.toLowerCase()));
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
                    const isGenreProtected = protectedGenres.some((genre) => metadata.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase())));
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
    }
    else {
        mainWindow?.webContents.send('scan-progress', {
            phase: 'metadata',
            progress: 100,
            current: romFiles.length,
            total: romFiles.length,
        });
    }
    // Group by system
    const grouped = {};
    for (const rom of romFiles) {
        if (!grouped[rom.systemName]) {
            grouped[rom.systemName] = [];
        }
        grouped[rom.systemName].push(rom);
    }
    // Detect clones/duplicates
    const cloneGroups = [];
    const processedBases = new Set();
    for (const rom of romFiles) {
        if (processedBases.has(rom.baseName))
            continue;
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
electron_1.ipcMain.handle('start-curation', async (_, options) => {
    const { folder, minRating, action } = options;
    const config = await fs_extra_1.default.readJson(CONFIG_PATH);
    const classics = await fs_extra_1.default.readJson(CLASSICS_PATH);
    const protectedGenres = await fs_extra_1.default.readJson(GENRE_PATH).catch(() => []);
    const protectedGames = await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH).catch(() => []);
    const systems = await fs_extra_1.default.readJson(SYSTEMS_PATH);
    const stats = {
        pasta: folder,
        total_encontrado: 0,
        preservados_classicos: 0,
        removidos: 0,
        mantidos_por_nota: 0,
        bytes_removed: 0,
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
                    genres: [],
                });
                continue;
            }
            const isUserProtected = protectedGames.some((game) => fileName.includes(game.toLowerCase()));
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
            const result = await getGameRating(path_1.default.basename(file.name, path_1.default.extname(file.name)), file.system, config);
            const isProtectedGenre = protectedGenres.some((genre) => result.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase())));
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
electron_1.ipcMain.handle('simulate-curation', async (_, options) => {
    const { folder, minRating, action } = options;
    const config = await fs_extra_1.default.readJson(CONFIG_PATH);
    const classics = await fs_extra_1.default.readJson(CLASSICS_PATH);
    const protectedGenres = await fs_extra_1.default.readJson(GENRE_PATH).catch(() => []);
    const protectedGames = await fs_extra_1.default.readJson(PROTECTED_GAMES_PATH).catch(() => []);
    const systems = await fs_extra_1.default.readJson(SYSTEMS_PATH);
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
                    const stat = await fs_extra_1.default.stat(fullPath);
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
    const dirGroups = new Map();
    for (const file of romFiles) {
        if (!dirGroups.has(file.parentDir)) {
            dirGroups.set(file.parentDir, []);
        }
        dirGroups.get(file.parentDir).push(file);
    }
    const simulationResults = [];
    const processedDirs = new Set();
    let totalSizeAffected = 0;
    for (const [parentDir, files] of dirGroups) {
        if (processedDirs.has(parentDir))
            continue;
        const folderName = path_1.default.basename(parentDir).toLowerCase();
        const isSingleRomFolder = files.length === 1 && folderName === path_1.default.basename(files[0].name, files[0].ext).toLowerCase();
        let groupAction = 'keep';
        for (const file of files) {
            const fileName = path_1.default.basename(file.name, path_1.default.extname(file.name)).toLowerCase();
            const isClassic = classics.some((classic) => fileName.includes(classic.toLowerCase()));
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
            const isUserProtected = protectedGames.some((game) => fileName.includes(game.toLowerCase()));
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
            const result = await getGameRating(path_1.default.basename(file.name, path_1.default.extname(file.name)), file.system, config);
            const isProtectedGenre = protectedGenres.some((genre) => result.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase())));
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
            }
            else {
                groupAction = 'remove';
                simulationResults.push({
                    fileName: file.name,
                    system: file.system.name,
                    status: 'removed',
                    rating: result.rating,
                    genres: result.genres,
                    size: file.size,
                    action: action,
                    targetPath: action === 'move' ? path_1.default.join(folder, 'removidos', file.name) : undefined,
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
electron_1.ipcMain.handle('delete-removed-folder', async (_, folder) => {
    const removedDir = path_1.default.join(folder, 'removidos');
    if (await fs_extra_1.default.pathExists(removedDir)) {
        await fs_extra_1.default.remove(removedDir);
        return true;
    }
    return false;
});
const COMPRESSED_EXTENSIONS = new Set(['.zip', '.7z', '.rar', '.tar', '.gz', '.tar.gz']);
function isCompressedFile(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.tar.gz'))
        return true;
    for (const ext of COMPRESSED_EXTENSIONS) {
        if (lower.endsWith(ext))
            return true;
    }
    return false;
}
function getExtension(fileName) {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.tar.gz'))
        return '.tar.gz';
    return path_1.default.extname(lower);
}
function determineConcurrency(files) {
    if (files.length === 0)
        return 1;
    const maxSize = Math.max(...files.map((f) => f.size));
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (maxSize > 2 * 1024 * 1024 * 1024)
        return 1;
    if (totalSize > 10 * 1024 * 1024 * 1024)
        return 1;
    if (totalSize > 5 * 1024 * 1024 * 1024)
        return 2;
    if (maxSize < 100 * 1024 * 1024)
        return 3;
    return 2;
}
async function extractZipFile(zipPath, outputDir, onProgress) {
    const directory = await unzipper_1.default.Open.file(zipPath);
    const files = directory.files.filter((f) => f.type === 'File');
    const totalSize = files.reduce((sum, f) => sum + (f.uncompressedSize || 0), 0);
    let extractedSize = 0;
    let fileCount = 0;
    for (const file of files) {
        const outputPath = path_1.default.join(outputDir, file.path);
        await fs_extra_1.default.mkdir(path_1.default.dirname(outputPath), { recursive: true });
        await new Promise((resolve, reject) => {
            const stream = file.stream();
            const writeStream = fs_extra_1.default.createWriteStream(outputPath);
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
async function extract7zFile(archivePath, outputDir, onProgress) {
    const entries = await new Promise((resolve, reject) => {
        _7zip_min_1.default.list(archivePath, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result || []);
        });
    });
    const files = entries.filter((e) => e.method !== undefined);
    const totalSize = files.reduce((sum, e) => sum + (e.size || 0), 0);
    await new Promise((resolve, reject) => {
        _7zip_min_1.default.unpack(archivePath, outputDir, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    onProgress({
        type: 'file-progress',
        fileName: path_1.default.basename(archivePath),
        progress: 100,
        extractedSize: totalSize,
        totalSize,
    });
    return { extractedSize: totalSize, fileCount: files.length };
}
async function extractRarFile(archivePath, outputDir, onProgress) {
    const entries = await new Promise((resolve, reject) => {
        _7zip_min_1.default.list(archivePath, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result || []);
        });
    });
    const files = entries.filter((e) => e.method !== undefined);
    const totalSize = files.reduce((sum, e) => sum + (e.size || 0), 0);
    await new Promise((resolve, reject) => {
        _7zip_min_1.default.unpack(archivePath, outputDir, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    onProgress({
        type: 'file-progress',
        fileName: path_1.default.basename(archivePath),
        progress: 100,
        extractedSize: totalSize,
        totalSize,
    });
    return { extractedSize: totalSize, fileCount: files.length };
}
async function extractTarFile(tarPath, outputDir, onProgress) {
    let fileCount = 0;
    let extractedSize = 0;
    await tar.x({
        file: tarPath,
        cwd: outputDir,
        onentry: (entry) => {
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
        fileName: path_1.default.basename(tarPath),
        progress: 100,
        extractedSize,
        totalSize: extractedSize,
    });
    return { extractedSize, fileCount };
}
async function extractGzFile(gzPath, outputDir, onProgress) {
    const baseName = path_1.default.basename(gzPath, '.gz');
    const outputPath = path_1.default.join(outputDir, baseName);
    await new Promise((resolve, reject) => {
        const readStream = fs_extra_1.default.createReadStream(gzPath);
        const writeStream = fs_extra_1.default.createWriteStream(outputPath);
        const gunzip = zlib_1.default.createGunzip();
        let extractedSize = 0;
        readStream.pipe(gunzip).pipe(writeStream);
        gunzip.on('data', (chunk) => {
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
    const stat = await fs_extra_1.default.stat(outputPath);
    onProgress({
        type: 'file-progress',
        fileName: baseName,
        progress: 100,
        extractedSize: stat.size,
        totalSize: stat.size,
    });
    return { extractedSize: stat.size, fileCount: 1 };
}
async function extractTarGzFile(tarGzPath, outputDir, onProgress) {
    let fileCount = 0;
    let extractedSize = 0;
    await tar.x({
        file: tarGzPath,
        cwd: outputDir,
        onentry: (entry) => {
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
        fileName: path_1.default.basename(tarGzPath),
        progress: 100,
        extractedSize,
        totalSize: extractedSize,
    });
    return { extractedSize, fileCount };
}
async function extractFile(filePath, outputDir, onProgress) {
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
electron_1.ipcMain.handle('cancel-extraction', async () => {
    extractionCancelled = true;
    return true;
});
electron_1.ipcMain.handle('scan-compressed', async (_, folder) => {
    const files = [];
    async function scanDirectory(dir) {
        const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                await scanDirectory(fullPath);
            }
            else if (isCompressedFile(entry.name)) {
                const stat = await fs_extra_1.default.stat(fullPath);
                files.push({
                    path: fullPath,
                    name: entry.name,
                    size: stat.size,
                    ext: getExtension(entry.name),
                });
            }
        }
    }
    await scanDirectory(folder);
    return files;
});
electron_1.ipcMain.handle('start-extraction', async (_, options) => {
    const { files, mode, deleteAfter } = options;
    extractionCancelled = false;
    const results = [];
    const concurrency = determineConcurrency(files);
    const queue = [...files];
    const running = [];
    let index = 0;
    async function processFile(file, idx) {
        const outputDir = mode === 'own-folder'
            ? path_1.default.join(path_1.default.dirname(file.path), file.name.replace(/\.[^.]+$/, '').replace(/\.tar$/, ''))
            : path_1.default.dirname(file.path);
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
                await fs_extra_1.default.remove(file.path);
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
        }
        catch (error) {
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
                    const file = queue.shift();
                    results.push({ name: file.name, status: 'cancelled', compressedSize: file.size, extractedSize: 0, fileCount: 0 });
                }
                break;
            }
            const file = queue.shift();
            const idx = index++;
            const promise = processFile(file, idx).then(() => {
                const i = running.indexOf(promise);
                if (i > -1)
                    running.splice(i, 1);
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
