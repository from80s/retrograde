import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LuSave, LuShield, LuTrash2, LuMoveRight, LuStar, LuWifi, LuLoader, LuCircleCheckBig, LuCircleX, LuPlus, LuTriangleAlert, LuBookOpen, LuX, LuGamepad2 } from "react-icons/lu";
import { ClassicGamesPicker } from '../ClassicGamesPicker';
import { ModalBase } from '../ModalBase';
import { Button } from '../Button';
import { SearchInput } from '../SearchInput';
import {
  ContentScroll, Section, SectionHeader, SectionTitle, SectionTitleWithIcon,
  SectionDesc, SubLabel, FieldsGroup, FieldBlock, FieldLabel, FieldLabelRow,
  TextInput, PasswordInput, RangeSlider, RangeLabels, ActionButtons,
  ActionButton, InlineInputSecondary, InlineInputWarning,
  InlineInputTeal, AddGenreButton, AddProtectedButton, ValidationResult,
  TagsContainer, Tag, TagRemoveButton, EmptyText, BlockedFeature,
  BlockedFeatureRow, BlockedIcon, BlockedTextGroup, BlockedTitle,
  BlockedDesc, BlockedHighlight, BlockedCode, Footer, CloseButton,
  TestOverlay, TestModal, TestHeader, TestHeaderLeft, TestHeaderTitle,
  TestContent, TestResultCard, TestResultIconBox, TestResultInfo,
  TestResultName, TestResultMessage, TestSummary, TestFooter, TestCloseButton,
  ConfirmOverlay, ConfirmModal, ConfirmContent, ConfirmIcon, ConfirmTitle,
  ConfirmText, ConfirmHighlight, ConfirmFooter, ConfirmCancel, ConfirmDelete,
} from "./styles";

interface SettingsModalProps {
  onClose: () => void;
  minRating: number;
  action: 'move' | 'delete';
  classics: string[];
  genres: string[];
  protectedGames: string[];
  onSave: (minRating: number, action: 'move' | 'delete') => void;
  onApiTested: (hasConnection: boolean) => void;
  onClassicsUpdated: (classics: string[]) => void;
  onGenresUpdated: (genres: string[]) => void;
  onProtectedGamesUpdated: (games: string[]) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface TestResult {
  status: 'pending' | 'success' | 'error';
  message: string;
}

export function SettingsModal({ onClose, minRating, action, classics, genres, protectedGames, onSave, onApiTested, onClassicsUpdated, onGenresUpdated, onProtectedGamesUpdated, onToast }: SettingsModalProps) {
  const [localMinRating, setLocalMinRating] = useState(minRating);
  const [localAction, setLocalAction] = useState<'move' | 'delete'>(action);
  const [config, setConfig] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testResults, setTestResults] = useState<{ igdb: TestResult; tgdb: TestResult } | null>(null);
  const [classicsFilter, setClassicsFilter] = useState('');
  const [newClassic, setNewClassic] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [genresFilter, setGenresFilter] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [showGenreDeleteConfirm, setShowGenreDeleteConfirm] = useState<string | null>(null);
  const [protectedGamesFilter, setProtectedGamesFilter] = useState('');
  const [newProtectedGame, setNewProtectedGame] = useState('');
  const [showProtectedGameDeleteConfirm, setShowProtectedGameDeleteConfirm] = useState<string | null>(null);
  const [showClassicPicker, setShowClassicPicker] = useState(false);

