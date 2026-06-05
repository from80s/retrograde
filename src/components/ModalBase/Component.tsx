import { type ReactNode } from "react";
import { LuX } from "react-icons/lu";
import { Overlay, Modal, Header, HeaderLeft, Title, CloseButton } from "./styles";

interface ModalBaseProps {
  children: ReactNode;
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  maxWidth?: string;
}

export function ModalBase({ children, onClose, icon, title, maxWidth = "max-w-lg" }: ModalBaseProps) {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        $maxWidth={maxWidth}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            {icon}
            <Title>{title}</Title>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX className="w-5 h-5" />
          </CloseButton>
        </Header>
        {children}
      </Modal>
    </Overlay>
  );
}
