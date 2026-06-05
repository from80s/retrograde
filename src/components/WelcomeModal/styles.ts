import styled from "styled-components";
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
  max-width: 32rem;
  overflow: hidden;
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

export const IconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #f4f4f5;
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

export const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StatusBanner = styled.div<{ $hasConfig: boolean }>`
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ $hasConfig }) =>
    $hasConfig
      ? "rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.1)"
      : "rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.1)"};
  border: 1px solid
    ${({ $hasConfig }) =>
      $hasConfig
        ? "rgba(var(--color-retro-warning-rgb, 234, 179, 8), 0.2)"
        : "rgba(var(--color-retro-danger-rgb, 239, 68, 68), 0.2)"};
`;

export const StatusText = styled.p`
  font-size: 0.875rem;
  color: #d4d4d8;
`;

export const StepsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const StepRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const StepNumber = styled.div<{ $color?: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${({ $color }) =>
    $color
      ? `rgba(${$color}, 0.2)`
      : "rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const StepNumText = styled.span<{ $color?: string }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $color }) =>
    $color
      ? `var(${$color})`
      : "var(--color-retro-primary, #a855f7)"};
`;

export const StepContent = styled.div``;

export const StepTitle = styled.p`
  font-size: 0.875rem;
  color: #e4e4e7;
  font-weight: 500;
`;

export const StepDesc = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-top: 0.25rem;
`;

export const ApiLinks = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ApiLink = styled.a<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: ${({ $color }) => $color};
  transition: all 200ms ease;
  text-decoration: none;

  &:hover {
    background: #27272a;
  }
`;

export const InfoBanner = styled.div`
  padding: 0.75rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.3);
`;

export const InfoContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const InfoText = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
`;

export const InfoHighlight = styled.span`
  color: #e4e4e7;
  font-weight: 500;
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  gap: 0.75rem;
`;

export const FooterButton = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease;

  &:hover {
    color: #e4e4e7;
  }
`;

export const CancelFooterButton = styled(FooterButton)`
  color: #a1a1aa;
  background: transparent;

  &:hover {
    background: rgba(39, 39, 42, 0.5);
  }
`;

export const PrimaryFooterButton = styled(FooterButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }
`;
