import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Shield, Trash2, MoveRight, Star, Wifi, Loader2, CheckCircle2, XCircle, Search, Plus, AlertTriangle, Gamepad2, BookOpen } from 'lucide-react';
import { ClassicGamesPicker } from './ClassicGamesPicker';
import { getSystemLogo } from '../lib/system-logos';

interface SettingsModalProps {
  onClose: () => void;
  minRating: number;
  action: 'move' | 'delete';
  systems: Record<string, any>;
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

export function SettingsModal({ onClose, minRating, action, systems, classics, genres, protectedGames, onSave, onApiTested, onClassicsUpdated, onGenresUpdated, onProtectedGamesUpdated, onToast }: SettingsModalProps) {
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
    if (status === 'pending') return <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />;
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-retro-success" />;
    return <XCircle className="w-5 h-5 text-retro-danger" />;
  };

  const statusColor = (status: string) => {
    if (status === 'pending') return 'text-zinc-400';
    if (status === 'success') return 'text-retro-success';
    return 'text-retro-danger';
  };

  return (
    <>
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
          className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-100">Configurações</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
            {/* API Config */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Credenciais de API</h3>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all
                           bg-retro-primary/10 text-retro-primary border border-retro-primary/30
                           hover:bg-retro-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                  Testar Conexão
                </button>
              </div>
              <p className="text-xs text-zinc-500 -mt-2">
                Após preencher as credenciais, clique em <span className="text-retro-primary font-medium">"Testar Conexão"</span> para validar.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">IGDB Client ID</label>
                  <input
                    type="text"
                    value={config?.IGDB_CLIENT_ID || ''}
                    onChange={(e) => handleConfigChange('IGDB_CLIENT_ID', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">IGDB Client Secret</label>
                  <input
                    type="password"
                    value={config?.IGDB_CLIENT_SECRET || ''}
                    onChange={(e) => handleConfigChange('IGDB_CLIENT_SECRET', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">TGDB API Key</label>
                  <input
                    type="password"
                    value={config?.TGDB_API_KEY || ''}
                    onChange={(e) => handleConfigChange('TGDB_API_KEY', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Curation Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Configurações de Curadoria</h3>
              
              <div>
                <label className="text-xs text-zinc-500 mb-2 block flex items-center gap-2">
                  <Star className="w-4 h-4 text-retro-warning" />
                  Nota Mínima para Manter: {localMinRating}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localMinRating}
                  onChange={(e) => setLocalMinRating(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-retro-primary"
                />
                <div className="flex justify-between text-xs text-zinc-600 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Ação para Jogos Removidos</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLocalAction('move')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      localAction === 'move'
                        ? 'bg-retro-warning/10 border-retro-warning/30 text-retro-warning'
                        : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <MoveRight className="w-4 h-4" />
                    <span className="text-sm font-medium">Mover para /removidos</span>
                  </button>
                  <button
                    onClick={() => setLocalAction('delete')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      localAction === 'delete'
                        ? 'bg-retro-danger/10 border-retro-danger/30 text-retro-danger'
                        : 'bg-zinc-800/30 border-zinc-700/30 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Deletar Permanentemente</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Systems Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Sistemas Suportados ({Object.keys(systems).length})
              </h3>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto scrollbar-thin">
                {Object.entries(systems)
                  .sort(([, a], [, b]) => (a.name || '').localeCompare(b.name || ''))
                  .map(([ext, info]: [string, any]) => {
                    const logo = getSystemLogo(ext, info.name);
                    return (
                      <div key={ext} className="flex items-center gap-3 px-4 py-3 bg-zinc-800/30 rounded-xl">
                        {logo && (
                          <img
                            src={`system logos/${logo}`}
                            alt={info.name}
                            className="w-10 h-10 object-contain flex-shrink-0"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-mono text-retro-primary">{ext}</span>
                          <span className="text-xs text-zinc-400 truncate">{info.name}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Classics Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-retro-secondary" />
                  Clássicos Protegidos ({classics.length})
                </h3>
                <button
                  onClick={() => setShowClassicPicker(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all
                           bg-retro-secondary/10 text-retro-secondary border border-retro-secondary/30
                           hover:bg-retro-secondary/20"
                >
                  <BookOpen className="w-4 h-4" />
                  Popular Clássicos
                </button>
              </div>

              {/* Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filtrar clássicos..."
                  value={classicsFilter}
                  onChange={(e) => setClassicsFilter(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-retro-secondary/50 transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Add new classic */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar novo clássico..."
                  value={newClassic}
                  onChange={(e) => { setNewClassic(e.target.value); setValidationResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateClassic()}
                  className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-retro-secondary/50 transition-colors placeholder:text-zinc-600"
                />
                <button
                  onClick={handleValidateClassic}
                  disabled={validating || !newClassic.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all
                           bg-retro-secondary/10 text-retro-secondary border border-retro-secondary/30
                           hover:bg-retro-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Validar
                </button>
              </div>

              {/* Validation result */}
              <AnimatePresence>
                {validationResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                      validationResult.valid
                        ? 'bg-retro-success/10 text-retro-success border border-retro-success/20'
                        : 'bg-retro-danger/10 text-retro-danger border border-retro-danger/20'
                    }`}
                  >
                    {validationResult.valid ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                    <span>{validationResult.message}</span>
                    {validationResult.valid && (
                      <button
                        onClick={handleAddClassic}
                        className="ml-auto px-3 py-1 rounded-lg bg-retro-success/20 hover:bg-retro-success/30 text-xs font-medium transition-colors"
                      >
                        Adicionar
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Classics list */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                {filteredClassics.map((classic) => (
                  <span
                    key={classic}
                    className="group flex items-center gap-1 px-3 py-1 bg-retro-secondary/10 border border-retro-secondary/20 rounded-full text-xs text-retro-secondary"
                  >
                    {classic}
                    <button
                      onClick={() => setShowDeleteConfirm(classic)}
                      className="ml-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-retro-danger/20 hover:text-retro-danger transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filteredClassics.length === 0 && classicsFilter && (
                  <p className="text-xs text-zinc-600">Nenhum clássico encontrado</p>
                )}
              </div>
            </div>

            {/* Protected Genres */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-retro-warning" />
                Gêneros Protegidos ({genres.length})
              </h3>

              {config?.IGDB_CLIENT_ID && config?.IGDB_CLIENT_SECRET ? (
                <>
                  <p className="text-xs text-zinc-500 -mt-2">
                    Jogos destes gêneros serão mantidos mesmo com nota baixa.
                  </p>

                  {/* Filter */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrar gêneros..."
                      value={genresFilter}
                      onChange={(e) => setGenresFilter(e.target.value)}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-retro-warning/50 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Add new genre */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: RPG, Luta, Aventura..."
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGenre()}
                      className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-retro-warning/50 transition-colors placeholder:text-zinc-600"
                    />
                    <button
                      onClick={handleAddGenre}
                      disabled={!newGenre.trim()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all
                               bg-retro-warning/10 text-retro-warning border border-retro-warning/30
                               hover:bg-retro-warning/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>

                  {/* Genres list */}
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                    {filteredGenres.map((genre) => (
                      <span
                        key={genre}
                        className="group flex items-center gap-1 px-3 py-1 bg-retro-warning/10 border border-retro-warning/20 rounded-full text-xs text-retro-warning"
                      >
                        {genre}
                        <button
                          onClick={() => setShowGenreDeleteConfirm(genre)}
                          className="ml-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-retro-danger/20 hover:text-retro-danger transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filteredGenres.length === 0 && genresFilter && (
                      <p className="text-xs text-zinc-600">Nenhum gênero encontrado</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-zinc-300 font-medium">Feature bloqueada</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        A proteção por gêneros requer a API do <span className="text-retro-primary font-medium">IGDB</span> para identificar os gêneros dos jogos.
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Configure o <span className="text-zinc-300 font-mono">IGDB Client ID</span> e <span className="text-zinc-300 font-mono">IGDB Client Secret</span> na seção de credenciais acima para liberar esta funcionalidade.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Protected Games */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                Jogos Protegidos ({protectedGames.length})
              </h3>
              <p className="text-xs text-zinc-500 -mt-2">
                Jogos específicos que serão sempre mantidos, independente da nota ou gênero.
              </p>

              {/* Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filtrar jogos protegidos..."
                  value={protectedGamesFilter}
                  onChange={(e) => setProtectedGamesFilter(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-teal-400/50 transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Add new protected game */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome do jogo..."
                  value={newProtectedGame}
                  onChange={(e) => setNewProtectedGame(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProtectedGame()}
                  className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-teal-400/50 transition-colors placeholder:text-zinc-600"
                />
                <button
                  onClick={handleAddProtectedGame}
                  disabled={!newProtectedGame.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all
                           bg-teal-500/10 text-teal-400 border border-teal-500/30
                           hover:bg-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              {/* Protected games list */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                {filteredProtectedGames.map((game) => (
                  <span
                    key={game}
                    className="group flex items-center gap-1 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs text-teal-400"
                  >
                    {game}
                    <button
                      onClick={() => setShowProtectedGameDeleteConfirm(game)}
                      className="ml-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-retro-danger/20 hover:text-retro-danger transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filteredProtectedGames.length === 0 && protectedGamesFilter && (
                  <p className="text-xs text-zinc-600">Nenhum jogo encontrado</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-800/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Test Results Modal */}
      <AnimatePresence>
        {showTestModal && testResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]"
            onClick={() => setShowTestModal(false)}
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
                  <Wifi className="w-5 h-5 text-retro-primary" />
                  <h3 className="text-lg font-bold text-zinc-100">Teste de Conexão</h3>
                </div>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    testResults.igdb.status === 'success' ? 'bg-retro-success/10' :
                    testResults.igdb.status === 'error' ? 'bg-retro-danger/10' : 'bg-zinc-700/50'
                  }`}>
                    {statusIcon(testResults.igdb.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200">IGDB</p>
                    <p className={`text-xs ${statusColor(testResults.igdb.status)}`}>{testResults.igdb.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    testResults.tgdb.status === 'success' ? 'bg-retro-success/10' :
                    testResults.tgdb.status === 'error' ? 'bg-retro-danger/10' : 'bg-zinc-700/50'
                  }`}>
                    {statusIcon(testResults.tgdb.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200">TheGamesDB</p>
                    <p className={`text-xs ${statusColor(testResults.tgdb.status)}`}>{testResults.tgdb.message}</p>
                  </div>
                </div>

                {!testing && (
                  <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                    (testResults.igdb.status === 'success' || testResults.tgdb.status === 'success')
                      ? 'bg-retro-success/10 text-retro-success border border-retro-success/20'
                      : 'bg-retro-danger/10 text-retro-danger border border-retro-danger/20'
                  }`}>
                    {(testResults.igdb.status === 'success' || testResults.tgdb.status === 'success')
                      ? 'Pelo menos uma API conectada. Curadoria habilitada.'
                      : 'Nenhuma API conectada. Curadoria desabilitada.'}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-zinc-800/50 flex justify-end">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Classic Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70]"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-retro-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-retro-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Remover Clássico</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Tem certeza que deseja remover <span className="text-retro-secondary font-medium">"{showDeleteConfirm}"</span> da lista de clássicos protegidos?
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-800/50 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleRemoveClassic(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-retro-danger/10 text-retro-danger border border-retro-danger/30 font-medium hover:bg-retro-danger/20 transition-all text-sm"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Genre Confirmation Modal */}
      <AnimatePresence>
        {showGenreDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70]"
            onClick={() => setShowGenreDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-retro-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-retro-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Remover Gênero</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Tem certeza que deseja remover <span className="text-retro-warning font-medium">"{showGenreDeleteConfirm}"</span> da lista de gêneros protegidos?
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-800/50 flex gap-3">
                <button
                  onClick={() => setShowGenreDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleRemoveGenre(showGenreDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-retro-danger/10 text-retro-danger border border-retro-danger/30 font-medium hover:bg-retro-danger/20 transition-all text-sm"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Protected Game Confirmation Modal */}
      <AnimatePresence>
        {showProtectedGameDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70]"
            onClick={() => setShowProtectedGameDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-retro-danger/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-retro-danger" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Remover Jogo Protegido</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Tem certeza que deseja remover <span className="text-teal-400 font-medium">"{showProtectedGameDeleteConfirm}"</span> da lista de jogos protegidos?
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-800/50 flex gap-3">
                <button
                  onClick={() => setShowProtectedGameDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleRemoveProtectedGame(showProtectedGameDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-retro-danger/10 text-retro-danger border border-retro-danger/30 font-medium hover:bg-retro-danger/20 transition-all text-sm"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Classic Games Picker */}
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
