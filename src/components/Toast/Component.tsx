import { AnimatePresence } from "framer-motion";
import { LuCircleCheckBig, LuCircleX, LuInfo } from "react-icons/lu";
import { ToastContainer, IconWrapper, Message, CloseButton } from "./styles";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const icons = {
  success: <LuCircleCheckBig className="w-5 h-5" />,
  error: <LuCircleX className="w-5 h-5" />,
  info: <LuInfo className="w-5 h-5" />,
};

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <ToastContainer
        $type={type}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <IconWrapper $type={type}>{icons[type]}</IconWrapper>
        <Message>{message}</Message>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ToastContainer>
    </AnimatePresence>
  );
}
