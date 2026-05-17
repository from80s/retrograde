import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readConfig: () => ipcRenderer.invoke('read-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  readClassics: () => ipcRenderer.invoke('read-classics'),
  addClassic: (name: string) => ipcRenderer.invoke('addClassic', name),
  removeClassic: (name: string) => ipcRenderer.invoke('removeClassic', name),
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
});
