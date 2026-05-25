import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, ShieldCheck, CheckCircle2, XCircle, Star } from 'lucide-react';
import { getSystemLogo } from '../lib/system-logos';

interface LogEntry {
  fileName: string;
  status: string;
  rating: number | null;
  system: string;
  genres?: string[];
}

interface CurationModalProps {
  onClose: () => void;
  onCancel?: () => void;
  progress: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: 'classic' | 'kept' | 'removed' | null;
  classics: number;
  kept: number;
  removed: number;
  total: number;
  current: number;
  log: LogEntry[];
  cancelled?: boolean;
}

const statusIcons = {
  classic: ShieldCheck,
  kept: CheckCircle2,
  removed: XCircle,
};

const statusColors = {
  classic: 'text-retro-secondary',
  kept: 'text-retro-success',
  removed: 'text-retro-danger',
};

export function CurationModal({
  onClose,
  onCancel,
  progress,
  currentFile,
  currentSystem,
  currentRating,
  currentStatus,
  classics,
  kept,
  removed,
  total,
  current,
  log,
  cancelled,
}: CurationModalProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

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
        className="glass rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {cancelled ? (
              <XCircle className="w-5 h-5 text-retro-danger" />
            ) : (
              <Loader2 className="w-5 h-5 text-retro-primary animate-spin" />
            )}
            <div>
              <h3 className="text-lg font-bold text-zinc-100">{cancelled ? 'Curadoria Cancelada' : 'Curadoria em Andamento'}</h3>
              <p className="text-xs text-zinc-500">
                {cancelled ? 'Processamento interrompido' : `Processando ${current} de ${total} ROMs`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!cancelled && onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-retro-danger/10 text-retro-danger border border-retro-danger/30 text-sm font-medium hover:bg-retro-danger/20 transition-all active:scale-95"
              >
                <XCircle className="w-4 h-4" />
                Cancelar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-zinc-800/50 space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2">
              <div
                className="bg-retro-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-600">
              <span>{current} processados</span>
              <span>{total - current} restantes</span>
            </div>
          </div>

          {/* Current file */}
          {currentFile && (
            <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl">
              {currentStatus && (() => {
                const Icon = statusIcons[currentStatus];
                const color = statusColors[currentStatus];
                return <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />;
              })()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-zinc-300 truncate">{currentFile}</p>
                <p className="text-xs text-zinc-500">{currentSystem}</p>
              </div>
              {currentRating !== null && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 text-retro-warning" />
                  <span className="text-xs font-mono text-retro-warning">{currentRating.toFixed(0)}</span>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-retro-secondary/10 border border-retro-secondary/20 rounded-xl text-center">
              <p className="text-lg font-bold text-retro-secondary">{classics}</p>
              <p className="text-xs text-zinc-500">Clássicos</p>
            </div>
            <div className="p-3 bg-retro-success/10 border border-retro-success/20 rounded-xl text-center">
              <p className="text-lg font-bold text-retro-success">{kept}</p>
              <p className="text-xs text-zinc-500">Mantidos</p>
            </div>
            <div className="p-3 bg-retro-danger/10 border border-retro-danger/20 rounded-xl text-center">
              <p className="text-lg font-bold text-retro-danger">{removed}</p>
              <p className="text-xs text-zinc-500">Removidos</p>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between flex-shrink-0">
            <h4 className="text-sm font-semibold text-zinc-300">Log de Atividades</h4>
            <span className="text-xs text-zinc-500 font-mono">{log.length} entradas</span>
          </div>
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1 min-h-0"
            style={{ maxHeight: '300px' }}
          >
            {log.map((entry, index) => {
              const Icon = statusIcons[entry.status as keyof typeof statusIcons] || CheckCircle2;
              const color = statusColors[entry.status as keyof typeof statusColors] || 'text-zinc-400';

              return (
                <motion.div
                  key={`${entry.fileName}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors"
                >
                  <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                  <span className="text-sm font-mono text-zinc-300 truncate flex-1">{entry.fileName}</span>
                  {(() => {
                    const logo = getSystemLogo(undefined, entry.system);
                    return logo ? (
                      <img
                        src={`system/logos/${logo}`}
                        alt={entry.system}
                        className="w-4 h-4 object-contain flex-shrink-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <span className="text-xs text-zinc-500 flex-shrink-0">{entry.system}</span>
                    );
                  })()}
                  {entry.rating !== null && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-retro-warning" />
                      <span className="text-xs font-mono text-retro-warning">
                        {entry.rating.toFixed(0)}
                      </span>
                    </div>
                  )}
                  {entry.genres && entry.genres.length > 0 && (
                    <span className="text-xs text-zinc-500 flex-shrink-0 truncate max-w-[120px]">
                      {entry.genres.slice(0, 2).join(', ')}
                    </span>
                  )}
                </motion.div>
              );
            })}
            {log.length === 0 && (
              <div className="flex items-center justify-center h-full text-zinc-600 py-8">
                <p className="text-sm">Aguardando processamento...</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
