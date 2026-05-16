import { motion } from 'framer-motion';
import { X, ExternalLink, Settings, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onOpenSettings: () => void;
  hasConfig: boolean;
}

export function WelcomeModal({ onClose, onOpenSettings, hasConfig }: WelcomeModalProps) {
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
        className="glass rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-retro-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-retro-primary" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Bem-vindo ao RetroGrade</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            hasConfig
              ? 'bg-retro-warning/10 border border-retro-warning/20'
              : 'bg-retro-danger/10 border border-retro-danger/20'
          }`}>
            {hasConfig ? (
              <AlertCircle className="w-5 h-5 text-retro-warning flex-shrink-0" />
            ) : (
              <Wifi className="w-5 h-5 text-retro-danger flex-shrink-0" />
            )}
            <p className="text-sm text-zinc-300">
              {hasConfig
                ? 'APIs configuradas, mas conexão não testada. Clique em "Testar Conexão" para validar.'
                : 'Nenhuma API configurada. Configure pelo menos uma API para iniciar a curadoria.'}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Como configurar</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-retro-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-retro-primary">1</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Abra as Configurações</p>
                  <p className="text-xs text-zinc-500 mt-1">Clique no botão "Configurações" na barra lateral esquerda.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-retro-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-retro-primary">2</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Obtenha suas chaves de API</p>
                  <p className="text-xs text-zinc-500 mt-1">Cadastre-se nos serviços abaixo para obter suas credenciais:</p>
                  <div className="mt-2 space-y-2">
                    <a
                      href="https://api-docs.igdb.com/#account-creation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg text-xs text-retro-primary hover:bg-zinc-800 transition-colors group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      IGDB (Twitch Developer) - api-docs.igdb.com
                    </a>
                    <a
                      href="https://thegamesdb.net/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg text-xs text-retro-secondary hover:bg-zinc-800 transition-colors group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      TheGamesDB - thegamesdb.net/api
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-retro-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-retro-primary">3</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Preencha as credenciais</p>
                  <p className="text-xs text-zinc-500 mt-1">Cole o Client ID, Client Secret (IGDB) e API Key (TGDB) nos campos correspondentes.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-retro-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-retro-success">4</span>
                </div>
                <div>
                  <p className="text-sm text-zinc-200 font-medium">Teste a conexão</p>
                  <p className="text-xs text-zinc-500 mt-1">Clique em "Testar Conexão" para validar as credenciais. Pelo menos uma API precisa conectar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-retro-success flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Basta configurar <span className="text-zinc-200 font-medium">uma das APIs</span> para que a curadoria seja habilitada. O app usa a IGDB como principal e a TheGamesDB como fallback.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
          >
            Fechar
          </button>
          <button
            onClick={() => { onClose(); onOpenSettings(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all text-sm"
          >
            <Settings className="w-4 h-4" />
            Ir para Configurações
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
