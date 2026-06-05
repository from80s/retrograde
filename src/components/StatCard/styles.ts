import styled, { css } from "styled-components";
import { motion } from "framer-motion";

const glassStyles = css`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
`;

export const GlassContainer = styled(motion.div)`
  ${glassStyles}
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const BgOverlay = styled.div<{ $bgColor: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bgColor }) => $bgColor};
  opacity: 0.5;
`;

export const Content = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const IconWrapper = styled.div<{ $bgColor: string; $borderColor: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  background: ${({ $bgColor }) => $bgColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
`;

export const MotionSpan = motion.span as React.ComponentType<React.ComponentProps<typeof motion.span>>;

export const Value = styled(MotionSpan)<{ $textColor: string }>`
  font-size: 2.25rem;
  font-weight: 700;
  font-family: monospace;
  color: ${({ $textColor }) => $textColor};
`;

export const Label = styled.span`
  color: #a1a1aa;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  text-align: center;
`;
