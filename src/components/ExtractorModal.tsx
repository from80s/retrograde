import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FolderOpen, Archive, FolderPlus, Trash2, Square, CheckCircle2,
  XCircle, AlertTriangle, FileText, ChevronRight, Loader2, Download,
} from 'lucide-react';

interface ExtractorModalProps {
  onClose: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type Step = 'config' | 'scanning' | 'files' | 'extracting' | 'summary';

interface CompressedFile {
  path: string;
  name: string;
  size: number;
  ext: string;
}

interface ExtractionLogEntry {
  fileName: string;
  status: 'extracting' | 'progress' | 'complete' | 'error';
  progress: number;
  compressedSize: number;
  extractedSize: number;
  fileCount: number;
  error?: string;
  index: number;
  total: number;
}

interface ExtractionResult {
  name: string;
  status: 'success' | 'error' | 'cancelled';
  compressedSize: number;
  extractedSize: number;
  fileCount: number;
  error?: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
}

export function ExtractorModal({ onClose, onToast }: ExtractorModalProps) {
  const [step, setStep] = useState<Step>('config');
  const [sourceFolder, setSourceFolder] = useState<string | null>(null);
  const [mode, setMode] = useState<'in-place' | 'own-folder'>('own-folder');
  const [deleteAfter, setDeleteAfter] = useState(false);
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [log, setLog] = useState<ExtractionLogEntry[]>([]);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [stats, setStats] = useState({
    successCount: 0, errorCount: 0, cancelledCount: 0,
    totalExtracted: 0, totalCompressed: 0, totalFiles: 0,
  });
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const handleSelectFolder = useCallback(async () => {
    const folder = await window.api.selectFolder();
    if (folder) {
      setSourceFolder(folder);
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (!sourceFolder) return;
    setStep('scanning');
    try {
      const found = await window.api.scanCompressed(sourceFolder);
      setFiles(found);
      if (found.length === 0) {
        onToast('Nenhum arquivo comprimido encontrado.', 'info');
        setStep('config');
      } else {
        setStep('files');
      }
    } catch {
      onToast('Erro ao escanear pasta.', 'error');
      setStep('config');
    }
  }, [sourceFolder, onToast]);

  const handleStartExtraction = useCallback(() => {
    setStep('extracting');
    setLog([]);
    setResults([]);
    setStats({ successCount: 0, errorCount: 0, cancelledCount: 0, totalExtracted: 0, totalCompressed: 0, totalFiles: 0 });

    window.api.onExtractionProgress((data) => {
      if (data.type === 'file-start') {
        setLog((prev) => [
          ...prev,
          {
            fileName: data.fileName,
            status: 'extracting' as const,
            progress: 0,
            compressedSize: data.compressedSize,
            extractedSize: 0,
            fileCount: 0,
            index: data.index,
            total: data.total,
          },
        ]);
      } else if (data.type === 'file-progress') {
        setLog((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.fileName === data.fileName && last.status === 'extracting') {
            return [...prev.slice(0, -1), { ...last, status: 'progress' as const, progress: data.progress, extractedSize: data.extractedSize }];
          }
          return [...prev, {
            fileName: data.fileName,
            status: 'progress' as const,
            progress: data.progress,
            compressedSize: data.compressedSize || 0,
            extractedSize: data.extractedSize,
            fileCount: 0,
            index: data.index,
            total: data.total,
          }];
        });
      } else if (data.type === 'file-complete') {
        setLog((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.fileName === data.fileName) {
            return [...prev.slice(0, -1), { ...last, status: 'complete' as const, progress: 100, extractedSize: data.extractedSize, fileCount: data.fileCount }];
          }
          return [...prev, {
            fileName: data.fileName,
            status: 'complete' as const,
            progress: 100,
            compressedSize: 0,
            extractedSize: data.extractedSize,
            fileCount: data.fileCount,
            index: data.index,
            total: data.total,
          }];
        });
      } else if (data.type === 'file-error') {
        setLog((prev) => [...prev, {
          fileName: data.fileName,
          status: 'error' as const,
          progress: 0,
          compressedSize: 0,
          extractedSize: 0,
          fileCount: 0,
          error: data.error,
          index: data.index,
          total: data.total,
        }]);
      } else if (data.type === 'complete') {
        setResults(data.results);
        setStats({
          successCount: data.successCount,
          errorCount: data.errorCount,
          cancelledCount: data.cancelledCount,
          totalExtracted: data.totalExtracted,
          totalCompressed: data.totalCompressed,
          totalFiles: data.totalFiles,
        });
        setStep('summary');
        window.api.removeExtractionProgressListener();
      }
    });

    window.api.startExtraction({ files, mode, deleteAfter });
  }, [files, mode, deleteAfter]);

  const handleCancel = useCallback(async () => {
    await window.api.cancelExtraction();
    window.api.removeExtractionProgressListener();
  }, []);

