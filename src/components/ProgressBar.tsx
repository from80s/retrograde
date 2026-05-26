import { motion } from 'framer-motion';

interface ProgressBarProps {
  percent: number;
  label?: string;
  height?: string;
  color?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export function ProgressBar({ percent, label, height = 'h-3', color = 'from-retro-primary to-retro-secondary', animated = true, showLabel = true }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      {(label || showLabel) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm text-zinc-400">{label}</span>}
          {showLabel && (
            <span className="text-sm font-mono text-retro-primary">{percent.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className={`${height} bg-zinc-800 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={animated ? { duration: 0.3, ease: 'easeOut' } : undefined}
        />
      </div>
    </div>
  );
}
