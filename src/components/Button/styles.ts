import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "success" | "danger" | "warning" | "secondary" | "neutral" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
    color: var(--color-retro-primary, #a855f7);
    border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
    &:hover {
      background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
    }
  `,
  success: css`
    background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1);
    color: var(--color-retro-success, #22c55e);
    border: 1px solid rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.3);
    &:hover {
      background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.2);
    }
  `,
  danger: css`
    background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1);
    color: var(--color-retro-danger, #ef4444);
    border: 1px solid rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.3);
    &:hover {
      background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2);
    }
  `,
  warning: css`
    background: rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.1);
    color: var(--color-retro-warning, #eab308);
    border: 1px solid rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.3);
    &:hover {
      background: rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.2);
    }
  `,
  secondary: css`
    background: rgba(var(--color-retro-secondary-rgb, 99, 102, 241), 0.1);
    color: var(--color-retro-secondary, #6366f1);
    border: 1px solid rgba(var(--color-retro-secondary-rgb, 99, 102, 241), 0.3);
    &:hover {
      background: rgba(var(--color-retro-secondary-rgb, 99, 102, 241), 0.2);
    }
  `,
  neutral: css`
    background: rgba(63, 63, 70, 0.3);
    color: #d4d4d8;
    border: 1px solid rgba(87, 87, 91, 0.3);
    &:hover {
      background: rgba(63, 63, 70, 0.5);
    }
  `,
  ghost: css`
    color: #a1a1aa;
    border: 1px solid transparent;
    &:hover {
      color: #e4e4e7;
      background: rgba(39, 39, 42, 0.5);
    }
  `,
};

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  `,
  md: css`
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  `,
  lg: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  `,
};

export const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

export const Spinner = styled.svg`
  animation: spin 1s linear infinite;
  width: 1rem;
  height: 1rem;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const SpinnerCircle = styled.circle`
  opacity: 0.25;
`;

export const SpinnerPath = styled.path`
  opacity: 0.75;
`;
