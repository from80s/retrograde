import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readConfig: () => ipcRenderer.invoke('read-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  readClassics: () => ipcRenderer.invoke('read-classics'),
  readClassicGames: () => ipcRenderer.invoke('read-classic-games'),
  addClassics: (names: string[]) => ipcRenderer.invoke('addClassics', names),
  fetchGameCover: (name: string) => ipcRenderer.invoke('fetch-game-cover', name),
  addClassic: (name: string) => ipcRenderer.invoke('addClassic', name),
  removeClassic: (name: string) => ipcRenderer.invoke('removeClassic', name),
  readGenres: () => ipcRenderer.invoke('read-genres'),
  addGenre: (genre: string) => ipcRenderer.invoke('addGenre', genre),
  removeGenre: (genre: string) => ipcRenderer.invoke('removeGenre', genre),
  readProtectedGames: () => ipcRenderer.invoke('read-protected-games'),
  addProtectedGame: (game: string) => ipcRenderer.invoke('add-protected-game', game),
  removeProtectedGame: (game: string) => ipcRenderer.invoke('remove-protected-game', game),
  scanFolder: (folder: string) => ipcRenderer.invoke('scan-folder', folder),
  onScanProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('scan-progress', (_, data) => callback(data));
  },
  removeScanProgressListener: () => {
    ipcRenderer.removeAllListeners('scan-progress');
  },
  simulateCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) =>
    ipcRenderer.invoke('simulate-curation', options),
  validateGameName: (name: string) => ipcRenderer.invoke('validate-game-name', name),
  readSystems: () => ipcRenderer.invoke('read-systems'),
  readStats: () => ipcRenderer.invoke('read-stats'),
  saveStats: (stats: any) => ipcRenderer.invoke('save-stats', stats),
  readVersion: () => ipcRenderer.invoke('read-version'),
  testApiConnections: () => ipcRenderer.invoke('test-api-connections'),
  startCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) =>
    ipcRenderer.invoke('start-curation', options),
  onCurationProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('curation-progress', (_, data) => callback(data));
  },
  removeCurationProgressListener: () => {
    ipcRenderer.removeAllListeners('curation-progress');
  },
  deleteRemovedFolder: (folder: string) => ipcRenderer.invoke('delete-removed-folder', folder),
  scanCompressed: (folder: string) => ipcRenderer.invoke('scan-compressed', folder),
  startExtraction: (options: { files: any[]; mode: string; deleteAfter: boolean }) =>
    ipcRenderer.invoke('start-extraction', options),
  cancelExtraction: () => ipcRenderer.invoke('cancel-extraction'),
  onExtractionProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('extraction-progress', (_, data) => callback(data));
  },
  removeExtractionProgressListener: () => {
    ipcRenderer.removeAllListeners('extraction-progress');
  },
});
