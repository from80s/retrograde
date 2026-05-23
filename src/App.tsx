import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Archive,
  Scan,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { SettingsModal } from "./components/SettingsModal";
import { StatsHistory } from "./components/StatsHistory";
import { SupportModal } from "./components/SupportModal";
import { AboutModal } from "./components/AboutModal";
import { WelcomeModal } from "./components/WelcomeModal";
import { SplashScreen } from "./components/SplashScreen";
import { SpaceSavingsCard } from "./components/SpaceSavingsCard";
import { CurationModal } from "./components/CurationModal";
import { ScanPreviewModal } from "./components/ScanPreviewModal";
import { ExtractorModal } from "./components/ExtractorModal";
import { OrphanFilesModal } from "./components/OrphanFilesModal";
import { SupportedSystems } from "./components/SupportedSystems";
import { TgdbAssetsModal } from "./components/TgdbAssetsModal";
import { Toast } from "./components/Toast";
import { TitleBar } from "./components/TitleBar";
import RetroGradeLogo from "../assets/images/RetroGrade.png";

interface CurationState {
  isRunning: boolean;
  folder: string | null;
  minRating: number;
  action: "move" | "delete";
  total: number;
  current: number;
  classics: number;
  kept: number;
  removed: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: "classic" | "kept" | "removed" | null;
  cancelled: boolean;
  log: {
    fileName: string;
    status: string;
    rating: number | null;
    system: string;
    genres?: string[];
  }[];
}

