import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, History, Gamepad2, ShieldCheck, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

interface StatsHistoryProps {
  onClose: () => void;
}

export function StatsHistory({ onClose }: StatsHistoryProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'list'>('chart');

  useEffect(() => {
    window.api.readStats().then(setStats);
  }, []);

  const reversedStats = [...stats].reverse();
  const maxTotal = Math.max(...stats.map((s) => s.total_encontrado), 1);

  const totals = {
    total: stats.reduce((acc, s) => acc + s.total_encontrado, 0),
    classics: stats.reduce((acc, s) => acc + s.preservados_classicos, 0),
    kept: stats.reduce((acc, s) => acc + s.mantidos_por_nota, 0),
    removed: stats.reduce((acc, s) => acc + s.removidos, 0),
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

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'chart'
                ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Gráficos
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <History className="w-4 h-4" />
            Lista Detalhada
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
              <History className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">Nenhuma execução registrada</p>
            </div>
          ) : activeTab === 'chart' ? (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <Gamepad2 className="w-5 h-5 text-retro-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono text-retro-primary">{totals.total.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-zinc-500 mt-1">Total Analisado</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <ShieldCheck className="w-5 h-5 text-retro-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono text-retro-secondary">{totals.classics.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-zinc-500 mt-1">Clássicos</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-retro-success mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono text-retro-success">{totals.kept.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-zinc-500 mt-1">Mantidos</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <XCircle className="w-5 h-5 text-retro-danger mx-auto mb-2" />
                  <p className="text-2xl font-bold font-mono text-retro-danger">{totals.removed.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-zinc-500 mt-1">Removidos</p>
                </motion.div>
              </div>

              {/* Bar Chart */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Execuções por Pasta</h3>
                <div className="space-y-4">
                  {reversedStats.slice(0, 10).map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-mono truncate max-w-[200px]">{stat.pasta.split('/').pop()}</span>
                        <span className="text-zinc-500">{stat.data}</span>
                      </div>
                      <div className="flex gap-1 h-8">
                        {/* Classics bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.preservados_classicos / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="bg-retro-secondary/60 rounded-l-md relative group"
                          style={{ minWidth: stat.preservados_classicos > 0 ? '4px' : '0' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-retro-secondary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Clássicos: {stat.preservados_classicos}
                          </div>
                        </motion.div>
                        {/* Kept bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.mantidos_por_nota / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                          className="bg-retro-success/60 relative group"
                          style={{ minWidth: stat.mantidos_por_nota > 0 ? '4px' : '0' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-retro-success text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Mantidos: {stat.mantidos_por_nota}
                          </div>
                        </motion.div>
                        {/* Removed bar */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.removidos / maxTotal) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          className="bg-retro-danger/60 rounded-r-md relative group"
                          style={{ minWidth: stat.removidos > 0 ? '4px' : '0' }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-retro-danger text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Removidos: {stat.removidos}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-6 pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-retro-secondary/60" />
                    <span className="text-xs text-zinc-500">Clássicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-retro-success/60" />
                    <span className="text-xs text-zinc-500">Mantidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-retro-danger/60" />
                    <span className="text-xs text-zinc-500">Removidos</span>
                  </div>
                </div>
              </div>

              {/* Pie-like distribution */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Distribuição Geral</h3>
                <div className="flex items-center justify-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        const total = totals.classics + totals.kept + totals.removed;
                        if (total === 0) return null;
                        const classicsPct = (totals.classics / total) * 100;
                        const keptPct = (totals.kept / total) * 100;
                        const removedPct = (totals.removed / total) * 100;
                        return (
                          <>
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray={`${classicsPct} ${100 - classicsPct}`} strokeDashoffset="0" />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray={`${keptPct} ${100 - keptPct}`} strokeDashoffset={`-${classicsPct}`} />
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f87171" strokeWidth="3" strokeDasharray={`${removedPct} ${100 - removedPct}`} strokeDashoffset={`-${classicsPct + keptPct}`} />
                          </>
                        );
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold font-mono text-zinc-200">{totals.total.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-retro-secondary" />
                      <div>
                        <p className="text-sm text-zinc-300">Clássicos</p>
                        <p className="text-xs text-zinc-500">{totals.classics} ({totals.total > 0 ? Math.round((totals.classics / totals.total) * 100) : 0}%)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-retro-success" />
                      <div>
                        <p className="text-sm text-zinc-300">Mantidos</p>
                        <p className="text-xs text-zinc-500">{totals.kept} ({totals.total > 0 ? Math.round((totals.kept / totals.total) * 100) : 0}%)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-retro-danger" />
                      <div>
                        <p className="text-sm text-zinc-300">Removidos</p>
                        <p className="text-xs text-zinc-500">{totals.removed} ({totals.total > 0 ? Math.round((totals.removed / totals.total) * 100) : 0}%)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reversedStats.map((stat, index) => (
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
