import { motion } from 'framer-motion';
import { Gamepad2, Star, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { getSystemLogo } from '../lib/system-logos';

interface ProgressCardProps {
  progress: number;
  currentFile: string;
  currentSystem: string;
  currentRating: number | null;
  currentStatus: 'classic' | 'kept' | 'removed' | null;
}

const statusConfig = {
  classic: { icon: ShieldCheck, color: 'text-retro-secondary', bg: 'bg-retro-secondary/10', label: 'Clássico Preservado' },
  kept: { icon: CheckCircle2, color: 'text-retro-success', bg: 'bg-retro-success/10', label: 'Mantido por Nota' },
  removed: { icon: XCircle, color: 'text-retro-danger', bg: 'bg-retro-danger/10', label: 'Removido' },
};

export function ProgressCard({ progress, currentFile, currentSystem, currentRating, currentStatus }: ProgressCardProps) {
  const status = currentStatus ? statusConfig[currentStatus] : null;
  const StatusIcon = status?.icon || Gamepad2;

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-400">Progresso da Curadoria</span>
          <span className="text-sm font-mono text-retro-primary">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-retro-primary to-retro-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Current File Info */}
      {currentFile && (
        <motion.div
          key={currentFile}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl"
        >
          <div className={`w-10 h-10 rounded-lg ${status?.bg || 'bg-zinc-700'} flex items-center justify-center`}>
            <StatusIcon className={`w-5 h-5 ${status?.color || 'text-zinc-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono text-zinc-200 truncate">{currentFile}</p>
            <div className="flex items-center gap-1.5">
              {(() => {
                const logo = getSystemLogo(undefined, currentSystem);
                return logo ? (
                  <img
                    src={`system logos/${logo}`}
                    alt={currentSystem}
                    className="w-4 h-4 object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : null;
              })()}
              <p className="text-xs text-zinc-500">{currentSystem}</p>
            </div>
          </div>
          {currentRating !== null && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-retro-warning fill-retro-warning" />
              <span className="text-sm font-mono text-retro-warning">{(currentRating / 10).toFixed(1)}</span>
            </div>
          )}
          {status && (
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
