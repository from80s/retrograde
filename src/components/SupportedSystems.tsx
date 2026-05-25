import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFanartUrl } from '@/utils/fanart';

const SUPPORTED_SYSTEMS = [
  { name: '3DO Interactive Multiplayer', shortName: '3DO', logo: '3do.svg', extensions: ['.bin', '.cue', '.iso', '.chd'] },
  { name: 'Amstrad CPC', shortName: 'CPC', logo: 'amstradcpc.svg', extensions: ['.dsk', '.sna', '.cpr', '.tap', '.kcr'] },
  { name: 'Apple II', shortName: 'Apple II', logo: 'apple2.svg', extensions: ['.do', '.po', '.nib', '.dsk'] },
  { name: 'Apple IIGS', shortName: 'IIGS', logo: 'apple2gs.svg', extensions: ['.2mg', '.dsk'] },
  { name: 'Arcade', shortName: 'Arcade', logo: 'arcade.svg', extensions: ['.zip', '.7z', '.chd'] },
  { name: 'Atari 2600', shortName: '2600', logo: 'atari2600.svg', extensions: ['.a26', '.bin'] },
  { name: 'Atari 5200', shortName: '5200', logo: 'atari5200.svg', extensions: ['.a52', '.bin', '.car', '.rom'] },
  { name: 'Atari 7800', shortName: '7800', logo: 'atari7800.svg', extensions: ['.a78', '.bin'] },
  { name: 'Atari 800', shortName: '800', logo: 'atari800.svg', extensions: ['.atr', '.xex', '.com', '.dsk'] },
  { name: 'Atari Jaguar / CD', shortName: 'Jaguar', logo: 'atarijaguar.svg', extensions: ['.jag', '.abs', '.cof', '.rom', '.jcd', '.iso', '.chd', '.cue'] },
  { name: 'Atari Lynx', shortName: 'Lynx', logo: 'atarilynx.svg', extensions: ['.lnx', '.o'] },
  { name: 'Atari ST', shortName: 'ST', logo: 'atarist.svg', extensions: ['.st', '.msa', '.stx', '.ipf'] },
  { name: 'BBC Micro', shortName: 'BBC', logo: 'bbcmicro.svg', extensions: ['.ssd', '.dsk'] },
  { name: 'Coleco Adam', shortName: 'Adam', logo: 'adam.svg', extensions: ['.col', '.dsk', '.rom', '.ddp'] },
  { name: 'ColecoVision', shortName: 'Coleco', logo: 'colecovision.svg', extensions: ['.col', '.bin', '.rom'] },
  { name: 'Commodore 64', shortName: 'C64', logo: 'c64.svg', extensions: ['.d64', '.t64', '.g64', '.crt', '.prg'] },
  { name: 'Commodore Amiga', shortName: 'Amiga', logo: 'amiga.svg', extensions: ['.adf', '.dms', '.ipf', '.lha', '.uae'] },
  { name: 'Commodore Amiga CD32', shortName: 'CD32', logo: 'amigacd32.svg', extensions: ['.iso', '.bin', '.cue', '.chd'] },
  { name: 'Commodore VIC-20', shortName: 'VIC-20', logo: 'vic20.svg', extensions: ['.crt', '.prg', '.tap'] },
  { name: 'Daphne', shortName: 'Daphne', logo: 'daphne.svg', extensions: ['.daphne', '.m2v', '.ogg'] },
  { name: 'DOS', shortName: 'DOS', logo: 'dos.svg', extensions: ['.exe', '.com', '.bat', '.conf', '.iso'] },
  { name: 'Fairchild Channel F', shortName: 'Ch F', logo: 'astrocade.svg', extensions: ['.chf', '.bin', '.rom'] },
  { name: 'Game & Watch', shortName: 'G&W', logo: 'gameandwatch.svg', extensions: ['.mgw'] },
  { name: 'Game Boy', shortName: 'GB', logo: 'gb.svg', extensions: ['.gb', '.gbs'] },
  { name: 'Game Boy Advance', shortName: 'GBA', logo: 'gba.svg', extensions: ['.gba', '.gbs'] },
  { name: 'Game Boy Color', shortName: 'GBC', logo: 'gbc.svg', extensions: ['.gbc', '.gbs'] },
  { name: 'GameCube', shortName: 'GC', logo: 'gc.svg', extensions: ['.gcm', '.iso', '.rvz', '.ciso', '.gcz'] },
  { name: 'Intellivision', shortName: 'Intv', logo: 'intellivision.svg', extensions: ['.int', '.bin', '.rom'] },
  { name: 'LowRes NX', shortName: 'NX', logo: 'lowresnx.svg', extensions: ['.nx'] },
  { name: 'MAME', shortName: 'MAME', logo: 'mame.svg', extensions: ['.zip', '.7z', '.chd'] },
  { name: 'MSX / MSX2', shortName: 'MSX', logo: 'msx.svg', extensions: ['.mx1', '.mx2', '.rom', '.dsk', '.cas'] },
  { name: 'Neo Geo', shortName: 'NeoGeo', logo: 'neogeo.svg', extensions: ['.neo', '.zip'] },
  { name: 'Neo Geo CD', shortName: 'NGCD', logo: 'neogeocd.svg', extensions: ['.iso', '.chd', '.cue'] },
  { name: 'Neo Geo Pocket / Color', shortName: 'NGP/NGPC', logo: 'ngpc.svg', extensions: ['.ngp', '.ngc'] },
  { name: 'NES', shortName: 'NES', logo: 'nes.svg', extensions: ['.nes', '.unf', '.unif'] },
  { name: 'Nintendo 3DS', shortName: '3DS', logo: 'n3ds.svg', extensions: ['.3ds', '.3dsx', '.cia', '.cci', '.cxi'] },
  { name: 'Nintendo 64 / 64DD', shortName: 'N64', logo: 'n64.svg', extensions: ['.n64', '.z64', '.v64', '.u1', '.ndd', '.d64'] },
  { name: 'Nintendo DS', shortName: 'NDS', logo: 'nds.svg', extensions: ['.nds', '.dsi'] },
  { name: 'Nintendo Switch', shortName: 'Switch', logo: 'switch.svg', extensions: ['.nsp', '.xci', '.nro', '.nso'] },
  { name: 'PC Engine / TurboGrafx-16', shortName: 'PCE/TG16', logo: 'pcengine.svg', extensions: ['.pce', '.sgx'] },
  { name: 'PC Engine CD / TurboGrafx-CD', shortName: 'PCE-CD/TG-CD', logo: 'pcenginecd.svg', extensions: ['.pce', '.chd', '.cue', '.iso'] },
  { name: 'PC-88', shortName: 'PC-88', logo: 'pc88.svg', extensions: ['.d88', '.m3u'] },
  { name: 'PC-98', shortName: 'PC-98', logo: 'pc98.svg', extensions: ['.d88', '.d98', '.hdi', '.nhd'] },
  { name: 'PC-FX', shortName: 'PC-FX', logo: 'pcfx.svg', extensions: ['.iso', '.chd', '.cue', '.toc'] },
  { name: 'PICO-8', shortName: 'PICO-8', logo: 'pico8.svg', extensions: ['.p8', '.png'] },
  { name: 'PlayStation', shortName: 'PS1', logo: 'psx.svg', extensions: ['.bin', '.cue', '.img', '.pbp', '.ecm', '.cbn'] },
  { name: 'PlayStation 2', shortName: 'PS2', logo: 'ps2.svg', extensions: ['.iso', '.bin', '.cso', '.chd', '.gz', '.mdf'] },
  { name: 'PlayStation 3', shortName: 'PS3', logo: 'ps3.svg', extensions: ['.iso', '.pkg', '.rap'] },
  { name: 'PlayStation Portable', shortName: 'PSP', logo: 'psp.svg', extensions: ['.cso', '.iso', '.pbp'] },
  { name: 'PlayStation Vita', shortName: 'Vita', logo: 'psvita.svg', extensions: ['.vpk'] },
  { name: 'Pokémon Mini', shortName: 'Pokémini', logo: 'pokemini.svg', extensions: ['.min'] },
  { name: 'ScummVM', shortName: 'Scumm', logo: 'scummvm.svg', extensions: ['.svm'] },
  { name: 'Sega 32X', shortName: '32X', logo: 'sega32x.svg', extensions: ['.32x', '.bin', '.md', '.smd'] },
  { name: 'Sega CD / Mega-CD', shortName: 'Sega CD', logo: 'segacd.svg', extensions: ['.bin', '.cue', '.iso', '.chd'] },
  { name: 'Sega Dreamcast', shortName: 'Dreamcast', logo: 'dreamcast.svg', extensions: ['.gdi', '.cdi', '.bin', '.cue', '.chd'] },
  { name: 'Sega Game Gear', shortName: 'GG', logo: 'gamegear.svg', extensions: ['.gg', '.bin', '.sms'] },
  { name: 'Sega Genesis / Mega Drive', shortName: 'Genesis/MD', logo: 'megadrive.svg', extensions: ['.gen', '.md', '.smd', '.bin'] },
  { name: 'Sega Master System', shortName: 'SMS', logo: 'mastersystem.svg', extensions: ['.sms', '.bin'] },
  { name: 'Sega NAOMI', shortName: 'NAOMI', logo: 'naomi.svg', extensions: ['.bin', '.dat', '.lst'] },
  { name: 'Sega Saturn', shortName: 'Saturn', logo: 'saturn.svg', extensions: ['.bin', '.cue', '.iso', '.chd'] },
  { name: 'Sega SG-1000', shortName: 'SG-1000', logo: 'sg-1000.svg', extensions: ['.sg', '.bin', '.rom'] },
  { name: 'Sharp X1', shortName: 'X1', logo: 'x1.svg', extensions: ['.2d', '.2hd', '.dx1'] },
  { name: 'Sharp X68000', shortName: 'X68k', logo: 'x68000.svg', extensions: ['.d88', '.hdf', '.m3u'] },
  { name: 'SNES / Super Famicom', shortName: 'SNES/SFC', logo: 'snes.svg', extensions: ['.sfc', '.smc', '.fig', '.bs', '.swc'] },
  { name: 'SuperGrafx', shortName: 'SGX', logo: 'supergrafx.svg', extensions: ['.sgx', '.pce'] },
  { name: 'SuFami Turbo', shortName: 'Sufami', logo: 'sufami.svg', extensions: ['.bs', '.sfc', '.smc'] },
  { name: 'TIC-80', shortName: 'TIC-80', logo: 'tic80.svg', extensions: ['.tic'] },
  { name: 'Vectrex', shortName: 'Vectrex', logo: 'vectrex.svg', extensions: ['.vec', '.gam', '.bin', '.rom'] },
  { name: 'Virtual Boy', shortName: 'VB', logo: 'virtualboy.svg', extensions: ['.vb', '.vboy'] },
  { name: 'WASM-4', shortName: 'WASM-4', logo: 'wasm4.svg', extensions: ['.wasm'] },
  { name: 'Watara Supervision', shortName: 'SV', logo: 'supervision.svg', extensions: ['.sv', '.bin'] },
  { name: 'Wii', shortName: 'Wii', logo: 'wii.svg', extensions: ['.wbfs', '.iso', '.rvz', '.gcz', '.ciso'] },
  { name: 'Wii U', shortName: 'Wii U', logo: 'wiiu.svg', extensions: ['.wux', '.wud', '.rpx', '.app'] },
  { name: 'WonderSwan / Color', shortName: 'WS/WSC', logo: 'wonderswan.svg', extensions: ['.ws', '.wsc'] },
  { name: 'Xbox', shortName: 'Xbox', logo: 'xbox.svg', extensions: ['.iso', '.xiso'] },
  { name: 'Xbox 360', shortName: 'X360', logo: 'xbox360.svg', extensions: ['.iso', '.xex'] },
  { name: 'ZX Spectrum', shortName: 'ZX', logo: 'zxspectrum.svg', extensions: ['.z80', '.sna', '.tap', '.trd', '.scl', '.tzx'] },
  { name: 'Sinclair ZX81', shortName: 'ZX81', logo: 'zx81.svg', extensions: ['.p', '.t81'] },
];

