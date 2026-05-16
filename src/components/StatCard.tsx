import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  'retro-primary': { bg: 'bg-retro-primary/10', text: 'text-retro-primary', border: 'border-retro-primary/20' },
  'retro-secondary': { bg: 'bg-retro-secondary/10', text: 'text-retro-secondary', border: 'border-retro-secondary/20' },
  'retro-success': { bg: 'bg-retro-success/10', text: 'text-retro-success', border: 'border-retro-success/20' },
  'retro-danger': { bg: 'bg-retro-danger/10', text: 'text-retro-danger', border: 'border-retro-danger/20' },
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color] || colorMap['retro-primary'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className={`absolute inset-0 ${colors.bg} opacity-50`} />
      <div className="relative z-10 flex flex-col items-center">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-3`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold font-mono ${colors.text}`}
        >
          {value.toLocaleString('pt-BR')}
        </motion.span>
        <span className="text-zinc-400 text-sm mt-2 font-medium text-center">{label}</span>
      </div>
    </motion.div>
  );
}
