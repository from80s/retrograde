import { motion } from 'framer-motion';
import { HardDrive, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface SpaceSavingsCardProps {
  bytesSaved: number;
  action: 'move' | 'delete';
  onDeleteRemoved?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function SpaceSavingsCard({ bytesSaved, action, onDeleteRemoved }: SpaceSavingsCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const percentage = Math.min((bytesSaved / (1024 * 1024 * 1024)) * 100, 100);

  const handleDelete = async () => {
    if (onDeleteRemoved) {
      setDeleting(true);
      await onDeleteRemoved();
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-retro-success/10 flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-retro-success" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Economia de Espaço</h3>
          <p className="text-xs text-zinc-500">
            {action === 'move' ? 'Espaço recuperável' : 'Espaço economizado'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end gap-2">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-retro-success"
          >
            {formatBytes(bytesSaved)}
          </motion.span>
          <span className="text-sm text-zinc-500 mb-1">
            {action === 'move' ? 'na pasta /removidos' : 'em disco'}
          </span>
        </div>

        <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-retro-success to-retro-success/60 rounded-full"
          />
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {action === 'move'
            ? `Os arquivos removidos foram movidos para a pasta /removidos. Se você deletar esta pasta, liberará ${formatBytes(bytesSaved)} de espaço em disco.`
            : `A curadoria removeu permanentemente arquivos que totalizam ${formatBytes(bytesSaved)} de espaço em disco.`}
        </p>
      </div>

      {action === 'move' && bytesSaved > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                   bg-retro-danger/10 text-retro-danger border border-retro-danger/20
                   hover:bg-retro-danger/20 hover:border-retro-danger/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          Deletar pasta /removidos
        </motion.button>
      )}

      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-retro-danger/5 border border-retro-danger/20 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-retro-danger flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Tem certeza que deseja deletar permanentemente a pasta <span className="font-mono text-retro-danger">/removidos</span>? 
              Esta ação não pode ser desfeita e liberará <span className="font-semibold text-retro-danger">{formatBytes(bytesSaved)}</span> de espaço.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-retro-danger/20 text-retro-danger border border-retro-danger/30 hover:bg-retro-danger/30 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deletando...' : 'Confirmar Deleção'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
