import { useState, useEffect, useRef } from 'react';
import { LuX, LuSearch, LuCheck, LuLayoutList, LuGrid3X3, LuBookOpen, LuChevronDown } from "react-icons/lu";
import type { ClassicGamesData } from '../../types/global';
import { tGenre } from '../../locales';
import { getSystemLogo } from '../../lib/system-logos';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalHeaderContent,
  HeaderIcon,
  ModalTitle,
  CloseButton,
  ModalContent,
  DescriptionText,
  ControlsBar,
  DropdownContainer,
  DropdownButton,
  DropdownLabel,
  DropdownChevron,
  DropdownMenu,
  DropdownItem,
  SearchContainer,
  SearchIcon,
  SearchInput,
  ViewToggle,
  ViewToggleButton,
  ActionBar,
  ActionButtons,
  SelectAllButton,
  ClearButton,
  ListView,
  ListItem,
  ListItemCheckbox,
  ListItemName,
  ListItemGenre,
  ListItemSystemLogo,
  ListItemSystemText,
  GridView,
  GridItem,
  GridItemImage,
  GridItemPlaceholder,
  GridItemInfo,
  GridItemName,
  GridItemGenre,
  GridItemSystemLogo,
  GridItemCheckbox,
  EmptyState,
  EmptyGridState,
  ModalFooter,
  CancelButton,
  AddButton,
} from './styles';

interface ClassicGamesPickerProps {
  onClose: () => void;
  onAddClassics: (names: string[]) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type ViewMode = 'list' | 'grid';

export function ClassicGamesPicker({ onClose, onAddClassics, onToast }: ClassicGamesPickerProps) {
  const [data, setData] = useState<ClassicGamesData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.readClassicGames().then(setData);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const platforms = data ? Object.keys(data.platforms).sort((a, b) => a.localeCompare(b)) : [];
  const allClassics = data
    ? Object.entries(data.platforms).flatMap(([system, info]) =>
        info.classics.map((g) => ({ ...g, system }))
      )
    : [];

  const filtered = allClassics.filter((g) => {
    const matchSystem = selectedSystem === 'all' || g.system === selectedSystem;
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return matchSystem && matchSearch;
  });

  const toggleSelect = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map((g) => g.name)));
  const deselectAll = () => setSelected(new Set());

  const handleAdd = () => {
    if (selected.size === 0) {
      onToast('Selecione ao menos um jogo.', 'error');
      return;
    }
    onAddClassics(Array.from(selected));
    onClose();
  };

  const coverPath = (cover?: string) => (cover ? `./${cover}` : undefined);

  const systemLabel = selectedSystem === 'all' ? 'Todos os Sistemas' : selectedSystem;

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalHeaderContent>
            <HeaderIcon>
              <LuBookOpen />
            </HeaderIcon>
            <ModalTitle>Popular Clássicos</ModalTitle>
          </ModalHeaderContent>
          <CloseButton onClick={onClose}>
            <LuX />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <DescriptionText>
            Selecione os jogos clássicos que deseja adicionar à sua lista de proteção.
          </DescriptionText>

          <ControlsBar>
            {/* Dropdown Personalizado */}
            <DropdownContainer ref={dropdownRef}>
              <DropdownButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                <DropdownLabel>{systemLabel}</DropdownLabel>
                <DropdownChevron $open={dropdownOpen}>
                  <LuChevronDown />
                </DropdownChevron>
              </DropdownButton>
              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem
                    $active={selectedSystem === 'all'}
                    onClick={() => { setSelectedSystem('all'); setDropdownOpen(false); }}
                  >
                    Todos os Sistemas
                  </DropdownItem>
                  {platforms.map((p) => {
                    const logo = getSystemLogo(undefined, p);
                    return (
                      <DropdownItem
                        key={p}
                        $active={selectedSystem === p}
                        onClick={() => { setSelectedSystem(p); setDropdownOpen(false); }}
                      >
                        {logo && (
                          <img
                            src={`system/logos/${logo}`}
                            alt={p}
                            className="w-5 h-5 object-contain"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        {p}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              )}
            </DropdownContainer>

            <SearchContainer>
              <SearchIcon>
                <LuSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar jogos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchContainer>

            <ViewToggle>
              <ViewToggleButton
                $active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                title="Lista"
              >
                <LuLayoutList />
              </ViewToggleButton>
              <ViewToggleButton
                $active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                title="Grade"
              >
                <LuGrid3X3 />
              </ViewToggleButton>
            </ViewToggle>
          </ControlsBar>

          <ActionBar>
            <span>{filtered.length} jogos · {selected.size} selecionados</span>
            <ActionButtons>
              <SelectAllButton onClick={selectAll}>
                Selecionar Todos
              </SelectAllButton>
              <ClearButton onClick={deselectAll}>
                Limpar
              </ClearButton>
            </ActionButtons>
          </ActionBar>

          {viewMode === 'list' ? (
            <ListView>
              {filtered.map((g) => {
                const isSelected = selected.has(g.name);
                const logo = getSystemLogo(undefined, g.system);
                return (
                  <ListItem
                    key={g.name}
                    $selected={isSelected}
                    onClick={() => toggleSelect(g.name)}
                  >
                    <ListItemCheckbox $selected={isSelected}>
                      {isSelected && <LuCheck />}
                    </ListItemCheckbox>
                    <ListItemName>{g.name}</ListItemName>
                    <ListItemGenre>{tGenre(g.genre)}</ListItemGenre>
                    {logo && (
                      <ListItemSystemLogo
                        src={`system/logos/${logo}`}
                        alt={g.system}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    {!logo && <ListItemSystemText>{g.system}</ListItemSystemText>}
                  </ListItem>
                );
              })}
              {filtered.length === 0 && (
                <EmptyState>Nenhum jogo encontrado</EmptyState>
              )}
            </ListView>
          ) : (
            <GridView>
              {filtered.map((g) => {
                const isSelected = selected.has(g.name);
                const src = coverPath(g.cover);
                return (
                  <GridItem
                    key={g.name}
                    $selected={isSelected}
                    onClick={() => toggleSelect(g.name)}
                  >
                    <GridItemImage>
                      {src ? (
                        <img src={src} alt={g.name} loading="lazy" />
                      ) : (
                        <GridItemPlaceholder>
                          <LuBookOpen />
                          <span>{g.name}</span>
                        </GridItemPlaceholder>
                      )}
                    </GridItemImage>
                    <GridItemInfo>
                      <GridItemName>{g.name}</GridItemName>
                      <div className="flex items-center gap-1.5">
                        <GridItemGenre>{tGenre(g.genre)}</GridItemGenre>
                        {(() => {
                          const logo = getSystemLogo(undefined, g.system);
                          return logo ? (
                            <GridItemSystemLogo
                              src={`system/logos/${logo}`}
                              alt={g.system}
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : null;
                        })()}
                      </div>
                    </GridItemInfo>
                    <GridItemCheckbox $selected={isSelected}>
                      {isSelected && <LuCheck />}
                    </GridItemCheckbox>
                  </GridItem>
                );
              })}
              {filtered.length === 0 && (
                <EmptyGridState>Nenhum jogo encontrado</EmptyGridState>
              )}
            </GridView>
          )}
        </ModalContent>

        <ModalFooter>
          <CancelButton onClick={onClose}>
            Cancelar
          </CancelButton>
          <AddButton
            onClick={handleAdd}
            disabled={selected.size === 0}
          >
            <LuCheck />
            Adicionar ({selected.size})
          </AddButton>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
}
