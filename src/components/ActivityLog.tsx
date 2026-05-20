import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, XCircle, Star } from 'lucide-react';
import * as React from 'react';
import { getSystemLogo } from '../lib/system-logos';

interface LogEntry {
  fileName: string;
  status: string;
  rating: number | null;
  system: string;
  genres?: string[];
}

interface ActivityLogProps {
  log: LogEntry[];
  logRef: React.RefObject<HTMLDivElement>;
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

export function ActivityLog({ log, logRef }: ActivityLogProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-zinc-200">Log de Atividades</h3>
        <span className="text-xs text-zinc-500 font-mono">{log.length} entradas</span>
      </div>
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1 min-h-0"
      >
        <AnimatePresence initial={false}>
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
        </AnimatePresence>
        {log.length === 0 && (
          <div className="flex items-center justify-center h-full text-zinc-600">
            <p className="text-sm">Nenhuma atividade registrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
