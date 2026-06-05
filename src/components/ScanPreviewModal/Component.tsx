import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LuX, LuPlay, LuFilter, LuSearch, LuShield, LuGamepad2, LuCalendar,
  LuChevronDown, LuChevronUp, LuCopy, LuGlobe, LuStar, LuTriangleAlert,
  LuCircleX, LuCircleCheckBig, LuSquare
} from "react-icons/lu";
import { getSystemLogo } from '../../lib/system-logos';
import {
  MotionDiv, Overlay, ModalContent, Header, Title, Subtitle, CloseButton,
  ResumeOverlay, ResumeDialog as ResumeDialogStyled, ResumeTitle, ResumeText, ResumeActions,
  CancelButton, PrimaryButton,
  ContentArea, ScanCenter, ScanText, ProgressBar, ProgressFill, ScanFooter,
  MainContent, StatsGrid, StatCard, StatValue, StatLabel,
  FilterSection, FilterTitle, FilterGrid, FilterInputWrapper, FilterIcon,
  FilterInput, FilterSelect,
  SystemsSection, SystemsTitle, SystemCard, SystemHeader, SystemInfo,
  SystemName, SystemCount, SystemSize,
  RomList, RomItem, RomFileName, RomMeta, RomMetaItem, RomRight, RomSize,
  CloneSection, CloneToggle, CloneToggleLeft, CloneToggleTitle, CloneToggleSubtitle,
  CloneContent, CheckboxRow, CheckboxInput, CheckboxLabel,
  RegionSection, RegionLabel, RegionList, RegionButton, RegionError,
  CloneGroupList, CloneGroup, CloneGroupInfo, CloneGroupName, CloneGroupCount, CloneGroupKeep,
  ProtectedSection, ProtectedTitle, ProtectedInputRow, ProtectedInput, ValidateButton,
  ValidationResult, AddButton, ProtectedTags, ProtectedTag, RemoveTagButton,
  Footer, Legend, LegendItem, LegendDot, FooterActions,
  SuccessButton, DangerButton, MutedButton,
  SpinnerIcon,
} from './styles';

interface ScanPreviewModalProps {
  folder: string;
  minRating: number;
  action: 'move' | 'delete';
  onClose: () => void;
  onStartCuration: (options: {
    folder: string;
    minRating: number;
    action: 'move' | 'delete';
    removeClones: boolean;
    preferredRegions: string[];
    protectedGames: string[];
    resume?: boolean;
  }) => void;
}

