import { motion } from 'framer-motion';
import { X, Mail, MapPin, Heart } from 'lucide-react';

interface SupportModalProps {
  onClose: () => void;
}

export function SupportModal({ onClose }: SupportModalProps) {
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
        className="glass rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-retro-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-retro-primary" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Suporte</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-zinc-400 text-sm">Precisa de ajuda? Entre em contato conosco!</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-retro-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-retro-primary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">E-mail</p>
                <p className="text-sm font-mono text-zinc-200">helloretrograde@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-retro-secondary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-retro-secondary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Localização</p>
                <p className="text-sm text-zinc-200">Brasil / Curitiba - PR</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
            <p className="text-xs text-zinc-500 text-center">
              Respondemos em até 24 horas em dias úteis.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
