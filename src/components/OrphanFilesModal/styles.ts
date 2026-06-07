import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { LuLoader } from 'react-icons/lu';
import { thinScrollbar } from "../../styles/scrollbar";

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

export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #fafafa;
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

export const SpinnerIcon = styled(LuLoader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const ScanCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1rem;
`;

export const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(129, 140, 248, 0.1);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(129, 140, 248, 0.2);
  }
`;

export const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const GlassCard = styled.div`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
`;

export const CardValue = styled.p<{ $color: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
  color: ${({ $color }) => $color};
`;

export const CardLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-top: 0.25rem;
`;

export const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const CategoryTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(39, 39, 42, 0.4);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #a1a1aa;
`;

export const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #71717a;
  margin-bottom: 0.75rem;
`;

export const SelectAllBtn = styled.button`
  background: transparent;
  border: none;
  color: #fbbf24;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: rgba(251, 191, 36, 0.8);
  }
`;

export const DeselectAllBtn = styled.button`
  background: transparent;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #e4e4e7;
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 18rem;
  overflow-y: auto;
  ${thinScrollbar}
`;

export const FileItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  background: transparent;
  border: 1px solid;
  ${({ $selected }) => $selected && css`
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.3);
  `}
  ${({ $selected }) => !$selected && css`
    background: rgba(39, 39, 42, 0.2);
    border-color: transparent;
    &:hover { background: rgba(39, 39, 42, 0.4); }
  `}
`;

export const Checkbox = styled.div<{ $checked: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  ${({ $checked }) => $checked && css`
    background: #fbbf24;
    border-color: #fbbf24;
  `}
  ${({ $checked }) => !$checked && css`
    border-color: #52525b;
  `}
`;

export const FileName = styled.span<{ $selected: boolean }>`
  flex: 1;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $selected }) => $selected ? '#e4e4e7' : '#a1a1aa'};
`;

export const FileCategory = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

export const FileSize = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: monospace;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  gap: 0.75rem;
`;

export const EmptyText = styled.p`
  color: #d4d4d8;
  font-weight: 500;
`;

export const EmptySubtext = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const DoneSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  gap: 0.75rem;
`;

export const DoneTitle = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fafafa;
`;

export const DoneGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
`;

export const DoneCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  text-align: center;
`;

export const DoneValue = styled.p<{ $color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

export const DoneLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    color: #e4e4e7;
    background: rgba(39, 39, 42, 0.5);
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(129, 140, 248, 0.1);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(129, 140, 248, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