function App() {
  const [state, setState] = useState<CurationState>({
    isRunning: false,
    folder: null,
    minRating: 60,
    action: "move",
    total: 0,
    current: 0,
    classics: 0,
    kept: 0,
    removed: 0,
    currentFile: "",
    currentSystem: "",
    currentRating: null,
    currentStatus: null,
    cancelled: false,
    log: [],
  });

  const [bytesSaved, setBytesSaved] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHoverExpanded, setSidebarHoverExpanded] = useState(false);

  const isSidebarExpanded = sidebarCollapsed ? sidebarHoverExpanded : true;
  const sidebarWidth = isSidebarExpanded ? 288 : 64;

  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSplash, setShowSplash] = useState(!import.meta.env.DEV);
  const [showScanPreview, setShowScanPreview] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const [showOrphanFiles, setShowOrphanFiles] = useState(false);
  const [showTgdbAssets, setShowTgdbAssets] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [hasConfig, setHasConfig] = useState(false);
  const [classics, setClassics] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [protectedGames, setProtectedGames] = useState<string[]>([]);
  const [version, setVersion] = useState("0.0.0");
  const [apiConnected, setApiConnected] = useState(false);
  const [configChecked, setConfigChecked] = useState(false);
  const logRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.readClassics().then(setClassics);
    window.api.readGenres().then(setGenres);
    window.api.readProtectedGames().then(setProtectedGames);
    window.api.readVersion().then(setVersion);
    window.api.readConfig().then((config) => {
      setConfigChecked(true);
      const hasAnyConfig =
        config && (config.IGDB_CLIENT_ID || config.TGDB_API_KEY);
      setHasConfig(!!hasAnyConfig);
      if (config) {
        setState((prev) => ({
          ...prev,
          minRating: config.minRating ?? 60,
          action: config.action ?? "move",
        }));
        if (config.api_tested) {
          setApiConnected(true);
        }
      }
      if (!hasAnyConfig || !config?.api_tested) {
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
      setState((prev) => ({
        ...prev,
        folder,
        log: [],
        current: 0,
        classics: 0,
        kept: 0,
        removed: 0,
        total: 0,
      }));
      setBytesSaved(0);
    }
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
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

  const handleExecuteCuration = useCallback(
    async (options: {
      folder: string;
      minRating: number;
      action: "move" | "delete";
      removeClones: boolean;
      preferredRegions: string[];
      protectedGames: string[];
      resume?: boolean;
    }) => {
      setShowScanPreview(false);
      setState((prev) => ({
        ...prev,
        isRunning: true,
        cancelled: false,
        log: [],
        current: 0,
        classics: 0,
        kept: 0,
        removed: 0,
      }));
      setBytesSaved(0);

      window.api.onCurationProgress((data) => {
        if (data.type === "init") {
          setState((prev) => ({ ...prev, total: data.total }));
        } else if (data.type === "file") {
          setState((prev) => ({
            ...prev,
            current: data.index + 1,
            currentFile: data.fileName,
            currentSystem: data.system,
            currentRating: data.rating,
            currentStatus: data.status,
            classics:
              data.status === "classic" ? prev.classics + 1 : prev.classics,
            kept: data.status === "kept" ? prev.kept + 1 : prev.kept,
            removed:
              data.status === "removed" ? prev.removed + 1 : prev.removed,
            log: [
              ...prev.log.slice(-99),
              {
                fileName: data.fileName,
                status: data.status,
                rating: data.rating,
                system: data.system,
                genres: data.genres,
              },
            ],
          }));
        } else if (data.type === "cancelled") {
          setState((prev) => ({ ...prev, cancelled: true, isRunning: false }));
          window.api.removeCurationProgressListener();
        } else if (data.type === "complete") {
          setState((prev) => ({ ...prev, isRunning: false }));
          setBytesSaved(data.stats?.bytes_removed || 0);
          window.api.removeCurationProgressListener();
        }
      });

      await window.api.startCuration({
        folder: options.folder,
        minRating: options.minRating,
        action: options.action,
        resume: options.resume,
      });
    },
    [],
  );

  const progress = state.total > 0 ? (state.current / state.total) * 100 : 0;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <TitleBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="glass border-r border-zinc-800/50 flex flex-col overflow-hidden relative"
          style={{ minWidth: sidebarWidth }}
          onMouseEnter={() => sidebarCollapsed && setSidebarHoverExpanded(true)}
          onMouseLeave={() =>
            sidebarCollapsed && setSidebarHoverExpanded(false)
          }
        >
          {/* Logo Header */}
          <div
            className={`border-b border-zinc-800/50 flex flex-col items-center ${isSidebarExpanded ? "p-5 gap-2" : "p-2 gap-0.5"}`}
          >
            <img
              src={RetroGradeLogo}
              alt="RetroGrade"
              className={`${isSidebarExpanded ? "h-20" : "h-8"} w-auto`}
            />
            {isSidebarExpanded && (
              <p className="text-[10px] text-zinc-500 font-mono">v{version}</p>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              setSidebarHoverExpanded(false);
            }}
            className="absolute top-0 right-0 w-6 h-10 bg-zinc-800 border border-zinc-700/50 rounded-l-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors z-20"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
            {!apiConnected && isSidebarExpanded && (
              <div className="p-3 bg-retro-warning/5 border border-retro-warning/20 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-retro-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-retro-warning font-medium">
                    APIs desconectadas
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Configure as credenciais em Configurações para habilitar a
                    curadoria.
                  </p>
                </div>
              </div>
            )}

            {/* Main Action Buttons */}
            <button
              onClick={handleSelectFolder}
              disabled={state.isRunning}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-retro-primary/10 text-retro-primary border border-retro-primary/20
                       hover:bg-retro-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={!isSidebarExpanded ? "Selecionar Pasta" : undefined}
            >
              <FolderOpen
                className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Selecionar Pasta</span>
              )}
            </button>

            {state.folder && isSidebarExpanded && (
              <div className="px-1 pb-1">
                <div className="glass rounded-lg p-2">
                  <p className="text-[10px] text-zinc-500 mb-0.5">
                    Pasta selecionada
                  </p>
                  <p className="text-xs text-zinc-300 truncate font-mono">
                    {state.folder}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleSimulateCuration}
              disabled={state.isRunning || !state.folder || !apiConnected}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-zinc-700/30 text-zinc-300 border border-zinc-600/30
                       hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={!isSidebarExpanded ? "Simular Curadoria" : undefined}
            >
              <Search
                className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Simular Curadoria</span>
              )}
            </button>

            <button
              onClick={handleStartCuration}
              disabled={state.isRunning || !state.folder || !apiConnected}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-retro-success/10 text-retro-success border border-retro-success/20
                       hover:bg-retro-success/20 disabled:opacity-50 disabled:cursor-not-allowed ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={
                !isSidebarExpanded
                  ? state.isRunning
                    ? "Processando..."
                    : !apiConnected
                      ? "APIs desconectadas"
                      : "Iniciar Curadoria"
                  : undefined
              }
            >
              {state.isRunning ? (
                <Loader2
                  className={`flex-shrink-0 animate-spin ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
              ) : (
                <BarChart3
                  className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
              )}
              {isSidebarExpanded && (
                <span className="font-medium text-sm">
                  {state.isRunning
                    ? "Processando..."
                    : !apiConnected
                      ? "APIs desconectadas"
                      : "Iniciar Curadoria"}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowTgdbAssets(true)}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-zinc-700/30 text-zinc-300 border border-zinc-600/30
                       hover:bg-zinc-700/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={!isSidebarExpanded ? "Mídias" : undefined}
            >
              <Download
                className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Mídias</span>
              )}
            </button>

            <button
              onClick={() => setShowOrphanFiles(true)}
              disabled={!state.folder}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-zinc-700/30 text-zinc-300 border border-zinc-600/30
                       hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={!isSidebarExpanded ? "Arquivos Órfãos" : undefined}
            >
              <Scan
                className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Arquivos Órfãos</span>
              )}
            </button>

            <button
              onClick={() => setShowExtractor(true)}
              className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                       bg-zinc-700/30 text-zinc-300 border border-zinc-600/30
                       hover:bg-zinc-700/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
              title={!isSidebarExpanded ? "Extrator de ROMs" : undefined}
            >
              <Archive
                className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Extrator de ROMs</span>
              )}
            </button>

            {/* Secondary Actions */}
            <div
              className={`pt-2 border-t border-zinc-800/30 space-y-1 ${!isSidebarExpanded ? "flex flex-col items-center gap-1" : ""}`}
            >
              <button
                onClick={() => setShowSettings(true)}
                className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                         text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
                title={!isSidebarExpanded ? "Configurações" : undefined}
              >
                <Settings
                  className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {isSidebarExpanded && (
                  <span className="font-medium text-sm">Configurações</span>
                )}
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                         text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
                title={!isSidebarExpanded ? "Histórico" : undefined}
              >
                <History
                  className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {isSidebarExpanded && (
                  <span className="font-medium text-sm">Histórico</span>
                )}
              </button>

              <button
                onClick={() => setShowSupport(true)}
                className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                         text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
                title={!isSidebarExpanded ? "Suporte" : undefined}
              >
                <LifeBuoy
                  className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {isSidebarExpanded && (
                  <span className="font-medium text-sm">Suporte</span>
                )}
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className={`w-full flex items-center gap-3 rounded-xl text-left transition-all duration-200
                         text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 ${isSidebarExpanded ? "px-3 py-2.5" : "px-2 py-2 justify-center"}`}
                title={!isSidebarExpanded ? "Sobre" : undefined}
              >
                <Info
                  className={`flex-shrink-0 ${isSidebarExpanded ? "w-4 h-4" : "w-5 h-5"}`}
                />
                {isSidebarExpanded && (
                  <span className="font-medium text-sm">Sobre</span>
                )}
              </button>
            </div>
          </nav>

          {/* Buy me a coffee - Bottom of sidebar */}
          <div
            className={`border-t border-zinc-800/30 ${isSidebarExpanded ? "p-3" : "p-2 flex justify-center"}`}
          >
            <a
              href="https://www.buymeacoffee.com/retrograde"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl transition-all duration-200
                       bg-yellow-500/10 text-yellow-400 border border-yellow-500/20
                       hover:bg-yellow-500/20 hover:border-yellow-500/40 ${isSidebarExpanded ? "px-3 py-2" : "px-2 py-1.5 justify-center"}`}
              title={!isSidebarExpanded ? "Buy me a coffee" : undefined}
            >
              <Coffee
                className={isSidebarExpanded ? "w-3.5 h-3.5" : "w-4 h-4"}
              />
              {isSidebarExpanded && (
                <span className="font-medium text-xs">Buy me a coffee</span>
              )}
            </a>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-8 max-w-6xl mx-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
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

              {/* Supported Systems */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <SupportedSystems />
              </motion.div>
            </div>
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
        {state.isRunning && (
          <CurationModal
            onClose={() => setState(prev => ({ ...prev, isRunning: false, cancelled: false }))}
            onCancel={async () => {
              await window.api.cancelCuration();
            }}
            cancelled={state.cancelled}
            progress={progress}
            currentFile={state.currentFile}
            currentSystem={state.currentSystem}
            currentRating={state.currentRating}
            currentStatus={state.currentStatus}
            classics={state.classics}
            kept={state.kept}
            removed={state.removed}
            total={state.total}
            current={state.current}
            log={state.log}
          />
        )}
        {showExtractor && (
          <ExtractorModal
            onClose={() => setShowExtractor(false)}
            onToast={showToast}
          />
        )}
        {showOrphanFiles && state.folder && (
          <OrphanFilesModal
            onClose={() => setShowOrphanFiles(false)}
            folder={state.folder}
            onToast={showToast}
          />
        )}
        {showTgdbAssets && (
          <TgdbAssetsModal
            onClose={() => setShowTgdbAssets(false)}
            onToast={showToast}
          />
        )}
        {showHistory && <StatsHistory onClose={() => setShowHistory(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
        {showAbout && (
          <AboutModal onClose={() => setShowAbout(false)} version={version} />
        )}
        {showWelcome && configChecked && (
          <WelcomeModal
            onClose={() => setShowWelcome(false)}
            onOpenSettings={() => setShowSettings(true)}
            hasConfig={hasConfig}
          />
        )}
      </AnimatePresence>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