  useEffect(() => {
    window.api.readConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
      if (loadedConfig) {
        setLocalMinRating(loadedConfig.minRating ?? minRating);
        setLocalAction(loadedConfig.action ?? action);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      if (config) {
        const updatedConfig = { ...config, minRating: localMinRating, action: localAction };
        await window.api.saveConfig(updatedConfig);
      }
      onSave(localMinRating, localAction);
      onToast('Configurações salvas com sucesso!', 'success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      onToast('Erro ao salvar configurações.', 'error');
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleTestConnection = async () => {
    if (config) {
      await window.api.saveConfig({ ...config, api_tested: false });
    }
    setTesting(true);
    setShowTestModal(true);
    setTestResults({
      igdb: { status: 'pending', message: 'Testando...' },
      tgdb: { status: 'pending', message: 'Testando...' },
    });

    const results = await window.api.testApiConnections();
    setTestResults(results as { igdb: TestResult; tgdb: TestResult });
    setTesting(false);

    const igdbSuccess = results.igdb.status === 'success';
    const tgdbSuccess = results.tgdb.status === 'success';
    const hasConnection = igdbSuccess || tgdbSuccess;

    if (hasConnection) {
      const savedApis = [];
      if (igdbSuccess) savedApis.push('IGDB');
      if (tgdbSuccess) savedApis.push('TheGamesDB');
      onToast(`Conexão estabelecida! ${savedApis.join(' e ')} salva(s) automaticamente.`, 'success');
      if (config) {
        await window.api.saveConfig({ ...config, api_tested: true });
      }
    } else {
      onToast('Nenhuma API conectada. Verifique as credenciais.', 'error');
      if (config) {
        await window.api.saveConfig({ ...config, api_tested: false });
      }
    }

    onApiTested(hasConnection);
  };

  const handleValidateClassic = async () => {
    if (!newClassic.trim()) return;
    setValidating(true);
    setValidationResult(null);

    const result = await window.api.validateGameName(newClassic.trim());
    setValidationResult(result);
    setValidating(false);
  };

  const handleAddClassic = async () => {
    if (!validationResult?.valid) return;
    const updated = await window.api.addClassic(newClassic.trim());
    onClassicsUpdated(updated);
    setNewClassic('');
    setValidationResult(null);
  };

  const handleRemoveClassic = async (classic: string) => {
    const updated = await window.api.removeClassic(classic);
    onClassicsUpdated(updated);
    setShowDeleteConfirm(null);
  };

  const handleBatchAddClassics = async (names: string[]) => {
    const result = await window.api.addClassics(names);
    onClassicsUpdated(result.classics);
    const addedCount = result.added.length;
    if (addedCount > 0) {
      onToast(`${addedCount} clássico(s) adicionado(s) com sucesso!`, 'success');
    } else {
      onToast('Todos os jogos selecionados já estavam na lista.', 'info');
    }
  };

  const filteredClassics = classics.filter((c) =>
    c.toLowerCase().includes(classicsFilter.toLowerCase())
  );

  const filteredGenres = genres.filter((g) =>
    g.toLowerCase().includes(genresFilter.toLowerCase())
  );

  const handleAddGenre = async () => {
    if (!newGenre.trim()) return;
    const updated = await window.api.addGenre(newGenre.trim());
    onGenresUpdated(updated);
    setNewGenre('');
  };

  const handleRemoveGenre = async (genre: string) => {
    const updated = await window.api.removeGenre(genre);
    onGenresUpdated(updated);
    setShowGenreDeleteConfirm(null);
  };

  const filteredProtectedGames = protectedGames.filter((g) =>
    g.toLowerCase().includes(protectedGamesFilter.toLowerCase())
  );

  const handleAddProtectedGame = async () => {
    if (!newProtectedGame.trim()) return;
    const updated = await window.api.addProtectedGame(newProtectedGame.trim());
    onProtectedGamesUpdated(updated);
    setNewProtectedGame('');
  };

  const handleRemoveProtectedGame = async (game: string) => {
    const updated = await window.api.removeProtectedGame(game);
    onProtectedGamesUpdated(updated);
    setShowProtectedGameDeleteConfirm(null);
  };

  const statusIcon = (status: string) => {
    if (status === 'pending') return <LuLoader className="w-5 h-5 animate-spin" style={{ color: "#a1a1aa" }} />;
    if (status === 'success') return <LuCircleCheckBig className="w-5 h-5" style={{ color: "var(--color-retro-success, #22c55e)" }} />;
    return <LuCircleX className="w-5 h-5" style={{ color: "var(--color-retro-danger, #ef4444)" }} />;
  };

  const statusColor = (status: string) => {
    if (status === 'pending') return '#a1a1aa';
    if (status === 'success') return 'var(--color-retro-success, #22c55e)';
    return 'var(--color-retro-danger, #ef4444)';
  };

  return (
    <>
    <ModalBase onClose={onClose} title="Configurações" maxWidth="max-w-2xl">
      <ContentScroll>
            {/* Config de API */}
            <Section>
              <SectionHeader>
                <SectionTitle>Credenciais de API</SectionTitle>
                <Button variant="primary" size="sm" icon={testing ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuWifi className="w-4 h-4" />} onClick={handleTestConnection} disabled={testing}>
                  Testar Conexão
                </Button>
              </SectionHeader>
              <SectionDesc>
                Após preencher as credenciais, clique em <SubLabel>"Testar Conexão"</SubLabel> para validar.
              </SectionDesc>
              <FieldsGroup>
                <FieldBlock>
                  <FieldLabel>IGDB Client ID</FieldLabel>
                  <TextInput
                    type="text"
                    value={config?.IGDB_CLIENT_ID || ''}
                    onChange={(e) => handleConfigChange('IGDB_CLIENT_ID', e.target.value)}
                  />
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>IGDB Client Secret</FieldLabel>
                  <PasswordInput
                    type="password"
                    value={config?.IGDB_CLIENT_SECRET || ''}
                    onChange={(e) => handleConfigChange('IGDB_CLIENT_SECRET', e.target.value)}
                  />
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>TGDB API Key</FieldLabel>
                  <PasswordInput
                    type="password"
                    value={config?.TGDB_API_KEY || ''}
                    onChange={(e) => handleConfigChange('TGDB_API_KEY', e.target.value)}
                  />
                </FieldBlock>
              </FieldsGroup>
            </Section>

            {/* Config de Curadoria */}
            <Section>
              <SectionTitle>Configurações de Curadoria</SectionTitle>

              <FieldBlock>
                <FieldLabelRow>
                  <LuStar className="w-4 h-4" style={{ color: "var(--color-retro-warning, #eab308)" }} />
                  Nota Mínima para Manter: {localMinRating}
                </FieldLabelRow>
                <RangeSlider
                  type="range"
                  min="0"
                  max="100"
                  value={localMinRating}
                  onChange={(e) => setLocalMinRating(Number(e.target.value))}
                />
                <RangeLabels>
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </RangeLabels>
              </FieldBlock>

              <FieldBlock>
                <FieldLabel>Ação para Jogos Removidos</FieldLabel>
                <ActionButtons>
                  <ActionButton
                    $active={localAction === 'move'}
                    $color="--color-retro-warning-rgb, 234, 179, 8"
                    onClick={() => setLocalAction('move')}
                  >
                    <LuMoveRight className="w-4 h-4" />
                    <span>Mover para /removidos</span>
                  </ActionButton>
                  <ActionButton
                    $active={localAction === 'delete'}
                    $color="--color-retro-danger-rgb, 239, 68, 68"
                    onClick={() => setLocalAction('delete')}
                  >
                    <LuTrash2 className="w-4 h-4" />
                    <span>Deletar Permanentemente</span>
                  </ActionButton>
                </ActionButtons>
              </FieldBlock>
            </Section>

            {/* Clássicos Protegidos */}
            <Section>
              <SectionHeader>
                <SectionTitleWithIcon>
                  <LuShield className="w-4 h-4" style={{ color: "var(--color-retro-secondary, #6366f1)" }} />
                  Clássicos Protegidos ({classics.length})
                </SectionTitleWithIcon>
                <Button variant="secondary" size="sm" icon={<LuBookOpen className="w-4 h-4" />} onClick={() => setShowClassicPicker(true)}>
                  Popular Clássicos
                </Button>
              </SectionHeader>

              <SearchInput value={classicsFilter} onChange={setClassicsFilter} placeholder="Filtrar clássicos..." />

              {/* Adicionar novo clássico */}
              <ActionButtons>
                <InlineInputSecondary
                  type="text"
                  placeholder="Adicionar novo clássico..."
                  value={newClassic}
                  onChange={(e) => { setNewClassic(e.target.value); setValidationResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateClassic()}
                />
                <Button variant="secondary" icon={validating ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuPlus className="w-4 h-4" />} onClick={handleValidateClassic} disabled={validating || !newClassic.trim()}>
                  Validar
                </Button>
              </ActionButtons>

              {/* Resultado da validação */}
              <AnimatePresence>
                {validationResult && (
                  <ValidationResult
                    $valid={validationResult.valid}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {validationResult.valid ? <LuCircleCheckBig className="w-4 h-4 flex-shrink-0" /> : <LuCircleX className="w-4 h-4 flex-shrink-0" />}
                    <span>{validationResult.message}</span>
                    {validationResult.valid && (
                      <Button variant="success" size="sm" onClick={handleAddClassic}>Adicionar</Button>
                    )}
                  </ValidationResult>
                )}
              </AnimatePresence>

              {/* Lista de clássicos */}
              <TagsContainer>
                {filteredClassics.map((classic) => (
                  <Tag key={classic} $color="--color-retro-secondary-rgb, 99, 102, 241">
                    {classic}
                    <TagRemoveButton onClick={() => setShowDeleteConfirm(classic)}>
                      <LuX className="w-3 h-3" />
                    </TagRemoveButton>
                  </Tag>
                ))}
                {filteredClassics.length === 0 && classicsFilter && (
                  <EmptyText>Nenhum clássico encontrado</EmptyText>
                )}
              </TagsContainer>
            </Section>

            {/* Gêneros Protegidos */}
            <Section>
              <SectionTitleWithIcon>
                <LuGamepad2 className="w-4 h-4" style={{ color: "var(--color-retro-warning, #eab308)" }} />
                Gêneros Protegidos ({genres.length})
              </SectionTitleWithIcon>

              {config?.IGDB_CLIENT_ID && config?.IGDB_CLIENT_SECRET ? (
                <>
                  <SectionDesc>
                    Jogos destes gêneros serão mantidos mesmo com nota baixa.
                  </SectionDesc>

                  <SearchInput value={genresFilter} onChange={setGenresFilter} placeholder="Filtrar gêneros..." />

                  {/* Adicionar novo gênero */}
                  <ActionButtons>
                    <InlineInputWarning
                      type="text"
                      placeholder="Ex: RPG, Luta, Aventura..."
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()}
                    />
                    <AddGenreButton onClick={handleAddGenre} disabled={!newGenre.trim()}>
                      <LuPlus className="w-4 h-4" />
                      Adicionar
                    </AddGenreButton>
                  </ActionButtons>

                  {/* Lista de gêneros */}
                  <TagsContainer>
                    {filteredGenres.map((genre) => (
                      <Tag key={genre} $color="--color-retro-warning-rgb, 234, 179, 8">
                        {genre}
                        <TagRemoveButton onClick={() => setShowGenreDeleteConfirm(genre)}>
                          <LuX className="w-3 h-3" />
                        </TagRemoveButton>
                      </Tag>
                    ))}
                    {filteredGenres.length === 0 && genresFilter && (
                      <EmptyText>Nenhum gênero encontrado</EmptyText>
                    )}
                  </TagsContainer>
                </>
              ) : (
                <BlockedFeature>
                  <BlockedFeatureRow>
                    <BlockedIcon>
                      <LuGamepad2 className="w-4 h-4" style={{ color: "#71717a" }} />
                    </BlockedIcon>
                    <BlockedTextGroup>
                      <BlockedTitle>Feature bloqueada</BlockedTitle>
                      <BlockedDesc>
                        A proteção por gêneros requer a API do <BlockedHighlight>IGDB</BlockedHighlight> para identificar os gêneros dos jogos.
                      </BlockedDesc>
                      <BlockedDesc>
                        Configure o <BlockedCode>IGDB Client ID</BlockedCode> e <BlockedCode>IGDB Client Secret</BlockedCode> na seção de credenciais acima para liberar esta funcionalidade.
                      </BlockedDesc>
                    </BlockedTextGroup>
                  </BlockedFeatureRow>
                </BlockedFeature>
              )}
            </Section>

            {/* Jogos Protegidos pelo Usuário */}
            <Section>
              <SectionTitleWithIcon>
                <LuShield className="w-4 h-4" style={{ color: "#2dd4bf" }} />
                Jogos Protegidos ({protectedGames.length})
              </SectionTitleWithIcon>
              <SectionDesc>
                Jogos específicos que serão sempre mantidos, independente da nota ou gênero.
              </SectionDesc>

              <SearchInput value={protectedGamesFilter} onChange={setProtectedGamesFilter} placeholder="Filtrar jogos protegidos..." />

              {/* Adicionar novo jogo protegido */}
              <ActionButtons>
                <InlineInputTeal
                  type="text"
                  placeholder="Nome do jogo..."
                  value={newProtectedGame}
                  onChange={(e) => setNewProtectedGame(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProtectedGame()}
                />
                <AddProtectedButton onClick={handleAddProtectedGame} disabled={!newProtectedGame.trim()}>
                  <LuPlus className="w-4 h-4" />
                  Adicionar
                </AddProtectedButton>
              </ActionButtons>

              {/* Lista de jogos protegidos */}
              <TagsContainer>
                {filteredProtectedGames.map((game) => (
                  <Tag key={game} $color="45, 212, 191">
                    {game}
                    <TagRemoveButton onClick={() => setShowProtectedGameDeleteConfirm(game)}>
                      <LuX className="w-3 h-3" />
                    </TagRemoveButton>
                  </Tag>
                ))}
                {filteredProtectedGames.length === 0 && protectedGamesFilter && (
                  <EmptyText>Nenhum jogo encontrado</EmptyText>
                )}
              </TagsContainer>
            </Section>
          </ContentScroll>

          {/* Rodapé */}
          <Footer>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" icon={<LuSave className="w-4 h-4" />} onClick={handleSave}>
              Salvar
            </Button>
          </Footer>
    </ModalBase>

      {/* Modal de Resultado de Teste */}
      <AnimatePresence>
        {showTestModal && testResults && (
          <TestOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTestModal(false)}
          >
            <TestModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <TestHeader>
                <TestHeaderLeft>
                  <LuWifi className="w-5 h-5" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
                  <TestHeaderTitle>Teste de Conexão</TestHeaderTitle>
                </TestHeaderLeft>
                <CloseButton onClick={() => setShowTestModal(false)}>
                  <LuX className="w-5 h-5" />
                </CloseButton>
              </TestHeader>

              <TestContent>
                <TestResultCard>
                  <TestResultIconBox $color={
                    testResults.igdb.status === 'success' ? 'rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1)' :
                    testResults.igdb.status === 'error' ? 'rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1)' : 'rgba(63, 63, 70, 0.5)'
                  }>
                    {statusIcon(testResults.igdb.status)}
                  </TestResultIconBox>
                  <TestResultInfo>
                    <TestResultName>IGDB</TestResultName>
                    <TestResultMessage $color={statusColor(testResults.igdb.status)}>{testResults.igdb.message}</TestResultMessage>
                  </TestResultInfo>
                </TestResultCard>

                <TestResultCard>
                  <TestResultIconBox $color={
                    testResults.tgdb.status === 'success' ? 'rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1)' :
                    testResults.tgdb.status === 'error' ? 'rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1)' : 'rgba(63, 63, 70, 0.5)'
                  }>
                    {statusIcon(testResults.tgdb.status)}
                  </TestResultIconBox>
                  <TestResultInfo>
                    <TestResultName>TheGamesDB</TestResultName>
                    <TestResultMessage $color={statusColor(testResults.tgdb.status)}>{testResults.tgdb.message}</TestResultMessage>
                  </TestResultInfo>
                </TestResultCard>

                {!testing && (
                  <TestSummary $success={testResults.igdb.status === 'success' || testResults.tgdb.status === 'success'}>
                    {(testResults.igdb.status === 'success' || testResults.tgdb.status === 'success')
                      ? 'Pelo menos uma API conectada. Curadoria habilitada.'
                      : 'Nenhuma API conectada. Curadoria desabilitada.'}
                  </TestSummary>
                )}
              </TestContent>

              <TestFooter>
                <TestCloseButton onClick={() => setShowTestModal(false)}>
                  Fechar
                </TestCloseButton>
              </TestFooter>
            </TestModal>
          </TestOverlay>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão de Clássico */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <ConfirmOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(null)}
          >
            <ConfirmModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ConfirmContent>
                <ConfirmIcon>
                  <LuTriangleAlert className="w-6 h-6" style={{ color: "var(--color-retro-danger, #ef4444)" }} />
                </ConfirmIcon>
                <div>
                  <ConfirmTitle>Remover Clássico</ConfirmTitle>
                  <ConfirmText>
                    Tem certeza que deseja remover <ConfirmHighlight $color="var(--color-retro-secondary, #6366f1)">"{showDeleteConfirm}"</ConfirmHighlight> da lista de clássicos protegidos?
                  </ConfirmText>
                </div>
              </ConfirmContent>
              <ConfirmFooter>
                <ConfirmCancel onClick={() => setShowDeleteConfirm(null)}>
                  Cancelar
                </ConfirmCancel>
                <ConfirmDelete onClick={() => handleRemoveClassic(showDeleteConfirm)}>
                  Remover
                </ConfirmDelete>
              </ConfirmFooter>
            </ConfirmModal>
          </ConfirmOverlay>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão de Gênero */}
      <AnimatePresence>
        {showGenreDeleteConfirm && (
          <ConfirmOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGenreDeleteConfirm(null)}
          >
            <ConfirmModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ConfirmContent>
                <ConfirmIcon>
                  <LuTriangleAlert className="w-6 h-6" style={{ color: "var(--color-retro-danger, #ef4444)" }} />
                </ConfirmIcon>
                <div>
                  <ConfirmTitle>Remover Gênero</ConfirmTitle>
                  <ConfirmText>
                    Tem certeza que deseja remover <ConfirmHighlight $color="var(--color-retro-warning, #eab308)">"{showGenreDeleteConfirm}"</ConfirmHighlight> da lista de gêneros protegidos?
                  </ConfirmText>
                </div>
              </ConfirmContent>
              <ConfirmFooter>
                <ConfirmCancel onClick={() => setShowGenreDeleteConfirm(null)}>
                  Cancelar
                </ConfirmCancel>
                <ConfirmDelete onClick={() => handleRemoveGenre(showGenreDeleteConfirm)}>
                  Remover
                </ConfirmDelete>
              </ConfirmFooter>
            </ConfirmModal>
          </ConfirmOverlay>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão de Jogo Protegido */}
      <AnimatePresence>
        {showProtectedGameDeleteConfirm && (
          <ConfirmOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProtectedGameDeleteConfirm(null)}
          >
            <ConfirmModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ConfirmContent>
                <ConfirmIcon>
                  <LuTriangleAlert className="w-6 h-6" style={{ color: "var(--color-retro-danger, #ef4444)" }} />
                </ConfirmIcon>
                <div>
                  <ConfirmTitle>Remover Jogo Protegido</ConfirmTitle>
                  <ConfirmText>
                    Tem certeza que deseja remover <ConfirmHighlight $color="#2dd4bf">"{showProtectedGameDeleteConfirm}"</ConfirmHighlight> da lista de jogos protegidos?
                  </ConfirmText>
                </div>
              </ConfirmContent>
              <ConfirmFooter>
                <ConfirmCancel onClick={() => setShowProtectedGameDeleteConfirm(null)}>
                  Cancelar
                </ConfirmCancel>
                <ConfirmDelete onClick={() => handleRemoveProtectedGame(showProtectedGameDeleteConfirm)}>
                  Remover
                </ConfirmDelete>
              </ConfirmFooter>
            </ConfirmModal>
          </ConfirmOverlay>
        )}
      </AnimatePresence>

      {/* Seletor de Jogos Clássicos */}
      <AnimatePresence>
        {showClassicPicker && (
          <ClassicGamesPicker
            onClose={() => setShowClassicPicker(false)}
            onAddClassics={handleBatchAddClassics}
            onToast={onToast}
          />
        )}
      </AnimatePresence>
    </>
  );
}
