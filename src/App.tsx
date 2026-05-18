import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Settings,
  BarChart3,
  Loader2,
  Gamepad2,
  History,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  LifeBuoy,
  Info,
  Coffee,
  Search,
} from 'lucide-react';
import { ProgressCard } from './components/ProgressCard';
import { StatCard } from './components/StatCard';
import { ActivityLog } from './components/ActivityLog';
import { SettingsModal } from './components/SettingsModal';
import { StatsHistory } from './components/StatsHistory';
import { SupportModal } from './components/SupportModal';
import { AboutModal } from './components/AboutModal';
import { WelcomeModal } from './components/WelcomeModal';
import { SplashScreen } from './components/SplashScreen';
import { SpaceSavingsCard } from './components/SpaceSavingsCard';
import { ScanPreviewModal } from './components/ScanPreviewModal';
import { Toast } from './components/Toast';
import { TitleBar } from './components/TitleBar';
import RetroGradeLogo from '../assets/images/RetroGrade.png';

interface CurationState {
  isRunning: boolean;
  folder: string | null;
  minRating: number;
  action: 'move' | 'delete';
  total: number;
  current: number;
  classics: number;
  kept: number;
  removed: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: 'classic' | 'kept' | 'removed' | null;
  log: { fileName: string; status: string; rating: number | null; system: string; genres?: string[] }[];
}

