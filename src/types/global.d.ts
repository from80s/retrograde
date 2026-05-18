export interface ClassicGameEntry {
  name: string;
  genre: string;
  cover?: string;
}

export interface ClassicGamesPlatform {
  extensions: string[];
  igdb: number;
  tgdb: number;
  classics: ClassicGameEntry[];
}

export interface ClassicGamesData {
  platforms: Record<string, ClassicGamesPlatform>;
}

export interface ApiBridge {
  selectFolder: () => Promise<string | null>;
  readConfig: () => Promise<any>;
  saveConfig: (config: any) => Promise<boolean>;
  readClassics: () => Promise<string[]>;
  readClassicGames: () => Promise<ClassicGamesData>;
  addClassics: (names: string[]) => Promise<{ classics: string[]; added: string[] }>;
  fetchGameCover: (name: string) => Promise<string | null>;
  addClassic: (name: string) => Promise<string[]>;
  removeClassic: (name: string) => Promise<string[]>;
  readGenres: () => Promise<string[]>;
  addGenre: (genre: string) => Promise<string[]>;
  removeGenre: (genre: string) => Promise<string[]>;
  readProtectedGames: () => Promise<string[]>;
  addProtectedGame: (game: string) => Promise<string[]>;
  removeProtectedGame: (game: string) => Promise<string[]>;
  scanFolder: (folder: string) => Promise<{
    total: number;
    grouped: Record<string, any[]>;
    cloneGroups: any[];
    hasIGDB: boolean;
  }>;
  onScanProgress: (callback: (data: any) => void) => void;
  removeScanProgressListener: () => void;
  simulateCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete' }) => Promise<{
    results: any[];
    totalFiles: number;
    totalSizeAffected: number;
    action: 'move' | 'delete';
  }>;
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
