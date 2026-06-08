import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LuX, LuFolderOpen, LuArchive, LuFolderPlus, LuTrash2, LuSquare, LuCircleCheckBig,
  LuCircleX, LuTriangleAlert, LuFileText, LuChevronRight, LuDownload, LuPlay, LuPause,
} from "react-icons/lu";
import {
  MotionDiv, Overlay, ModalContent, Header, HeaderLeft, Title, CloseButton,
  StepsBar, StepsRow, StepItem, StepBadge, StepCircle,
  SpinnerIcon, SectionLabel, FolderSelector, FolderText,
  ResumeDialog, ResumeHeader, ResumeTitle, ResumeSubtitle, ResumeActions,
  TextButton, PrimaryButton,
  ModeGrid, ModeButton, ModeLabel, ModeDesc,
  ToggleRow, ToggleLabel, ToggleDesc, ToggleTrack, ToggleThumb,
  FormatsInfo, FormatsText, FormatExt,
  ScanCenter, ScanProgress, ScanLabel, ScanBarBg, ScanBarFill, ScanFooter, FoundText,
  FilesSection, FilesHeader, FilesCount, FilesSize, FilesToolbar, ToolbarButton, FileList,
  FileItem, FileCheckbox, FileItemName, FileItemExt, FileItemSize,
  UnsupportedLabel, UnsupportedItem, UnsupportedName, UnsupportedExt,
  ExtractionSection, ExtractionProgress, ExtractionsBarBg, ExtractionsBarFill,
  ExtractionLog, ExtractionEntry, ExtractionEntryHeader, ExtractionEntryName,
  ExtractionEntryPercent, ExtractionEntryBar, ExtractionEntryBarFill,
  ExtractionEntryStats, ExtractionEntryError,
  SummarySection, StatsGrid, StatCard, StatValue, StatLabel,
  SizeSummary, SizeGrid, SizeValue, SizeLabel,
  ErrorList, ErrorItem, ErrorItemName, ErrorItemMessage,
  FullLogEntry, FullLogName, FullLogSize,
  Footer, FooterButton, FooterStats, FooterFullWidth,
  ScrollableContent,
  DiskSpaceCard, DiskSpaceRow, DiskSpaceLabel, DiskSpaceValue, DiskSpaceWarning,
  CurrentFileSection, CurrentFileHeader, CurrentFileName, CurrentFilePercent,
  CurrentFileBarBg, CurrentFileBarFill,
  PauseButton, PausedLabel,
} from './styles';

