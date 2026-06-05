import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Label = styled.span`
  font-size: 0.875rem;
  color: #a1a1aa;
`;

export const Percent = styled.span`
  font-size: 0.875rem;
  font-family: monospace;
  color: var(--color-retro-primary, #a855f7);
`;

export const Track = styled.div<{ $height: string }>`
  ${({ $height }) => css`
    height: ${$height};
  `}
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const Fill = styled(motion.div)<{ $gradient: string }>`
  height: 100%;
  border-radius: 9999px;
  background: ${({ $gradient }) => $gradient};
`;
