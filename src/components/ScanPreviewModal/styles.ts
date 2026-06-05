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

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fafafa;
`;

export const Subtitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-top: 0.25rem;
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

export const ResumeOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const ResumeDialog = styled.div`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 28rem;
  margin: 0 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ResumeTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #fafafa;
`;

export const ResumeText = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
`;

export const ResumeActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  padding-top: 0.5rem;
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
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ScanCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
  gap: 1.5rem;
`;

export const ScanText = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
  text-align: center;
`;

export const ProgressBar = styled.div`
  width: 16rem;
  height: 0.5rem;
  background: #27272a;
  border-radius: 9999px;
  overflow: hidden;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(to right, #818cf8, rgba(129, 140, 248, 0.6));
  border-radius: 9999px;
`;

export const ScanFooter = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const MainContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

export const StatCard = styled.div`
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
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

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FilterTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

export const FilterInputWrapper = styled.div`
  position: relative;
`;

export const FilterIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #71717a;
`;

export const FilterInput = styled.input`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;
  transition: all 0.15s ease;

  &::placeholder { color: #52525b; }
  &:focus { border-color: rgba(129, 140, 248, 0.5); }
`;

export const FilterSelect = styled.select`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:focus { border-color: rgba(129, 140, 248, 0.5); }
`;

export const SystemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SystemsTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SystemCard = styled.div`
  background: rgba(39, 39, 42, 0.2);
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const SystemHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { background: rgba(39, 39, 42, 0.3); }
`;

export const SystemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SystemName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #e4e4e7;
`;

export const SystemCount = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

export const SystemSize = styled.span`
  font-size: 0.75rem;
  color: #71717a;
`;

export const RomList = styled.div`
  border-top: 1px solid rgba(63, 63, 70, 0.5);
  max-height: 16rem;
  overflow-y: auto;
`;

export const RomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  transition: all 0.15s ease;

  &:hover { background: rgba(39, 39, 42, 0.2); }
`;

export const RomInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RomFileName = styled.p`
  font-size: 0.875rem;
  color: #e4e4e7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RomMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

export const RomMetaItem = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const RomRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RomSize = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

export const CloneSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CloneToggle = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { background: rgba(39, 39, 42, 0.5); }
`;

export const CloneToggleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
`;

export const CloneToggleTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e4e4e7;
`;

export const CloneToggleSubtitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const CloneContent = styled.div`
  background: rgba(39, 39, 42, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const CheckboxInput = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  accent-color: #818cf8;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #d4d4d8;
`;

export const RegionSection = styled.div`
  padding-left: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RegionLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const RegionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const RegionButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid;
  background: transparent;
  ${({ $active }) => $active && css`
    background: rgba(129, 140, 248, 0.2);
    color: #818cf8;
    border-color: rgba(129, 140, 248, 0.3);
  `}
  ${({ $active }) => !$active && css`
    background: rgba(63, 63, 70, 0.5);
    color: #a1a1aa;
    border-color: rgba(82, 82, 91, 0.3);
    &:hover { color: #e4e4e7; }
  `}
`;

export const RegionError = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
`;

export const CloneGroupList = styled.div`
  max-height: 10rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CloneGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.5rem;
`;

export const CloneGroupInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CloneGroupName = styled.p`
  font-size: 0.75rem;
  color: #d4d4d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CloneGroupCount = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const CloneGroupKeep = styled.span`
  font-size: 0.75rem;
  color: #22c55e;
  flex-shrink: 0;
`;

export const ProtectedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ProtectedTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProtectedInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ProtectedInput = styled.input`
  flex: 1;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;
  transition: all 0.15s ease;

  &::placeholder { color: #52525b; }
  &:focus { border-color: rgba(45, 212, 191, 0.5); }
`;

export const ValidateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(45, 212, 191, 0.1);
  color: #2dd4bf;
  border: 1px solid rgba(45, 212, 191, 0.3);
  cursor: pointer;
  transition: all 0.15s ease;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: rgba(45, 212, 191, 0.2); }
`;

export const ValidationResult = styled.div<{ $valid: boolean }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${({ $valid }) => $valid && css`
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.2);
  `}
  ${({ $valid }) => !$valid && css`
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}
`;

export const AddButton = styled.button`
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { background: rgba(34, 197, 94, 0.3); }
`;

export const ProtectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 6rem;
  overflow-y: auto;
`;

export const ProtectedTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: rgba(45, 212, 191, 0.1);
  border: 1px solid rgba(45, 212, 191, 0.2);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #2dd4bf;
`;

export const RemoveTagButton = styled.button`
  margin-left: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.15s ease;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
  ${ProtectedTag}:hover & { opacity: 1; }
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #71717a;
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const LegendDot = styled.span<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const SuccessButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { background: rgba(34, 197, 94, 0.2); }
  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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

  &:hover { background: rgba(239, 68, 68, 0.2); }
  &:active { transform: scale(0.95); }
`;

export const MutedButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: rgba(63, 63, 70, 0.5);
  color: #d4d4d8;
  border: 1px solid rgba(82, 82, 91, 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { background: rgba(63, 63, 70, 0.8); }
  &:active { transform: scale(0.95); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
