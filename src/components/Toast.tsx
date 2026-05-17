import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const colors = {
    success: 'bg-retro-success/10 border-retro-success/30 text-retro-success',
    error: 'bg-retro-danger/10 border-retro-danger/30 text-retro-danger',
    info: 'bg-retro-primary/10 border-retro-primary/30 text-retro-primary',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -20, x: '-50%' }}
        className="fixed top-16 left-1/2 z-[200] glass rounded-xl border px-4 py-3 flex items-center gap-3 shadow-lg"
      >
        <div className={colors[type]}>{icons[type]}</div>
        <span className="text-sm text-zinc-200">{message}</span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
