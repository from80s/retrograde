import { LuX, LuMail, LuMapPin, LuHeart, LuCopy, LuCheck } from "react-icons/lu";
import { useState } from "react";
import {
  Overlay, Modal, Header, HeaderLeft, IconBox, HeaderTitle, CloseButton,
  Content, CenteredText, DescriptionText, InfoList, InfoCard, InfoIconBox,
  InfoContent, InfoLabel, InfoValue, CopyButton, LocationValue,
  ResponseTimeBanner, ResponseTimeText, Footer, CloseFooterButton,
} from "./styles";

interface SupportModalProps {
  onClose: () => void;
}

export function SupportModal({ onClose }: SupportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('helloretrogradeofficial@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            <IconBox>
              <LuHeart className="w-5 h-5" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
            </IconBox>
            <HeaderTitle>Suporte</HeaderTitle>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX className="w-5 h-5" />
          </CloseButton>
        </Header>

        <Content>
          <CenteredText>
            <DescriptionText>Precisa de ajuda? Entre em contato conosco!</DescriptionText>
          </CenteredText>

          <InfoList>
            <InfoCard>
              <InfoIconBox $color="rgba(var(--color-retro-primary-rgb, 168, 85, 247), 0.1)">
                <LuMail className="w-5 h-5" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
              </InfoIconBox>
              <InfoContent>
                <InfoLabel>E-mail</InfoLabel>
                <InfoValue>helloretrogradeofficial@gmail.com</InfoValue>
              </InfoContent>
              <CopyButton onClick={handleCopyEmail} title="Copiar email">
                {copied ? <LuCheck className="w-4 h-4" /> : <LuCopy className="w-4 h-4" />}
              </CopyButton>
            </InfoCard>

            <InfoCard>
              <InfoIconBox $color="rgba(var(--color-retro-secondary-rgb, 99, 102, 241), 0.1)">
                <LuMapPin className="w-5 h-5" style={{ color: "var(--color-retro-secondary, #6366f1)" }} />
              </InfoIconBox>
              <InfoContent>
                <InfoLabel>Localização</InfoLabel>
                <LocationValue>Brasil / Curitiba - PR</LocationValue>
              </InfoContent>
            </InfoCard>
          </InfoList>

          <ResponseTimeBanner>
            <ResponseTimeText>Respondemos em até 24 horas em dias úteis.</ResponseTimeText>
          </ResponseTimeBanner>
        </Content>

        <Footer>
          <CloseFooterButton onClick={onClose}>
            Fechar
          </CloseFooterButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
