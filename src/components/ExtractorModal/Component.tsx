import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LuX, LuFolderOpen, LuArchive, LuFolderPlus, LuTrash2, LuSquare, LuCircleCheckBig,
  LuCircleX, LuTriangleAlert, LuFileText, LuChevronRight, LuChevronLeft, LuDownload,
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
  DiskSpaceCard, DiskSpaceBarContainer, DiskSpaceBarBg, DiskSpaceBarFill, DiskSpaceBarPulse,
  DiskSpaceRow, DiskSpaceLabel, DiskSpaceValue, DiskSpaceWarning,
  ConfirmOverlay, ConfirmDialog, ConfirmTitle, ConfirmMessage, ConfirmActions,
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
  status: 'pending' | 'extracting' | 'complete' | 'error' | 'paused';
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
  const [cancelling, setCancelling] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [completedExtractedFiles, setCompletedExtractedFiles] = useState<Set<string>>(new Set());
  const logRef = useRef<HTMLDivElement>(null);

  const completedCount = log.filter(l => l.status === 'complete' || l.status === 'error').length;
  const totalCount = log.length > 0 ? Math.max(...log.map(l => l.total)) : 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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

        if (bgStatus.fileStatuses && bgStatus.fileStatuses.length > 0) {
          setLog(bgStatus.fileStatuses.map((fs, i) => ({
            fileName: fs.fileName,
            status: fs.status as ExtractionLogEntry['status'],
            progress: fs.progress,
            compressedSize: fs.compressedSize,
            extractedSize: fs.extractedSize,
            fileCount: fs.fileCount,
            error: fs.error,
            index: i,
            total: bgStatus.total,
          })));
        }

        window.api.onExtractionProgress((data: any) => {
          handleProgressEvent(data);
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

  const handleProgressEvent = useCallback((data: any) => {
    if (data.type === 'file-start') {
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
      setLog((prev) => {
        const idx = prev.findIndex(l => l.index === data.index);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], status: 'extracting', progress: data.progress, extractedSize: data.extractedSize };
          return updated;
        }
        return [...prev, {
          fileName: data.fileName, status: 'extracting', progress: data.progress,
          compressedSize: data.compressedSize || 0, extractedSize: data.extractedSize,
          fileCount: 0, index: data.index, total: data.total,
        }];
      });
    } else if (data.type === 'file-complete') {
      setLog((prev) => {
        const idx = prev.findIndex(l => l.index === data.index);
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
      setLog((prev) => {
        const idx = prev.findIndex(l => l.index === data.index);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], status: 'error', progress: 0, error: data.error };
          return updated;
        }
        return [...prev, {
          fileName: data.fileName, status: 'error', progress: 0,
          compressedSize: 0, extractedSize: 0, fileCount: 0,
          error: data.error, index: data.index, total: data.total,
        }];
      });
    } else if (data.type === 'disk-error') {
      onToast(
        `Espaço insuficiente! Necessário: ~${formatSize(data.needed)}, Disponível: ${formatSize(data.free)}`,
        'error'
      );
      setCancelling(false);
      setStep('config');
    } else if (data.type === 'complete') {
      setCancelling(false);
      setResults(data.results);
      setStats({
        successCount: data.successCount, errorCount: data.errorCount,
        cancelledCount: data.cancelledCount, totalExtracted: data.totalExtracted,
        totalCompressed: data.totalCompressed, totalFiles: data.totalFiles,
      });
      setStep('summary');
      window.api.removeExtractionProgressListener();
    }
  }, [onToast]);

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

  const doScan = useCallback(async (folder: string, resume?: boolean) => {
    setStep('scanning');
    setScanProgress({ progress: 0, scanned: 0, total: 0, found: 0 });

    window.api.onScanCompressedProgress((data) => {
      setScanProgress({ progress: data.progress, scanned: data.scanned, total: data.total, found: data.found });
    });

    try {
      const result = await window.api.scanCompressed(folder);
      setFiles(result.files);

      // Verifica arquivos já extraídos a partir do progress log
      const completedSet = new Set<string>();
      try {
        const progressLog = await window.api.readProgressLog(folder);
        if (progressLog?.completedFiles && progressLog.completedFiles.length > 0) {
          const logMode = progressLog.mode || 'own-folder';
          for (const cf of progressLog.completedFiles) {
            if (cf.status === 'success') {
              // Determina o caminho da saída extraída baseado no mode
              let extractedPath: string;
              if (logMode === 'own-folder') {
                const dirName = cf.name.replace(/\.[^.]+$/, '').replace(/\.tar$/, '');
                extractedPath = cf.path.replace(/[^/\\]+$/, dirName);
              } else {
                extractedPath = require('path').dirname(cf.path);
              }

              // Verifica se o diretório/arquivo extraído existe
              try {
                const extractedExists = await window.api.checkFileExists(extractedPath);
                if (!extractedExists) continue;

                // Se tem fileCount/extractedSize salvos, valida contra o conteúdo real
                if (cf.fileCount && cf.fileCount > 0) {
                  const actualCount = await window.api.countDirEntries(extractedPath);
                  if (actualCount < cf.fileCount) continue; // Extração incompleta
                }
                if (cf.extractedSize && cf.extractedSize > 0) {
                  const actualSize = await window.api.getDirSize(extractedPath);
                  // Tolerância de 5% — arquivos parciais podem ter tamanho próximo mas conteúdo incompleto
                  if (actualSize < cf.extractedSize * 0.95) continue;
                }

                completedSet.add(cf.path);
              } catch { }
            }
          }
        }
      } catch { }
      setCompletedExtractedFiles(completedSet);

      // Seleciona apenas arquivos que ainda não foram extraídos
      const extractableFiles = result.files.filter(f =>
        ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext) && !completedSet.has(f.path)
      );
      setSelectedFiles(new Set(extractableFiles.map(f => f.path)));

      window.api.removeScanCompressedProgressListener();

      try {
        const space = await window.api.getDiskSpace(folder);
        setDiskSpace({ free: space.free, estimated: result.estimatedExtractedSize });
      } catch {
        setDiskSpace(null);
      }

      if (result.files.length === 0) {
        onToast('Nenhum arquivo comprimido encontrado.', 'info');
        setStep('config');
      } else {
        setStep('files');
        if (resume) {
          handleStartExtraction(true);
        }
      }
    } catch {
      onToast('Erro ao escanear pasta.', 'error');
      window.api.removeScanCompressedProgressListener();
      setStep('config');
    }
  }, [onToast]);

  const handleScan = useCallback(async () => {
    if (!sourceFolder) return;
    await doScan(sourceFolder);
  }, [sourceFolder, doScan]);

  const supportedFiles = files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const unsupportedFiles = files.filter(f => !['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext));
  const selectedSupportedFiles = supportedFiles.filter(f => selectedFiles.has(f.path));
  const totalCompressedSize = selectedSupportedFiles.reduce((sum, f) => sum + f.size, 0);
  const allSelected = supportedFiles.length > 0 && supportedFiles.filter(f => !completedExtractedFiles.has(f.path)).every(f => selectedFiles.has(f.path));

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
      setSelectedFiles(new Set(supportedFiles.filter(f => !completedExtractedFiles.has(f.path)).map(f => f.path)));
    }
  }, [allSelected, supportedFiles, completedExtractedFiles]);

  const handleStartExtraction = useCallback(async (resume?: boolean) => {
    setStep('extracting');
    setResults([]);
    setStats({ successCount: 0, errorCount: 0, cancelledCount: 0, totalExtracted: 0, totalCompressed: 0, totalFiles: 0 });
    setCancelling(false);

    const filesToExtract = resume ? files.filter(f => ['.zip', '.rar', '.7z', '.tar', '.gz', '.tar.gz'].includes(f.ext)) : selectedSupportedFiles;

    setLog(filesToExtract.map((f, i) => ({
      fileName: f.name,
      status: 'pending' as const,
      progress: 0,
      compressedSize: f.size,
      extractedSize: 0,
      fileCount: 0,
      index: i,
      total: filesToExtract.length,
    })));

    window.api.onExtractionProgress((data: any) => {
      handleProgressEvent(data);
    });

    window.api.startExtraction({ files: filesToExtract, mode, deleteAfter, resume });
  }, [selectedSupportedFiles, mode, deleteAfter, files, handleProgressEvent]);

  const handleCancel = useCallback(async () => {
    setShowCancelConfirm(false);
    setCancelling(true);
    try {
      const result = await window.api.cancelExtraction();
      // Após cancelar, exibe resultado parcial
      if (result) {
        setResults((result.results || []) as ExtractionResult[]);
        setStats({
          successCount: result.successCount || 0,
          errorCount: result.errorCount || 0,
          cancelledCount: result.cancelledCount || 0,
          totalExtracted: result.totalExtracted || 0,
          totalCompressed: result.totalCompressed || 0,
          totalFiles: result.totalFiles || 0,
        });
        window.api.removeExtractionProgressListener();
        setStep('summary');
      } else {
        setStep('config');
      }
    } catch {
      setStep('config');
    }
    setCancelling(false);
  }, []);

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
                                await doScan(sourceFolder, true);
                              }}
                            >
                              <LuDownload size={16} />
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

                {diskSpace && (() => {
                  const COMPRESSION_RATIO = 3;
                  const totalNeeded = totalCompressedSize * COMPRESSION_RATIO;
                  const freeUnknown = diskSpace.free <= 0;
                  const hasEnough = freeUnknown ? true : diskSpace.free >= totalNeeded;
                  const ratio = freeUnknown ? 0 : (diskSpace.free > 0 ? Math.min((totalNeeded / diskSpace.free) * 100, 100) : 0);

                  return (
                    <DiskSpaceCard $warning={!hasEnough}>
                      <DiskSpaceBarContainer>
                        <DiskSpaceBarBg>
                          <DiskSpaceBarFill
                            $warning={!hasEnough}
                            initial={{ width: '0%' }}
                            animate={{ width: `${ratio}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                          {!hasEnough && (
                            <DiskSpaceBarPulse
                              $warning
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </DiskSpaceBarBg>
                      </DiskSpaceBarContainer>
                      <DiskSpaceRow>
                        <DiskSpaceLabel>Necessário</DiskSpaceLabel>
                        <DiskSpaceValue $warning={!hasEnough}><AnimatedSizeValue value={totalNeeded} /></DiskSpaceValue>
                      </DiskSpaceRow>
                      <DiskSpaceRow>
                        <DiskSpaceLabel>Disponível</DiskSpaceLabel>
                        <DiskSpaceValue>{freeUnknown ? 'Não identificado' : <AnimatedSizeValue value={diskSpace.free} />}</DiskSpaceValue>
                      </DiskSpaceRow>
                      {!hasEnough && (
                        <DiskSpaceWarning>
                          <LuTriangleAlert size={14} />
                          Espaço insuficiente para esta extração
                        </DiskSpaceWarning>
                      )}
                    </DiskSpaceCard>
                  );
                })()}

                <FileList>
                  {supportedFiles.map((f) => {
                    const isCompleted = completedExtractedFiles.has(f.path);
                    return (
                      <FileItem
                        key={f.path}
                        $selected={selectedFiles.has(f.path)}
                        onClick={() => !isCompleted && handleToggleFile(f.path)}
                        style={isCompleted ? { opacity: 0.5, cursor: 'default' } : undefined}
                      >
                        <FileCheckbox $checked={selectedFiles.has(f.path)}>
                          {isCompleted ? (
                            <LuCircleCheckBig size={12} color="#22c55e" />
                          ) : selectedFiles.has(f.path) ? (
                            <LuCircleCheckBig size={12} />
                          ) : null}
                        </FileCheckbox>
                        <LuArchive size={16} color={isCompleted ? '#22c55e' : '#818cf8'} />
                        <FileItemName>{f.name}</FileItemName>
                        {isCompleted && (
                          <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 500 }}>Extraído</span>
                        )}
                        <FileItemExt>{f.ext}</FileItemExt>
                        <FileItemSize>{formatSize(f.size)}</FileItemSize>
                      </FileItem>
                    );
                  })}
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
                      {completedCount} / {totalCount}
                    </span>
                  </ScanLabel>
                  <ExtractionsBarBg>
                    <ExtractionsBarFill
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </ExtractionsBarBg>
                </ExtractionProgress>

                <ExtractionLog ref={logRef}>
                  {log.map((entry) => (
                    <ExtractionEntry
                      key={`${entry.fileName}-${entry.index}`}
                      $status={entry.status}
                    >
                      <ExtractionEntryHeader>
                        {entry.status === 'complete' ? <LuCircleCheckBig size={16} color="#22c55e" /> :
                         entry.status === 'error' ? <LuCircleX size={16} color="#ef4444" /> :
                         entry.status === 'pending' ? <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #52525b', display: 'inline-block', flexShrink: 0 }} /> :
                         <SpinnerIcon size={16} color="#818cf8" />}
                        <ExtractionEntryName>{entry.fileName}</ExtractionEntryName>
                        <ExtractionEntryPercent>
                          {entry.status === 'pending' ? 'Aguardando' :
                           `${entry.progress.toFixed(0)}%`}
                        </ExtractionEntryPercent>
                      </ExtractionEntryHeader>
                      {entry.status === 'extracting' && (
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
                </ExtractionLog>
              </ExtractionSection>
            )}

            {step === 'summary' && (
              <SummarySection>
                <StatsGrid>
                  <StatCard $variant="success">
                    <LuCircleCheckBig size={24} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                    <StatValue $color="#22c55e"><AnimatedCounter value={stats.successCount} /></StatValue>
                    <StatLabel>Extraídos com sucesso</StatLabel>
                  </StatCard>
                  {stats.errorCount > 0 && (
                    <StatCard $variant="danger">
                      <LuCircleX size={24} color="#ef4444" style={{ margin: '0 auto 0.5rem' }} />
                      <StatValue $color="#ef4444"><AnimatedCounter value={stats.errorCount} /></StatValue>
                      <StatLabel>Erros</StatLabel>
                    </StatCard>
                  )}
                  {stats.cancelledCount > 0 && (
                    <StatCard $variant="muted">
                      <LuTriangleAlert size={24} color="#71717a" style={{ margin: '0 auto 0.5rem' }} />
                      <StatValue $color="#a1a1aa"><AnimatedCounter value={stats.cancelledCount} /></StatValue>
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
                      <SizeValue $color="#d4d4d8"><AnimatedSizeValue value={stats.totalCompressed} /></SizeValue>
                      <SizeLabel>Compactado</SizeLabel>
                    </div>
                    <div>
                      <SizeValue $color="#818cf8"><AnimatedSizeValue value={stats.totalExtracted} /></SizeValue>
                      <SizeLabel>Extraído</SizeLabel>
                    </div>
                    <div>
                      <SizeValue $color="#d4d4d8"><AnimatedCounter value={stats.totalFiles} /></SizeValue>
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
              <FooterButton onClick={onClose}>
                <LuX size={16} />
                Cancelar
              </FooterButton>
              <FooterButton $variant="primary" onClick={handleScan} disabled={!sourceFolder}>
                <LuFolderOpen size={16} />
                Escanear Pasta
              </FooterButton>
            </>
          )}

          {step === 'files' && (() => {
            const COMPRESSION_RATIO = 3;
            const totalNeeded = totalCompressedSize * COMPRESSION_RATIO;
            const freeUnknown = !diskSpace || diskSpace.free <= 0;
            const hasEnoughSpace = freeUnknown ? false : diskSpace.free >= totalNeeded;
            const extractionDisabled = selectedSupportedFiles.length === 0 || !hasEnoughSpace;

            return (
              <>
                <FooterButton onClick={() => setStep('config')}>
                  <LuChevronLeft size={16} />
                  Voltar
                </FooterButton>
                <FooterButton
                  $variant="success"
                  onClick={() => handleStartExtraction()}
                  disabled={extractionDisabled}
                  title={!hasEnoughSpace ? (freeUnknown ? 'Espaço em disco não identificado' : 'Espaço insuficiente em disco') : undefined}
                >
                  <LuArchive size={16} />
                  Iniciar Extração ({selectedSupportedFiles.length})
                </FooterButton>
              </>
            );
          })()}

          {step === 'extracting' && (
            <>
              {cancelling ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SpinnerIcon size={14} color="#ef4444" />
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>Cancelando extração...</span>
                </div>
              ) : (
                <FooterStats>
                  {log.filter(l => l.status === 'complete').length} concluído(s) · {log.filter(l => l.status === 'error').length} erro(s)
                </FooterStats>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <FooterButton $variant="danger" onClick={() => setShowCancelConfirm(true)} disabled={cancelling}>
                  {cancelling ? <SpinnerIcon size={16} color="#ef4444" /> : <LuSquare size={16} />}
                  {cancelling ? 'Cancelando...' : 'Cancelar'}
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

        <AnimatePresence>
          {showCancelConfirm && !cancelling && (
            <ConfirmOverlay onClick={() => setShowCancelConfirm(false)}>
              <ConfirmDialog onClick={(e) => e.stopPropagation()}>
                <LuTriangleAlert size={32} color="#fbbf24" style={{ margin: '0 auto 0.75rem' }} />
                <ConfirmTitle>Cancelar Extração?</ConfirmTitle>
                <ConfirmMessage>
                  Os arquivos já extraídos serão mantidos, mas a extração dos arquivos restantes será interrompida.
                </ConfirmMessage>
                <ConfirmActions>
                  <TextButton onClick={() => setShowCancelConfirm(false)}>
                    <LuChevronLeft size={14} />
                    Voltar
                  </TextButton>
                  <FooterButton $variant="danger" onClick={handleCancel}>
                    <LuSquare size={16} />
                    Confirmar Cancelamento
                  </FooterButton>
                </ConfirmActions>
              </ConfirmDialog>
            </ConfirmOverlay>
          )}
        </AnimatePresence>
      </ModalContent>
    </Overlay>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 600;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}</>;
}

function AnimatedSizeValue({ value }: { value: number }) {
  const [display, setDisplay] = useState('0 B');

  useEffect(() => {
    if (value === 0) { setDisplay('0 B'); return; }
    const duration = 800;
    const steps = 40;
    const increment = value / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), value);
      setDisplay(formatSize(current));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}</>;
}