interface RomInfo {
  path: string;
  fileName: string;
  baseName: string;
  ext: string;
  system: string;
  systemName: string;
  size: number;
  parentDir: string;
  regionTags: string[];
  metadata?: {
    name: string;
    rating: number | null;
    genres: string[];
    year: number | null;
    version: string;
  };
  protectionStatus: {
    isClassic: boolean;
    isGenreProtected: boolean;
    isUserProtected: boolean;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const ALL_REGIONS = ['USA', 'World', 'Europe', 'Japan', 'Brazil'];

export function ScanPreviewModal({ folder, minRating, action, onClose, onStartCuration }: ScanPreviewModalProps) {
  const [scanData, setScanData] = useState<any>(null);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState({ progress: 0, scanned: 0, total: 0, found: 0 });
  const [scanPhase, setScanPhase] = useState('scan');
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState({ name: '', genre: '', year: '' });
  const [removeClones, setRemoveClones] = useState(false);
  const [preferredRegions, setPreferredRegions] = useState<string[]>(['USA']);
  const [userProtectedGames, setUserProtectedGames] = useState<string[]>([]);
  const [newProtectedGame, setNewProtectedGame] = useState('');
  const [showCloneOptions, setShowCloneOptions] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState<'simulation' | 'curation' | null>(null);
  const [validatingGame, setValidatingGame] = useState(false);
  const [gameValidationResult, setGameValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    window.api.scanFolder(folder).then((data) => {
      setScanData(data);
      setScanning(false);
      setScanProgress({ progress: 100, scanned: 0, total: 0, found: 0 });
      const systems = Object.keys(data.grouped);
      const initialExpanded: Record<string, boolean> = {};
      systems.forEach(s => initialExpanded[s] = false);
      setExpandedSystems(initialExpanded);
    });

    window.api.onScanProgress((data) => {
      setScanProgress(prev => ({
        ...prev,
        progress: data.progress ?? prev.progress,
        scanned: data.scanned ?? prev.scanned,
        found: data.found ?? prev.found,
      }));
      setScanPhase(data.phase);
    });

    return () => {
      window.api.removeScanProgressListener();
    };
  }, [folder]);

  useEffect(() => {
    window.api.readProtectedGames().then(setUserProtectedGames);
  }, []);

  const handleValidateProtectedGame = async () => {
    if (!newProtectedGame.trim()) return;
    setValidatingGame(true);
    setGameValidationResult(null);
    const result = await window.api.validateGameName(newProtectedGame.trim());
    setGameValidationResult(result);
    setValidatingGame(false);
  };

  const handleAddProtectedGame = async () => {
    if (!gameValidationResult?.valid) return;
    const updated = await window.api.addProtectedGame(newProtectedGame.trim());
    setUserProtectedGames(updated);
    setNewProtectedGame('');
    setGameValidationResult(null);
  };

  const handleRemoveProtectedGame = async (game: string) => {
    const updated = await window.api.removeProtectedGame(game);
    setUserProtectedGames(updated);
  };

  const toggleRegion = (region: string) => {
    setPreferredRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleSimulate = async () => {
    const existingLog = await window.api.readProgressLog(folder);
    if (existingLog?.type === 'simulation' && !existingLog.complete && !existingLog.cancelled) {
      setShowResumeDialog('simulation');
      return;
    }
    setSimulating(true);
    await window.api.simulateCuration({ folder, minRating, action });
    setSimulating(false);
  };

  const handleResumeSimulation = async () => {
    setShowResumeDialog(null);
    setSimulating(true);
    await window.api.simulateCuration({ folder, minRating, action, resume: true });
    setSimulating(false);
  };

  const handleCancelSimulation = async () => {
    await window.api.cancelSimulation();
  };

  const filteredRoms = useMemo(() => {
    if (!scanData) return {};
    const filtered: Record<string, RomInfo[]> = {};
    for (const [system, roms] of Object.entries(scanData.grouped)) {
      const systemRoms = (roms as RomInfo[]).filter((rom) => {
        const nameMatch = !filters.name || rom.fileName.toLowerCase().includes(filters.name.toLowerCase());
        const genreMatch = !filters.genre || rom.metadata?.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase()));
        const yearMatch = !filters.year || rom.metadata?.year?.toString() === filters.year;
        return nameMatch && genreMatch && yearMatch;
      });
      if (systemRoms.length > 0) {
        filtered[system] = systemRoms;
      }
    }
    return filtered;
  }, [scanData, filters]);

