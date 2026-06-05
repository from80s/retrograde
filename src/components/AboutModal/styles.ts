import styled from 'styled-components';
import { motion } from 'framer-motion';

type MotionProps = {
  initial?: object;
  animate?: object;
  exit?: object;
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
  max-width: 28rem;
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

export const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
`;

export const Logo = styled.img`
  width: 8rem;
  height: auto;
`;

export const Description = styled.p`
  color: #d4d4d8;
  font-size: 0.875rem;
  line-height: 1.625;
`;

export const VersionText = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  font-family: monospace;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a1a1aa;
  font-size: 0.875rem;
`;

export const InfoName = styled.span`
  color: #e4e4e7;
  font-weight: 500;
`;

export const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #818cf8;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    text-decoration: underline;
  }
`;

export const LicenseLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a1a1aa;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    color: #e4e4e7;
    text-decoration: underline;
  }
`;

export const TechSection = styled.div`
  background: rgba(39, 39, 42, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TechTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

export const TechBadge = styled.span`
  padding: 0.25rem 0.75rem;
  background: rgba(63, 63, 70, 0.5);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #d4d4d8;
  border: 1px solid rgba(82, 82, 91, 0.3);
`;
