import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Filter, Search, Shield, Gamepad2, Calendar,
  ChevronDown, ChevronUp, Copy, Globe, Star, AlertTriangle,
  Loader2, XCircle, CheckCircle2, Square
} from 'lucide-react';
import { getSystemLogo } from '../lib/system-logos';

interface ScanPreviewModalProps {
  folder: string;
  minRating: number;
  action: 'move' | 'delete';
  onClose: () => void;
  onStartCuration: (options: {
    folder: string;
    minRating: number;
    action: 'move' | 'delete';
    removeClones: boolean;
    preferredRegions: string[];
    protectedGames: string[];
    resume?: boolean;
  }) => void;
}

interface RomInfo {
  path: string;
  fileName: string;
  baseName: string;
  ext: string;
  system: string;
  systemName: string;
  size: number;
  parentDir: string;
  regionTags: string[];
  metadata?: {
    name: string;
    rating: number | null;
    genres: string[];
    year: number | null;
    version: string;
  };
  protectionStatus: {
    isClassic: boolean;
    isGenreProtected: boolean;
    isUserProtected: boolean;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const ALL_REGIONS = ['USA', 'World', 'Europe', 'Japan', 'Brazil'];

export function ScanPreviewModal({ folder, minRating, action, onClose, onStartCuration }: ScanPreviewModalProps) {
  const [scanData, setScanData] = useState<any>(null);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState({ progress: 0, scanned: 0, total: 0, found: 0 });
  const [scanPhase, setScanPhase] = useState('scan');
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState({ name: '', genre: '', year: '' });
  const [removeClones, setRemoveClones] = useState(false);
  const [preferredRegions, setPreferredRegions] = useState<string[]>(['USA']);
  const [userProtectedGames, setUserProtectedGames] = useState<string[]>([]);
  const [newProtectedGame, setNewProtectedGame] = useState('');
  const [showCloneOptions, setShowCloneOptions] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState<'simulation' | 'curation' | null>(null);
  const [validatingGame, setValidatingGame] = useState(false);
  const [gameValidationResult, setGameValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    window.api.scanFolder(folder).then((data) => {
      setScanData(data);
      setScanning(false);
      setScanProgress({ progress: 100, scanned: 0, total: 0, found: 0 });
      const systems = Object.keys(data.grouped);
      const initialExpanded: Record<string, boolean> = {};
      systems.forEach(s => initialExpanded[s] = false);
      setExpandedSystems(initialExpanded);
    });

    window.api.onScanProgress((data) => {
      setScanProgress(prev => ({
        ...prev,
        progress: data.progress ?? prev.progress,
        scanned: data.scanned ?? prev.scanned,
        found: data.found ?? prev.found,
      }));
      setScanPhase(data.phase);
    });

    return () => {
      window.api.removeScanProgressListener();
    };
  }, [folder]);

  useEffect(() => {
    window.api.readProtectedGames().then(setUserProtectedGames);
  }, []);

  const handleValidateProtectedGame = async () => {
    if (!newProtectedGame.trim()) return;
    setValidatingGame(true);
    setGameValidationResult(null);

    const result = await window.api.validateGameName(newProtectedGame.trim());
    setGameValidationResult(result);
    setValidatingGame(false);
  };

  const handleAddProtectedGame = async () => {
    if (!gameValidationResult?.valid) return;
    const updated = await window.api.addProtectedGame(newProtectedGame.trim());
    setUserProtectedGames(updated);
    setNewProtectedGame('');
    setGameValidationResult(null);
  };

  const handleRemoveProtectedGame = async (game: string) => {
    const updated = await window.api.removeProtectedGame(game);
    setUserProtectedGames(updated);
  };

  const toggleRegion = (region: string) => {
    setPreferredRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleSimulate = async () => {
    const existingLog = await window.api.readProgressLog(folder);
    if (existingLog?.type === 'simulation' && !existingLog.complete && !existingLog.cancelled) {
      setShowResumeDialog('simulation');
      return;
    }

    setSimulating(true);
    await window.api.simulateCuration({
      folder,
      minRating,
      action,
    });
    setSimulating(false);
  };

  const handleResumeSimulation = async () => {
    setShowResumeDialog(null);
    setSimulating(true);
    await window.api.simulateCuration({
      folder,
      minRating,
      action,
      resume: true,
    });
    setSimulating(false);
  };

  const handleCancelSimulation = async () => {
    await window.api.cancelSimulation();
  };

  const filteredRoms = useMemo(() => {
    if (!scanData) return {};
    const filtered: Record<string, RomInfo[]> = {};
    for (const [system, roms] of Object.entries(scanData.grouped)) {
      const systemRoms = (roms as RomInfo[]).filter((rom) => {
        const nameMatch = !filters.name || rom.fileName.toLowerCase().includes(filters.name.toLowerCase());
        const genreMatch = !filters.genre || rom.metadata?.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase()));
        const yearMatch = !filters.year || rom.metadata?.year?.toString() === filters.year;
        return nameMatch && genreMatch && yearMatch;
      });
      if (systemRoms.length > 0) {
        filtered[system] = systemRoms;
      }
    }
    return filtered;
  }, [scanData, filters]);

