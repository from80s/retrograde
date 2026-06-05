import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { LuLoader } from 'react-icons/lu';

type MotionProps = {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
};

export const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const ModalContent = styled.div`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  width: 100%;
  max-width: 48rem;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #fafafa;
`;

export const Subtitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }
`;

export const ProgressSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #71717a;
`;

export const ProgressBar = styled.div`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 9999px;
  height: 0.5rem;
`;

export const ProgressFill = styled.div`
  background: #818cf8;
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
`;

export const ProgressFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #52525b;
`;

export const CurrentFile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
`;

export const FileName = styled.p`
  font-size: 0.875rem;
  font-family: monospace;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;

export const FileSystem = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

export const StatCard = styled.div<{ $variant: 'secondary' | 'success' | 'danger' }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
  ${({ $variant }) => $variant === 'secondary' && css`
    background: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.2);
  `}
  ${({ $variant }) => $variant === 'success' && css`
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
  `}
  ${({ $variant }) => $variant === 'danger' && css`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}
`;

export const StatValue = styled.p<{ $variant: 'secondary' | 'success' | 'danger' }>`
  font-size: 1.125rem;
  font-weight: 700;
  ${({ $variant }) => $variant === 'secondary' && css`color: #a78bfa;`}
  ${({ $variant }) => $variant === 'success' && css`color: #22c55e;`}
  ${({ $variant }) => $variant === 'danger' && css`color: #ef4444;`}
`;

export const StatLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const LogSection = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const LogHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const LogTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #d4d4d8;
`;

export const LogCount = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: monospace;
`;

export const LogList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 0;
  max-height: 300px;
`;

export const LogEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(39, 39, 42, 0.3);
  }
`;

export const LogFileName = styled.span`
  font-size: 0.875rem;
  font-family: monospace;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const LogSystem = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  flex-shrink: 0;
`;

export const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const RatingText = styled.span`
  font-size: 0.75rem;
  font-family: monospace;
  color: #fbbf24;
`;

export const GenresText = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
`;

export const EmptyLog = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #52525b;
  padding: 2rem 0;
`;

export const SpinnerIcon = styled(LuLoader)`
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
