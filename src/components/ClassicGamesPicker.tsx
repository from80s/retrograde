import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Check, LayoutList, Grid3X3, BookOpen, ChevronDown } from 'lucide-react';
import type { ClassicGamesData } from '../types/global';
import { tGenre } from '../locales';
import { getSystemLogo } from '../lib/system-logos';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-retro-secondary" />
            <h3 className="text-lg font-bold text-zinc-100">Popular Clássicos</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto scrollbar-thin">
          <p className="text-xs text-zinc-500">
            Selecione os jogos clássicos que deseja adicionar à sua lista de proteção.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Dropdown Personalizado */}
            <div ref={dropdownRef} className="relative w-56">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 hover:border-zinc-600/50 transition-colors"
              >
                <span className="truncate">{systemLabel}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-64 overflow-y-auto scrollbar-thin">
                  <button
                    onClick={() => { setSelectedSystem('all'); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedSystem === 'all'
                        ? 'bg-retro-secondary/10 text-retro-secondary font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
                    }`}
                  >
                    Todos os Sistemas
                  </button>
                  {platforms.map((p) => {
                    const logo = getSystemLogo(undefined, p);
                    return (
                      <button
                        key={p}
                        onClick={() => { setSelectedSystem(p); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm transition-colors ${
                          selectedSystem === p
                            ? 'bg-retro-secondary/10 text-retro-secondary font-medium'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/30'
                        }`}
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
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar jogos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-retro-secondary/50 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div className="flex bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-retro-secondary/20 text-retro-secondary' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Lista"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-retro-secondary/20 text-retro-secondary' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Grade"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{filtered.length} jogos · {selected.size} selecionados</span>
            <div className="flex gap-3">
              <button onClick={selectAll} className="text-retro-secondary hover:text-retro-secondary/80 transition-colors">
                Selecionar Todos
              </button>
              <button onClick={deselectAll} className="text-zinc-400 hover:text-zinc-200 transition-colors">
                Limpar
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
              {filtered.map((g) => {
                const isSelected = selected.has(g.name);
                const logo = getSystemLogo(undefined, g.system);
                return (
                  <button
                    key={g.name}
                    onClick={() => toggleSelect(g.name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left ${
                      isSelected
                        ? 'bg-retro-secondary/10 border border-retro-secondary/30 text-retro-secondary'
                        : 'bg-zinc-800/20 border border-transparent text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-retro-secondary border-retro-secondary' : 'border-zinc-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="flex-1 font-medium">{g.name}</span>
                    <span className="text-xs text-zinc-500">{tGenre(g.genre)}</span>
                    {logo && (
                      <img
                        src={`system/logos/${logo}`}
                        alt={g.system}
                        className="w-5 h-5 object-contain"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    {!logo && <span className="text-xs text-zinc-600">{g.system}</span>}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-zinc-600 py-8 text-sm">Nenhum jogo encontrado</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
              {filtered.map((g) => {
                const isSelected = selected.has(g.name);
                const src = coverPath(g.cover);
                return (
                  <button
                    key={g.name}
                    onClick={() => toggleSelect(g.name)}
                    className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all ${
                      isSelected
                        ? 'bg-retro-secondary/10 border-retro-secondary/40 ring-1 ring-retro-secondary/30'
                        : 'bg-zinc-800/20 border-zinc-700/30 hover:bg-zinc-800/40 hover:border-zinc-600/50'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-zinc-800/50 flex items-center justify-center overflow-hidden">
                      {src ? (
                        <img src={src} alt={g.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-600">
                          <BookOpen className="w-8 h-8" />
                          <span className="text-[10px] px-2 text-center leading-tight">{g.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-left">
                      <p className="text-xs font-medium text-zinc-200 truncate">{g.name}</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[10px] text-zinc-500 truncate">{tGenre(g.genre)}</p>
                        {(() => {
                          const logo = getSystemLogo(undefined, g.system);
                          return logo ? (
                            <img
                              src={`system/logos/${logo}`}
                              alt={g.system}
                              className="w-3.5 h-3.5 object-contain"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <div className={`absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-retro-secondary border-retro-secondary'
                        : 'border-zinc-500 bg-black/40 opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-zinc-600 py-8 text-sm">Nenhum jogo encontrado</p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={selected.size === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-retro-secondary/10 text-retro-secondary border border-retro-secondary/30 rounded-xl font-medium hover:bg-retro-secondary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Adicionar ({selected.size})
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}