  const availableYears = useMemo(() => {
    if (!scanData) return [];
    const years = new Set<number>();
    for (const roms of Object.values(scanData.grouped)) {
      for (const rom of roms as RomInfo[]) {
        if (rom.metadata?.year) {
          years.add(rom.metadata.year);
        }
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [scanData]);

  const totalRoms = Object.values(filteredRoms).reduce((sum, roms) => sum + roms.length, 0);
  const totalSize = Object.values(filteredRoms).reduce((sum, roms) => sum + roms.reduce((s, r) => s + r.size, 0), 0);

  const toggleSystem = (system: string) => {
    setExpandedSystems(prev => ({ ...prev, [system]: !prev[system] }));
  };

  const getProtectionBadge = (rom: RomInfo) => {
    if (rom.protectionStatus.isClassic) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-400">
          <Shield className="w-3 h-3" />
          Clássico
        </span>
      );
    }
    if (rom.protectionStatus.isGenreProtected) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400">
          <Shield className="w-3 h-3" />
          Gênero
        </span>
      );
    }
    if (rom.protectionStatus.isUserProtected) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs text-teal-400">
          <Shield className="w-3 h-3" />
          Protegido
        </span>
      );
    }
    return null;
  };

  const handleStart = async () => {
    const existingLog = await window.api.readProgressLog(folder);
    if (existingLog?.type === 'curation' && !existingLog.complete && !existingLog.cancelled) {
      setShowResumeDialog('curation');
      return;
    }
    onStartCuration({
      folder,
      minRating,
      action,
      removeClones,
      preferredRegions,
      protectedGames: userProtectedGames,
    });
  };

  const handleResumeCuration = () => {
    setShowResumeDialog(null);
    onStartCuration({
      folder,
      minRating,
      action,
      removeClones,
      preferredRegions,
      protectedGames: userProtectedGames,
      resume: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Pré-visualização da Curadoria</h2>
            <p className="text-xs text-zinc-500 mt-1">{folder}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Diálogo de Retomada */}
          <AnimatePresence>
            {showResumeDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass rounded-2xl p-8 max-w-md mx-4 text-center space-y-4"
                >
                  <AlertTriangle className="w-12 h-12 text-retro-warning mx-auto" />
                  <h3 className="text-lg font-bold text-zinc-100">Processamento Anterior Encontrado</h3>
                  <p className="text-sm text-zinc-400">
                    {showResumeDialog === 'simulation'
                      ? 'Há uma simulação de curadoria incompleta. Deseja retomar de onde parou?'
                      : 'Há uma curadoria incompleta. Deseja retomar de onde parou?'}
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => setShowResumeDialog(null)}
                      className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
                    >
                      Começar do Início
                    </button>
                    <button
                      onClick={showResumeDialog === 'simulation' ? handleResumeSimulation : handleResumeCuration}
                      className="flex items-center gap-2 px-6 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4" />
                      Retomar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {scanning ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-6">
              <div className="relative w-16 h-16">
                <Loader2 className="w-16 h-16 text-retro-primary animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-zinc-400">
                  {scanPhase === 'scan' ? 'Escaneando arquivos...' : 'Consultando APIs...'}
                </p>
                <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress.progress}%` }}
                    className="h-full bg-gradient-to-r from-retro-primary to-retro-primary/60 rounded-full"
                  />
                </div>
                <p className="text-xs text-zinc-600">{scanProgress.scanned} arquivos verificados · {scanProgress.found} ROMs encontradas</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Resumo de Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-retro-primary">{totalRoms}</p>
                  <p className="text-xs text-zinc-500">ROMs Encontradas</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-retro-success">{formatBytes(totalSize)}</p>
                  <p className="text-xs text-zinc-500">Tamanho Total</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-400">{Object.keys(filteredRoms).length}</p>
                  <p className="text-xs text-zinc-500">Sistemas</p>
                </div>
              </div>

              {/* Filtros */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrar por nome..."
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrar por gênero..."
                      value={filters.genre}
                      onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Todos os anos</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Lista de ROMs por Sistema */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  ROMs por Sistema
                </h3>
                <div className="space-y-2">
                  {Object.entries(filteredRoms).map(([system, roms]) => {
                    const logo = getSystemLogo(undefined, system);
                    return (
                      <div key={system} className="bg-zinc-800/20 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSystem(system)}
                          className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSystems[system] ? (
                              <ChevronUp className="w-5 h-5 text-zinc-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-zinc-400" />
                            )}
                            {logo && (
                              <img
                                src={`system/logos/${logo}`}
                                alt={system}
                                className="w-6 h-6 object-contain"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            )}
                            <span className="text-sm font-medium text-zinc-200">{system}</span>
                            <span className="text-xs text-zinc-500">({(roms as RomInfo[]).length})</span>
                          </div>
                          <span className="text-xs text-zinc-500">
                            {formatBytes((roms as RomInfo[]).reduce((s, r) => s + r.size, 0))}
                          </span>
                        </button>

                      <AnimatePresence>
                        {expandedSystems[system] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-zinc-800/50 divide-y divide-zinc-800/30 max-h-64 overflow-y-auto scrollbar-thin">
                              {(roms as RomInfo[]).map((rom, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 hover:bg-zinc-800/20 transition-colors">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-zinc-200 truncate">{rom.fileName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {rom.metadata?.year && (
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {rom.metadata.year}
                                        </span>
                                      )}
                                      {rom.metadata?.rating && (
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                          <Star className="w-3 h-3" />
                                          {rom.metadata.rating.toFixed(0)}
                                        </span>
                                      )}
                                      {rom.regionTags.length > 0 && (
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                          <Globe className="w-3 h-3" />
                                          {rom.regionTags.join(', ')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getProtectionBadge(rom)}
                                    <span className="text-xs text-zinc-600">{formatBytes(rom.size)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                  })}
                </div>
              </div>

              {/* Detecção de Clones */}
              {scanData?.cloneGroups?.length > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCloneOptions(!showCloneOptions)}
                    className="w-full flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Copy className="w-5 h-5 text-retro-warning" />
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-zinc-200">Detecção de Clones/Duplicados</h3>
                        <p className="text-xs text-zinc-500">{scanData.cloneGroups.length} grupos encontrados</p>
                      </div>
                    </div>
                    {showCloneOptions ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                  </button>

                  <AnimatePresence>
                    {showCloneOptions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-zinc-800/20 rounded-xl p-4 space-y-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="removeClones"
                              checked={removeClones}
                              onChange={(e) => setRemoveClones(e.target.checked)}
                              className="w-4 h-4 rounded border-zinc-600 text-retro-primary focus:ring-retro-primary bg-zinc-700"
                            />
                            <label htmlFor="removeClones" className="text-sm text-zinc-300">
                              Remover automaticamente versões duplicadas/regiões diferentes
                            </label>
                          </div>

                          {removeClones && (
                            <div className="pl-7 space-y-2">
                              <p className="text-xs text-zinc-500">Regiões preferidas para manter (selecione uma ou mais):</p>
                              <div className="flex flex-wrap gap-2">
                                {ALL_REGIONS.map(region => (
                                  <button
                                    key={region}
                                    onClick={() => toggleRegion(region)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                                      preferredRegions.includes(region)
                                        ? 'bg-retro-primary/20 text-retro-primary border border-retro-primary/30'
                                        : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30 hover:text-zinc-200'
                                    }`}
                                  >
                                    {preferredRegions.includes(region) && <CheckCircle2 className="w-3 h-3" />}
                                    {region}
                                  </button>
                                ))}
                              </div>
                              {preferredRegions.length === 0 && (
                                <p className="text-xs text-retro-danger">Selecione ao menos uma região.</p>
                              )}
                            </div>
                          )}

                          <div className="max-h-40 overflow-y-auto space-y-2 scrollbar-thin">
                            {scanData.cloneGroups.slice(0, 10).map((group: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 p-2 bg-zinc-800/30 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-retro-warning flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-zinc-300 truncate">{group.baseName}</p>
                                  <p className="text-xs text-zinc-500">{group.roms.length} variantes</p>
                                </div>
                                {preferredRegions.length > 0 && (
                                  <span className="text-xs text-retro-success flex-shrink-0">Manter: {preferredRegions.join(', ')}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Jogos Protegidos pelo Usuário */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-400" />
                  Jogos Protegidos ({userProtectedGames.length})
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nome do jogo (será validado)..."
                    value={newProtectedGame}
                    onChange={(e) => { setNewProtectedGame(e.target.value); setGameValidationResult(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateProtectedGame()}
                    className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-400/50 transition-colors placeholder:text-zinc-600"
                  />
                  <button
                    onClick={handleValidateProtectedGame}
                    disabled={validatingGame || !newProtectedGame.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {validatingGame ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Validar
                  </button>
                </div>

                <AnimatePresence>
                  {gameValidationResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                        gameValidationResult.valid
                          ? 'bg-retro-success/10 text-retro-success border border-retro-success/20'
                          : 'bg-retro-danger/10 text-retro-danger border border-retro-danger/20'
                      }`}
                    >
                      {gameValidationResult.valid ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                      <span>{gameValidationResult.message}</span>
                      {gameValidationResult.valid && (
                        <button
                          onClick={handleAddProtectedGame}
                          className="ml-auto px-3 py-1 rounded-lg bg-retro-success/20 hover:bg-retro-success/30 text-xs font-medium transition-colors"
                        >
                          Adicionar
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-thin">
                  {userProtectedGames.map((game) => (
                    <span
                      key={game}
                      className="group flex items-center gap-1 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs text-teal-400"
                    >
                      {game}
                      <button
                        onClick={() => handleRemoveProtectedGame(game)}
                        className="ml-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-retro-danger/20 hover:text-retro-danger transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-zinc-800/50 space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                Clássico
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                Gênero
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Protegido
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              {simulating ? (
                <button
                  onClick={handleCancelSimulation}
                  className="flex items-center gap-2 px-6 py-2.5 bg-retro-danger/10 text-retro-danger border border-retro-danger/30 rounded-xl font-medium hover:bg-retro-danger/20 transition-all active:scale-95"
                >
                  <Square className="w-4 h-4" />
                  Cancelar Simulação
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSimulate}
                    disabled={simulating || scanning}
                    className="flex items-center gap-2 px-6 py-2.5 bg-zinc-700/50 text-zinc-300 border border-zinc-600/30 rounded-xl font-medium hover:bg-zinc-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {simulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Simular Curadoria
                  </button>
                  <button
                    onClick={handleStart}
                    disabled={scanning}
                    className="flex items-center gap-2 px-6 py-2.5 bg-retro-success/10 text-retro-success border border-retro-success/30 rounded-xl font-medium hover:bg-retro-success/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    Iniciar Curadoria
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
