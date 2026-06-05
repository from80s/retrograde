import { getSystemLogo } from "../../lib/system-logos";
import { Logo } from "./styles";

interface SystemLogoProps {
  system: string;
  size?: string;
  className?: string;
}

export function SystemLogo({ system, size = "w-4 h-4", className = "" }: SystemLogoProps) {
  const logo = getSystemLogo(undefined, system);
  if (!logo) return null;

  const sizeMap: Record<string, string> = {
    "w-4 h-4": "1rem",
    "w-5 h-5": "1.25rem",
    "w-6 h-6": "1.5rem",
  };
  const resolvedSize = sizeMap[size] || size;

  return (
    <Logo
      src={`system/logos/${logo}`}
      alt={system}
      $size={resolvedSize}
      className={className}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
    />
  );
}
