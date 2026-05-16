export interface ApiBridge {
  selectFolder: () => Promise<string | null>;
  readConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<boolean>;
  readClassics: () => Promise<string[]>;
  readSystems: () => Promise<Record<string, any>>;
  readStats: () => Promise<any[]>;
  saveStats: (stats: any) => Promise<boolean>;
  readVersion: () => Promise<string>;
  startCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) => Promise<any>;
  onCurationProgress: (callback: (data: any) => void) => void;
  removeCurationProgressListener: () => void;
}

declare global {
  interface Window {
    api: ApiBridge;
  }
}
