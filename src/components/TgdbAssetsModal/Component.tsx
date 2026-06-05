import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LuX, LuLoader, LuImage, LuMonitor, LuPalette, LuFlag, LuType, LuFileText,
  LuCalendar, LuBuilding2, LuSearch, LuChevronDown, LuDownload, LuFolderOpen,
  LuCircleCheckBig, LuCopy, LuPlus, LuTrash2, LuLayers, LuVideo, LuGamepad2,
} from "react-icons/lu";
import { getSystemLogo } from '../../lib/system-logos';
import {
  Overlay, Modal, Header, HeaderLeft, HeaderTitle, HeaderSubtitle, CloseButton,
  ContentScroll, SearchSection, MaxWidthMd, MaxWidthLg, SearchModeButtons,
  SearchModeButton, FieldGroup, FieldLabel, TextInput,
  DropdownButton, DropdownPlaceholder, DropdownArrow, DropdownMenu, DropdownSearch,
  DropdownSearchInput, DropdownList, DropdownItem, DropdownEmpty, MediaTypeGrid,
  MediaTypeButton, SearchButton, FolderSection, AddFolderButton, FolderList,
  FolderItem, FolderText, FolderRemoveButton, ScanButton, ProgressBar, ProgressFill,
  SuccessProgressFill, RomEntriesSection, RomEntriesHeader, RomEntriesCount,
  SelectActions, SelectAction, ClearAction, RomEntriesScroll, SystemGroup,
  SystemHeader, SystemLogo, SystemName, SystemCount, RomList, RomButton,
  Checkbox, RomName, DownloadButton, DownloadProgressText, DownloadResults,
  DownloadResultsTitle, DownloadResultRow, DownloadResultName, DownloadResultStatus,
  ManualSection, ManualTitle, ManualInputRow, ManualInput, PlatformSelectButton,
  MultiPlatformDropdown, PlatformCheckbox, PlatformCheckBox, AddEntryButton,
  ManualEntriesList, ManualEntryItem, ManualEntryName, ManualEntryPlatforms,
  ManualEntryRemove, LoadingContainer, LoadingText, RetryContainer, RetryText,
  RetryButton, ResultsContent, TabsBar, TabButton, TabCount, ExportButton,
  ExportSection, ExportModeButtons, ExportModeButton, ExportConfig, ExportCard,
  ExportCardTitle, FolderInputGroup, FolderInput, FolderBrowseButton,
  InstructionsCard, InstructionsHeader, InstructionsLabel, CopyInstructionsButton,
  InstructionsPre, ExportResultCard, ExportResultSummary, ExportResultText,
  ExportResultList, ExportResultItem, ExportResultItemType, ExportResultItemValue,
  ExportButtonStyled, BoxartContainer, BoxartButton, BoxartOverlay, BoxartLabel,
  ImageGrid, ImageGridItem, ImageOverlay, BannerContainer, BannerImage,
  VideosSection, VideoCard, VideoLabel, VideoTitle, VideoPlayer,
  NoResults, NoResultsTitle, NoResultsDesc, DetailsSection, DetailsGrid,
  DetailCard, DetailLabel, DetailValue, Footer, FooterLeft, FooterButton,
  PreviewOverlay, PreviewCloseButton, PreviewImage,
} from "./styles";

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

  const [romFolders, setRomFolders] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [romEntries, setRomEntries] = useState<RomEntry[]>([]);
  const [selectedRoms, setSelectedRoms] = useState<Set<string>>(new Set());

  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [newEntryName, setNewEntryName] = useState('');
  const [newEntryPlatforms, setNewEntryPlatforms] = useState<number[]>([]);
  const [showMultiPlatformDropdown, setShowMultiPlatformDropdown] = useState(false);

  const [mediaTypes, setMediaTypes] = useState({
    boxart: true,
    screenshots: true,
    fanart: true,
    banner: false,
    logo: false,
    videos: false,
  });

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
        { id: 'boxart', label: 'Boxart', icon: LuImage, count: assets.boxart ? 1 : 0 },
        { id: 'screenshots', label: 'Screenshots', icon: LuMonitor, count: assets.screenshots.length },
        { id: 'fanart', label: 'Fanart', icon: LuPalette, count: assets.fanart.length },
        { id: 'banner', label: 'Banner', icon: LuFlag, count: assets.banner ? 1 : 0 },
        { id: 'videos', label: 'Vídeos', icon: LuVideo, count: assets.videos?.length || 0 },
        { id: 'details', label: 'Detalhes', icon: LuFileText, count: 1 },
      ]
    : [];

  const validTabs = tabs.filter(t => t.count > 0);

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            <LuDownload className="w-5 h-5" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
            <div>
              <HeaderTitle>Mídias</HeaderTitle>
              {step === 'results' && assets?.gameTitle && (
                <HeaderSubtitle>{assets.gameTitle}</HeaderSubtitle>
              )}
            </div>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX className="w-5 h-5" />
          </CloseButton>
        </Header>

        <ContentScroll>
          {step === 'search' && (
            <SearchSection
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SearchModeButtons>
                <SearchModeButton $active={searchMode === 'manual'} onClick={() => setSearchMode('manual')}>
                  <LuSearch className="w-4 h-4 inline mr-2" />
                  Busca Manual
                </SearchModeButton>
                <SearchModeButton $active={searchMode === 'folder'} onClick={() => setSearchMode('folder')}>
                  <LuFolderOpen className="w-4 h-4 inline mr-2" />
                  Escanear Pastas
                </SearchModeButton>
              </SearchModeButtons>

              {searchMode === 'manual' && (
                <MaxWidthMd>
                  <FieldGroup>
                    <FieldLabel>Nome do Jogo</FieldLabel>
                    <TextInput
                      type="text"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Ex: Super Mario World"
                    />
                  </FieldGroup>

                  <FieldGroup style={{ position: 'relative' }}>
                    <FieldLabel>Plataforma</FieldLabel>
                    <DropdownButton onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}>
                      <DropdownPlaceholder $selected={!!selectedPlatform}>
                        {selectedPlatform ? selectedPlatform.name : 'Selecione uma plataforma...'}
                      </DropdownPlaceholder>
                      <DropdownArrow $open={showPlatformDropdown}>
                        <LuChevronDown className="w-4 h-4" style={{ color: '#71717a' }} />
                      </DropdownArrow>
                    </DropdownButton>

                    <AnimatePresence>
                      {showPlatformDropdown && (
                        <DropdownMenu
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <DropdownSearch>
                            <DropdownSearchInput
                              type="text"
                              value={platformSearch}
                              onChange={(e) => setPlatformSearch(e.target.value)}
                              placeholder="Buscar plataforma..."
                              autoFocus
                            />
                          </DropdownSearch>
                          <DropdownList>
                            {filteredPlatforms.map((p) => (
                              <DropdownItem
                                key={p.id}
                                $selected={platformId === p.id}
                                onClick={() => {
                                  setPlatformId(p.id);
                                  setShowPlatformDropdown(false);
                                  setPlatformSearch('');
                                }}
                              >
                                {p.name}
                              </DropdownItem>
                            ))}
                            {filteredPlatforms.length === 0 && (
                              <DropdownEmpty>Nenhuma plataforma encontrada.</DropdownEmpty>
                            )}
                          </DropdownList>
                        </DropdownMenu>
                      )}
                    </AnimatePresence>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Tipos de Mídia</FieldLabel>
                    <MediaTypeGrid $cols={2}>
                      {[
                        { key: 'boxart', label: 'Box Art', icon: LuImage },
                        { key: 'screenshots', label: 'Screenshots', icon: LuMonitor },
                        { key: 'fanart', label: 'Fanart', icon: LuPalette },
                        { key: 'banner', label: 'Banner', icon: LuFlag },
                        { key: 'logo', label: 'Logo', icon: LuLayers },
                      ].map(({ key, label, icon: Icon }) => (
                        <MediaTypeButton
                          key={key}
                          $active={mediaTypes[key as keyof typeof mediaTypes]}
                          onClick={() => setMediaTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        >
                          <Icon className="w-3 h-3" />
                          {label}
                        </MediaTypeButton>
                      ))}
                    </MediaTypeGrid>
                  </FieldGroup>

                  <SearchButton onClick={handleSearch}>
                    <LuSearch className="w-4 h-4" />
                    Buscar Mídias
                  </SearchButton>
                </MaxWidthMd>
              )}

              {searchMode === 'folder' && (
                <MaxWidthLg>
                  <FolderSection>
                    <FieldLabel>Pastas de ROMs</FieldLabel>
                    <AddFolderButton onClick={handleSelectFolder}>
                      <LuPlus className="w-4 h-4" />
                      Adicionar Pasta
                    </AddFolderButton>
                    {romFolders.length > 0 && (
                      <FolderList>
                        {romFolders.map((folder, i) => (
                          <FolderItem key={i}>
                            <LuFolderOpen className="w-3 h-3" style={{ color: '#71717a' }} />
                            <FolderText>{folder}</FolderText>
                            <FolderRemoveButton onClick={() => setRomFolders(prev => prev.filter((_, idx) => idx !== i))}>
                              <LuTrash2 className="w-3 h-3" />
                            </FolderRemoveButton>
                          </FolderItem>
                        ))}
                      </FolderList>
                    )}
                  </FolderSection>

                  <ScanButton onClick={handleScanFolders} disabled={scanning || romFolders.length === 0}>
                    {scanning ? (
                      <>
                        <LuLoader className="w-4 h-4 animate-spin" />
                        Escaneando... {Math.round(scanProgress)}%
                      </>
                    ) : (
                      <>
                        <LuSearch className="w-4 h-4" />
                        Escanear ROMs
                      </>
                    )}
                  </ScanButton>

                  {scanning && (
                    <ProgressBar>
                      <ProgressFill style={{ width: `${scanProgress}%` }} />
                    </ProgressBar>
                  )}

                  {romEntries.length > 0 && !scanning && (
                    <RomEntriesSection>
                      <FieldGroup>
                        <FieldLabel>Tipos de Mídia</FieldLabel>
                        <MediaTypeGrid $cols={3}>
                          {[
                            { key: 'boxart', label: 'Box Art', icon: LuImage },
                            { key: 'screenshots', label: 'Screenshots', icon: LuMonitor },
                            { key: 'fanart', label: 'Fanart', icon: LuPalette },
                            { key: 'banner', label: 'Banner', icon: LuFlag },
                            { key: 'logo', label: 'Logo', icon: LuLayers },
                            { key: 'videos', label: 'Vídeos', icon: LuVideo },
                          ].map(({ key, label, icon: Icon }) => (
                            <MediaTypeButton
                              key={key}
                              $active={mediaTypes[key as keyof typeof mediaTypes]}
                              onClick={() => setMediaTypes(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            >
                              <Icon className="w-3 h-3" />
                              {label}
                            </MediaTypeButton>
                          ))}
                        </MediaTypeGrid>
                      </FieldGroup>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <RomEntriesHeader>
                          <RomEntriesCount>{romEntries.length} ROMs em {new Set(romEntries.map(e => e.platformName)).size} sistema(s)</RomEntriesCount>
                          <SelectActions>
                            <SelectAction onClick={selectAllRoms}>Selecionar Todas</SelectAction>
                            <ClearAction onClick={deselectAllRoms}>Limpar</ClearAction>
                          </SelectActions>
                        </RomEntriesHeader>

                        <RomEntriesScroll>
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
                                <SystemGroup key={system}>
                                  <SystemHeader>
                                    {logo && (
                                      <SystemLogo
                                        src={`system/logos/${logo}`}
                                        alt={system}
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                      />
                                    )}
                                    {!logo && <LuGamepad2 className="w-3 h-3" style={{ color: "var(--color-retro-primary, #a855f7)" }} />}
                                    <SystemName>{system}</SystemName>
                                    <SystemCount>({roms.length})</SystemCount>
                                  </SystemHeader>
                                  <RomList>
                                    {roms.map((rom) => {
                                      const isSelected = selectedRoms.has(rom.path);
                                      return (
                                        <RomButton
                                          key={rom.path}
                                          $selected={isSelected}
                                          onClick={() => toggleRomSelection(rom.path)}
                                        >
                                          <Checkbox $checked={isSelected}>
                                            {isSelected && <LuCircleCheckBig className="w-2.5 h-2.5 text-white" />}
                                          </Checkbox>
                                          <RomName $selected={isSelected}>{rom.name}</RomName>
                                        </RomButton>
                                      );
                                    })}
                                  </RomList>
                                </SystemGroup>
                              );
                            })}
                        </RomEntriesScroll>
                      </div>

                      <DownloadButton onClick={handleDownloadBatch} disabled={downloading || selectedRoms.size === 0}>
                        {downloading ? (
                          <>
                            <LuLoader className="w-4 h-4 animate-spin" />
                            Baixando {downloadProgress.current}/{downloadProgress.total}...
                          </>
                        ) : (
                          <>
                            <LuDownload className="w-4 h-4" />
                            Baixar Mídias ({selectedRoms.size} jogos)
                          </>
                        )}
                      </DownloadButton>

                      {downloading && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <ProgressBar>
                            <SuccessProgressFill style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }} />
                          </ProgressBar>
                          <DownloadProgressText>{downloadProgress.currentGame}</DownloadProgressText>
                        </div>
                      )}

                      {downloadResults.length > 0 && !downloading && (
                        <DownloadResults>
                          <DownloadResultsTitle>Resultados</DownloadResultsTitle>
                          {downloadResults.map((r, i) => (
                            <DownloadResultRow key={i}>
                              <DownloadResultName>{r.name} ({r.platform})</DownloadResultName>
                              <DownloadResultStatus $status={r.status}>
                                {r.status === 'success' ? '✓' : r.status === 'no_assets' ? '⚠' : '✗'}
                              </DownloadResultStatus>
                            </DownloadResultRow>
                          ))}
                        </DownloadResults>
                      )}
                    </RomEntriesSection>
                  )}

                  <ManualSection>
                    <ManualTitle>Ou adicione jogos manualmente</ManualTitle>
                    <ManualInputRow>
                      <ManualInput
                        type="text"
                        value={newEntryName}
                        onChange={(e) => setNewEntryName(e.target.value)}
                        placeholder="Nome do jogo..."
                      />
                      <div style={{ position: 'relative' }}>
                        <PlatformSelectButton onClick={() => setShowMultiPlatformDropdown(!showMultiPlatformDropdown)}>
                          {newEntryPlatforms.length > 0 ? `${newEntryPlatforms.length} plat.` : 'Plataformas'}
                        </PlatformSelectButton>
                        <AnimatePresence>
                          {showMultiPlatformDropdown && (
                            <MultiPlatformDropdown
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {TGDB_PLATFORMS.map((p) => (
                                <PlatformCheckbox
                                  key={p.id}
                                  $selected={newEntryPlatforms.includes(p.id)}
                                  onClick={() => {
                                    setNewEntryPlatforms(prev =>
                                      prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                    );
                                  }}
                                >
                                  <PlatformCheckBox $selected={newEntryPlatforms.includes(p.id)} />
                                  {p.name}
                                </PlatformCheckbox>
                              ))}
                            </MultiPlatformDropdown>
                          )}
                        </AnimatePresence>
                      </div>
                      <AddEntryButton onClick={addManualEntry}>
                        <LuPlus className="w-4 h-4" />
                      </AddEntryButton>
                    </ManualInputRow>

                    {manualEntries.length > 0 && (
                      <ManualEntriesList>
                        {manualEntries.map((entry, i) => (
                          <ManualEntryItem key={i}>
                            <ManualEntryName>{entry.name}</ManualEntryName>
                            <ManualEntryPlatforms>{entry.platformIds.map(getPlatformName).join(', ')}</ManualEntryPlatforms>
                            <ManualEntryRemove onClick={() => removeManualEntry(i)}>
                              <LuTrash2 className="w-3 h-3" />
                            </ManualEntryRemove>
                          </ManualEntryItem>
                        ))}
                      </ManualEntriesList>
                    )}

                    {manualEntries.length > 0 && (
                      <DownloadButton onClick={handleDownloadBatch} disabled={downloading}>
                        <LuDownload className="w-4 h-4" />
                        Baixar Mídias ({manualEntries.length} jogos)
                      </DownloadButton>
                    )}
                  </ManualSection>
                </MaxWidthLg>
              )}
            </SearchSection>
          )}

          {step === 'loading' && (
            <LoadingContainer>
              <LuLoader className="w-12 h-12 animate-spin" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
              <LoadingText>Buscando mídias na TheGamesDB...</LoadingText>
              {searchError && (
                <RetryContainer>
                  <RetryText>{searchError}</RetryText>
                  <RetryButton onClick={handleSearch}>Tentar Novamente</RetryButton>
                </RetryContainer>
              )}
            </LoadingContainer>
          )}

          {step === 'results' && assets && (
            <ResultsContent>
              {!activeExport && validTabs.length > 0 && (
                <TabsBar>
                  {validTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabButton
                        key={tab.id}
                        $active={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        <TabCount>({tab.count})</TabCount>
                      </TabButton>
                    );
                  })}
                  <ExportButton onClick={() => setActiveExport('retroarch')}>
                    <LuDownload className="w-4 h-4" />
                    Exportar
                  </ExportButton>
                </TabsBar>
              )}

              <AnimatePresence mode="wait">
                {activeExport ? (
                  <ExportSection
                    key="export"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ExportModeButtons>
                      {(['retroarch', 'esde', 'manual'] as ExportMode[]).map((mode) => {
                        const labels = { retroarch: 'RetroArch', esde: 'ES-DE', manual: 'Manual' };
                        const icons = { retroarch: '🎮', esde: '🖥️', manual: '📁' };
                        return (
                          <ExportModeButton
                            key={mode}
                            $active={activeExport === mode}
                            onClick={() => { setActiveExport(mode); setExportResult(null); }}
                          >
                            <span className="mr-2">{icons[mode!]}</span>
                            {labels[mode!]}
                          </ExportModeButton>
                        );
                      })}
                    </ExportModeButtons>

                    {activeExport === 'retroarch' && (
                      <ExportConfig>
                        <ExportCard>
                          <ExportCardTitle>
                            <LuFolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </ExportCardTitle>
                          <FolderInputGroup>
                            <FolderInput
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione a pasta do RetroArch..."
                              readOnly
                            />
                            <FolderBrowseButton onClick={handleSelectFolder}>
                              <LuFolderOpen className="w-4 h-4" />
                            </FolderBrowseButton>
                          </FolderInputGroup>
                        </ExportCard>
                        <InstructionsCard>
                          <InstructionsHeader>
                            <InstructionsLabel>Como funciona</InstructionsLabel>
                            <CopyInstructionsButton onClick={() => copyInstructions(RETROARCH_INSTRUCTIONS)}>
                              {copiedInstruction ? <LuCircleCheckBig className="w-3 h-3" /> : <LuCopy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </CopyInstructionsButton>
                          </InstructionsHeader>
                          <InstructionsPre>{RETROARCH_INSTRUCTIONS}</InstructionsPre>
                        </InstructionsCard>
                      </ExportConfig>
                    )}

                    {activeExport === 'esde' && (
                      <ExportConfig>
                        <ExportCard>
                          <ExportCardTitle>
                            <LuFolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </ExportCardTitle>
                          <FolderInputGroup>
                            <FolderInput
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione a pasta do ES-DE..."
                              readOnly
                            />
                            <FolderBrowseButton onClick={handleSelectFolder}>
                              <LuFolderOpen className="w-4 h-4" />
                            </FolderBrowseButton>
                          </FolderInputGroup>
                        </ExportCard>
                        <InstructionsCard>
                          <InstructionsHeader>
                            <InstructionsLabel>Como funciona</InstructionsLabel>
                            <CopyInstructionsButton onClick={() => copyInstructions(ESDE_INSTRUCTIONS)}>
                              {copiedInstruction ? <LuCircleCheckBig className="w-3 h-3" /> : <LuCopy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </CopyInstructionsButton>
                          </InstructionsHeader>
                          <InstructionsPre>{ESDE_INSTRUCTIONS}</InstructionsPre>
                        </InstructionsCard>
                      </ExportConfig>
                    )}

                    {activeExport === 'manual' && (
                      <ExportConfig>
                        <ExportCard>
                          <ExportCardTitle>
                            <LuFolderOpen className="w-4 h-4" />
                            Pasta de Destino
                          </ExportCardTitle>
                          <FolderInputGroup>
                            <FolderInput
                              type="text"
                              value={exportTargetDir}
                              onChange={(e) => setExportTargetDir(e.target.value)}
                              placeholder="Selecione uma pasta..."
                              readOnly
                            />
                            <FolderBrowseButton onClick={handleSelectFolder}>
                              <LuFolderOpen className="w-4 h-4" />
                            </FolderBrowseButton>
                          </FolderInputGroup>
                        </ExportCard>
                        <InstructionsCard>
                          <InstructionsHeader>
                            <InstructionsLabel>Como funciona</InstructionsLabel>
                            <CopyInstructionsButton onClick={() => copyInstructions(MANUAL_INSTRUCTIONS)}>
                              {copiedInstruction ? <LuCircleCheckBig className="w-3 h-3" /> : <LuCopy className="w-3 h-3" />}
                              {copiedInstruction ? 'Copiado!' : 'Copiar instruções'}
                            </CopyInstructionsButton>
                          </InstructionsHeader>
                          <InstructionsPre>{MANUAL_INSTRUCTIONS}</InstructionsPre>
                        </InstructionsCard>
                      </ExportConfig>
                    )}

                    {exportResult && (
                      <ExportResultCard>
                        <ExportResultSummary>
                          <LuCircleCheckBig className="w-5 h-5" style={{ color: "var(--color-retro-success, #22c55e)" }} />
                          <ExportResultText>
                            {exportResult.successCount}/{exportResult.total} mídias exportadas
                          </ExportResultText>
                        </ExportResultSummary>
                        <ExportResultList>
                          {exportResult.results.map((r: any, i: number) => (
                            <ExportResultItem key={i}>
                              <ExportResultItemType $status={r.status}>{r.type}</ExportResultItemType>
                              <ExportResultItemValue $status={r.status}>
                                {r.status === 'success' ? r.path : r.error}
                              </ExportResultItemValue>
                            </ExportResultItem>
                          ))}
                        </ExportResultList>
                      </ExportResultCard>
                    )}

                    <ExportButtonStyled onClick={handleExport} disabled={exporting || !exportTargetDir}>
                      {exporting ? (
                        <>
                          <LuLoader className="w-4 h-4 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <LuDownload className="w-4 h-4" />
                          Exportar Mídias
                        </>
                      )}
                    </ExportButtonStyled>
                  </ExportSection>
                ) : (
                  <>
                    {activeTab === 'boxart' && assets.boxart && (
                      <BoxartContainer
                        key="boxart"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <BoxartButton onClick={() => setSelectedImage(assets.boxart)}>
                          <img src={assets.boxart} alt="Boxart" style={{ width: '16rem', height: 'auto', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                          <BoxartOverlay>
                            <BoxartLabel>Ver em tamanho real</BoxartLabel>
                          </BoxartOverlay>
                        </BoxartButton>
                      </BoxartContainer>
                    )}

                    {activeTab === 'screenshots' && assets.screenshots.length > 0 && (
                      <ImageGrid
                        key="screenshots"
                        $cols={2}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {assets.screenshots.map((url: string, i: number) => (
                          <ImageGridItem key={i} onClick={() => setSelectedImage(url)}>
                            <img src={url} alt={`Screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <ImageOverlay />
                          </ImageGridItem>
                        ))}
                      </ImageGrid>
                    )}

                    {activeTab === 'fanart' && assets.fanart.length > 0 && (
                      <ImageGrid
                        key="fanart"
                        $cols={2}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {assets.fanart.map((url: string, i: number) => (
                          <ImageGridItem key={i} onClick={() => setSelectedImage(url)}>
                            <img src={url} alt={`Fanart ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <ImageOverlay />
                          </ImageGridItem>
                        ))}
                      </ImageGrid>
                    )}

                    {activeTab === 'banner' && assets.banner && (
                      <BannerContainer
                        key="banner"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <BannerImage src={assets.banner} alt="Banner" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </BannerContainer>
                    )}

                    {activeTab === 'videos' && assets.videos && assets.videos.length > 0 && (
                      <VideosSection
                        key="videos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {assets.videos.map((video: { url: string; title: string }, i: number) => (
                          <VideoCard key={i}>
                            <VideoLabel><LuVideo className="w-3 h-3" />Vídeo {i + 1}</VideoLabel>
                            <VideoTitle>{video.title}</VideoTitle>
                            <VideoPlayer
                              src={video.url}
                              controls
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </VideoCard>
                        ))}
                      </VideosSection>
                    )}

                    {activeTab === 'videos' && (!assets.videos || assets.videos.length === 0) && (
                      <NoResults key="no-videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <LuVideo className="w-12 h-12" style={{ color: '#3f3f46' }} />
                        <NoResultsTitle>Nenhum vídeo encontrado</NoResultsTitle>
                        <NoResultsDesc>Este jogo não possui vídeos disponíveis na TheGamesDB.</NoResultsDesc>
                      </NoResults>
                    )}

                    {activeTab === 'details' && (
                      <DetailsSection
                        key="details"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {assets.logo && (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={assets.logo} alt="Logo" style={{ maxHeight: '6rem', width: 'auto' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <DetailsGrid>
                          <DetailCard>
                            <DetailLabel><LuType className="w-3 h-3" />Título</DetailLabel>
                            <DetailValue>{assets.gameTitle || gameName}</DetailValue>
                          </DetailCard>
                          <DetailCard>
                            <DetailLabel><LuCalendar className="w-3 h-3" />Lançamento</DetailLabel>
                            <DetailValue>{formatReleaseDate(assets.releaseDate)}</DetailValue>
                          </DetailCard>
                          <DetailCard>
                            <DetailLabel><LuBuilding2 className="w-3 h-3" />Desenvolvedor</DetailLabel>
                            <DetailValue>{assets.developer || 'Desconhecido'}</DetailValue>
                          </DetailCard>
                          <DetailCard>
                            <DetailLabel><LuBuilding2 className="w-3 h-3" />Publicadora</DetailLabel>
                            <DetailValue>{assets.publisher || 'Desconhecido'}</DetailValue>
                          </DetailCard>
                        </DetailsGrid>
                        {assets.overview && (
                          <DetailCard>
                            <DetailLabel><LuFileText className="w-3 h-3" />Sinopse</DetailLabel>
                            <p style={{ color: '#d4d4d8', fontSize: '0.875rem', lineHeight: '1.625' }}>{assets.overview}</p>
                          </DetailCard>
                        )}
                      </DetailsSection>
                    )}

                    {validTabs.length === 0 && (
                      <NoResults key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <LuImage className="w-12 h-12" style={{ color: '#3f3f46' }} />
                        <NoResultsTitle>Nenhuma mídia encontrada</NoResultsTitle>
                        <NoResultsDesc>Tente buscar com outro nome ou plataforma.</NoResultsDesc>
                      </NoResults>
                    )}
                  </>
                )}
              </AnimatePresence>
            </ResultsContent>
          )}
        </ContentScroll>

        <Footer>
          <FooterLeft>
            {step === 'results' && !activeExport && (
              <FooterButton onClick={() => { setStep('search'); setGameName(''); setPlatformId(0); setAssets(null); }}>
                Nova Busca
              </FooterButton>
            )}
            {activeExport && (
              <FooterButton onClick={() => { setActiveExport(null); setExportResult(null); }}>
                Voltar às Mídias
              </FooterButton>
            )}
          </FooterLeft>
          <FooterButton onClick={onClose}>Fechar</FooterButton>
        </Footer>
      </Modal>

      <AnimatePresence>
        {selectedImage && (
          <PreviewOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <PreviewCloseButton onClick={() => setSelectedImage(null)}>
              <LuX className="w-6 h-6" />
            </PreviewCloseButton>
            <PreviewImage
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Preview"
              onClick={(e) => e.stopPropagation()}
            />
          </PreviewOverlay>
        )}
      </AnimatePresence>
    </Overlay>
  );
}
