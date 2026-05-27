import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  X, FileText, Image, File, Trash2, Loader2,
  CheckCircle2, AlertTriangle, Scan,
} from 'lucide-react';

interface OrphanFilesModalProps {
  onClose: () => void;
  folder: string;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type Step = 'scanning' | 'results' | 'deleting' | 'done';

interface OrphanFile {
  path: string;
  name: string;
  size: number;
  ext: string;
  category: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
}

const categoryIcon: Record<string, any> = {
  imagem: Image,
  manual: FileText,
  texto: FileText,
  metadado: File,
  config: File,
  outro: File,
};

const categoryColor: Record<string, string> = {
  imagem: 'text-blue-400',
  manual: 'text-red-400',
  texto: 'text-zinc-400',
  metadado: 'text-yellow-400',
  config: 'text-orange-400',
  outro: 'text-zinc-500',
};

const categoryLabel: Record<string, string> = {
  imagem: 'Imagem',
  manual: 'Manual',
  texto: 'Texto',
  metadado: 'Metadado',
  config: 'Config',
  outro: 'Outro',
};

export function OrphanFilesModal({ onClose, folder, onToast }: OrphanFilesModalProps) {
  const [step, setStep] = useState<Step>('scanning');
  const [orphans, setOrphans] = useState<OrphanFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteResult, setDeleteResult] = useState<{ deleted: number; freedBytes: number } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const runScan = useCallback(async () => {
    setScanError(null);
    setStep('scanning');
    try {
      const files = await window.api.scanOrphanFiles(folder);
      setOrphans(files);
      setSelected(new Set(files.map(f => f.path)));
      setStep('results');
    } catch (err: any) {
      const msg = err?.message || 'Erro desconhecido ao escanear.';
      setScanError(msg);
      onToast(`Erro ao escanear: ${msg}`, 'error');
    }
  }, [folder, onToast]);

  useEffect(() => {
    runScan();
  }, [runScan]);

  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(orphans.map(f => f.path)));
  const deselectAll = () => setSelected(new Set());

  const handleDelete = useCallback(async () => {
    if (selected.size === 0) {
      onToast('Selecione ao menos um arquivo.', 'error');
      return;
    }
    setStep('deleting');
    const files = orphans.filter(f => selected.has(f.path)).map(f => ({ path: f.path }));
    const result = await window.api.deleteOrphanFiles(files);
    setDeleteResult(result);
    setStep('done');
    onToast(`${result.deleted} arquivo(s) deletado(s). ${formatSize(result.freedBytes)} liberado(s).`, 'success');
  }, [selected, orphans, onToast]);

  const selectedSize = orphans.filter(f => selected.has(f.path)).reduce((sum, f) => sum + f.size, 0);
  const byCategory = orphans.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scan className="w-5 h-5 text-retro-warning" />
            <h3 className="text-lg font-bold text-zinc-100">Arquivos Órfãos</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {step === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-12 h-12 text-retro-warning animate-spin" />
              <p className="text-zinc-400">Escaneando pasta em busca de arquivos órfãos...</p>
              {scanError && (
                <div className="flex flex-col items-center gap-3 mt-4">
                  <p className="text-sm text-retro-danger text-center max-w-sm">{scanError}</p>
                  <button
                    onClick={runScan}
                    className="px-4 py-2 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl text-sm font-medium hover:bg-retro-primary/20 transition-all"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'results' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {orphans.length === 0 ? (
                <div className="flex flex-col items-center py-12 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-retro-success" />
                  <p className="text-zinc-300 font-medium">Nenhum arquivo órfão encontrado!</p>
                  <p className="text-xs text-zinc-600">Sua pasta está limpa.</p>
                </div>
              ) : (
                <>
                  {/* Cartões de Resumo */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="glass rounded-xl p-4 text-center">
                      <AlertTriangle className="w-5 h-5 text-retro-warning mx-auto mb-2" />
                      <p className="text-xl font-bold font-mono text-retro-warning">{orphans.length}</p>
                      <p className="text-xs text-zinc-500 mt-1">Arquivos Órfãos</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                      <File className="w-5 h-5 text-retro-primary mx-auto mb-2" />
                      <p className="text-xl font-bold font-mono text-retro-primary">{selected.size}</p>
                      <p className="text-xs text-zinc-500 mt-1">Selecionados</p>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                      <File className="w-5 h-5 text-retro-success mx-auto mb-2" />
                      <p className="text-xl font-bold font-mono text-retro-success">{formatSize(selectedSize)}</p>
                      <p className="text-xs text-zinc-500 mt-1">Espaço Selecionado</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(byCategory).map(([cat, count]) => {
                      const Icon = categoryIcon[cat] || File;
                      return (
                        <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/40 rounded-lg text-xs text-zinc-400">
                          <Icon className={`w-3 h-3 ${categoryColor[cat]}`} />
                          {categoryLabel[cat]} ({count})
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <div className="flex gap-3">
                      <button onClick={selectAll} className="text-retro-warning hover:text-retro-warning/80 transition-colors">
                        Selecionar Todos
                      </button>
                      <button onClick={deselectAll} className="text-zinc-400 hover:text-zinc-200 transition-colors">
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin">
                    {orphans.map((f) => {
                      const isSelected = selected.has(f.path);
                      const Icon = categoryIcon[f.category] || File;
                      return (
                        <button
                          key={f.path}
                          onClick={() => toggleSelect(f.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left ${
                            isSelected
                              ? 'bg-retro-warning/10 border border-retro-warning/30'
                              : 'bg-zinc-800/20 border border-transparent hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-retro-warning border-retro-warning' : 'border-zinc-600'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <Icon className={`w-4 h-4 flex-shrink-0 ${categoryColor[f.category]}`} />
                          <span className={`flex-1 text-sm truncate ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`}>
                            {f.name}
                          </span>
                          <span className="text-xs text-zinc-600">{categoryLabel[f.category]}</span>
                          <span className="text-xs text-zinc-500 font-mono">{formatSize(f.size)}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'deleting' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-12 h-12 text-retro-warning animate-spin" />
              <p className="text-zinc-400">Deletando arquivos órfãos...</p>
            </div>
          )}

          {step === 'done' && deleteResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-col items-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-retro-success" />
                <p className="text-xl font-bold text-zinc-100">Limpeza concluída!</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/30 rounded-xl text-center">
                  <p className="text-2xl font-bold text-retro-success">{deleteResult.deleted}</p>
                  <p className="text-xs text-zinc-500">Arquivos deletados</p>
                </div>
                <div className="p-4 bg-zinc-800/30 rounded-xl text-center">
                  <p className="text-2xl font-bold text-retro-primary">{formatSize(deleteResult.freedBytes)}</p>
                  <p className="text-xs text-zinc-500">Espaço liberado</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50 flex justify-end gap-3">
          {step === 'results' && orphans.length > 0 && (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
              >
                Fechar
              </button>
              <button
                onClick={handleDelete}
                disabled={selected.size === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-retro-danger/10 text-retro-danger border border-retro-danger/30 rounded-xl font-medium hover:bg-retro-danger/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Deletar Selecionados ({selected.size})
              </button>
            </>
          )}
          {(step === 'done' || (step === 'results' && orphans.length === 0)) && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-8 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Fechar
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
