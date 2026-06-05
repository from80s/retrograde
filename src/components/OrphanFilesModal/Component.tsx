import { useState, useEffect, useCallback } from 'react';
import { LuX, LuFileText, LuImage, LuFile, LuTrash2,
  LuCircleCheckBig, LuTriangleAlert, LuScan } from "react-icons/lu";
import {
  MotionDiv, Overlay, ModalContent, Header, HeaderLeft, Title, CloseButton,
  ScanCenter, RetryButton,
  SummaryGrid, GlassCard, CardValue, CardLabel,
  CategoryTags, CategoryTag, ActionsBar, SelectAllBtn, DeselectAllBtn,
  FileList, FileItem, Checkbox, FileName, FileCategory, FileSize,
  EmptyState, EmptyText, EmptySubtext,
  DoneSection, DoneTitle, DoneGrid, DoneCard, DoneValue, DoneLabel,
  Footer, CancelButton, PrimaryButton, DangerButton,
} from './styles';

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
  imagem: LuImage,
  manual: LuFileText,
  texto: LuFileText,
  metadado: LuFile,
  config: LuFile,
  outro: LuFile,
};

const categoryColor: Record<string, string> = {
  imagem: '#60a5fa',
  manual: '#f87171',
  texto: '#a1a1aa',
  metadado: '#facc15',
  config: '#fb923c',
  outro: '#71717a',
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
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <LuScan size={20} color="#fbbf24" />
            <Title>Arquivos Órfãos</Title>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX size={20} />
          </CloseButton>
        </Header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {step === 'scanning' && (
            <ScanCenter>
              <span style={{ fontSize: 48, color: '#fbbf24' }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              </span>
              <p style={{ color: '#a1a1aa' }}>Escaneando pasta em busca de arquivos órfãos...</p>
              {scanError && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#ef4444', textAlign: 'center', maxWidth: '24rem' }}>{scanError}</p>
                  <RetryButton onClick={runScan}>Tentar Novamente</RetryButton>
                </div>
              )}
            </ScanCenter>
          )}

          {step === 'results' && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orphans.length === 0 ? (
                <EmptyState>
                  <LuCircleCheckBig size={48} color="#22c55e" />
                  <EmptyText>Nenhum arquivo órfão encontrado!</EmptyText>
                  <EmptySubtext>Sua pasta está limpa.</EmptySubtext>
                </EmptyState>
              ) : (
                <>
                  <SummaryGrid>
                    <GlassCard>
                      <LuTriangleAlert size={20} color="#fbbf24" style={{ margin: '0 auto 0.5rem' }} />
                      <CardValue $color="#fbbf24">{orphans.length}</CardValue>
                      <CardLabel>Arquivos Órfãos</CardLabel>
                    </GlassCard>
                    <GlassCard>
                      <LuFile size={20} color="#818cf8" style={{ margin: '0 auto 0.5rem' }} />
                      <CardValue $color="#818cf8">{selected.size}</CardValue>
                      <CardLabel>Selecionados</CardLabel>
                    </GlassCard>
                    <GlassCard>
                      <LuFile size={20} color="#22c55e" style={{ margin: '0 auto 0.5rem' }} />
                      <CardValue $color="#22c55e">{formatSize(selectedSize)}</CardValue>
                      <CardLabel>Espaço Selecionado</CardLabel>
                    </GlassCard>
                  </SummaryGrid>

                  <CategoryTags>
                    {Object.entries(byCategory).map(([cat, count]) => {
                      const Icon = categoryIcon[cat] || LuFile;
                      return (
                        <CategoryTag key={cat}>
                          <Icon size={12} color={categoryColor[cat]} />
                          {categoryLabel[cat]} ({count})
                        </CategoryTag>
                      );
                    })}
                  </CategoryTags>

                  <ActionsBar>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <SelectAllBtn onClick={selectAll}>Selecionar Todos</SelectAllBtn>
                      <DeselectAllBtn onClick={deselectAll}>Limpar</DeselectAllBtn>
                    </div>
                  </ActionsBar>

                  <FileList>
                    {orphans.map((f) => {
                      const isSelected = selected.has(f.path);
                      const Icon = categoryIcon[f.category] || LuFile;
                      return (
                        <FileItem key={f.path} $selected={isSelected} onClick={() => toggleSelect(f.path)}>
                          <Checkbox $checked={isSelected}>
                            {isSelected && <LuCircleCheckBig size={12} color="white" />}
                          </Checkbox>
                          <Icon size={16} color={categoryColor[f.category]} style={{ flexShrink: 0 }} />
                          <FileName $selected={isSelected}>{f.name}</FileName>
                          <FileCategory>{categoryLabel[f.category]}</FileCategory>
                          <FileSize>{formatSize(f.size)}</FileSize>
                        </FileItem>
                      );
                    })}
                  </FileList>
                </>
              )}
            </MotionDiv>
          )}

          {step === 'deleting' && (
            <ScanCenter>
              <span style={{ fontSize: 48, color: '#fbbf24' }}>⏳</span>
              <p style={{ color: '#a1a1aa' }}>Deletando arquivos órfãos...</p>
            </ScanCenter>
          )}

          {step === 'done' && deleteResult && (
            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <DoneSection>
                <LuCircleCheckBig size={64} color="#22c55e" />
                <DoneTitle>Limpeza concluída!</DoneTitle>
              </DoneSection>
              <DoneGrid>
                <DoneCard>
                  <DoneValue $color="#22c55e">{deleteResult.deleted}</DoneValue>
                  <DoneLabel>Arquivos deletados</DoneLabel>
                </DoneCard>
                <DoneCard>
                  <DoneValue $color="#818cf8">{formatSize(deleteResult.freedBytes)}</DoneValue>
                  <DoneLabel>Espaço liberado</DoneLabel>
                </DoneCard>
              </DoneGrid>
            </MotionDiv>
          )}
        </div>

        <Footer>
          {step === 'results' && orphans.length > 0 && (
            <>
              <CancelButton onClick={onClose}>Fechar</CancelButton>
              <DangerButton onClick={handleDelete} disabled={selected.size === 0}>
                <LuTrash2 size={16} />
                Deletar Selecionados ({selected.size})
              </DangerButton>
            </>
          )}
          {(step === 'done' || (step === 'results' && orphans.length === 0)) && (
            <PrimaryButton onClick={onClose}>
              <LuCircleCheckBig size={16} />
              Fechar
            </PrimaryButton>
          )}
        </Footer>
      </ModalContent>
    </Overlay>
  );
}
