import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readConfig: () => ipcRenderer.invoke('read-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  readClassics: () => ipcRenderer.invoke('read-classics'),
  readSystems: () => ipcRenderer.invoke('read-systems'),
  readStats: () => ipcRenderer.invoke('read-stats'),
  saveStats: (stats: any) => ipcRenderer.invoke('save-stats', stats),
  readVersion: () => ipcRenderer.invoke('read-version'),
  startCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) =>
    ipcRenderer.invoke('start-curation', options),
  onCurationProgress: (callback: (data: any) => void) => {
    ipcRenderer.on('curation-progress', (_, data) => callback(data));
  },
  removeCurationProgressListener: () => {
    ipcRenderer.removeAllListeners('curation-progress');
  },
});
