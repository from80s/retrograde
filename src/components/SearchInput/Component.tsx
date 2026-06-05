import { useState, useCallback } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { Container, SearchIcon, Input, ClearButton } from "./styles";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <Container>
      <SearchIcon>
        <LuSearch className="w-4 h-4" />
      </SearchIcon>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && value && (
        <ClearButton
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
        >
          <LuX className="w-4 h-4" />
        </ClearButton>
      )}
    </Container>
  );
}
