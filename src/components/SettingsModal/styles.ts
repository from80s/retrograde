import styled, { css } from "styled-components";
import { motion, type MotionProps } from "framer-motion";
import { thinScrollbar } from "../../styles/scrollbar";

const MotionDiv = motion.div as React.ComponentType<MotionProps & React.HTMLAttributes<HTMLDivElement>>;

export const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  ${thinScrollbar}
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SectionTitleWithIcon = styled(SectionTitle)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SectionDesc = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-top: -0.5rem;
`;

export const SubLabel = styled.span`
  color: var(--color-retro-primary, #a855f7);
  font-weight: 500;
`;

export const FieldsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FieldBlock = styled.div``;

export const FieldLabel = styled.label`
  font-size: 0.75rem;
  color: #71717a;
  margin-bottom: 0.25rem;
  display: block;
`;

export const FieldLabelRow = styled.label`
  font-size: 0.75rem;
  color: #71717a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TextInput = styled.input`
  width: 100%;
  background: rgba(39, 39, 42, 0.5);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  color: #e4e4e7;
  outline: none;
  transition: border-color 200ms ease;

  &:focus {
    border-color: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.5);
  }
`;

export const PasswordInput = styled(TextInput)`
  font-family: inherit;
`;

export const RangeSlider = styled.input.attrs({ type: "range" })`
  width: 100%;
  height: 0.5rem;
  background: #27272a;
  border-radius: 9999px;
  appearance: none;
  cursor: pointer;
  accent-color: var(--color-retro-primary, #a855f7);
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #52525b;
  margin-top: 0.25rem;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ActionButton = styled.button<{ $active: boolean; $color: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  transition: all 200ms ease;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ $active, $color }) =>
    $active
      ? css`
          background: rgba(${$color}, 0.1);
          border-color: rgba(${$color}, 0.3);
          color: var(--${$color.replace(", 0.1", "")});
        `
      : css`
          background: rgba(39, 39, 42, 0.3);
          border-color: rgba(63, 63, 70, 0.3);
          color: #71717a;
          &:hover {
            color: #d4d4d8;
          }
        `}
`;

export const InlineInput = styled(TextInput)`
  flex: 1;
  font-family: inherit;

  &::placeholder {
    color: #52525b;
  }
`;

export const InlineInputSecondary = styled(InlineInput)`
  &:focus {
    border-color: rgba(var(--color-retro-secondary-rgb, 99, 102, 241), 0.5);
  }
`;

export const InlineInputWarning = styled(InlineInput)`
  &:focus {
    border-color: rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.5);
  }
`;

export const InlineInputTeal = styled(InlineInput)`
  &:focus {
    border-color: rgba(45, 212, 191, 0.5);
  }
`;

export const AddGenreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;
  background: rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.1);
  color: var(--color-retro-warning, #eab308);
  border: 1px solid rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.3);

  &:hover {
    background: rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AddProtectedButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 200ms ease;
  background: rgba(45, 212, 191, 0.1);
  color: #2dd4bf;
  border: 1px solid rgba(45, 212, 191, 0.3);

  &:hover {
    background: rgba(45, 212, 191, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ValidationResult = styled(MotionDiv)<{ $valid: boolean }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $valid }) =>
    $valid
      ? css`
          background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1);
          color: var(--color-retro-success, #22c55e);
          border: 1px solid rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.2);
        `
      : css`
          background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1);
          color: var(--color-retro-danger, #ef4444);
          border: 1px solid rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2);
        `}
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 10rem;
  overflow-y: auto;
  ${thinScrollbar}
`;

export const Tag = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: ${({ $color }) => $color}1a;
  border: 1px solid ${({ $color }) => $color}33;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: ${({ $color }) => $color};
`;

export const TagRemoveButton = styled.button`
  margin-left: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 200ms ease;

  ${Tag}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2);
    color: var(--color-retro-danger, #ef4444);
  }
`;

export const EmptyText = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

export const BlockedFeature = styled.div`
  background: rgba(39, 39, 42, 0.3);
  border: 1px solid rgba(63, 63, 70, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const BlockedFeatureRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const BlockedIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(63, 63, 70, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BlockedTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const BlockedTitle = styled.p`
  font-size: 0.875rem;
  color: #d4d4d8;
  font-weight: 500;
`;

export const BlockedDesc = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  line-height: 1.625;
`;

export const BlockedHighlight = styled.span`
  color: var(--color-retro-primary, #a855f7);
  font-weight: 500;
`;

export const BlockedCode = styled.span`
  color: #d4d4d8;
  font-family: ui-monospace, monospace;
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

/* Modal de resultado de teste */
export const TestOverlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

export const TestModal = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 1rem;
  width: 100%;
  max-width: 28rem;
  overflow: hidden;
  backdrop-filter: blur(12px);
`;

export const TestHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TestHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TestHeaderTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f4f4f5;
`;

export const TestContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TestResultCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
`;

export const TestResultIconBox = styled.div<{ $color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color};
`;

export const TestResultInfo = styled.div`
  flex: 1;
`;

export const TestResultName = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e4e4e7;
`;

export const TestResultMessage = styled.p<{ $color: string }>`
  font-size: 0.75rem;
  color: ${({ $color }) => $color};
`;

export const TestSummary = styled.div<{ $success: boolean }>`
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ $success }) =>
    $success
      ? css`
          background: rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.1);
          color: var(--color-retro-success, #22c55e);
          border: 1px solid rgba(var(--color-retro-success-rgb, 34, 197, 94), 0.2);
        `
      : css`
          background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1);
          color: var(--color-retro-danger, #ef4444);
          border: 1px solid rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2);
        `}
`;

export const TestFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  justify-content: flex-end;
`;

export const TestCloseButton = styled.button`
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  color: #a1a1aa;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
    background: rgba(39, 39, 42, 0.5);
  }
`;

/* Modal de confirmação de exclusão */
export const ConfirmOverlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 70;
`;

export const ConfirmModal = styled(MotionDiv)`
  background: rgba(24, 24, 27, 0.8);
  border: 1px solid rgba(63, 63, 70, 0.5);
  border-radius: 1rem;
  width: 100%;
  max-width: 24rem;
  overflow: hidden;
  backdrop-filter: blur(12px);
`;

export const ConfirmContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
`;

export const ConfirmIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ConfirmTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #f4f4f5;
`;

export const ConfirmText = styled.p`
  font-size: 0.875rem;
  color: #a1a1aa;
  margin-top: 0.25rem;
`;

export const ConfirmHighlight = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 500;
`;

export const ConfirmFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  gap: 0.75rem;
`;

export const ConfirmCancel = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
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

export const ConfirmDelete = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1);
  color: var(--color-retro-danger, #ef4444);
  border: 1px solid rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.3);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 200ms ease;

  &:hover {
    background: rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2);
  }
`;
