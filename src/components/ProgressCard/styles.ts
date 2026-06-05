import styled, { css } from "styled-components";
import { motion, type MotionProps } from "framer-motion";

const glassStyles = css`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
`;

export const GlassContainer = styled.div`
  ${glassStyles}
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

export const FileRow = styled(MotionDiv)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
`;

export const StatusIconWrapper = styled.div<{ $bgColor: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bgColor }) => $bgColor};
`;

export const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const FileName = styled.p`
  font-size: 0.875rem;
  font-family: monospace;
  color: #e4e4e7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const SystemName = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RatingValue = styled.span`
  font-size: 0.875rem;
  font-family: monospace;
  color: #fbbf24;
`;

export const StatusBadge = styled.span<{ $bgColor: string; $textColor: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
`;
