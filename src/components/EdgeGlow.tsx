interface EdgeGlowProps {
  glowColor?: string;
  glowSize?: string;
}

export function EdgeGlow({
  glowColor = "rgba(168, 85, 247, 0.95)",
  glowSize = "250px",
}: EdgeGlowProps) {
  return (
    <div
      className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        padding: "1px",
        background: `radial-gradient(${glowSize} circle at var(--eg-x, 50%) var(--eg-y, 50%), ${glowColor} 0%, rgba(168, 85, 247, 0.7) 30%, transparent 60%)`,
        WebkitMask:
          "linear-gradient(black, black) content-box, linear-gradient(black, black)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        zIndex: 5,
      }}
    />
  );
}
