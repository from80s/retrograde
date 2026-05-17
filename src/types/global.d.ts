export interface ApiBridge {
  selectFolder: () => Promise<string | null>;
  readConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<boolean>;
  readClassics: () => Promise<string[]>;
  addClassic: (name: string) => Promise<string[]>;
  removeClassic: (name: string) => Promise<string[]>;
  validateGameName: (name: string) => Promise<{ valid: boolean; message: string }>;
  readSystems: () => Promise<Record<string, any>>;
  readStats: () => Promise<any[]>;
  saveStats: (stats: any) => Promise<boolean>;
  readVersion: () => Promise<string>;
  testApiConnections: () => Promise<{ igdb: { status: string; message: string }; tgdb: { status: string; message: string } }>;
  startCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) => Promise<any>;
  onCurationProgress: (callback: (data: any) => void) => void;
  removeCurationProgressListener: () => void;
  deleteRemovedFolder: (folder: string) => Promise<boolean>;
}

declare global {
  interface Window {
    api: ApiBridge;
  }
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
