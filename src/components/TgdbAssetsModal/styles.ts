import styled, { css } from "styled-components";
import { motion, type MotionProps } from "framer-motion";

const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

export const Overlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const Modal = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 1rem;
  width: 100%;
  max-width: 64rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(12px);
`;

export const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const HeaderTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f4f4f5;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const CloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
    background: #27272a;
  }
`;

export const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const SearchSection = styled(MotionDiv)`
  padding: 1.5rem;
`;

export const MaxWidthMd = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MaxWidthLg = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SearchModeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const SearchModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
          color: var(--color-retro-primary, #a855f7);
          border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
        `
      : css`
          background: rgba(39, 39, 42, 0.3);
          color: #a1a1aa;
          border: 1px solid rgba(63, 63, 70, 0.3);
          &:hover {
            background: rgba(39, 39, 42, 0.5);
          }
        `}
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4d4d8;
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  color: #e4e4e7;
  font-size: 0.875rem;
  outline: none;
  transition: all 200ms ease;

  &::placeholder {
    color: #52525b;
  }

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
    box-shadow: 0 0 0 1px rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e4e4e7;
  transition: all 200ms ease;

  &:hover {
    border-color: #52525b;
  }
`;

export const DropdownPlaceholder = styled.span<{ $selected: boolean }>`
  color: ${({ $selected }) => $selected ? '#e4e4e7' : '#52525b'};
`;

export const DropdownArrow = styled.span<{ $open: boolean }>`
  transition: transform 200ms ease;
  transform: rotate(${({ $open }) => $open ? '180deg' : '0deg'});
`;

export const DropdownMenu = styled(MotionDiv)`
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 0.5rem;
  background: #27272a;
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

export const DropdownSearch = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid rgba(63, 63, 70, 0.5);
`;

export const DropdownSearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(24, 24, 27, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const DropdownList = styled.div`
  max-height: 12rem;
  overflow-y: auto;
`;

export const DropdownItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  text-align: left;
  transition: all 200ms ease;
  color: ${({ $selected }) => $selected ? 'var(--color-retro-primary, #a855f7)' : '#d4d4d8'};
  background: ${({ $selected }) => $selected ? 'rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.05)' : 'transparent'};

  &:hover {
    background: rgba(63, 63, 70, 0.5);
  }
`;

export const DropdownEmpty = styled.p`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #52525b;
`;

export const MediaTypeGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: 0.5rem;
`;

export const MediaTypeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
          color: var(--color-retro-primary, #a855f7);
          border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
        `
      : css`
          background: rgba(39, 39, 42, 0.3);
          color: #71717a;
          border: 1px solid rgba(63, 63, 70, 0.3);
        `}
`;

export const SearchButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* Pasta scanning */
export const FolderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AddFolderButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(63, 63, 70, 0.5);
  color: #d4d4d8;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 200ms ease;

  &:hover {
    background: rgba(63, 63, 70, 0.7);
  }
`;

export const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const FolderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.5rem;
`;

export const FolderText = styled.span`
  font-size: 0.75rem;
  color: #d4d4d8;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FolderRemoveButton = styled.button`
  color: #71717a;
  transition: color 200ms ease;

  &:hover {
    color: var(--color-retro-danger, #ef4444);
  }
`;

export const ScanButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 9999px;
  height: 0.5rem;
`;

export const ProgressFill = styled.div`
  background: var(--color-retro-primary, #a855f7);
  height: 0.5rem;
  border-radius: 9999px;
  transition: width 300ms ease;
`;

export const SuccessProgressFill = styled(ProgressFill)`
  background: var(--color-retro-success, #22c55e);
`;

export const RomEntriesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RomEntriesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RomEntriesCount = styled.span`
  font-size: 0.875rem;
  color: #a1a1aa;
`;

export const SelectActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectAction = styled.button`
  font-size: 0.75rem;
  color: var(--color-retro-primary, #a855f7);
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const ClearAction = styled(SelectAction)`
  color: #71717a;

  &:hover {
    color: #d4d4d8;
  }
`;

export const RomEntriesScroll = styled.div`
  max-height: 16rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SystemGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SystemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: rgba(39, 39, 42, 0.4);
  border-radius: 0.5rem;
`;

export const SystemLogo = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
`;

export const SystemName = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #d4d4d8;
`;

export const SystemCount = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

export const RomList = styled.div`
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RomButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: left;
  transition: all 200ms ease;

  ${({ $selected }) =>
    $selected
      ? css`
          background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
          border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
        `
      : css`
          background: rgba(39, 39, 42, 0.2);
          border: 1px solid transparent;
          &:hover {
            background: rgba(39, 39, 42, 0.4);
          }
        `}
`;

export const Checkbox = styled.div<{ $checked: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  border-color: ${({ $checked }) => $checked ? 'var(--color-retro-primary, #a855f7)' : '#52525b'};
  background: ${({ $checked }) => $checked ? 'var(--color-retro-primary, #a855f7)' : 'transparent'};
`;

export const RomName = styled.span<{ $selected: boolean }>`
  flex: 1;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $selected }) => $selected ? '#e4e4e7' : '#a1a1aa'};
`;

export const DownloadButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1);
  color: var(--color-retro-success, #22c55e);
  border: 1px solid rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DownloadProgressText = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  text-align: center;
`;

export const DownloadResults = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
`;

export const DownloadResultsTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4d4d8;
`;

export const DownloadResultRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

export const DownloadResultName = styled.span`
  color: #a1a1aa;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.5rem;
`;

export const DownloadResultStatus = styled.span<{ $status: string }>`
  color: ${({ $status }) =>
    $status === 'success' ? 'var(--color-retro-success, #22c55e)' :
    $status === 'no_assets' ? 'var(--color-retro-warning, #eab308)' :
    'var(--color-retro-danger, #ef4444)'};
`;

/* Entrada manual */
export const ManualSection = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(39, 39, 42, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ManualTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4d4d8;
`;

export const ManualInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ManualInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;

  &::placeholder {
    color: #52525b;
  }

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const PlatformSelectButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: rgba(63, 63, 70, 0.5);
  color: #d4d4d8;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 200ms ease;

  &:hover {
    background: rgba(63, 63, 70, 0.7);
  }
`;

export const MultiPlatformDropdown = styled(MotionDiv)`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.25rem;
  width: 14rem;
  max-height: 12rem;
  background: #27272a;
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 10;
`;

export const PlatformCheckbox = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  text-align: left;
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ $selected }) => $selected ? 'var(--color-retro-primary, #a855f7)' : '#a1a1aa'};

  &:hover {
    background: rgba(63, 63, 70, 0.5);
  }
`;

export const PlatformCheckBox = styled.div<{ $selected: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
  border: 1px solid;
  border-color: ${({ $selected }) => $selected ? 'var(--color-retro-primary, #a855f7)' : '#52525b'};
  background: ${({ $selected }) => $selected ? 'var(--color-retro-primary, #a855f7)' : 'transparent'};
`;

export const AddEntryButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }
`;

export const ManualEntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ManualEntryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.5rem;
`;

export const ManualEntryName = styled.span`
  font-size: 0.75rem;
  color: #d4d4d8;
  flex: 1;
`;

export const ManualEntryPlatforms = styled.span`
  font-size: 0.75rem;
  color: #52525b;
`;

export const ManualEntryRemove = styled.button`
  color: #71717a;
  transition: color 200ms ease;

  &:hover {
    color: var(--color-retro-danger, #ef4444);
  }
`;

/* Loading */
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1rem;
`;

export const LoadingText = styled.p`
  color: #a1a1aa;
`;

export const RetryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const RetryText = styled.p`
  font-size: 0.875rem;
  color: var(--color-retro-danger, #ef4444);
  text-align: center;
  max-width: 24rem;
`;

export const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }
`;

/* Result tabs */
export const ResultsContent = styled.div`
  padding: 1.5rem;
`;

export const TabsBar = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.3);
`;

export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 200ms ease;
  color: ${({ $active }) => $active ? 'var(--color-retro-primary, #a855f7)' : '#71717a'};
  background: ${({ $active }) => $active ? 'rgba(39, 39, 42, 0.5)' : 'transparent'};
  border-bottom: ${({ $active }) => $active ? '2px solid var(--color-retro-primary, #a855f7)' : '2px solid transparent'};

  &:hover {
    color: ${({ $active }) => $active ? 'var(--color-retro-primary, #a855f7)' : '#d4d4d8'};
  }
`;

export const TabCount = styled.span`
  font-size: 0.75rem;
  opacity: 0.6;
`;

export const ExportButton = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 200ms ease;
  color: #71717a;

  &:hover {
    color: #d4d4d8;
  }
`;

/* Export */
export const ExportSection = styled(MotionDiv)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ExportModeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ExportModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
          color: var(--color-retro-primary, #a855f7);
          border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);
        `
      : css`
          background: rgba(39, 39, 42, 0.3);
          color: #a1a1aa;
          border: 1px solid rgba(63, 63, 70, 0.3);
          &:hover {
            background: rgba(39, 39, 42, 0.5);
          }
        `}
`;

export const ExportConfig = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ExportCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ExportCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d4d4d8;
  font-weight: 500;
`;

export const FolderInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FolderInput = styled.input`
  flex: 1;
  padding: 0.625rem 1rem;
  background: rgba(24, 24, 27, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #e4e4e7;
  outline: none;

  &::placeholder {
    color: #52525b;
  }

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const FolderBrowseButton = styled.button`
  padding: 0.625rem 1rem;
  background: rgba(63, 63, 70, 0.5);
  color: #d4d4d8;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 200ms ease;

  &:hover {
    background: rgba(63, 63, 70, 0.7);
  }
`;

export const InstructionsCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.2);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.3);
`;

export const InstructionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const InstructionsLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #a1a1aa;
`;

export const CopyInstructionsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #71717a;
  transition: all 200ms ease;

  &:hover {
    color: #d4d4d8;
  }
`;

export const InstructionsPre = styled.pre`
  font-size: 0.75rem;
  color: #71717a;
  white-space: pre-wrap;
  font-family: ui-monospace, monospace;
  line-height: 1.625;
  max-height: 8rem;
  overflow-y: auto;
`;

export const ExportResultCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ExportResultSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ExportResultText = styled.span`
  color: #e4e4e7;
  font-weight: 500;
`;

export const ExportResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ExportResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
`;

export const ExportResultItemType = styled.span<{ $status: string }>`
  color: ${({ $status }) => $status === 'success' ? '#a1a1aa' : 'var(--color-retro-danger, #ef4444)'};
`;

export const ExportResultItemValue = styled.span<{ $status: string }>`
  color: ${({ $status }) => $status === 'success' ? 'var(--color-retro-success, #22c55e)' : 'var(--color-retro-danger, #ef4444)'};
`;

export const ExportButtonStyled = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1);
  color: var(--color-retro-success, #22c55e);
  border: 1px solid rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.3);
  border-radius: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Tab content: images, etc */
export const BoxartContainer = styled(MotionDiv)`
  display: flex;
  justify-content: center;
`;

export const BoxartButton = styled.button`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(63, 63, 70, 0.5);
  transition: border-color 200ms ease;

  &:hover {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const BoxartOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 200ms ease;

  ${BoxartButton}:hover & {
    background: rgba(0, 0, 0, 0.2);
  }
`;

export const BoxartLabel = styled.span`
  opacity: 0;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  transition: opacity 200ms ease;

  ${BoxartButton}:hover & {
    opacity: 1;
  }
`;

export const ImageGrid = styled(MotionDiv)<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ImageGridItem = styled.button`
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(63, 63, 70, 0.5);
  aspect-ratio: 16 / 9;
  transition: border-color 200ms ease;

  &:hover {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 200ms ease;

  ${ImageGridItem}:hover & {
    background: rgba(0, 0, 0, 0.2);
  }
`;

export const BannerContainer = styled(MotionDiv)`
  display: flex;
  justify-content: center;
`;

export const BannerImage = styled.img`
  max-width: 28rem;
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.5);
`;

export const VideosSection = styled(MotionDiv)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const VideoCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
`;

export const VideoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #71717a;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

export const VideoTitle = styled.p`
  color: #e4e4e7;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

export const VideoPlayer = styled.video`
  width: 100%;
  max-height: 16rem;
  border-radius: 0.5rem;
  background: #18181b;
`;

export const NoResults = styled(MotionDiv)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  gap: 0.75rem;
`;

export const NoResultsTitle = styled.p`
  color: #71717a;
  font-weight: 500;
`;

export const NoResultsDesc = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

/* Detalhes */
export const DetailsSection = styled(MotionDiv)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const DetailCard = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
`;

export const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #71717a;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

export const DetailValue = styled.p`
  color: #e4e4e7;
  font-weight: 500;
`;

/* Footer */
export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const FooterLeft = styled.div`
  flex: 1;
`;

export const FooterButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #a1a1aa;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
    background: rgba(39, 39, 42, 0.5);
  }
`;

/* Image preview overlay */
export const PreviewOverlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

export const PreviewCloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
  }
`;

export const PreviewImage = styled(motion.img)`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;
