"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    romDetect: (filePath) => electron_1.ipcRenderer.invoke('rom:detect', filePath),
    romDetectBatch: (filePaths) => electron_1.ipcRenderer.invoke('rom:detectBatch', filePaths),
    selectFolder: () => electron_1.ipcRenderer.invoke('select-folder'),
    readConfig: () => electron_1.ipcRenderer.invoke('read-config'),
    saveConfig: (config) => electron_1.ipcRenderer.invoke('save-config', config),
    readClassics: () => electron_1.ipcRenderer.invoke('read-classics'),
    readClassicGames: () => electron_1.ipcRenderer.invoke('read-classic-games'),
    addClassics: (names) => electron_1.ipcRenderer.invoke('addClassics', names),
    fetchGameCover: (name) => electron_1.ipcRenderer.invoke('fetch-game-cover', name),
    addClassic: (name) => electron_1.ipcRenderer.invoke('addClassic', name),
    removeClassic: (name) => electron_1.ipcRenderer.invoke('removeClassic', name),
    readGenres: () => electron_1.ipcRenderer.invoke('read-genres'),
    addGenre: (genre) => electron_1.ipcRenderer.invoke('addGenre', genre),
    removeGenre: (genre) => electron_1.ipcRenderer.invoke('removeGenre', genre),
    readProtectedGames: () => electron_1.ipcRenderer.invoke('read-protected-games'),
    addProtectedGame: (game) => electron_1.ipcRenderer.invoke('add-protected-game', game),
    removeProtectedGame: (game) => electron_1.ipcRenderer.invoke('remove-protected-game', game),
    scanFolder: (folder) => electron_1.ipcRenderer.invoke('scan-folder', folder),
    onScanProgress: (callback) => {
        electron_1.ipcRenderer.on('scan-progress', (_, data) => callback(data));
    },
    removeScanProgressListener: () => {
        electron_1.ipcRenderer.removeAllListeners('scan-progress');
    },
    simulateCuration: (options) => electron_1.ipcRenderer.invoke('simulate-curation', options),
    cancelCuration: () => electron_1.ipcRenderer.invoke('cancel-curation'),
    cancelSimulation: () => electron_1.ipcRenderer.invoke('cancel-simulation'),
    validateGameName: (name) => electron_1.ipcRenderer.invoke('validate-game-name', name),
    readSystems: () => electron_1.ipcRenderer.invoke('read-systems'),
    readStats: () => electron_1.ipcRenderer.invoke('read-stats'),
    saveStats: (stats) => electron_1.ipcRenderer.invoke('save-stats', stats),
    readVersion: () => electron_1.ipcRenderer.invoke('read-version'),
    testApiConnections: () => electron_1.ipcRenderer.invoke('test-api-connections'),
    startCuration: (options) => electron_1.ipcRenderer.invoke('start-curation', options),
    onCurationProgress: (callback) => {
        electron_1.ipcRenderer.on('curation-progress', (_, data) => callback(data));
    },
    removeCurationProgressListener: () => {
        electron_1.ipcRenderer.removeAllListeners('curation-progress');
    },
    deleteRemovedFolder: (folder) => electron_1.ipcRenderer.invoke('delete-removed-folder', folder),
    scanCompressed: (folder) => electron_1.ipcRenderer.invoke('scan-compressed', folder),
    onScanCompressedProgress: (callback) => {
        electron_1.ipcRenderer.on('scan-compressed-progress', (_, data) => callback(data));
    },
    removeScanCompressedProgressListener: () => {
        electron_1.ipcRenderer.removeAllListeners('scan-compressed-progress');
    },
    startExtraction: (options) => electron_1.ipcRenderer.invoke('start-extraction', options),
    cancelExtraction: () => electron_1.ipcRenderer.invoke('cancel-extraction'),
    onExtractionProgress: (callback) => {
        electron_1.ipcRenderer.on('extraction-progress', (_, data) => callback(data));
    },
    removeExtractionProgressListener: () => {
        electron_1.ipcRenderer.removeAllListeners('extraction-progress');
    },
    scanOrphanFiles: (folder) => electron_1.ipcRenderer.invoke('scan-orphan-files', folder),
    deleteOrphanFiles: (files) => electron_1.ipcRenderer.invoke('delete-orphan-files', files),
    fetchTgdbAssets: (gameName, platformId) => electron_1.ipcRenderer.invoke('fetch-tgdb-assets', gameName, platformId),
    fetchTgdbDetails: (gameName, platformId) => electron_1.ipcRenderer.invoke('fetch-tgdb-details', gameName, platformId),
    searchTgdbById: (gameId, include) => electron_1.ipcRenderer.invoke('search-tgdb-by-id', gameId, include),
    detectInstallations: () => electron_1.ipcRenderer.invoke('detect-installations'),
    readProgressLog: (folder) => electron_1.ipcRenderer.invoke('read-progress-log', folder),
    deleteProgressLog: (folder) => electron_1.ipcRenderer.invoke('delete-progress-log', folder),
    exportAssetsRetroarch: (options) => electron_1.ipcRenderer.invoke('export-assets-retroarch', options),
    exportAssetsEsde: (options) => electron_1.ipcRenderer.invoke('export-assets-esde', options),
    exportAssetsManual: (options) => electron_1.ipcRenderer.invoke('export-assets-manual', options),
    windowMinimize: () => electron_1.ipcRenderer.invoke('window-minimize'),
    windowMaximize: () => electron_1.ipcRenderer.invoke('window-maximize'),
    windowClose: () => electron_1.ipcRenderer.invoke('window-close'),
});
