import { getSystemLogo } from '../lib/system-logos';

interface SystemLogoProps {
  system: string;
  size?: string;
  className?: string;
}

export function SystemLogo({ system, size = 'w-4 h-4', className = '' }: SystemLogoProps) {
  const logo = getSystemLogo(undefined, system);
  if (!logo) return null;

  return (
    <img
      src={`system/logos/${logo}`}
      alt={system}
      className={`${size} object-contain ${className}`}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
