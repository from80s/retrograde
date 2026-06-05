import styled, { css } from "styled-components";
import { motion } from "framer-motion";

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

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const HeaderIconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(52, 211, 153, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e4e4e7;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const BytesRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const MotionSpan = motion.span as React.ComponentType<React.ComponentProps<typeof motion.span>>;

export const BytesValue = styled(MotionSpan)`
  font-size: 1.875rem;
  font-weight: 700;
  color: #34d399;
`;

export const BytesUnit = styled.span`
  font-size: 0.875rem;
  color: #71717a;
  margin-bottom: 0.25rem;
`;

export const ProgressTrack = styled.div`
  position: relative;
  height: 0.75rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to right, #34d399, rgba(52, 211, 153, 0.6));
  border-radius: 9999px;
`;

export const Description = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
  line-height: 1.625;
`;

export const MotionDiv = motion.div as React.ComponentType<React.ComponentProps<typeof motion.div>>;

export const WarningBox = styled(MotionDiv)`
  background: rgba(248, 113, 113, 0.05);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const WarningRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const WarningText = styled.p`
  font-size: 0.75rem;
  color: #d4d4d8;
  line-height: 1.625;
`;

export const WarningPath = styled.span`
  font-family: monospace;
  color: #f87171;
`;

export const WarningValue = styled.span`
  font-weight: 600;
  color: #f87171;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;
