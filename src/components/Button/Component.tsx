import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { StyledButton, Spinner, SpinnerCircle, SpinnerPath } from "./styles";

type ButtonVariant = "primary" | "success" | "danger" | "warning" | "secondary" | "neutral" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({ children, variant = "neutral", size = "md", icon, loading, className = "", disabled, ...props }: ButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner viewBox="0 0 24 24" fill="none">
          <SpinnerCircle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <SpinnerPath fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </Spinner>
      ) : icon}
      {children}
    </StyledButton>
  );
}
