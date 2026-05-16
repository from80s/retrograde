import { Minus, Square, X } from 'lucide-react';

export function TitleBar() {
  return (
    <div className="h-10 bg-zinc-950 flex items-center justify-between px-4 select-none" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-retro-primary to-retro-secondary" />
        <span className="text-xs text-zinc-500 font-medium">RetroGrade</span>
      </div>
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
          <Square className="w-3.5 h-3.5" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-retro-danger hover:bg-zinc-800 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