  const supportedFiles = files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const unsupportedFiles = files.filter(f => !['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const totalCompressedSize = files.reduce((sum, f) => sum + f.size, 0);

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
            <Archive className="w-5 h-5 text-retro-primary" />
            <h3 className="text-lg font-bold text-zinc-100">Extrator de ROMs</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 text-xs">
                    {['config', 'files', 'extracting', 'summary'].map((s, idx) => {
                      const labels = ['Configurar', 'Arquivos', 'Extraindo', 'Resultado'];
                      const isActive = s === step || (step === 'scanning' && s === 'config');
                      const isDone = ['files', 'extracting', 'summary'].indexOf(step) > idx;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                            isDone ? 'bg-retro-success/10 text-retro-success' :
                            isActive ? 'bg-retro-primary/10 text-retro-primary' :
                            'bg-zinc-800/30 text-zinc-600'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border-2 flex items-center justify-center text-[8px]">{idx + 1}</span>}
                            {labels[idx]}
                          </div>
                          {idx < 3 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
                        </div>
                      );
                    })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Config */}
            {step === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Folder picker */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Pasta com ROMs comprimidas</label>
                  <button
                    onClick={handleSelectFolder}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600/50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span className="flex-1 text-left truncate">{sourceFolder || 'Clique para selecionar a pasta...'}</span>
                  </button>
                </div>

                {/* Extract mode */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Modo de extração</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode('own-folder')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        mode === 'own-folder'
                          ? 'bg-retro-primary/10 border-retro-primary/30 text-retro-primary'
                          : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <FolderPlus className="w-4 h-4" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Pasta própria</p>
                        <p className="text-xs opacity-70">Cria uma pasta para cada arquivo</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setMode('in-place')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        mode === 'in-place'
                          ? 'bg-retro-primary/10 border-retro-primary/30 text-retro-primary'
                          : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Na pasta atual</p>
                        <p className="text-xs opacity-70">Extrai no mesmo diretório</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Delete after */}
                <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-zinc-500" />
                    <div>
                      <p className="text-sm text-zinc-300">Excluir arquivo após extração</p>
                      <p className="text-xs text-zinc-600">Remove o arquivo original após sucesso</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteAfter(!deleteAfter)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      deleteAfter ? 'bg-retro-primary' : 'bg-zinc-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      deleteAfter ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Supported formats info */}
                <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/20">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs text-zinc-400">Formatos suportados: <span className="text-zinc-200 font-medium">.zip</span>, <span className="text-zinc-200 font-medium">.rar</span>, <span className="text-zinc-200 font-medium">.7z</span>, <span className="text-zinc-200 font-medium">.tar</span>, <span className="text-zinc-200 font-medium">.gz</span>, <span className="text-zinc-200 font-medium">.tar.gz</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1.5: Scanning */}
            {step === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 space-y-4"
              >
                <Loader2 className="w-12 h-12 text-retro-primary animate-spin" />
                <p className="text-zinc-400">Escaneando pasta em busca de arquivos comprimidos...</p>
              </motion.div>
            )}

            {/* Step 2: Files */}
            {step === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">
                    {supportedFiles.length} arquivo(s) compatível(is) encontrado(s)
                    {unsupportedFiles.length > 0 && ` · ${unsupportedFiles.length} não suportado(s)`}
                  </p>
                  <p className="text-xs text-zinc-600">{formatSize(totalCompressedSize)} total</p>
                </div>

                {/* Supported files */}
                <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin">
                  {supportedFiles.map((f) => (
                    <div key={f.path} className="flex items-center gap-3 px-4 py-2.5 bg-zinc-800/20 rounded-lg">
                      <Archive className="w-4 h-4 text-retro-primary" />
                      <span className="flex-1 text-sm text-zinc-300 truncate">{f.name}</span>
                      <span className="text-xs text-zinc-600 font-mono">{f.ext}</span>
                      <span className="text-xs text-zinc-500">{formatSize(f.size)}</span>
                    </div>
                  ))}
                </div>

                {/* Unsupported files */}
                {unsupportedFiles.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-600">Arquivos não suportados (serão ignorados):</p>
                    {unsupportedFiles.map((f) => (
                      <div key={f.path} className="flex items-center gap-3 px-4 py-2 bg-zinc-800/10 rounded-lg opacity-50">
                        <XCircle className="w-3 h-3 text-zinc-600" />
                        <span className="flex-1 text-xs text-zinc-500 truncate">{f.name}</span>
                        <span className="text-xs text-zinc-700 font-mono">{f.ext}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Extracting */}
            {step === 'extracting' && (
              <motion.div
                key="extracting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Overall progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Progresso geral</span>
                    <span className="text-zinc-300">{log.filter(l => l.status === 'complete' || l.status === 'error').length} / {log.length > 0 ? Math.max(...log.map(l => l.total)) : 0}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-retro-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${log.length > 0 ? (log.filter(l => l.status === 'complete' || l.status === 'error').length / Math.max(...log.map(l => l.total), 1)) * 100 : 0}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Log */}
                <div ref={logRef} className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                  <AnimatePresence>
                    {log.map((entry) => (
                      <motion.div
                        key={`${entry.fileName}-${entry.index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className={`p-3 rounded-xl border ${
                          entry.status === 'complete' ? 'bg-retro-success/5 border-retro-success/20' :
                          entry.status === 'error' ? 'bg-retro-danger/5 border-retro-danger/20' :
                          'bg-zinc-800/20 border-zinc-700/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {entry.status === 'complete' ? <CheckCircle2 className="w-4 h-4 text-retro-success" /> :
                           entry.status === 'error' ? <XCircle className="w-4 h-4 text-retro-danger" /> :
                           <Loader2 className="w-4 h-4 text-retro-primary animate-spin" />}
                          <span className="text-sm text-zinc-300 truncate flex-1">{entry.fileName}</span>
                          <span className="text-xs text-zinc-600">{entry.progress.toFixed(0)}%</span>
                        </div>
                        {entry.status === 'progress' && (
                          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-retro-primary rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: `${entry.progress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-600">
                          <span>Compactado: {formatSize(entry.compressedSize)}</span>
                          {entry.extractedSize > 0 && <span>Extraído: {formatSize(entry.extractedSize)}</span>}
                          {entry.fileCount > 0 && <span>{entry.fileCount} arquivo(s)</span>}
                        </div>
                        {entry.error && (
                          <p className="text-xs text-retro-danger mt-1">{entry.error}</p>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Step 4: Summary */}
            {step === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-retro-success/10 border border-retro-success/20 rounded-xl text-center">
                    <CheckCircle2 className="w-6 h-6 text-retro-success mx-auto mb-2" />
                    <p className="text-2xl font-bold text-retro-success">{stats.successCount}</p>
                    <p className="text-xs text-zinc-500">Extraídos com sucesso</p>
                  </div>
                  {stats.errorCount > 0 && (
                    <div className="p-4 bg-retro-danger/10 border border-retro-danger/20 rounded-xl text-center">
                      <XCircle className="w-6 h-6 text-retro-danger mx-auto mb-2" />
                      <p className="text-2xl font-bold text-retro-danger">{stats.errorCount}</p>
                      <p className="text-xs text-zinc-500">Erros</p>
                    </div>
                  )}
                  {stats.cancelledCount > 0 && (
                    <div className="p-4 bg-zinc-700/20 border border-zinc-600/20 rounded-xl text-center">
                      <AlertTriangle className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-zinc-400">{stats.cancelledCount}</p>
                      <p className="text-xs text-zinc-500">Cancelados</p>
                    </div>
                  )}
                </div>

                {/* Size comparison */}
                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-zinc-400">Resumo de tamanho</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-zinc-300">{formatSize(stats.totalCompressed)}</p>
                      <p className="text-xs text-zinc-600">Compactado</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-retro-primary">{formatSize(stats.totalExtracted)}</p>
                      <p className="text-xs text-zinc-600">Extraído</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-zinc-300">{stats.totalFiles}</p>
                      <p className="text-xs text-zinc-600">Arquivos extraídos</p>
                    </div>
                  </div>
                </div>

                {/* Error log */}
                {results.filter(r => r.status === 'error').length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-retro-warning" />
                      Erros detalhados
                    </p>
                    {results.filter(r => r.status === 'error').map((r) => (
                      <div key={r.name} className="p-3 bg-retro-danger/5 border border-retro-danger/10 rounded-xl">
                        <p className="text-sm text-zinc-300">{r.name}</p>
                        <p className="text-xs text-retro-danger mt-1">{r.error}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full log */}
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Log completo</p>
                  <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1">
                    {results.map((r) => (
                      <div key={r.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                        r.status === 'success' ? 'bg-retro-success/5 text-retro-success' :
                        r.status === 'error' ? 'bg-retro-danger/5 text-retro-danger' :
                        'bg-zinc-800/20 text-zinc-500'
                      }`}>
                        {r.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> :
                         r.status === 'error' ? <XCircle className="w-3 h-3" /> :
                         <AlertTriangle className="w-3 h-3" />}
                        <span className="flex-1 truncate">{r.name}</span>
                        <span className="text-zinc-600">{formatSize(r.compressedSize)} → {formatSize(r.extractedSize)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800/50 flex justify-between items-center">
          {step === 'config' && (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleScan}
                disabled={!sourceFolder}
                className="flex items-center gap-2 px-6 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FolderOpen className="w-4 h-4" />
                Escanear Pasta
              </button>
            </>
          )}

          {step === 'files' && (
            <>
              <button
                onClick={() => setStep('config')}
                className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleStartExtraction}
                className="flex items-center gap-2 px-6 py-2.5 bg-retro-success/10 text-retro-success border border-retro-success/30 rounded-xl font-medium hover:bg-retro-success/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Iniciar Extração ({supportedFiles.length})
              </button>
            </>
          )}

          {step === 'extracting' && (
            <>
              <div className="text-xs text-zinc-600">
                {log.filter(l => l.status === 'complete').length} concluído(s) · {log.filter(l => l.status === 'error').length} erro(s)
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2.5 bg-retro-danger/10 text-retro-danger border border-retro-danger/30 rounded-xl font-medium hover:bg-retro-danger/20 transition-all active:scale-95"
              >
                <Square className="w-4 h-4" />
                Cancelar
              </button>
            </>
          )}

          {step === 'summary' && (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-8 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Fechar
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}