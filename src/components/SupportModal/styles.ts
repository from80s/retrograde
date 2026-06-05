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

export const CenteredText = styled.div`
  text-align: center;
`;

export const DescriptionText = styled.p`
  color: #a1a1aa;
  font-size: 0.875rem;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(39, 39, 42, 0.5);
  border-radius: 0.75rem;
`;

export const InfoIconBox = styled.div<{ $color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoLabel = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-bottom: 0.25rem;
`;

export const InfoValue = styled.p`
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  color: #e4e4e7;
  word-break: break-all;
`;

export const CopyButton = styled.button`
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1);
  color: var(--color-retro-primary, #a855f7);
  border: 1px solid rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.3);

  &:hover {
    background: rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const LocationValue = styled.p`
  font-size: 0.875rem;
  color: #e4e4e7;
`;

export const ResponseTimeBanner = styled.div`
  padding: 1rem;
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(63, 63, 70, 0.3);
`;

export const ResponseTimeText = styled.p`
  font-size: 0.75rem;
  color: #a1a1aa;
  text-align: center;
`;

export const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(39, 39, 42, 0.5);
  display: flex;
  justify-content: flex-end;
`;

export const CloseFooterButton = styled.button`
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
