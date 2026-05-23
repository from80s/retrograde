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
  simulateCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete'; resume?: boolean }) => Promise<{
    results: any[];
    totalFiles: number;
    totalSizeAffected: number;
    action: 'move' | 'delete';
    cancelled?: boolean;
  }>;
  cancelCuration: () => Promise<boolean>;
  cancelSimulation: () => Promise<boolean>;
  readProgressLog: (folder: string) => Promise<any>;
  deleteProgressLog: (folder: string) => Promise<boolean>;
  validateGameName: (name: string) => Promise<{ valid: boolean; message: string }>;
  readSystems: () => Promise<Record<string, any>>;
  readStats: () => Promise<any[]>;
  saveStats: (stats: any) => Promise<boolean>;
  readVersion: () => Promise<string>;
  testApiConnections: () => Promise<{ igdb: { status: string; message: string }; tgdb: { status: string; message: string } }>;
  startCuration: (options: { folder: string; minRating: number; action: 'move' | 'delete'; resume?: boolean }) => Promise<any>;
  onCurationProgress: (callback: (data: any) => void) => void;
  removeCurationProgressListener: () => void;
  deleteRemovedFolder: (folder: string) => Promise<boolean>;
  scanCompressed: (folder: string) => Promise<{ path: string; name: string; size: number; ext: string }[]>;
  onScanCompressedProgress: (callback: (data: { progress: number; scanned: number; total: number; found: number }) => void) => void;
  removeScanCompressedProgressListener: () => void;
  startExtraction: (options: { files: { path: string; name: string; size: number; ext: string }[]; mode: string; deleteAfter: boolean; resume?: boolean }) => Promise<{
    results: { name: string; status: string; compressedSize: number; extractedSize: number; fileCount: number; error?: string }[];
    successCount: number;
    errorCount: number;
    cancelledCount: number;
    totalExtracted: number;
    totalCompressed: number;
    totalFiles: number;
  }>;
  cancelExtraction: () => Promise<boolean>;
  onExtractionProgress: (callback: (data: any) => void) => void;
  removeExtractionProgressListener: () => void;
  scanOrphanFiles: (folder: string) => Promise<{ path: string; name: string; size: number; ext: string; category: string }[]>;
  deleteOrphanFiles: (files: { path: string }[]) => Promise<{ deleted: number; freedBytes: number }>;
  fetchTgdbAssets: (gameName: string, platformId: number) => Promise<{
    boxart: string | null;
    screenshots: string[];
    fanart: string[];
    banner: string | null;
    logo: string | null;
    videos: { url: string; title: string }[];
    gameTitle: string | null;
    overview: string | null;
    releaseDate: string | null;
    developer: string | null;
    publisher: string | null;
  }>;
  fetchTgdbDetails: (gameName: string, platformId: number) => Promise<any>;
  searchTgdbById: (gameId: number, include?: string[]) => Promise<any>;
  detectInstallations: () => Promise<{
    retroarch: { found: boolean; path: string | null; method?: string };
    esde: { found: boolean; path: string | null; method?: string };
  }>;
  exportAssetsRetroarch: (options: {
    targetDir: string;
    playlistName: string;
    gameName: string;
    assets: { boxart: string | null; screenshots: string[]; fanart: string[] };
  }) => Promise<{ successCount: number; total: number; results: { type: string; status: string; path?: string; error?: string }[] }>;
  exportAssetsEsde: (options: {
    targetDir: string;
    systemId: number;
    gameName: string;
    assets: { boxart: string | null; screenshots: string[]; fanart: string[]; banner: string | null; logo: string | null; overview: string | null; releaseDate: string | null; developer: string | null; publisher: string | null };
  }) => Promise<{ successCount: number; total: number; results: { type: string; status: string; path?: string; error?: string }[]; systemName: string }>;
  exportAssetsManual: (options: {
    targetDir: string;
    gameName: string;
    assets: { boxart: string | null; screenshots: string[]; fanart: string[]; banner: string | null; logo: string | null };
  }) => Promise<{ successCount: number; total: number; results: { type: string; status: string; path?: string; error?: string }[]; gameDir: string }>;
  windowMinimize: () => Promise<void>;
  windowMaximize: () => Promise<void>;
  windowClose: () => Promise<void>;
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