function App() {
  const [state, setState] = useState<CurationState>({
    isRunning: false,
    folder: null,
    minRating: 60,
    action: 'move',
    total: 0,
    current: 0,
    classics: 0,
    kept: 0,
    removed: 0,
    currentFile: '',
    currentSystem: '',
    currentRating: null,
    currentStatus: null,
    log: [],
  });

  const [bytesSaved, setBytesSaved] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showScanPreview, setShowScanPreview] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasConfig, setHasConfig] = useState(false);
  const [systems, setSystems] = useState<Record<string, any>>({});
  const [classics, setClassics] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [protectedGames, setProtectedGames] = useState<string[]>([]);
  const [version, setVersion] = useState('0.0.0');
  const [apiConnected, setApiConnected] = useState(false);
  const [configChecked, setConfigChecked] = useState(false);
  const logRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.readSystems().then(setSystems);
    window.api.readClassics().then(setClassics);
    window.api.readGenres().then(setGenres);
    window.api.readProtectedGames().then(setProtectedGames);
    window.api.readVersion().then(setVersion);
    window.api.readConfig().then((config) => {
      setConfigChecked(true);
      const hasAnyConfig = config && (config.IGDB_CLIENT_ID || config.TGDB_API_KEY);
      setHasConfig(!!hasAnyConfig);
      if (config) {
        setState((prev) => ({
          ...prev,
          minRating: config.minRating ?? 60,
          action: config.action ?? 'move',
        }));
      }
      if (!hasAnyConfig || !apiConnected) {
        setShowWelcome(true);
      }
    });
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.log]);

  const handleSelectFolder = useCallback(async () => {
    const folder = await window.api.selectFolder();
    if (folder) {
      setState((prev) => ({ ...prev, folder, log: [], current: 0, classics: 0, kept: 0, removed: 0, total: 0 }));
      setBytesSaved(0);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSimulateCuration = useCallback(async () => {
    if (!state.folder) return;
    setShowScanPreview(true);
  }, [state.folder]);

  const handleStartCuration = useCallback(async () => {
    if (!state.folder) return;
    setShowScanPreview(true);
  }, [state.folder]);

  const handleExecuteCuration = useCallback(async (options: {
    folder: string;
    minRating: number;
    action: 'move' | 'delete';
    removeClones: boolean;
    preferredRegions: string[];
    protectedGames: string[];
  }) => {
    setShowScanPreview(false);
    setState((prev) => ({
      ...prev,
      isRunning: true,
      log: [],
      current: 0,
      classics: 0,
      kept: 0,
      removed: 0,
    }));
    setBytesSaved(0);

    window.api.onCurationProgress((data) => {
      if (data.type === 'init') {
        setState((prev) => ({ ...prev, total: data.total }));
      } else if (data.type === 'file') {
        setState((prev) => ({
          ...prev,
          current: data.index + 1,
          currentFile: data.fileName,
          currentSystem: data.system,
          currentRating: data.rating,
          currentStatus: data.status,
          classics: data.status === 'classic' ? prev.classics + 1 : prev.classics,
          kept: data.status === 'kept' ? prev.kept + 1 : prev.kept,
          removed: data.status === 'removed' ? prev.removed + 1 : prev.removed,
          log: [
            ...prev.log.slice(-99),
            { fileName: data.fileName, status: data.status, rating: data.rating, system: data.system, genres: data.genres },
          ],
        }));
      } else if (data.type === 'complete') {
        setState((prev) => ({ ...prev, isRunning: false }));
        setBytesSaved(data.stats?.bytes_removed || 0);
        window.api.removeCurationProgressListener();
      }
    });

    await window.api.startCuration({
      folder: options.folder,
      minRating: options.minRating,
      action: options.action,
    });
  }, []);

  const progress = state.total > 0 ? (state.current / state.total) * 100 : 0;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <TitleBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 glass border-r border-zinc-800/50 flex flex-col">
          <div className="p-6 border-b border-zinc-800/50">
            <div className="flex flex-col items-center gap-2">
              <img src={RetroGradeLogo} alt="RetroGrade" className="w-48 h-auto" />
              <p className="text-xs text-zinc-500 font-mono">v{version}</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={handleSelectFolder}
              disabled={state.isRunning}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       bg-retro-primary/10 text-retro-primary border border-retro-primary/20
                       hover:bg-retro-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Selecionar Pasta</span>
            </button>

            {state.folder && (
              <div className="px-4 pb-2">
                <div className="glass rounded-xl p-3">
                  <p className="text-xs text-zinc-500 mb-1">Pasta selecionada</p>
                  <p className="text-sm text-zinc-300 truncate font-mono">{state.folder}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleSimulateCuration}
              disabled={state.isRunning || !state.folder || !apiConnected}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       bg-zinc-700/30 text-zinc-300 border border-zinc-600/30
                       hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
              <span className="font-medium text-sm">Simular Curadoria</span>
            </button>

            <button
              onClick={handleStartCuration}
              disabled={state.isRunning || !state.folder || !apiConnected}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       bg-retro-success/10 text-retro-success border border-retro-success/20
                       hover:bg-retro-success/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isRunning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <BarChart3 className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">
                {state.isRunning ? 'Processando...' : !apiConnected ? 'APIs desconectadas' : 'Iniciar Curadoria'}
              </span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configurações</span>
            </button>

            <button
              onClick={() => setShowHistory(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            >
              <History className="w-5 h-5" />
              <span className="font-medium">Histórico</span>
            </button>

            <button
              onClick={() => setShowSupport(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            >
              <LifeBuoy className="w-5 h-5" />
              <span className="font-medium">Suporte</span>
            </button>

            <button
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                       text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">Sobre</span>
            </button>
          </nav>

          <div className="p-4 border-t border-zinc-800/50">
            <a
              href="https://www.buymeacoffee.com/retrograde"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-left transition-all duration-200
                       bg-yellow-500/10 text-yellow-400 border border-yellow-500/20
                       hover:bg-yellow-500/20 hover:border-yellow-500/40"
            >
              <Coffee className="w-5 h-5" />
              <span className="font-medium text-sm">Buy me a coffee</span>
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Encontrado"
                value={state.total}
                icon={Gamepad2}
                color="retro-primary"
              />
              <StatCard
                label="Clássicos Preservados"
                value={state.classics}
                icon={ShieldCheck}
                color="retro-secondary"
              />
              <StatCard
                label="Mantidos por Nota"
                value={state.kept}
                icon={CheckCircle2}
                color="retro-success"
              />
              <StatCard
                label="Removidos"
                value={state.removed}
                icon={XCircle}
                color="retro-danger"
              />
            </div>

            {/* Space Savings Card */}
            {bytesSaved > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <SpaceSavingsCard
                  bytesSaved={bytesSaved}
                  action={state.action}
                  onDeleteRemoved={async () => {
                    if (state.folder) {
                      await window.api.deleteRemovedFolder(state.folder);
                      setBytesSaved(0);
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Progress Section */}
            {state.isRunning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <ProgressCard
                  progress={progress}
                  currentFile={state.currentFile}
                  currentSystem={state.currentSystem}
                  currentRating={state.currentRating}
                  currentStatus={state.currentStatus}
                />
              </motion.div>
            )}

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ActivityLog log={state.log} logRef={logRef} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            minRating={state.minRating}
            action={state.action}
            systems={systems}
            classics={classics}
            genres={genres}
            protectedGames={protectedGames}
            onApiTested={(connected) => {
              setApiConnected(connected);
              if (connected) setShowWelcome(false);
            }}
            onClassicsUpdated={setClassics}
            onGenresUpdated={setGenres}
            onProtectedGamesUpdated={setProtectedGames}
            onSave={(minRating, action) => {
              setState((prev) => ({ ...prev, minRating, action }));
              setShowSettings(false);
            }}
            onToast={showToast}
          />
        )}
        {showScanPreview && state.folder && (
          <ScanPreviewModal
            folder={state.folder}
            minRating={state.minRating}
            action={state.action}
            onClose={() => setShowScanPreview(false)}
            onStartCuration={handleExecuteCuration}
          />
        )}
        {showHistory && <StatsHistory onClose={() => setShowHistory(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} version={version} />}
        {showWelcome && configChecked && (
          <WelcomeModal
            onClose={() => setShowWelcome(false)}
            onOpenSettings={() => setShowSettings(true)}
            hasConfig={hasConfig}
          />
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
