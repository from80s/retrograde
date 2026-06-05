import styled, { css } from "styled-components";
import { motion, type MotionProps } from "framer-motion";

type ToastType = "success" | "error" | "info";

const typeStyles: Record<ToastType, ReturnType<typeof css>> = {
  success: css`
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #22c55e;
  `,
  error: css`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  `,
  info: css`
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.3);
    color: #a855f7;
  `,
};

const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

export const ToastContainer = styled(MotionDiv)<{ $type: ToastType }>`
  position: fixed;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -2px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);

  ${({ $type }) => typeStyles[$type]}
`;

export const IconWrapper = styled.div<{ $type: ToastType }>`
  ${({ $type }) => typeStyles[$type]}
`;

export const Message = styled.span`
  font-size: 0.875rem;
  color: #e4e4e7;
`;

export const CloseButton = styled.button`
  color: #71717a;
  transition: color 200ms ease;
  margin-left: 0.5rem;

  &:hover {
    color: #d4d4d8;
  }
`;
