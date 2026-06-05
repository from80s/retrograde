import { Container, LabelRow, Label, Percent, Track, Fill } from "./styles";

interface ProgressBarProps {
  percent: number;
  label?: string;
  height?: string;
  color?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export function ProgressBar({ percent, label, height = "h-3", color = "from-retro-primary to-retro-secondary", animated = true, showLabel = true }: ProgressBarProps) {
  const heightMap: Record<string, string> = {
    "h-3": "0.75rem",
    "h-2": "0.5rem",
    "h-4": "1rem",
  };
  const resolvedHeight = heightMap[height] || height;

  const gradientMap: Record<string, string> = {
    "from-retro-primary to-retro-secondary": "linear-gradient(to right, var(--color-retro-primary, #a855f7), var(--color-retro-secondary, #6366f1))",
    "from-retro-success to-retro-success/60": "linear-gradient(to right, var(--color-retro-success, #22c55e), rgba(34, 197, 94, 0.6))",
  };
  const resolvedGradient = gradientMap[color] || `linear-gradient(to right, var(--color-retro-primary, #a855f7), var(--color-retro-secondary, #6366f1))`;

  return (
    <Container>
      {(label || showLabel) && (
        <LabelRow>
          {label && <Label>{label}</Label>}
          {showLabel && <Percent>{percent.toFixed(1)}%</Percent>}
        </LabelRow>
      )}
      <Track $height={resolvedHeight}>
        <Fill
          $gradient={resolvedGradient}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={animated ? { duration: 0.3, ease: "easeOut" } : undefined}
        />
      </Track>
    </Container>
  );
}
