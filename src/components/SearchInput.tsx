import { useState, useCallback } from 'react';
import { LuSearch, LuX } from "react-icons/lu";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-10 py-2 text-sm text-zinc-200 focus:outline-none focus:border-retro-primary/50 transition-colors placeholder:text-zinc-600"
      />
      {focused && value && (
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
        >
          <LuX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
