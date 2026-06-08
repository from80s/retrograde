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
  max-width: 56rem;
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

export const StepsBar = styled.div`
  padding: 1rem 1.5rem 0;
`;

export const StepsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
`;

export const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StepBadge = styled.div<{ $active: boolean; $done: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
  ${({ $active }) => $active && css`
    background: rgba(129, 140, 248, 0.1);
    color: #818cf8;
  `}
  ${({ $done }) => $done && css`
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  `}
  ${({ $active, $done }) => !$active && !$done && css`
    background: rgba(39, 39, 42, 0.3);
    color: #52525b;
  `}
`;

export const StepCircle = styled.span`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  ${thinScrollbar}
  padding: 1.5rem;
`;

export const SpinnerIcon = styled(LuLoader)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const SectionLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4d4d8;
`;

export const FolderSelector = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.5);
  background: rgba(39, 39, 42, 0.3);
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  text-align: left;

  &:hover {
    color: #e4e4e7;
    border-color: rgba(63, 63, 70, 0.8);
  }
`;

export const FolderText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ResumeDialog = styled.div`
  padding: 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ResumeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ResumeTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #e4e4e7;
`;

export const ResumeSubtitle = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
`;

export const ResumeActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export const TextButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
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
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(129, 140, 248, 0.1);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(129, 140, 248, 0.2);
  }
`;

export const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  transition: all 0.15s ease;
  background: transparent;
  cursor: pointer;
  text-align: left;
  ${({ $active }) => $active && css`
    background: rgba(129, 140, 248, 0.1);
    border-color: rgba(129, 140, 248, 0.3);
    color: #818cf8;
  `}
  ${({ $active }) => !$active && css`
    background: rgba(39, 39, 42, 0.3);
    border-color: rgba(63, 63, 70, 0.3);
    color: #71717a;
    &:hover { color: #d4d4d8; }
  `}
`;

export const ModeLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ModeDesc = styled.p`
  font-size: 0.75rem;
  opacity: 0.7;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.3);
`;

export const ToggleLabel = styled.p`
  font-size: 0.875rem;
  color: #d4d4d8;
`;

export const ToggleDesc = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const ToggleTrack = styled.button<{ $active: boolean }>`
  width: 3rem;
  height: 1.5rem;
  border-radius: 9999px;
  position: relative;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $active }) => $active ? '#818cf8' : '#3f3f46'};
`;

export const ToggleThumb = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 2px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: white;
  transition: transform 0.15s ease;
  transform: translateX(${({ $active }) => $active ? '24px' : '2px'});
`;

export const FormatsInfo = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.2);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.2);
`;

export const FormatsText = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
`;

export const FormatExt = styled.span`
  color: #e4e4e7;
  font-weight: 500;
`;

export const ScanCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1.5rem;
`;

export const ScanProgress = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ScanLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
`;

export const ScanBarBg = styled.div`
  height: 0.625rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ScanBarFill = styled(motion.div)`
  height: 100%;
  background: #818cf8;
  border-radius: 9999px;
`;

export const ScanFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #52525b;
`;

export const FoundText = styled.span`
  color: #818cf8;
`;

export const FilesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FilesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FilesCount = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
`;

export const FilesSize = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const FilesToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: #a1a1aa;
  background: rgba(39, 39, 42, 0.4);
  border: 1px solid rgba(63, 63, 70, 0.4);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(63, 63, 70, 0.6);
    color: #d4d4d8;
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 16rem;
  overflow-y: auto;
  ${thinScrollbar}
`;

export const FileItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  background: ${(p) => p.$selected ? 'rgba(129, 140, 248, 0.08)' : 'rgba(39, 39, 42, 0.2)'};
  border: 1px solid ${(p) => p.$selected ? 'rgba(129, 140, 248, 0.2)' : 'transparent'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => p.$selected ? 'rgba(129, 140, 248, 0.12)' : 'rgba(39, 39, 42, 0.4)'};
  }
`;

export const FileCheckbox = styled.div<{ $checked?: boolean }>`
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 0.25rem;
  border: 1.5px solid ${(p) => p.$checked ? '#818cf8' : '#52525b'};
  background: ${(p) => p.$checked ? '#818cf8' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  transition: all 0.15s ease;
`;

export const FileItemName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileItemExt = styled.span`
  font-size: 0.75rem;
  color: #52525b;
  font-family: monospace;
`;

export const FileItemSize = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

export const UnsupportedLabel = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const UnsupportedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(39, 39, 42, 0.1);
  border-radius: 0.5rem;
  opacity: 0.5;
`;

export const UnsupportedName = styled.span`
  flex: 1;
  font-size: 0.75rem;
  color: #71717a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UnsupportedExt = styled.span`
  font-size: 0.75rem;
  color: #3f3f46;
  font-family: monospace;
`;

export const ExtractionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ExtractionProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ExtractionsBarBg = styled.div`
  height: 0.5rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ExtractionsBarFill = styled(motion.div)`
  height: 100%;
  background: #818cf8;
  border-radius: 9999px;
`;

export const ExtractionLog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 20rem;
  overflow-y: auto;
  ${thinScrollbar}
`;

export const ExtractionEntry = styled.div<{ $status: string }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid;
  ${({ $status }) => $status === 'complete' && css`
    background: rgba(34, 197, 94, 0.05);
    border-color: rgba(34, 197, 94, 0.2);
  `}
  ${({ $status }) => $status === 'error' && css`
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.2);
  `}
  ${({ $status }) => $status !== 'complete' && $status !== 'error' && css`
    background: rgba(39, 39, 42, 0.2);
    border-color: rgba(63, 63, 70, 0.2);
  `}
`;

