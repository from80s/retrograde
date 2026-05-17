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
const GENRE_PATH = path_1.default.join(DATA_DIR, 'genre.json');
const PROTECTED_GAMES_PATH = path_1.default.join(DATA_DIR, 'protected_games.json');
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
    const igdbResult = await searchIGDB(gameName, systemInfo.igdb, config);
    if (igdbResult.rating !== null) {
        return igdbResult;
    }
    const tgdbRating = await searchTGDB(gameName, systemInfo.tgdb, config);
    return { rating: tgdbRating, genres: [] };
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
    // Fetch metadata for each ROM (batch by system to avoid rate limits)
    const hasIGDB = config?.IGDB_CLIENT_ID && config?.IGDB_CLIENT_SECRET;
    if (hasIGDB) {
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
            if (i + 5 < romFiles.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
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
electron_1.ipcMain.handle('delete-removed-folder', async (_, folder) => {
    const removedDir = path_1.default.join(folder, 'removidos');
    if (await fs_extra_1.default.pathExists(removedDir)) {
        await fs_extra_1.default.remove(removedDir);
        return true;
    }
    return false;
});
