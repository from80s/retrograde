import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, History, Gamepad2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface StatsHistoryProps {
  onClose: () => void;
}

export function StatsHistory({ onClose }: StatsHistoryProps) {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    window.api.readStats().then(setStats);
  }, []);

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
        className="glass rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-retro-primary" />
            <h2 className="text-xl font-bold text-zinc-100">Histórico de Execuções</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">Nenhuma execução registrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...stats].reverse().map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-retro-primary" />
                      <span className="text-sm font-mono text-zinc-300 truncate max-w-md">{stat.pasta}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{stat.data}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-retro-primary" />
                      <div>
                        <p className="text-xs text-zinc-500">Total</p>
                        <p className="text-sm font-mono text-retro-primary">{stat.total_encontrado}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-retro-secondary" />
                      <div>
                        <p className="text-xs text-zinc-500">Clássicos</p>
                        <p className="text-sm font-mono text-retro-secondary">{stat.preservados_classicos}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-retro-success" />
                      <div>
                        <p className="text-xs text-zinc-500">Mantidos</p>
                        <p className="text-sm font-mono text-retro-success">{stat.mantidos_por_nota}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-retro-danger" />
                      <div>
                        <p className="text-xs text-zinc-500">Removidos</p>
                        <p className="text-sm font-mono text-retro-danger">{stat.removidos}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
