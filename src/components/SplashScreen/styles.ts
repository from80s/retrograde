import styled from "styled-components";
import { motion } from "framer-motion";

export const MotionDiv = motion.div as React.ComponentType<
  React.ComponentProps<typeof motion.div>
>;

export const Overlay = styled(MotionDiv)`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