export const ExtractionEntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const ExtractionEntryName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExtractionEntryPercent = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

export const ExtractionEntryBar = styled.div`
  height: 0.375rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ExtractionEntryBarFill = styled(motion.div)`
  height: 100%;
  background: #818cf8;
  border-radius: 9999px;
`;

export const ExtractionEntryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #52525b;
`;

export const ExtractionEntryError = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

export const StatCard = styled.div<{ $variant?: string }>`
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
  border: 1px solid;
  ${({ $variant }) => $variant === 'success' && css`
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
  `}
  ${({ $variant }) => $variant === 'danger' && css`
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
  `}
  ${({ $variant }) => $variant === 'muted' && css`
    background: rgba(63, 63, 70, 0.2);
    border-color: rgba(82, 82, 91, 0.2);
  `}
  ${({ $variant }) => !$variant && css`
    background: rgba(39, 39, 42, 0.3);
    border-color: rgba(63, 63, 70, 0.3);
  `}
`;

export const StatValue = styled.p<{ $color: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

export const StatLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const SizeSummary = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.3);
`;

export const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
`;

export const SizeValue = styled.p<{ $color: string }>`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

export const SizeLabel = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const ErrorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ErrorItem = styled.div`
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 0.75rem;
`;

export const ErrorItemName = styled.p`
  font-size: 0.875rem;
  color: #d4d4d8;
`;

export const ErrorItemMessage = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const FullLog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FullLogEntry = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  ${({ $status }) => $status === 'success' && css`
    background: rgba(34, 197, 94, 0.05);
    color: #22c55e;
  `}
  ${({ $status }) => $status === 'error' && css`
    background: rgba(239, 68, 68, 0.05);
    color: #ef4444;
  `}
  ${({ $status }) => $status === 'cancelled' && css`
    background: rgba(39, 39, 42, 0.2);
    color: #71717a;
  `}
`;

export const FullLogName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FullLogSize = styled.span`
  color: #52525b;
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterButton = styled.button<{ $variant?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid;
  background: transparent;
  font-size: 0.875rem;
  ${({ $variant }) => $variant === 'primary' && css`
    background: rgba(129, 140, 248, 0.1);
    color: #818cf8;
    border-color: rgba(129, 140, 248, 0.3);
    &:hover { background: rgba(129, 140, 248, 0.2); }
  `}
  ${({ $variant }) => $variant === 'success' && css`
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
    &:hover { background: rgba(34, 197, 94, 0.2); }
  `}
  ${({ $variant }) => $variant === 'danger' && css`
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
    &:hover { background: rgba(239, 68, 68, 0.2); }
  `}
  ${({ $variant }) => !$variant && css`
    color: #a1a1aa;
    &:hover { color: #e4e4e7; background: rgba(39, 39, 42, 0.5); }
  `}
  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const FooterStats = styled.div`
  font-size: 0.75rem;
  color: #52525b;
`;

export const FooterFullWidth = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  ${thinScrollbar}
  padding: 1.5rem;
`;

export const DiskSpaceCard = styled.div<{ $warning: boolean }>`
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  ${({ $warning }) => $warning && css`
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.2);
  `}
  ${({ $warning }) => !$warning && css`
    background: rgba(39, 39, 42, 0.3);
    border-color: rgba(63, 63, 70, 0.3);
  `}
`;

export const DiskSpaceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
`;

export const DiskSpaceLabel = styled.span`
  color: #a1a1aa;
`;

export const DiskSpaceValue = styled.span<{ $warning?: boolean }>`
  font-weight: 600;
  color: ${({ $warning }) => $warning ? '#fbbf24' : '#d4d4d8'};
`;

export const DiskSpaceWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #fbbf24;
`;

export const CurrentFileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(39, 39, 42, 0.2);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.2);
`;

export const CurrentFileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CurrentFileName = styled.span`
  font-size: 0.8125rem;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 0.5rem;
`;

export const CurrentFilePercent = styled.span`
  font-size: 0.75rem;
  color: #818cf8;
  font-weight: 600;
`;

export const CurrentFileBarBg = styled.div`
  height: 0.5rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const CurrentFileBarFill = styled(motion.div)`
  height: 100%;
  background: #818cf8;
  border-radius: 9999px;
`;

export const PauseButton = styled.button<{ $paused: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid;
  background: transparent;
  font-size: 0.875rem;
  ${({ $paused }) => $paused && css`
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
    &:hover { background: rgba(34, 197, 94, 0.2); }
  `}
  ${({ $paused }) => !$paused && css`
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.3);
    &:hover { background: rgba(251, 191, 36, 0.2); }
  `}
  &:active { transform: scale(0.95); }
`;

export const PausedLabel = styled.span`
  font-size: 0.75rem;
  color: #fbbf24;
  font-weight: 500;
`;