  const availableYears = useMemo(() => {
    if (!scanData) return [];
    const years = new Set<number>();
    for (const roms of Object.values(scanData.grouped)) {
      for (const rom of roms as RomInfo[]) {
        if (rom.metadata?.year) {
          years.add(rom.metadata.year);
        }
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [scanData]);

  const totalRoms = Object.values(filteredRoms).reduce((sum, roms) => sum + roms.length, 0);
  const totalSize = Object.values(filteredRoms).reduce((sum, roms) => sum + roms.reduce((s, r) => s + r.size, 0), 0);

  const toggleSystem = (system: string) => {
    setExpandedSystems(prev => ({ ...prev, [system]: !prev[system] }));
  };

  const getProtectionBadge = (rom: RomInfo) => {
    if (rom.protectionStatus.isClassic) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.2)', borderRadius: 9999, fontSize: '0.75rem', color: '#facc15' }}>
          <LuShield size={12} />
          Classico
        </span>
      );
    }
    if (rom.protectionStatus.isGenreProtected) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: 9999, fontSize: '0.75rem', color: '#a855f7' }}>
          <LuShield size={12} />
          Genero
        </span>
      );
    }
    if (rom.protectionStatus.isUserProtected) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: 9999, fontSize: '0.75rem', color: '#2dd4bf' }}>
          <LuShield size={12} />
          Protegido
        </span>
      );
    }
    return null;
  };

  const handleStart = async () => {
    const existingLog = await window.api.readProgressLog(folder);
    if (existingLog?.type === 'curation' && !existingLog.complete && !existingLog.cancelled) {
      setShowResumeDialog('curation');
      return;
    }
    onStartCuration({ folder, minRating, action, removeClones, preferredRegions, protectedGames: userProtectedGames });
  };

  const handleResumeCuration = () => {
    setShowResumeDialog(null);
    onStartCuration({ folder, minRating, action, removeClones, preferredRegions, protectedGames: userProtectedGames, resume: true });
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>
            <Title>Pre-visualizacao da Curadoria</Title>
            <Subtitle>{folder}</Subtitle>
          </div>
          <CloseButton onClick={onClose}>
            <LuX size={20} />
          </CloseButton>
        </Header>

        <ContentArea>
          <AnimatePresence>
            {showResumeDialog && (
              <ResumeOverlay style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <MotionDiv
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <ResumeDialogStyled>
                    <LuTriangleAlert size={48} color="#fbbf24" style={{ margin: '0 auto' }} />
                    <ResumeTitle>Processamento Anterior Encontrado</ResumeTitle>
                    <ResumeText>
                      {showResumeDialog === 'simulation'
                        ? 'Ha uma simulacao de curadoria incompleta. Deseja retomar de onde parou?'
                        : 'Ha uma curadoria incompleta. Deseja retomar de onde parou?'}
                    </ResumeText>
                    <ResumeActions>
                      <CancelButton onClick={() => setShowResumeDialog(null)}>
                        Comecar do Inicio
                      </CancelButton>
                      <PrimaryButton onClick={showResumeDialog === 'simulation' ? handleResumeSimulation : handleResumeCuration}>
                        <LuPlay size={16} />
                        Retomar
                      </PrimaryButton>
                    </ResumeActions>
                  </ResumeDialogStyled>
                </MotionDiv>
              </ResumeOverlay>
            )}
          </AnimatePresence>

          {scanning ? (
            <ScanCenter>
              <SpinnerIcon size={64} color="#818cf8" />
              <ScanText>
                {scanPhase === 'scan' ? 'Escaneando arquivos...' : 'Consultando APIs...'}
              </ScanText>
              <ProgressBar>
                <ProgressFill
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress.progress}%` }}
                />
              </ProgressBar>
              <ScanFooter>{scanProgress.scanned} arquivos verificados - {scanProgress.found} ROMs encontradas</ScanFooter>
            </ScanCenter>
          ) : (
            <MainContent>
              <StatsGrid>
                <StatCard>
                  <StatValue $color="#818cf8">{totalRoms}</StatValue>
                  <StatLabel>ROMs Encontradas</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue $color="#22c55e">{formatBytes(totalSize)}</StatValue>
                  <StatLabel>Tamanho Total</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue $color="#a1a1aa">{Object.keys(filteredRoms).length}</StatValue>
                  <StatLabel>Sistemas</StatLabel>
                </StatCard>
              </StatsGrid>

              <FilterSection>
                <FilterTitle>
                  <LuFilter size={16} />
                  Filtros
                </FilterTitle>
                <FilterGrid>
                  <FilterInputWrapper>
                    <FilterIcon><LuSearch size={16} /></FilterIcon>
                    <FilterInput
                      type="text"
                      placeholder="Filtrar por nome..."
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </FilterInputWrapper>
                  <FilterInputWrapper>
                    <FilterIcon><LuGamepad2 size={16} /></FilterIcon>
                    <FilterInput
                      type="text"
                      placeholder="Filtrar por genero..."
                      value={filters.genre}
                      onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                    />
                  </FilterInputWrapper>
                  <FilterInputWrapper>
                    <FilterIcon><LuCalendar size={16} /></FilterIcon>
                    <FilterSelect
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                    >
                      <option value="">Todos os anos</option>
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </FilterSelect>
                  </FilterInputWrapper>
                </FilterGrid>
              </FilterSection>

              <SystemsSection>
                <SystemsTitle>ROMs por Sistema</SystemsTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(filteredRoms).map(([system, roms]) => {
                    const logo = getSystemLogo(undefined, system);
                    return (
                      <SystemCard key={system}>
                        <SystemHeader onClick={() => toggleSystem(system)}>
                          <SystemInfo>
                            {expandedSystems[system] ? (
                              <LuChevronUp size={20} color="#a1a1aa" />
                            ) : (
                              <LuChevronDown size={20} color="#a1a1aa" />
                            )}
                            {logo && (
                              <img
                                src={`system/logos/${logo}`}
                                alt={system}
                                style={{ width: 24, height: 24, objectFit: 'contain' }}
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            )}
                            <SystemName>{system}</SystemName>
                            <SystemCount>({(roms as RomInfo[]).length})</SystemCount>
                          </SystemInfo>
                          <SystemSize>
                            {formatBytes((roms as RomInfo[]).reduce((s, r) => s + r.size, 0))}
                          </SystemSize>
                        </SystemHeader>

                        <AnimatePresence>
                          {expandedSystems[system] && (
                            <MotionDiv
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <RomList>
                                {(roms as RomInfo[]).map((rom, idx) => (
                                  <RomItem key={idx}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <RomFileName>{rom.fileName}</RomFileName>
                                      <RomMeta>
                                        {rom.metadata?.year && (
                                          <RomMetaItem>
                                            <LuCalendar size={12} />
                                            {rom.metadata.year}
                                          </RomMetaItem>
                                        )}
                                        {rom.metadata?.rating && (
                                          <RomMetaItem>
                                            <LuStar size={12} />
                                            {rom.metadata.rating.toFixed(0)}
                                          </RomMetaItem>
                                        )}
                                        {rom.regionTags.length > 0 && (
                                          <RomMetaItem>
                                            <LuGlobe size={12} />
                                            {rom.regionTags.join(', ')}
                                          </RomMetaItem>
                                        )}
                                      </RomMeta>
                                    </div>
                                    <RomRight>
                                      {getProtectionBadge(rom)}
                                      <RomSize>{formatBytes(rom.size)}</RomSize>
                                    </RomRight>
                                  </RomItem>
                                ))}
                              </RomList>
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </SystemCard>
                    );
                  })}
                </div>
              </SystemsSection>

              {scanData?.cloneGroups?.length > 0 && (
                <CloneSection>
                  <CloneToggle onClick={() => setShowCloneOptions(!showCloneOptions)}>
                    <CloneToggleLeft>
                      <LuCopy size={20} color="#fbbf24" />
                      <div>
                        <CloneToggleTitle>Deteccao de Clones/Duplicados</CloneToggleTitle>
                        <CloneToggleSubtitle>{scanData.cloneGroups.length} grupos encontrados</CloneToggleSubtitle>
                      </div>
                    </CloneToggleLeft>
                    {showCloneOptions ? <LuChevronUp size={20} color="#a1a1aa" /> : <LuChevronDown size={20} color="#a1a1aa" />}
                  </CloneToggle>

                  <AnimatePresence>
                    {showCloneOptions && (
                      <MotionDiv
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CloneContent>
                          <CheckboxRow>
                            <CheckboxInput
                              type="checkbox"
                              id="removeClones"
                              checked={removeClones}
                              onChange={(e) => setRemoveClones(e.target.checked)}
                            />
                            <CheckboxLabel htmlFor="removeClones">
                              Remover automaticamente versoes duplicadas/regioes diferentes
                            </CheckboxLabel>
                          </CheckboxRow>

                          {removeClones && (
                            <RegionSection>
                              <RegionLabel>Regioes preferidas para manter (selecione uma ou mais):</RegionLabel>
                              <RegionList>
                                {ALL_REGIONS.map(region => (
                                  <RegionButton
                                    key={region}
                                    $active={preferredRegions.includes(region)}
                                    onClick={() => toggleRegion(region)}
                                  >
                                    {preferredRegions.includes(region) && <LuCircleCheckBig size={12} />}
                                    {region}
                                  </RegionButton>
                                ))}
                              </RegionList>
                              {preferredRegions.length === 0 && (
                                <RegionError>Selecione ao menos uma regiao.</RegionError>
                              )}
                            </RegionSection>
                          )}

                          <CloneGroupList>
                            {scanData.cloneGroups.slice(0, 10).map((group: any, idx: number) => (
                              <CloneGroup key={idx}>
                                <LuTriangleAlert size={16} color="#fbbf24" style={{ marginTop: 2, flexShrink: 0 }} />
                                <CloneGroupInfo>
                                  <CloneGroupName>{group.baseName}</CloneGroupName>
                                  <CloneGroupCount>{group.roms.length} variantes</CloneGroupCount>
                                </CloneGroupInfo>
                                {preferredRegions.length > 0 && (
                                  <CloneGroupKeep>Manter: {preferredRegions.join(', ')}</CloneGroupKeep>
                                )}
                              </CloneGroup>
                            ))}
                          </CloneGroupList>
                        </CloneContent>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </CloneSection>
              )}

              <ProtectedSection>
                <ProtectedTitle>
                  <LuShield size={16} color="#2dd4bf" />
                  Jogos Protegidos ({userProtectedGames.length})
                </ProtectedTitle>
                <ProtectedInputRow>
                  <ProtectedInput
                    type="text"
                    placeholder="Nome do jogo (sera validado)..."
                    value={newProtectedGame}
                    onChange={(e) => { setNewProtectedGame(e.target.value); setGameValidationResult(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateProtectedGame()}
                  />
                  <ValidateButton
                    onClick={handleValidateProtectedGame}
                    disabled={validatingGame || !newProtectedGame.trim()}
                  >
                    {validatingGame ? <SpinnerIcon size={16} /> : <LuSearch size={16} />}
                    Validar
                  </ValidateButton>
                </ProtectedInputRow>

                <AnimatePresence>
                  {gameValidationResult && (
                    <MotionDiv
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <ValidationResult $valid={gameValidationResult.valid}>
                        {gameValidationResult.valid ? <LuCircleCheckBig size={16} style={{ flexShrink: 0 }} /> : <LuCircleX size={16} style={{ flexShrink: 0 }} />}
                        <span>{gameValidationResult.message}</span>
                        {gameValidationResult.valid && (
                          <AddButton onClick={handleAddProtectedGame}>
                            Adicionar
                          </AddButton>
                        )}
                      </ValidationResult>
                    </MotionDiv>
                  )}
                </AnimatePresence>

                <ProtectedTags>
                  {userProtectedGames.map((game) => (
                    <ProtectedTag key={game}>
                      {game}
                      <RemoveTagButton onClick={() => handleRemoveProtectedGame(game)}>
                        <LuX size={12} />
                      </RemoveTagButton>
                    </ProtectedTag>
                  ))}
                </ProtectedTags>
              </ProtectedSection>
            </MainContent>
          )}
        </ContentArea>

        <Footer>
          <Legend>
            <LegendItem>
              <LegendDot $color="#facc15" />
              Classico
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#a855f7" />
              Genero
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#2dd4bf" />
              Protegido
            </LegendItem>
          </Legend>
          <FooterActions>
            <CancelButton onClick={onClose}>Cancelar</CancelButton>
            {simulating ? (
              <DangerButton onClick={handleCancelSimulation}>
                <LuSquare size={16} />
                Cancelar Simulacao
              </DangerButton>
            ) : (
              <>
                <MutedButton onClick={handleSimulate} disabled={simulating || scanning}>
                  {simulating ? <SpinnerIcon size={16} /> : <LuSearch size={16} />}
                  Simular Curadoria
                </MutedButton>
                <SuccessButton onClick={handleStart} disabled={scanning}>
                  <LuPlay size={16} />
                  Iniciar Curadoria
                </SuccessButton>
              </>
            )}
          </FooterActions>
        </Footer>
      </ModalContent>
    </Overlay>
  );
}
