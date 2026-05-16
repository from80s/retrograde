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
} from 'lucide-react';
import { ProgressCard } from './components/ProgressCard';
import { StatCard } from './components/StatCard';
import { ActivityLog } from './components/ActivityLog';
import { SettingsModal } from './components/SettingsModal';
import { StatsHistory } from './components/StatsHistory';
import { SupportModal } from './components/SupportModal';
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
  log: { fileName: string; status: string; rating: number | null; system: string }[];
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

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [systems, setSystems] = useState<Record<string, any>>({});
  const [classics, setClassics] = useState<string[]>([]);
  const [version, setVersion] = useState('0.0.0');
  const [apiConnected, setApiConnected] = useState(false);
  const logRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.readSystems().then(setSystems);
    window.api.readClassics().then(setClassics);
    window.api.readVersion().then(setVersion);
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
    }
  }, []);

  const handleStartCuration = useCallback(async () => {
    if (!state.folder) return;

    setState((prev) => ({
      ...prev,
      isRunning: true,
      log: [],
      current: 0,
      classics: 0,
      kept: 0,
      removed: 0,
    }));

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
            { fileName: data.fileName, status: data.status, rating: data.rating, system: data.system },
          ],
        }));
      } else if (data.type === 'complete') {
        setState((prev) => ({ ...prev, isRunning: false }));
        window.api.removeCurationProgressListener();
      }
    });

    await window.api.startCuration({
      folder: state.folder,
      minRating: state.minRating,
      action: state.action,
    });
  }, [state.folder, state.minRating, state.action]);

  const progress = state.total > 0 ? (state.current / state.total) * 100 : 0;

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
          </nav>

          {state.folder && (
            <div className="p-4 border-t border-zinc-800/50">
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-zinc-500 mb-1">Pasta selecionada</p>
                <p className="text-sm text-zinc-300 truncate font-mono">{state.folder}</p>
              </div>
            </div>
          )}
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
            onApiTested={setApiConnected}
            onClassicsUpdated={setClassics}
            onSave={(minRating, action) => {
              setState((prev) => ({ ...prev, minRating, action }));
              setShowSettings(false);
            }}
          />
        )}
        {showHistory && <StatsHistory onClose={() => setShowHistory(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
