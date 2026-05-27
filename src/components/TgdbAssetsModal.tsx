import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Loader2, Image, Monitor, Palette, Flag, Type, FileText,
  Calendar, Building2, Search, ChevronDown, Download, FolderOpen,
  CheckCircle2, Copy, Plus, Trash2, Layers, Video, Gamepad2,
} from 'lucide-react';
import { getSystemLogo } from '../lib/system-logos';

interface TgdbAssetsModalProps {
  onClose: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type AssetTab = 'boxart' | 'screenshots' | 'fanart' | 'banner' | 'videos' | 'details';
type Step = 'search' | 'loading' | 'results';
type SearchMode = 'folder' | 'manual';
type ExportMode = 'retroarch' | 'esde' | 'manual' | null;

interface RomEntry {
  name: string;
  platformId: number;
  platformName: string;
  path: string;
}

interface ManualEntry {
  name: string;
  platformIds: number[];
}

const TGDB_PLATFORMS = [
  { id: 29, name: '3DO', playlist: 'Panasonic - 3DO' },
  { id: 4911, name: 'Amiga', playlist: 'Commodore - Amiga' },
  { id: 4947, name: 'Amiga CD32', playlist: 'Commodore - Amiga CD32' },
  { id: 4914, name: 'Amstrad CPC', playlist: 'Amstrad - CPC' },
  { id: 4942, name: 'Apple II', playlist: 'Apple - Apple II' },
  { id: 23, name: 'Arcade', playlist: 'Arcade' },
  { id: 22, name: 'Atari 2600', playlist: 'Atari - 2600' },
  { id: 26, name: 'Atari 5200', playlist: 'Atari - 5200' },
  { id: 27, name: 'Atari 7800', playlist: 'Atari - 7800' },
  { id: 4943, name: 'Atari 800', playlist: 'Atari - 800' },
  { id: 28, name: 'Atari Jaguar', playlist: 'Atari - Jaguar' },
  { id: 4924, name: 'Atari Lynx', playlist: 'Atari - Lynx' },
  { id: 4937, name: 'Atari ST', playlist: 'Atari - ST' },
  { id: 31, name: 'ColecoVision', playlist: 'Coleco - ColecoVision' },
  { id: 40, name: 'Commodore 64', playlist: 'Commodore - 64' },
  { id: 16, name: 'Dreamcast', playlist: 'Sega - Dreamcast' },
  { id: 4936, name: 'Famicom Disk System', playlist: 'Nintendo - Famicom Disk System' },
  { id: 4, name: 'Game Boy', playlist: 'Nintendo - Game Boy' },
  { id: 5, name: 'Game Boy Advance', playlist: 'Nintendo - Game Boy Advance' },
  { id: 41, name: 'Game Boy Color', playlist: 'Nintendo - Game Boy Color' },
  { id: 2, name: 'GameCube', playlist: 'Nintendo - GameCube' },
  { id: 32, name: 'Intellivision', playlist: 'Mattel - Intellivision' },
  { id: 4929, name: 'MSX', playlist: 'Microsoft - MSX' },
  { id: 24, name: 'Neo Geo', playlist: 'SNK - Neo Geo' },
  { id: 4956, name: 'Neo Geo CD', playlist: 'SNK - Neo Geo CD' },
  { id: 4922, name: 'Neo Geo Pocket', playlist: 'SNK - Neo Geo Pocket' },
  { id: 4923, name: 'Neo Geo Pocket Color', playlist: 'SNK - Neo Geo Pocket Color' },
  { id: 7, name: 'NES', playlist: 'Nintendo - Nintendo Entertainment System' },
  { id: 4912, name: 'Nintendo 3DS', playlist: 'Nintendo - Nintendo 3DS' },
  { id: 3, name: 'Nintendo 64', playlist: 'Nintendo - Nintendo 64' },
  { id: 8, name: 'Nintendo DS', playlist: 'Nintendo - Nintendo DS' },
  { id: 4971, name: 'Nintendo Switch', playlist: 'Nintendo - Nintendo Switch' },
  { id: 34, name: 'PC Engine', playlist: 'NEC - PC Engine' },
  { id: 4955, name: 'PC Engine CD', playlist: 'NEC - PC Engine CD' },
  { id: 1, name: 'PC', playlist: 'PC' },
  { id: 4957, name: 'Pokémon Mini', playlist: 'Nintendo - Pokémon Mini' },
  { id: 10, name: 'PlayStation', playlist: 'Sony - PlayStation' },
  { id: 11, name: 'PlayStation 2', playlist: 'Sony - PlayStation 2' },
  { id: 12, name: 'PlayStation 3', playlist: 'Sony - PlayStation 3' },
  { id: 13, name: 'PSP', playlist: 'Sony - PlayStation Portable' },
  { id: 39, name: 'PlayStation Vita', playlist: 'Sony - PlayStation Vita' },
  { id: 33, name: 'Sega 32X', playlist: 'Sega - 32X' },
  { id: 21, name: 'Sega CD', playlist: 'Sega - CD' },
  { id: 20, name: 'Sega Game Gear', playlist: 'Sega - Game Gear' },
  { id: 36, name: 'Sega Mega Drive', playlist: 'Sega - Mega Drive' },
  { id: 18, name: 'Sega Genesis', playlist: 'Sega - Genesis' },
  { id: 35, name: 'Sega Master System', playlist: 'Sega - Master System' },
  { id: 4949, name: 'Sega SG-1000', playlist: 'Sega - SG-1000' },
  { id: 17, name: 'Sega Saturn', playlist: 'Sega - Saturn' },
  { id: 6, name: 'SNES', playlist: 'Nintendo - Super Nintendo Entertainment System' },
  { id: 46, name: 'Vectrex', playlist: 'GCE - Vectrex' },
  { id: 4918, name: 'Virtual Boy', playlist: 'Nintendo - Virtual Boy' },
  { id: 9, name: 'Wii', playlist: 'Nintendo - Wii' },
  { id: 38, name: 'Wii U', playlist: 'Nintendo - Wii U' },
  { id: 4925, name: 'WonderSwan', playlist: 'Bandai - WonderSwan' },
  { id: 4926, name: 'WonderSwan Color', playlist: 'Bandai - WonderSwan Color' },
  { id: 14, name: 'Xbox', playlist: 'Microsoft - Xbox' },
  { id: 15, name: 'Xbox 360', playlist: 'Microsoft - Xbox 360' },
  { id: 4920, name: 'Xbox One', playlist: 'Microsoft - Xbox One' },
  { id: 4980, name: 'Xbox Series X', playlist: 'Microsoft - Xbox Series X' },
  { id: 4913, name: 'ZX Spectrum', playlist: 'Sinclair - ZX Spectrum' },
];

function formatReleaseDate(dateStr: string | null): string {
  if (!dateStr) return 'Desconhecida';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getPlatformName(id: number): string {
  return TGDB_PLATFORMS.find(p => p.id === id)?.name || `Platform ${id}`;
}

const RETROARCH_INSTRUCTIONS = `1. Abra o RetroArch e vá em Configurações → Diretório
2. Verifique o caminho de "Thumbnails"
3. As mídias exportadas devem estar em: [pasta]/thumbnails/[Playlist]/
4. Dentro da pasta da playlist, existem 3 subpastas:
   • Named_Boxarts → Capas dos jogos
   • Named_Snaps → Screenshots
   • Named_Titles → Telas de título
5. O nome do arquivo deve ser EXATAMENTE igual ao nome na playlist
   (caracteres especiais como &*/:\\<>?| são substituídos por _)
6. Formato: PNG
7. Reinicie o RetroArch ou recarregue a playlist para ver as mudanças`;

const ESDE_INSTRUCTIONS = `1. Localize a pasta de instalação do ES-DE
2. As mídias são salvas em: [pasta]/media/[sistema]/
3. O gamelist.xml é atualizado em: [pasta]/gamelists/[sistema]/
4. Convenção de nomes:
   • [Nome_Jogo]-image.png → Boxart/capa
   • [Nome_Jogo]-thumbnail.png → Screenshot
   • [Nome_Jogo]-fanart.png → Fanart
5. Espaços no nome são substituídos por underscore (_)
6. O RetroGrade atualiza automaticamente o gamelist.xml
7. Reinicie o ES-DE para ver as mudanças`;

const MANUAL_INSTRUCTIONS = `1. Escolha uma pasta de destino para exportar as mídias
2. O RetroGrade cria uma subpasta com o nome do jogo
3. Os arquivos são salvos com nomes descritivos:
   • boxart.png → Capa do jogo
   • screenshot_1.png, screenshot_2.png → Screenshots
   • fanart_1.png, fanart_2.png → Fanarts
   • banner.png → Banner
   • logo.png → Logo
4. Use essas imagens manualmente no seu frontend preferido
5. Consulte a documentação do seu frontend para a estrutura correta`;

export function TgdbAssetsModal({ onClose, onToast }: TgdbAssetsModalProps) {
  const [step, setStep] = useState<Step>('search');
  const [searchMode, setSearchMode] = useState<SearchMode>('manual');
  const [gameName, setGameName] = useState('');
  const [platformId, setPlatformId] = useState(0);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [platformSearch, setPlatformSearch] = useState('');
  const [activeTab, setActiveTab] = useState<AssetTab>('boxart');
  const [activeExport, setActiveExport] = useState<ExportMode>(null);
  const [assets, setAssets] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [exportTargetDir, setExportTargetDir] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<any>(null);
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Estado da varredura de pastas
  const [romFolders, setRomFolders] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [romEntries, setRomEntries] = useState<RomEntry[]>([]);
  const [selectedRoms, setSelectedRoms] = useState<Set<string>>(new Set());

  // Estado de entrada manual
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntryPlatforms, setNewEntryPlatforms] = useState<number[]>([]);
  const [showMultiPlatformDropdown, setShowMultiPlatformDropdown] = useState(false);

  // Seleção de tipo de mídia
  const [mediaTypes, setMediaTypes] = useState({
    boxart: true,
    screenshots: true,
    fanart: true,
    banner: false,
    logo: false,
    videos: false,
  });

  // Progresso do download
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0, currentGame: '' });
  const [downloadResults, setDownloadResults] = useState<any[]>([]);

  const filteredPlatforms = TGDB_PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(platformSearch.toLowerCase())
  );
  const selectedPlatform = TGDB_PLATFORMS.find(p => p.id === platformId);

  const handleSearch = async () => {
    if (!gameName.trim()) {
      onToast('Digite o nome do jogo.', 'error');
      return;
    }
    if (!platformId) {
      onToast('Selecione uma plataforma.', 'error');
      return;
    }
    setStep('loading');
    setSearchError(null);
    try {
      const result = await window.api.fetchTgdbAssets(gameName.trim(), platformId);
      setAssets(result);
      setStep('results');
      if (!result.boxart && result.screenshots.length === 0 && result.fanart.length === 0 && !result.banner) {
        onToast('Nenhuma mídia encontrada para este jogo.', 'info');
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro ao conectar com TheGamesDB.';
      setSearchError(msg);
      onToast(`Erro ao buscar mídias: ${msg}`, 'error');
      setStep('search');
    }
  };

  const handleSelectFolder = async () => {
    const result = await window.api.selectFolder();
    if (result) {
      if (!romFolders.includes(result)) {
        setRomFolders(prev => [...prev, result]);
      }
    }
  };

  const handleScanFolders = async () => {
    if (romFolders.length === 0) {
      onToast('Adicione ao menos uma pasta de ROMs.', 'error');
      return;
    }
    setScanning(true);
    setScanProgress(0);
    setRomEntries([]);
    setSelectedRoms(new Set());

    try {
      const allEntries: RomEntry[] = [];
      const systems = await window.api.readSystems();

      for (let f = 0; f < romFolders.length; f++) {
        const folder = romFolders[f];
        const files = await window.api.scanFolder(folder);
        const grouped = files.grouped || {};

        for (const [ext, roms] of Object.entries(grouped)) {
          const sysInfo = systems[ext];
          if (sysInfo && sysInfo.tgdb) {
            for (const rom of (roms as any[])) {
              allEntries.push({
                name: rom.name.replace(/\.[^.]+$/, ''),
                platformId: sysInfo.tgdb,
                platformName: sysInfo.name || getPlatformName(sysInfo.tgdb),
                path: rom.path,
              });
            }
          }
        }
        setScanProgress(((f + 1) / romFolders.length) * 100);
      }

      setRomEntries(allEntries);
      setSelectedRoms(new Set(allEntries.map(e => e.path)));
      setScanning(false);
      if (allEntries.length === 0) {
        onToast('Nenhuma ROM encontrada nas pastas selecionadas.', 'info');
      } else {
        onToast(`${allEntries.length} ROMs encontradas em ${romFolders.length} pasta(s).`, 'success');
      }
    } catch (err: any) {
      setScanning(false);
      const msg = err?.message || 'Erro ao escanear pastas.';
      onToast(`Erro ao escanear: ${msg}`, 'error');
    }
  };

  const addManualEntry = () => {
    if (!newEntryName.trim()) {
      onToast('Digite o nome do jogo.', 'error');
      return;
    }
    if (newEntryPlatforms.length === 0) {
      onToast('Selecione ao menos uma plataforma.', 'error');
      return;
    }
    setManualEntries(prev => [...prev, { name: newEntryName.trim(), platformIds: [...newEntryPlatforms] }]);
    setNewEntryName('');
    setNewEntryPlatforms([]);
  };

  const removeManualEntry = (index: number) => {
    setManualEntries(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRomSelection = (path: string) => {
    setSelectedRoms(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const selectAllRoms = () => setSelectedRoms(new Set(romEntries.map(e => e.path)));
  const deselectAllRoms = () => setSelectedRoms(new Set());

  const handleDownloadBatch = async () => {
    const entries: { name: string; platformId: number }[] = [];

    if (searchMode === 'folder') {
      romEntries.filter(e => selectedRoms.has(e.path)).forEach(e => {
        entries.push({ name: e.name, platformId: e.platformId });
      });
    } else {
      manualEntries.forEach(entry => {
        entry.platformIds.forEach(pid => {
          entries.push({ name: entry.name, platformId: pid });
        });
      });
    }

    if (entries.length === 0) {
      onToast('Nenhum jogo selecionado para download.', 'error');
      return;
    }

    setDownloading(true);
    setDownloadProgress({ current: 0, total: entries.length, currentGame: '' });
    setDownloadResults([]);

    const results: any[] = [];
    let errorCount = 0;

    for (let i = 0; i < entries.length; i++) {
      const { name, platformId: pid } = entries[i];
      setDownloadProgress({ current: i + 1, total: entries.length, currentGame: name });

      try {
        const assetResult = await window.api.fetchTgdbAssets(name, pid);
        const hasAssets = assetResult?.boxart || assetResult?.screenshots?.length > 0 || assetResult?.fanart?.length > 0;
        results.push({
          name,
          platform: getPlatformName(pid),
          status: hasAssets ? 'success' : 'no_assets',
          assets: assetResult,
        });
        if (!hasAssets) errorCount++;
      } catch (err: any) {
        results.push({ name, platform: getPlatformName(pid), status: 'error', error: err?.message });
        errorCount++;
      }
    }

    setDownloadResults(results);
    setDownloading(false);
    const successCount = results.filter(r => r.status === 'success').length;
    if (errorCount > 0) {
      onToast(`Download: ${successCount} sucesso(s), ${errorCount} falha(s).`, errorCount === entries.length ? 'error' : 'info');
    } else {
      onToast(`Download concluído: ${successCount}/${entries.length} jogos.`, 'success');
    }
  };

  const handleExport = async () => {
    if (!exportTargetDir) {
      onToast('Selecione uma pasta de destino.', 'error');
      return;
    }
    if (!assets) return;
    setExporting(true);
    setExportResult(null);

    try {
      let result;
      if (activeExport === 'retroarch') {
        const platform = TGDB_PLATFORMS.find(p => p.id === platformId);
        result = await window.api.exportAssetsRetroarch({
          targetDir: exportTargetDir,
          playlistName: platform?.playlist || `Platform_${platformId}`,
          gameName: gameName.trim(),
          assets: { boxart: assets.boxart, screenshots: assets.screenshots, fanart: assets.fanart },
        });
      } else if (activeExport === 'esde') {
        result = await window.api.exportAssetsEsde({
          targetDir: exportTargetDir,
          systemId: platformId,
          gameName: gameName.trim(),
          assets,
        });
      } else {
        result = await window.api.exportAssetsManual({
          targetDir: exportTargetDir,
          gameName: gameName.trim(),
          assets: { boxart: assets.boxart, screenshots: assets.screenshots, fanart: assets.fanart, banner: assets.banner, logo: assets.logo },
        });
      }

      setExportResult(result);
      if (result.successCount > 0) {
        onToast(`${result.successCount} mídia(s) exportada(s) com sucesso!`, 'success');
      } else {
        onToast('Falha ao exportar mídias.', 'error');
      }
    } catch {
      onToast('Erro ao exportar mídias.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const copyInstructions = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInstruction(true);
    setTimeout(() => setCopiedInstruction(false), 2000);
  };

  const tabs: { id: AssetTab; label: string; icon: any; count: number }[] = assets
    ? [
        { id: 'boxart', label: 'Boxart', icon: Image, count: assets.boxart ? 1 : 0 },
        { id: 'screenshots', label: 'Screenshots', icon: Monitor, count: assets.screenshots.length },
        { id: 'fanart', label: 'Fanart', icon: Palette, count: assets.fanart.length },
        { id: 'banner', label: 'Banner', icon: Flag, count: assets.banner ? 1 : 0 },
        { id: 'videos', label: 'Vídeos', icon: Video, count: assets.videos?.length || 0 },
        { id: 'details', label: 'Detalhes', icon: FileText, count: 1 },
      ]
    : [];

  const validTabs = tabs.filter(t => t.count > 0);

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
        className="glass rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-retro-primary" />
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Mídias</h3>
              {step === 'results' && assets?.gameTitle && (
                <p className="text-xs text-zinc-500">{assets.gameTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {step === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              {/* Abas do Modo de Busca */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSearchMode('manual')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    searchMode === 'manual'
                      ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                      : 'bg-zinc-800/30 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800/50'
                  }`}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Busca Manual
                </button>
                <button
                  onClick={() => setSearchMode('folder')}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    searchMode === 'folder'
                      ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                      : 'bg-zinc-800/30 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800/50'
                  }`}
                >
                  <FolderOpen className="w-4 h-4 inline mr-2" />
                  Escanear Pastas
                </button>
              </div>

              {searchMode === 'manual' && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Nome do Jogo</label>
                    <input
                      type="text"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Ex: Super Mario World"
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50 focus:ring-1 focus:ring-retro-primary/20 transition-colors"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-zinc-300">Plataforma</label>
                    <button
                      onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-left flex items-center justify-between text-zinc-200 hover:border-zinc-600 transition-colors"
                    >
                      <span className={selectedPlatform ? 'text-zinc-200' : 'text-zinc-600'}>
                        {selectedPlatform ? selectedPlatform.name : 'Selecione uma plataforma...'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${showPlatformDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showPlatformDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-2 bg-zinc-800 border border-zinc-700/50 rounded-xl shadow-xl overflow-hidden"
                        >
                          <div className="p-2 border-b border-zinc-700/50">
                            <input
                              type="text"
                              value={platformSearch}
                              onChange={(e) => setPlatformSearch(e.target.value)}
                              placeholder="Buscar plataforma..."
                              className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700/30 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto scrollbar-thin">
                            {filteredPlatforms.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setPlatformId(p.id);
                                  setShowPlatformDropdown(false);
                                  setPlatformSearch('');
                                }}
                                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-zinc-700/50 transition-colors ${
                                  platformId === p.id ? 'text-retro-primary bg-retro-primary/5' : 'text-zinc-300'
                                }`}
                              >
                                {p.name}
                              </button>
                            ))}
                            {filteredPlatforms.length === 0 && (
                              <p className="px-4 py-3 text-sm text-zinc-600">Nenhuma plataforma encontrada.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Media Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Tipos de Mídia</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'boxart', label: 'Box Art', icon: Image },
                        { key: 'screenshots', label: 'Screenshots', icon: Monitor },
                        { key: 'fanart', label: 'Fanart', icon: Palette },
                        { key: 'banner', label: 'Banner', icon: Flag },
                        { key: 'logo', label: 'Logo', icon: Layers },
                      ].map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setMediaTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            mediaTypes[key as keyof typeof mediaTypes]
                              ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                              : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/30'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                    Buscar Mídias
                  </button>
                </div>
              )}

              {searchMode === 'folder' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Seleção de Pasta */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-300">Pastas de ROMs</label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectFolder}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-700/50 text-zinc-300 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Pasta
                      </button>
                    </div>
                    {romFolders.length > 0 && (
                      <div className="space-y-1">
                        {romFolders.map((folder, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 rounded-lg">
                            <FolderOpen className="w-3 h-3 text-zinc-500" />
                            <span className="text-xs text-zinc-300 flex-1 truncate">{folder}</span>
                            <button
                              onClick={() => setRomFolders(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-zinc-500 hover:text-retro-danger transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão de Varredura */}
                  <button
                    onClick={handleScanFolders}
                    disabled={scanning || romFolders.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl font-medium hover:bg-retro-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Escaneando... {Math.round(scanProgress)}%
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Escanear ROMs
                      </>
                    )}
                  </button>

                  {/* Progresso da Varredura */}
                  {scanning && (
                    <div className="w-full bg-zinc-800/50 rounded-full h-2">
                      <div
                        className="bg-retro-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Lista de ROMs agrupada por sistema */}
                  {romEntries.length > 0 && !scanning && (
                    <div className="space-y-4">
{/* Seleção de Tipo de Mídia */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Tipos de Mídia</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: 'boxart', label: 'Box Art', icon: Image },
                            { key: 'screenshots', label: 'Screenshots', icon: Monitor },
                            { key: 'fanart', label: 'Fanart', icon: Palette },
                            { key: 'banner', label: 'Banner', icon: Flag },
                            { key: 'logo', label: 'Logo', icon: Layers },
                            { key: 'videos', label: 'Vídeos', icon: Video },
                          ].map(({ key, label, icon: Icon }) => (
                            <button
                              key={key}
                              onClick={() => setMediaTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                mediaTypes[key as keyof typeof mediaTypes]
                                  ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                                  : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/30'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ROMs agrupadas por sistema */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">{romEntries.length} ROMs em {new Set(romEntries.map(e => e.platformName)).size} sistema(s)</span>
                          <div className="flex gap-2">
                            <button onClick={selectAllRoms} className="text-xs text-retro-primary hover:text-retro-primary/80">Selecionar Todas</button>
                            <button onClick={deselectAllRoms} className="text-xs text-zinc-500 hover:text-zinc-300">Limpar</button>
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-3">
                          {Object.entries(
                            romEntries.reduce((acc, rom) => {
                              const sys = rom.platformName;
                              if (!acc[sys]) acc[sys] = [];
                              acc[sys].push(rom);
                              return acc;
                            }, {} as Record<string, typeof romEntries>)
                          )
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([system, roms]) => {
                              const logo = getSystemLogo(undefined, system);
                              return (
                                <div key={system} className="space-y-1">
                                  <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-800/40 rounded-lg">
                                    {logo && (
                                      <img
                                        src={`system/logos/${logo}`}
                                        alt={system}
                                        className="w-5 h-5 object-contain"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                      />
                                    )}
                                    {!logo && <Gamepad2 className="w-3 h-3 text-retro-primary" />}
                                    <span className="text-xs font-medium text-zinc-300">{system}</span>
                                    <span className="text-xs text-zinc-600">({roms.length})</span>
                                  </div>
                                <div className="pl-2 space-y-1">
                                  {roms.map((rom) => {
                                    const isSelected = selectedRoms.has(rom.path);
                                    return (
                                      <button
                                        key={rom.path}
                                        onClick={() => toggleRomSelection(rom.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                                          isSelected
                                            ? 'bg-retro-primary/10 border border-retro-primary/30'
                                            : 'bg-zinc-800/20 border border-transparent hover:bg-zinc-800/40'
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                          isSelected ? 'bg-retro-primary border-retro-primary' : 'border-zinc-600'
                                        }`}>
                                          {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className={`flex-1 text-sm truncate ${isSelected ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                          {rom.name}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                            })}
                        </div>
                      </div>

                      <button
                        onClick={handleDownloadBatch}
                        disabled={downloading || selectedRoms.size === 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-retro-success/10 text-retro-success border border-retro-success/30 rounded-xl font-medium hover:bg-retro-success/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Baixando {downloadProgress.current}/{downloadProgress.total}...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Baixar Mídias ({selectedRoms.size} jogos)
                          </>
                        )}
                      </button>

                      {downloading && (
                        <div className="space-y-2">
                          <div className="w-full bg-zinc-800/50 rounded-full h-2">
                            <div
                              className="bg-retro-success h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-zinc-500 text-center">{downloadProgress.currentGame}</p>
                        </div>
                      )}

                      {downloadResults.length > 0 && !downloading && (
                        <div className="p-4 bg-zinc-800/30 rounded-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                          <p className="text-sm font-medium text-zinc-300">Resultados</p>
                          {downloadResults.map((r, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-zinc-400 flex-1 truncate mr-2">{r.name} ({r.platform})</span>
                              <span className={
                                r.status === 'success' ? 'text-retro-success' :
                                r.status === 'no_assets' ? 'text-retro-warning' : 'text-retro-danger'
                              }>
                                {r.status === 'success' ? '✓' : r.status === 'no_assets' ? '⚠' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Entrada Manual para Modo Pasta */}
                  <div className="pt-4 border-t border-zinc-800/30 space-y-3">
                    <p className="text-sm font-medium text-zinc-300">Ou adicione jogos manualmente</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newEntryName}
                        onChange={(e) => setNewEntryName(e.target.value)}
                        placeholder="Nome do jogo..."
                        className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50"
                      />
                      <div className="relative">
                        <button
                          onClick={() => setShowMultiPlatformDropdown(!showMultiPlatformDropdown)}
                          className="px-3 py-2 bg-zinc-700/50 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                        >
                          {newEntryPlatforms.length > 0 ? `${newEntryPlatforms.length} plat.` : 'Plataformas'}
                        </button>
                        <AnimatePresence>
                          {showMultiPlatformDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 top-full mt-1 w-56 max-h-48 bg-zinc-800 border border-zinc-700/50 rounded-xl shadow-xl overflow-y-auto scrollbar-thin z-10"
                            >
                              {TGDB_PLATFORMS.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    setNewEntryPlatforms(prev =>
                                      prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                    );
                                  }}
                                  className={`w-full px-3 py-2 text-xs text-left hover:bg-zinc-700/50 transition-colors flex items-center gap-2 ${
                                    newEntryPlatforms.includes(p.id) ? 'text-retro-primary' : 'text-zinc-400'
                                  }`}
                                >
                                  <div className={`w-3 h-3 rounded border ${
                                    newEntryPlatforms.includes(p.id) ? 'bg-retro-primary border-retro-primary' : 'border-zinc-600'
                                  }`} />
                                  {p.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={addManualEntry}
                        className="px-3 py-2 bg-retro-primary/10 text-retro-primary rounded-lg text-sm hover:bg-retro-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {manualEntries.length > 0 && (
                      <div className="space-y-1">
                        {manualEntries.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 rounded-lg">
                            <span className="text-xs text-zinc-300 flex-1">{entry.name}</span>
                            <span className="text-xs text-zinc-600">{entry.platformIds.map(getPlatformName).join(', ')}</span>
                            <button onClick={() => removeManualEntry(i)} className="text-zinc-500 hover:text-retro-danger">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {manualEntries.length > 0 && (
                      <button
                        onClick={handleDownloadBatch}
                        disabled={downloading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-retro-success/10 text-retro-success border border-retro-success/30 rounded-xl font-medium hover:bg-retro-success/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Mídias ({manualEntries.length} jogos)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-retro-primary animate-spin" />
              <p className="text-zinc-400">Buscando mídias na TheGamesDB...</p>
              {searchError && (
                <div className="flex flex-col items-center gap-3 mt-4">
                  <p className="text-sm text-retro-danger text-center max-w-sm">{searchError}</p>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-retro-primary/10 text-retro-primary border border-retro-primary/30 rounded-xl text-sm font-medium hover:bg-retro-primary/20 transition-all"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'results' && assets && (
            <div className="p-6">
              {/* Quando a exportação está ativa, oculta outras abas */}
              {!activeExport && validTabs.length > 0 && (
                <div className="flex gap-1 mb-6 border-b border-zinc-800/30">
                  {validTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-zinc-800/50 text-retro-primary border-b-2 border-retro-primary'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        <span className="text-xs opacity-60">({tab.count})</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setActiveExport('retroarch')}
                    className="ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors text-zinc-500 hover:text-zinc-300"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {activeExport ? (
                  <motion.div
                    key="export"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex gap-2">
                      {(['retroarch', 'esde', 'manual'] as ExportMode[]).map((mode) => {
                        const labels = { retroarch: 'RetroArch', esde: 'ES-DE', manual: 'Manual' };
                        const icons = { retroarch: '🎮', esde: '🖥️', manual: '📁' };
                        return (
                          <button
                            key={mode}
                            onClick={() => { setActiveExport(mode); setExportResult(null); }}
                            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              activeExport === mode
                                ? 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30'
                                : 'bg-zinc-800/30 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800/50'
                            }`}
                          >
                            <span className="mr-2">{icons[mode!]}</span>
                            {labels[mode!]}
                          </button>
                        );
                      })}
                    </div>

                    {activeExport === 'retroarch' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                          <div className="flex items-center gap-2 text-zinc-300 font-medium">
                            <FolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione a pasta do RetroArch..."
                              className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/30 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50"
                              readOnly
                            />
                            <button
                              onClick={handleSelectFolder}
                              className="px-4 py-2.5 bg-zinc-700/50 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-400">Como funciona</span>
                            <button
                              onClick={() => copyInstructions(RETROARCH_INSTRUCTIONS)}
                              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              {copiedInstruction ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </button>
                          </div>
                          <pre className="text-xs text-zinc-500 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto scrollbar-thin">
                            {RETROARCH_INSTRUCTIONS}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeExport === 'esde' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                          <div className="flex items-center gap-2 text-zinc-300 font-medium">
                            <FolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione a pasta do ES-DE..."
                              className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/30 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50"
                              readOnly
                            />
                            <button
                              onClick={handleSelectFolder}
                              className="px-4 py-2.5 bg-zinc-700/50 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-400">Como funciona</span>
                            <button
                              onClick={() => copyInstructions(ESDE_INSTRUCTIONS)}
                              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              {copiedInstruction ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </button>
                          </div>
                          <pre className="text-xs text-zinc-500 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto scrollbar-thin">
                            {ESDE_INSTRUCTIONS}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeExport === 'manual' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                          <div className="flex items-center gap-2 text-zinc-300 font-medium">
                            <FolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione uma pasta..."
                              className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/30 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-retro-primary/50"
                              readOnly
                            />
                            <button
                              onClick={handleSelectFolder}
                              className="px-4 py-2.5 bg-zinc-700/50 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-zinc-400">Como funciona</span>
                            <button
                              onClick={() => copyInstructions(MANUAL_INSTRUCTIONS)}
                              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              {copiedInstruction ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </button>
                          </div>
                          <pre className="text-xs text-zinc-500 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto scrollbar-thin">
                            {MANUAL_INSTRUCTIONS}
                          </pre>
                        </div>
                      </div>
                    )}

                    {exportResult && (
                      <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-retro-success" />
                          <span className="text-zinc-200 font-medium">
                            {exportResult.successCount}/{exportResult.total} mídias exportadas
                          </span>
                        </div>
                        <div className="space-y-1">
                          {exportResult.results.map((r: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className={r.status === 'success' ? 'text-zinc-400' : 'text-retro-danger'}>
                                {r.type}
                              </span>
                              <span className={r.status === 'success' ? 'text-retro-success' : 'text-retro-danger'}>
                                {r.status === 'success' ? r.path : r.error}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleExport}
                      disabled={exporting || !exportTargetDir}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-retro-success/10 text-retro-success border border-retro-success/30 rounded-xl font-medium hover:bg-retro-success/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Exportar Mídias
                        </>
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {activeTab === 'boxart' && assets.boxart && (
                      <motion.div key="boxart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center">
                        <button onClick={() => setSelectedImage(assets.boxart)} className="group relative rounded-xl overflow-hidden border border-zinc-700/50 hover:border-retro-primary/50 transition-colors">
                          <img src={assets.boxart} alt="Boxart" className="w-64 h-auto object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-lg">Ver em tamanho real</span>
                          </div>
                        </button>
                      </motion.div>
                    )}

                    {activeTab === 'screenshots' && assets.screenshots.length > 0 && (
                      <motion.div key="screenshots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {assets.screenshots.map((url: string, i: number) => (
                          <button key={i} onClick={() => setSelectedImage(url)} className="group relative rounded-xl overflow-hidden border border-zinc-700/50 hover:border-retro-primary/50 transition-colors aspect-video">
                            <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'fanart' && assets.fanart.length > 0 && (
                      <motion.div key="fanart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-4">
                        {assets.fanart.map((url: string, i: number) => (
                          <button key={i} onClick={() => setSelectedImage(url)} className="group relative rounded-xl overflow-hidden border border-zinc-700/50 hover:border-retro-primary/50 transition-colors aspect-video">
                            <img src={url} alt={`Fanart ${i + 1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </button>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'banner' && assets.banner && (
                      <motion.div key="banner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-center">
                        <img src={assets.banner} alt="Banner" className="max-w-md w-full h-auto rounded-xl border border-zinc-700/50" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </motion.div>
                    )}

                    {activeTab === 'videos' && assets.videos && assets.videos.length > 0 && (
                      <motion.div key="videos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        {assets.videos.map((video: { url: string; title: string }, i: number) => (
                          <div key={i} className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2"><Video className="w-3 h-3" />Vídeo {i + 1}</div>
                            <p className="text-zinc-200 font-medium text-sm mb-3">{video.title}</p>
                            <video
                              src={video.url}
                              controls
                              className="w-full max-h-64 rounded-lg bg-zinc-900"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'videos' && (!assets.videos || assets.videos.length === 0) && (
                      <motion.div key="no-videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 space-y-3">
                        <Video className="w-12 h-12 text-zinc-700" />
                        <p className="text-zinc-500 font-medium">Nenhum vídeo encontrado</p>
                        <p className="text-xs text-zinc-600">Este jogo não possui vídeos disponíveis na TheGamesDB.</p>
                      </motion.div>
                    )}

                    {activeTab === 'details' && (
                      <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        {assets.logo && (
                          <div className="flex justify-center">
                            <img src={assets.logo} alt="Logo" className="max-h-24 w-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1"><Type className="w-3 h-3" />Título</div>
                            <p className="text-zinc-200 font-medium">{assets.gameTitle || gameName}</p>
                          </div>
                          <div className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1"><Calendar className="w-3 h-3" />Lançamento</div>
                            <p className="text-zinc-200 font-medium">{formatReleaseDate(assets.releaseDate)}</p>
                          </div>
                          <div className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1"><Building2 className="w-3 h-3" />Desenvolvedor</div>
                            <p className="text-zinc-200 font-medium">{assets.developer || 'Desconhecido'}</p>
                          </div>
                          <div className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1"><Building2 className="w-3 h-3" />Publicadora</div>
                            <p className="text-zinc-200 font-medium">{assets.publisher || 'Desconhecido'}</p>
                          </div>
                        </div>
                        {assets.overview && (
                          <div className="p-4 bg-zinc-800/30 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2"><FileText className="w-3 h-3" />Sinopse</div>
                            <p className="text-zinc-300 text-sm leading-relaxed">{assets.overview}</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {validTabs.length === 0 && (
                      <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-12 space-y-3">
                        <Image className="w-12 h-12 text-zinc-700" />
                        <p className="text-zinc-500 font-medium">Nenhuma mídia encontrada</p>
                        <p className="text-xs text-zinc-600">Tente buscar com outro nome ou plataforma.</p>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50 flex justify-between gap-3">
          {step === 'results' && !activeExport && (
            <button
              onClick={() => { setStep('search'); setGameName(''); setPlatformId(0); setAssets(null); }}
              className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
            >
              Nova Busca
            </button>
          )}
          {activeExport && (
            <button
              onClick={() => { setActiveExport(null); setExportResult(null); }}
              className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
            >
              Voltar às Mídias
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium">
            Fechar
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60]"
            onClick={() => setSelectedImage(null)}
          >
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} src={selectedImage} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