interface SystemCard {
  name: string;
  shortName: string;
  logo: string;
  extensions: string[];
}

export function SupportedSystems() {
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const velocityRef = useRef(0);
  const lastPosRef = useRef({ x: 0, time: 0 });
  const inertiaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inertiaFrameRef = useRef<number>(0);

  const filteredSystems: SystemCard[] = (() => {
    const sorted = [...SUPPORTED_SYSTEMS].sort((a, b) => a.name.localeCompare(b.name));
    if (!filter.trim()) return sorted;
    const terms = filter.toLowerCase().split(/\s+/).filter(Boolean);
    return sorted.filter((sys) => {
      const searchBase = `${sys.name} ${sys.shortName} ${sys.extensions.join(' ')}`.toLowerCase();
      return terms.every(term => searchBase.includes(term));
    });
  })();

  const cancelInertia = useCallback(() => {
    if (inertiaTimerRef.current) {
      clearTimeout(inertiaTimerRef.current);
      inertiaTimerRef.current = null;
    }
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = 0;
    }
    velocityRef.current = 0;
  }, []);

  const runInertia = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const friction = 0.92;
    const minVelocity = 0.3;

    if (Math.abs(velocityRef.current) > minVelocity) {
      container.scrollLeft += velocityRef.current;
      velocityRef.current *= friction;
      inertiaFrameRef.current = requestAnimationFrame(runInertia);
    } else {
      velocityRef.current = 0;
      inertiaFrameRef.current = 0;
    }
  }, []);

  useEffect(() => {
    return () => cancelInertia();
  }, [cancelInertia]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    cancelInertia();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, scrollLeft: containerRef.current.scrollLeft };
    lastPosRef.current = { x: e.clientX, time: Date.now() };
    velocityRef.current = 0;
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.scrollBehavior = 'auto';
  }, [cancelInertia]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const dx = dragStartRef.current.x - e.clientX;
    containerRef.current.scrollLeft = dragStartRef.current.scrollLeft + dx;

    const now = Date.now();
    const dt = now - lastPosRef.current.time;
    if (dt > 0 && dt < 100) {
      velocityRef.current = (lastPosRef.current.x - e.clientX) / dt * 16;
    }
    lastPosRef.current = { x: e.clientX, time: now };
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!containerRef.current) return;
    isDraggingRef.current = false;
    containerRef.current.style.cursor = '';
    containerRef.current.style.scrollBehavior = '';

    if (Math.abs(velocityRef.current) > 1) {
      inertiaFrameRef.current = requestAnimationFrame(runInertia);
      inertiaTimerRef.current = setTimeout(() => {
        cancelInertia();
      }, 2000);
    }
  }, [runInertia, cancelInertia]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  const scrollByAmount = useCallback((amount: number) => {
    if (!containerRef.current) return;
    cancelInertia();
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  }, [cancelInertia]);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-zinc-200 whitespace-nowrap">
          Sistemas Suportados ({SUPPORTED_SYSTEMS.length})
        </h3>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por sistema, fabricante ou extensão..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Horizontal scroll area */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scrollByAmount(-300)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto px-12 py-4 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {filteredSystems.length > 0 ? (
            filteredSystems.map((sys) => {
              const fanartUrl = getFanartUrl(sys.name);
              return (
                <div
                  key={sys.name}
                  className="flex-shrink-0 w-48 bg-zinc-800/40 rounded-xl p-4 flex flex-col items-center text-center gap-2 border border-zinc-700/20 hover:border-zinc-600/40 transition-colors relative overflow-hidden group"
                >
                  {fanartUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${fanartUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  )}
                  {fanartUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20 pointer-events-none" />
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center gap-2 w-full">
                    <img
                      src={`system/logos/${sys.logo}`}
                      alt={sys.name}
                      className="w-28 h-28 object-contain pointer-events-none select-none"
                      draggable={false}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0 w-full">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{sys.name}</p>
                      <p className="text-[10px] text-zinc-500">{sys.shortName}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {sys.extensions.slice(0, 4).map((ext) => (
                        <span key={ext} className="text-[9px] font-mono px-1 py-0.5 bg-zinc-700/50 rounded text-retro-primary">
                          {ext}
                        </span>
                      ))}
                      {sys.extensions.length > 4 && (
                        <span className="text-[9px] font-mono px-1 py-0.5 bg-zinc-700/30 rounded text-zinc-500">
                          +{sys.extensions.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-shrink-0 w-full text-center py-8 text-zinc-500 text-sm">
              Nenhum sistema encontrado
            </div>
          )}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scrollByAmount(300)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter result count */}
      {filter && (
        <div className="px-4 pb-3">
          <p className="text-xs text-zinc-500 text-center">
            {filteredSystems.length} de {SUPPORTED_SYSTEMS.length} sistemas
          </p>
        </div>
      )}
    </div>
  );
}
