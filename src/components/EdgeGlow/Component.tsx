import { Glow } from "./styles";

interface EdgeGlowProps {
  glowColor?: string;
  glowSize?: string;
}

export function EdgeGlow({ glowColor = "rgba(168, 85, 247, 0.95)", glowSize = "250px" }: EdgeGlowProps) {
  return <Glow $glowColor={glowColor} $glowSize={glowSize} />;
}
