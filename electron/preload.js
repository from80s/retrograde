"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    selectFolder: () => electron_1.ipcRenderer.invoke('select-folder'),
    readConfig: () => electron_1.ipcRenderer.invoke('read-config'),
    saveConfig: (config) => electron_1.ipcRenderer.invoke('save-config', config),
    readClassics: () => electron_1.ipcRenderer.invoke('read-classics'),
    addClassic: (name) => electron_1.ipcRenderer.invoke('addClassic', name),
    removeClassic: (name) => electron_1.ipcRenderer.invoke('removeClassic', name),
    readGenres: () => electron_1.ipcRenderer.invoke('read-genres'),
    addGenre: (genre) => electron_1.ipcRenderer.invoke('addGenre', genre),
    removeGenre: (genre) => electron_1.ipcRenderer.invoke('removeGenre', genre),
    readProtectedGames: () => electron_1.ipcRenderer.invoke('read-protected-games'),
    addProtectedGame: (game) => electron_1.ipcRenderer.invoke('add-protected-game', game),
    removeProtectedGame: (game) => electron_1.ipcRenderer.invoke('remove-protected-game', game),
    scanFolder: (folder) => electron_1.ipcRenderer.invoke('scan-folder', folder),
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
});
