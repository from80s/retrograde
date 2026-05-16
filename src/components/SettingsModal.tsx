import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Shield, Trash2, MoveRight, Star } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  minRating: number;
  action: 'move' | 'delete';
  systems: Record<string, any>;
  classics: string[];
  onSave: (minRating: number, action: 'move' | 'delete') => void;
}

export function SettingsModal({ onClose, minRating, action, systems, classics, onSave }: SettingsModalProps) {
  const [localMinRating, setLocalMinRating] = useState(minRating);
  const [localAction, setLocalAction] = useState<'move' | 'delete'>(action);
  const [config, setConfig] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.api.readConfig().then(setConfig);
  }, []);

  const handleSave = async () => {
    if (config) {
      await window.api.saveConfig(config);
    }
    onSave(localMinRating, localAction);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
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
        className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100">Configurações</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          {/* API Config */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Credenciais de API</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">IGDB Client ID</label>
                <input
                  type="text"
                  value={config?.IGDB_CLIENT_ID || ''}
                  onChange={(e) => handleConfigChange('IGDB_CLIENT_ID', e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">IGDB Client Secret</label>
                <input
                  type="password"
                  value={config?.IGDB_CLIENT_SECRET || ''}
                  onChange={(e) => handleConfigChange('IGDB_CLIENT_SECRET', e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">TGDB API Key</label>
                <input
                  type="password"
                  value={config?.TGDB_API_KEY || ''}
                  onChange={(e) => handleConfigChange('TGDB_API_KEY', e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Curation Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Configurações de Curadoria</h3>
            
            <div>
              <label className="text-xs text-zinc-500 mb-2 block flex items-center gap-2">
                <Star className="w-4 h-4 text-retro-warning" />
                Nota Mínima para Manter: {localMinRating}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={localMinRating}
                onChange={(e) => setLocalMinRating(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-retro-primary"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-2 block">Ação para Jogos Removidos</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLocalAction('move')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    localAction === 'move'
                      ? 'bg-retro-warning/10 border-retro-warning/30 text-retro-warning'
                      : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <MoveRight className="w-4 h-4" />
                  <span className="text-sm font-medium">Mover para /removidos</span>
                </button>
                <button
                  onClick={() => setLocalAction('delete')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    localAction === 'delete'
                      ? 'bg-retro-danger/10 border-retro-danger/30 text-retro-danger'
                      : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Deletar Permanentemente</span>
                </button>
              </div>
            </div>
          </div>

          {/* Systems Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Sistemas Suportados ({Object.keys(systems).length})
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto scrollbar-thin">
              {Object.entries(systems).map(([ext, info]: [string, any]) => (
                <div key={ext} className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 rounded-lg">
                  <span className="text-xs font-mono text-retro-primary">{ext}</span>
                  <span className="text-xs text-zinc-500 truncate">{info.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classics Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-retro-secondary" />
              Clássicos Protegidos ({classics.length})
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin">
              {classics.map((classic) => (
                <span
                  key={classic}
                  className="px-3 py-1 bg-retro-secondary/10 border border-retro-secondary/20 rounded-full text-xs text-retro-secondary"
                >
                  {classic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Salvo!' : 'Salvar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
