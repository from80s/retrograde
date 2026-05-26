import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'neutral' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-retro-primary/10 text-retro-primary border border-retro-primary/30 hover:bg-retro-primary/20',
  success: 'bg-retro-success/10 text-retro-success border border-retro-success/30 hover:bg-retro-success/20',
  danger: 'bg-retro-danger/10 text-retro-danger border border-retro-danger/30 hover:bg-retro-danger/20',
  warning: 'bg-retro-warning/10 text-retro-warning border border-retro-warning/30 hover:bg-retro-warning/20',
  secondary: 'bg-retro-secondary/10 text-retro-secondary border border-retro-secondary/30 hover:bg-retro-secondary/20',
  neutral: 'bg-zinc-700/30 text-zinc-300 border border-zinc-600/30 hover:bg-zinc-700/50',
  ghost: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({ children, variant = 'neutral', size = 'md', icon, loading, className = '', disabled, ...props }: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}