interface ExtractorModalProps {
  onClose: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  initialStep?: Step;
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
  status: 'extracting' | 'progress' | 'complete' | 'error' | 'pending';
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

const stepsConfig = ['config', 'files', 'extracting', 'summary'] as const;
const stepLabels = ['Configurar', 'Arquivos', 'Extraindo', 'Resultado'];

export function ExtractorModal({ onClose, onToast, initialStep }: ExtractorModalProps) {
  const [step, setStep] = useState<Step>(initialStep ?? 'config');
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
  const [scanProgress, setScanProgress] = useState({ progress: 0, scanned: 0, total: 0, found: 0 });
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [diskSpace, setDiskSpace] = useState<{ free: number; estimated: number } | null>(null);
  const [currentFile, setCurrentFile] = useState<{ name: string; progress: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    if (initialStep !== 'extracting') return;

    const init = async () => {
      const bgStatus = await window.api.getBackgroundExtractionStatus();
      if (bgStatus?.active) {
        setSourceFolder(bgStatus.folder);
        setStep('extracting');
        setIsPaused(bgStatus.paused);

        if (bgStatus.completed > 0 && bgStatus.total > 0) {
          setLog((prev) => {
            if (prev.length > 0) return prev;
            return Array.from({ length: bgStatus.total }, (_, i) => ({
              fileName: `Arquivo ${i + 1}`,
              status: (i < bgStatus.completed ? 'complete' : 'pending') as 'complete' | 'pending',
              progress: i < bgStatus.completed ? 100 : 0,
              compressedSize: 0,
              extractedSize: 0,
              fileCount: 0,
              index: i + 1,
              total: bgStatus.total,
            }));
          });
        }

        window.api.onExtractionProgress((data: any) => {
          if (data.type === 'file-start') {
            setCurrentFile({ name: data.fileName, progress: 0 });
            setLog((prev) => {
              const idx = prev.findIndex(l => l.index === data.index);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], fileName: data.fileName, status: 'extracting', progress: 0, compressedSize: data.compressedSize };
                return updated;
              }
              return [...prev, {
                fileName: data.fileName, status: 'extracting', progress: 0,
                compressedSize: data.compressedSize, extractedSize: 0,
                fileCount: 0, index: data.index, total: data.total,
              }];
            });
          } else if (data.type === 'file-progress') {
            setCurrentFile({ name: data.fileName, progress: data.progress });
            setLog((prev) => {
              const idx = prev.findIndex(l => l.fileName === data.fileName || l.index === data.index);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], status: 'progress', progress: data.progress, extractedSize: data.extractedSize };
                return updated;
              }
              return [...prev, {
                fileName: data.fileName, status: 'progress', progress: data.progress,
                compressedSize: data.compressedSize || 0, extractedSize: data.extractedSize,
                fileCount: 0, index: data.index, total: data.total,
              }];
            });
          } else if (data.type === 'file-complete') {
            setCurrentFile((prev) => prev?.name === data.fileName ? { name: data.fileName, progress: 100 } : prev);
            setLog((prev) => {
              const idx = prev.findIndex(l => l.fileName === data.fileName || l.index === data.index);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], status: 'complete', progress: 100, extractedSize: data.extractedSize, fileCount: data.fileCount };
                return updated;
              }
              return [...prev, {
                fileName: data.fileName, status: 'complete', progress: 100,
                compressedSize: 0, extractedSize: data.extractedSize,
                fileCount: data.fileCount, index: data.index, total: data.total,
              }];
            });
          } else if (data.type === 'file-error') {
            setCurrentFile(null);
            setLog((prev) => [...prev, {
              fileName: data.fileName, status: 'error', progress: 0,
              compressedSize: 0, extractedSize: 0, fileCount: 0,
              error: data.error, index: data.index, total: data.total,
            }]);
          } else if (data.type === 'paused') {
            setIsPaused(true);
          } else if (data.type === 'resumed') {
            setIsPaused(false);
          } else if (data.type === 'complete') {
            setCurrentFile(null);
            setIsPaused(false);
            setResults(data.results);
            setStats({
              successCount: data.successCount, errorCount: data.errorCount,
              cancelledCount: data.cancelledCount, totalExtracted: data.totalExtracted,
              totalCompressed: data.totalCompressed, totalFiles: data.totalFiles,
            });
            setStep('summary');
            window.api.removeExtractionProgressListener();
          }
        });
      } else {
        setStep('config');
      }
    };

    init();

    return () => {
      window.api.removeExtractionProgressListener();
    };
  }, [initialStep]);

  const handleSelectFolder = useCallback(async () => {
    const folder = await window.api.selectFolder();
    if (folder) {
      setSourceFolder(folder);
      const existingLog = await window.api.readProgressLog(folder);
      if (existingLog?.type === 'extraction' && !existingLog.complete && !existingLog.cancelled) {
        setShowResumeDialog(true);
      }
    }
  }, []);

  const handleScan = useCallback(async () => {
    if (!sourceFolder) return;
    setStep('scanning');
    setScanProgress({ progress: 0, scanned: 0, total: 0, found: 0 });

    window.api.onScanCompressedProgress((data) => {
      setScanProgress({ progress: data.progress, scanned: data.scanned, total: data.total, found: data.found });
    });

    try {
      const result = await window.api.scanCompressed(sourceFolder);
      setFiles(result.files);
      setSelectedFiles(new Set(result.files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext)).map(f => f.path)));
      window.api.removeScanCompressedProgressListener();

      try {
        const space = await window.api.getDiskSpace(sourceFolder);
        setDiskSpace({ free: space.free, estimated: result.estimatedExtractedSize });
      } catch {
        setDiskSpace(null);
      }

      if (result.files.length === 0) {
        onToast('Nenhum arquivo comprimido encontrado.', 'info');
        setStep('config');
      } else {
        setStep('files');
      }
    } catch {
      onToast('Erro ao escanear pasta.', 'error');
      window.api.removeScanCompressedProgressListener();
      setStep('config');
    }
  }, [sourceFolder, onToast]);

  const supportedFiles = files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const unsupportedFiles = files.filter(f => !['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const selectedSupportedFiles = supportedFiles.filter(f => selectedFiles.has(f.path));
  const totalCompressedSize = selectedSupportedFiles.reduce((sum, f) => sum + f.size, 0);
  const allSelected = supportedFiles.length > 0 && supportedFiles.every(f => selectedFiles.has(f.path));

  const handleToggleFile = useCallback((path: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (allSelected) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(supportedFiles.map(f => f.path)));
    }
  }, [allSelected, supportedFiles]);

  const handleStartExtraction = useCallback(async (resume?: boolean) => {
    setStep('extracting');
    setLog([]);
    setResults([]);
    setStats({ successCount: 0, errorCount: 0, cancelledCount: 0, totalExtracted: 0, totalCompressed: 0, totalFiles: 0 });
    setCurrentFile(null);
    setIsPaused(false);

    window.api.onExtractionProgress((data) => {
      if (data.type === 'file-start') {
        setCurrentFile({ name: data.fileName, progress: 0 });
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
        setCurrentFile({ name: data.fileName, progress: data.progress });
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
        setCurrentFile((prev) => prev?.name === data.fileName ? { name: data.fileName, progress: 100 } : prev);
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
        setCurrentFile(null);
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
      } else if (data.type === 'paused') {
        setIsPaused(true);
        setCurrentFile((prev) => prev ? { name: prev.name, progress: prev.progress } : null);
      } else if (data.type === 'resumed') {
        setIsPaused(false);
      } else if (data.type === 'complete') {
        setCurrentFile(null);
        setIsPaused(false);
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

    window.api.startExtraction({ files: selectedSupportedFiles, mode, deleteAfter, resume });
  }, [selectedSupportedFiles, mode, deleteAfter]);

  const handleCancel = useCallback(async () => {
    await window.api.cancelExtraction();
  }, []);

  const handlePauseResume = useCallback(async () => {
    if (isPaused) {
      await window.api.resumeExtraction();
    } else {
      await window.api.pauseExtraction();
    }
  }, [isPaused]);

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <LuArchive size={20} color="#818cf8" />
            <Title>Extrator de ROMs</Title>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX size={20} />
          </CloseButton>
        </Header>

        <StepsBar>
          <StepsRow>
            {stepsConfig.map((s, idx) => {
              const isActive = s === step || (step === 'scanning' && s === 'config');
              const isDone = ['files', 'extracting', 'summary'].indexOf(step) > idx;
              return (
                <StepItem key={s}>
                  <StepBadge $active={isActive} $done={isDone}>
                    {isDone ? <LuCircleCheckBig size={12} /> : <StepCircle>{idx + 1}</StepCircle>}
                    {stepLabels[idx]}
                  </StepBadge>
                  {idx < 3 && <LuChevronRight size={12} color="#3f3f46" />}
                </StepItem>
              );
            })}
          </StepsRow>
        </StepsBar>

        <ScrollableContent>
          <AnimatePresence mode="wait">
            {step === 'config' && (
              <MotionDiv
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <SectionLabel>Pasta com ROMs comprimidas</SectionLabel>
                  <FolderSelector onClick={handleSelectFolder}>
                    <LuFolderOpen size={20} />
                    <FolderText>{sourceFolder || 'Clique para selecionar a pasta...'}</FolderText>
                  </FolderSelector>

                  <AnimatePresence>
                    {showResumeDialog && sourceFolder && (
                      <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <ResumeDialog>
                          <ResumeHeader>
                            <LuTriangleAlert size={20} color="#fbbf24" style={{ flexShrink: 0 }} />
                            <div>
                              <ResumeTitle>Extrações Anteriores Encontradas</ResumeTitle>
                              <ResumeSubtitle>Há extrações incompletas nesta pasta. Deseja retomar?</ResumeSubtitle>
                            </div>
                          </ResumeHeader>
                          <ResumeActions>
                            <TextButton
                              onClick={async () => {
                                await window.api.deleteProgressLog(sourceFolder);
                                setShowResumeDialog(false);
                              }}
                            >
                              Começar do Início
                            </TextButton>
                            <PrimaryButton
                              onClick={async () => {
                                setShowResumeDialog(false);
                                setStep('scanning');
                                setScanProgress({ progress: 0, scanned: 0, total: 0, found: 0 });

                                window.api.onScanCompressedProgress((data) => {
                                  setScanProgress({ progress: data.progress, scanned: data.scanned, total: data.total, found: data.found });
                                });

                                try {
                                  const result = await window.api.scanCompressed(sourceFolder);
                                  setFiles(result.files);
                                  setSelectedFiles(new Set(result.files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext)).map(f => f.path)));
                                  window.api.removeScanCompressedProgressListener();

                                  try {
                                    const space = await window.api.getDiskSpace(sourceFolder);
                                    setDiskSpace({ free: space.free, estimated: result.estimatedExtractedSize });
                                  } catch {
                                    setDiskSpace(null);
                                  }

                                  if (result.files.length === 0) {
                                    onToast('Nenhum arquivo comprimido encontrado.', 'info');
                                    setStep('config');
                                  } else {
                                    setStep('files');
                                    handleStartExtraction(true);
                                  }
                                } catch {
                                  onToast('Erro ao escanear pasta.', 'error');
                                  window.api.removeScanCompressedProgressListener();
                                  setStep('config');
                                }
                              }}
                            >
                              <LuPlay size={16} />
                              Retomar
                            </PrimaryButton>
                          </ResumeActions>
                        </ResumeDialog>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <SectionLabel>Modo de extração</SectionLabel>
                  <ModeGrid>
                    <ModeButton $active={mode === 'own-folder'} onClick={() => setMode('own-folder')}>
                      <LuFolderPlus size={16} />
                      <div style={{ textAlign: 'left' }}>
                        <ModeLabel>Pasta própria</ModeLabel>
                        <ModeDesc>Cria uma pasta para cada arquivo</ModeDesc>
                      </div>
                    </ModeButton>
                    <ModeButton $active={mode === 'in-place'} onClick={() => setMode('in-place')}>
                      <LuFolderOpen size={16} />
                      <div style={{ textAlign: 'left' }}>
                        <ModeLabel>Na pasta atual</ModeLabel>
                        <ModeDesc>Extrai no mesmo diretório</ModeDesc>
                      </div>
                    </ModeButton>
                  </ModeGrid>
                </div>

                <ToggleRow>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LuTrash2 size={16} color="#71717a" />
                    <div>
                      <ToggleLabel>Excluir arquivo após extração</ToggleLabel>
                      <ToggleDesc>Remove o arquivo original após sucesso</ToggleDesc>
                    </div>
                  </div>
                  <ToggleTrack $active={deleteAfter} onClick={() => setDeleteAfter(!deleteAfter)}>
                    <ToggleThumb $active={deleteAfter} />
                  </ToggleTrack>
                </ToggleRow>

                <FormatsInfo>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <LuFileText size={16} color="#71717a" style={{ marginTop: 2 }} />
                    <FormatsText>
                      Formatos suportados: <FormatExt>.zip</FormatExt>, <FormatExt>.rar</FormatExt>, <FormatExt>.7z</FormatExt>, <FormatExt>.tar</FormatExt>, <FormatExt>.gz</FormatExt>, <FormatExt>.tar.gz</FormatExt>
                    </FormatsText>
                  </div>
                </FormatsInfo>
              </MotionDiv>
            )}

            {step === 'scanning' && (
              <ScanCenter>
                <SpinnerIcon size={48} color="#818cf8" />
                <ScanProgress>
                  <ScanLabel>
                    <span style={{ color: '#a1a1aa' }}>Escaneando pasta...</span>
                    <span style={{ color: '#d4d4d8' }}>{scanProgress.progress}%</span>
                  </ScanLabel>
                  <ScanBarBg>
                    <ScanBarFill
                      initial={{ width: '0%' }}
                      animate={{ width: `${scanProgress.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </ScanBarBg>
                  <ScanFooter>
                    <span>{scanProgress.scanned} arquivos verificados</span>
                    {scanProgress.found > 0 && (
                      <FoundText>{scanProgress.found} encontrado(s)</FoundText>
                    )}
                  </ScanFooter>
                </ScanProgress>
              </ScanCenter>
            )}

            {step === 'files' && (
              <FilesSection>
                <FilesHeader>
                  <FilesCount>
                    {selectedSupportedFiles.length} de {supportedFiles.length} arquivo(s) selecionado(s)
                    {unsupportedFiles.length > 0 && ` · ${unsupportedFiles.length} não suportado(s)`}
                  </FilesCount>
                  <FilesSize>{formatSize(totalCompressedSize)} total</FilesSize>
                </FilesHeader>

                <FilesToolbar>
                  <ToolbarButton onClick={handleToggleAll}>
                    {allSelected ? <LuCircleX size={14} /> : <LuCircleCheckBig size={14} />}
                    {allSelected ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                  </ToolbarButton>
                </FilesToolbar>

                {diskSpace && (
                  <DiskSpaceCard $warning={diskSpace.estimated > diskSpace.free}>
                    <DiskSpaceRow>
                      <DiskSpaceLabel>Tamanho comprimido:</DiskSpaceLabel>
                      <DiskSpaceValue>{formatSize(totalCompressedSize)}</DiskSpaceValue>
                    </DiskSpaceRow>
                    <DiskSpaceRow>
                      <DiskSpaceLabel>Espaço estimado para extração:</DiskSpaceLabel>
                      <DiskSpaceValue>{formatSize(diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)))} (estimativa)</DiskSpaceValue>
                    </DiskSpaceRow>
                    <DiskSpaceRow>
                      <DiskSpaceLabel>Espaço necessário total:</DiskSpaceLabel>
                      <DiskSpaceValue $warning={deleteAfter && diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)) > diskSpace.free}>
                        {formatSize(deleteAfter ? diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)) : totalCompressedSize + diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)))}
                      </DiskSpaceValue>
                    </DiskSpaceRow>
                    {diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)) > diskSpace.free && (
                      <DiskSpaceWarning>
                        <LuTriangleAlert size={14} />
                        Espaço insuficiente! Necessário: {formatSize(diskSpace.estimated * (selectedSupportedFiles.length / Math.max(supportedFiles.length, 1)))}, Disponível: {formatSize(diskSpace.free)}
                      </DiskSpaceWarning>
                    )}
                  </DiskSpaceCard>
                )}

                <FileList>
                  {supportedFiles.map((f) => (
                    <FileItem key={f.path} $selected={selectedFiles.has(f.path)} onClick={() => handleToggleFile(f.path)}>
                      <FileCheckbox $checked={selectedFiles.has(f.path)}>
                        {selectedFiles.has(f.path) && <LuCircleCheckBig size={12} />}
                      </FileCheckbox>
                      <LuArchive size={16} color="#818cf8" />
                      <FileItemName>{f.name}</FileItemName>
                      <FileItemExt>{f.ext}</FileItemExt>
                      <FileItemSize>{formatSize(f.size)}</FileItemSize>
                    </FileItem>
                  ))}
                </FileList>

                {unsupportedFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <UnsupportedLabel>Arquivos não suportados (serão ignorados):</UnsupportedLabel>
                    {unsupportedFiles.map((f) => (
                      <UnsupportedItem key={f.path}>
                        <LuCircleX size={12} color="#52525b" />
                        <UnsupportedName>{f.name}</UnsupportedName>
                        <UnsupportedExt>{f.ext}</UnsupportedExt>
                      </UnsupportedItem>
                    ))}
                  </div>
                )}
              </FilesSection>
            )}

            {step === 'extracting' && (
              <ExtractionSection>
                <ExtractionProgress>
                  <ScanLabel>
                    <span style={{ color: '#a1a1aa' }}>Progresso geral</span>
                    <span style={{ color: '#d4d4d8' }}>
                      {log.filter(l => l.status === 'complete' || l.status === 'error').length} / {log.length > 0 ? Math.max(...log.map(l => l.total)) : 0}
                    </span>
                  </ScanLabel>
                  <ExtractionsBarBg>
                    <ExtractionsBarFill
                      initial={{ width: '0%' }}
                      animate={{ width: `${log.length > 0 ? (log.filter(l => l.status === 'complete' || l.status === 'error').length / Math.max(...log.map(l => l.total), 1)) * 100 : 0}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </ExtractionsBarBg>
                </ExtractionProgress>

                {currentFile && (
                  <CurrentFileSection>
                    <CurrentFileHeader>
                      <CurrentFileName title={currentFile.name}>
                        {currentFile.name.length > 40 ? currentFile.name.substring(0, 37) + '...' : currentFile.name}
                      </CurrentFileName>
                      {isPaused ? (
                        <PausedLabel>Pausado</PausedLabel>
                      ) : (
                        <CurrentFilePercent>{currentFile.progress.toFixed(0)}%</CurrentFilePercent>
                      )}
                    </CurrentFileHeader>
                    <CurrentFileBarBg>
                      <CurrentFileBarFill
                        initial={{ width: '0%' }}
                        animate={{ width: `${currentFile.progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </CurrentFileBarBg>
                  </CurrentFileSection>
                )}

                <ExtractionLog ref={logRef}>
                  <AnimatePresence>
                    {log.map((entry) => (
                      <ExtractionEntry
                        key={`${entry.fileName}-${entry.index}`}
                        $status={entry.status}
                      >
                        <ExtractionEntryHeader>
                          {entry.status === 'complete' ? <LuCircleCheckBig size={16} color="#22c55e" /> :
                           entry.status === 'error' ? <LuCircleX size={16} color="#ef4444" /> :
                           <SpinnerIcon size={16} color="#818cf8" />}
                          <ExtractionEntryName>{entry.fileName}</ExtractionEntryName>
                          <ExtractionEntryPercent>{entry.progress.toFixed(0)}%</ExtractionEntryPercent>
                        </ExtractionEntryHeader>
                        {entry.status === 'progress' && (
                          <ExtractionEntryBar>
                            <ExtractionEntryBarFill
                              initial={{ width: '0%' }}
                              animate={{ width: `${entry.progress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </ExtractionEntryBar>
                        )}
                        <ExtractionEntryStats>
                          <span>Compactado: {formatSize(entry.compressedSize)}</span>
                          {entry.extractedSize > 0 && <span>Extraído: {formatSize(entry.extractedSize)}</span>}
                          {entry.fileCount > 0 && <span>{entry.fileCount} arquivo(s)</span>}
                        </ExtractionEntryStats>
                        {entry.error && (
                          <ExtractionEntryError>{entry.error}</ExtractionEntryError>
                        )}
                      </ExtractionEntry>
                    ))}
                  </AnimatePresence>
                </ExtractionLog>
              </ExtractionSection>
            )}

            {step === 'summary' && (
              <SummarySection>
                <StatsGrid>
                  <StatCard $variant="success">
                    <LuCircleCheckBig size={24} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                    <StatValue $color="#22c55e">{stats.successCount}</StatValue>
                    <StatLabel>Extraídos com sucesso</StatLabel>
                  </StatCard>
                  {stats.errorCount > 0 && (
                    <StatCard $variant="danger">
                      <LuCircleX size={24} color="#ef4444" style={{ margin: '0 auto 0.5rem' }} />
                      <StatValue $color="#ef4444">{stats.errorCount}</StatValue>
                      <StatLabel>Erros</StatLabel>
                    </StatCard>
                  )}
                  {stats.cancelledCount > 0 && (
                    <StatCard $variant="muted">
                      <LuTriangleAlert size={24} color="#71717a" style={{ margin: '0 auto 0.5rem' }} />
                      <StatValue $color="#a1a1aa">{stats.cancelledCount}</StatValue>
                      <StatLabel>Cancelados</StatLabel>
                    </StatCard>
                  )}
                </StatsGrid>

                <SizeSummary>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Resumo de tamanho</span>
                  </div>
                  <SizeGrid>
                    <div>
                      <SizeValue $color="#d4d4d8">{formatSize(stats.totalCompressed)}</SizeValue>
                      <SizeLabel>Compactado</SizeLabel>
                    </div>
                    <div>
                      <SizeValue $color="#818cf8">{formatSize(stats.totalExtracted)}</SizeValue>
                      <SizeLabel>Extraído</SizeLabel>
                    </div>
                    <div>
                      <SizeValue $color="#d4d4d8">{stats.totalFiles}</SizeValue>
                      <SizeLabel>Arquivos extraídos</SizeLabel>
                    </div>
                  </SizeGrid>
                </SizeSummary>

                {results.filter(r => r.status === 'error').length > 0 && (
                  <ErrorList>
                    <p style={{ fontSize: '0.875rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LuTriangleAlert size={16} color="#fbbf24" />
                      Erros detalhados
                    </p>
                    {results.filter(r => r.status === 'error').map((r) => (
                      <ErrorItem key={r.name}>
                        <ErrorItemName>{r.name}</ErrorItemName>
                        <ErrorItemMessage>{r.error}</ErrorItemMessage>
                      </ErrorItem>
                    ))}
                  </ErrorList>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#a1a1aa' }}>Log completo</p>
                  <div style={{ maxHeight: '12rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {results.map((r) => (
                      <FullLogEntry key={r.name} $status={r.status}>
                        {r.status === 'success' ? <LuCircleCheckBig size={12} /> :
                         r.status === 'error' ? <LuCircleX size={12} /> :
                         <LuTriangleAlert size={12} />}
                        <FullLogName>{r.name}</FullLogName>
                        <FullLogSize>{formatSize(r.compressedSize)} → {formatSize(r.extractedSize)}</FullLogSize>
                      </FullLogEntry>
                    ))}
                  </div>
                </div>
              </SummarySection>
            )}
          </AnimatePresence>
        </ScrollableContent>

        <Footer>
          {step === 'config' && (
            <>
              <FooterButton onClick={onClose}>Cancelar</FooterButton>
              <FooterButton $variant="primary" onClick={handleScan} disabled={!sourceFolder}>
                <LuFolderOpen size={16} />
                Escanear Pasta
              </FooterButton>
            </>
          )}

          {step === 'files' && (
            <>
              <FooterButton onClick={() => setStep('config')}>Voltar</FooterButton>
              <FooterButton $variant="success" onClick={() => handleStartExtraction()} disabled={selectedSupportedFiles.length === 0}>
                <LuDownload size={16} />
                Iniciar Extração ({selectedSupportedFiles.length})
              </FooterButton>
            </>
          )}

          {step === 'extracting' && (
            <>
              <FooterStats>
                {log.filter(l => l.status === 'complete').length} concluído(s) · {log.filter(l => l.status === 'error').length} erro(s)
              </FooterStats>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PauseButton $paused={isPaused} onClick={handlePauseResume}>
                  {isPaused ? <LuPlay size={16} /> : <LuPause size={16} />}
                  {isPaused ? 'Retomar' : 'Pausar'}
                </PauseButton>
                <FooterButton $variant="danger" onClick={handleCancel}>
                  <LuSquare size={16} />
                  Cancelar
                </FooterButton>
              </div>
            </>
          )}

          {step === 'summary' && (
            <FooterFullWidth>
              <FooterButton $variant="primary" onClick={onClose}>
                <LuCircleCheckBig size={16} />
                Fechar
              </FooterButton>
            </FooterFullWidth>
          )}
        </Footer>
      </ModalContent>
    </Overlay>
  );
}
