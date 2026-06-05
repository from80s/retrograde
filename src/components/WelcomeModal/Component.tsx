import { LuX, LuExternalLink, LuSettings, LuWifi, LuCircleCheckBig, LuCircleAlert } from "react-icons/lu";
import {
  Overlay, Modal, Header, HeaderLeft, IconBox, HeaderTitle, CloseButton,
  Content, StatusBanner, StatusText, StepsSection, SectionTitle, StepsList,
  StepRow, StepNumber, StepNumText, StepContent, StepTitle, StepDesc,
  ApiLinks, ApiLink, InfoBanner, InfoContent, InfoText, InfoHighlight,
  Footer, CancelFooterButton, PrimaryFooterButton,
} from "./styles";

interface WelcomeModalProps {
  onClose: () => void;
  onOpenSettings: () => void;
  hasConfig: boolean;
}

export function WelcomeModal({ onClose, onOpenSettings, hasConfig }: WelcomeModalProps) {
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
              <LuSettings className="w-5 h-5" style={{ color: "var(--color-retro-primary, #a855f7)" }} />
            </IconBox>
            <HeaderTitle>Bem-vindo ao RetroGrade</HeaderTitle>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <LuX className="w-5 h-5" />
          </CloseButton>
        </Header>

        <Content>
          <StatusBanner $hasConfig={hasConfig}>
            {hasConfig ? (
              <LuCircleAlert className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-retro-warning, #eab308)" }} />
            ) : (
              <LuWifi className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-retro-danger, #ef4444)" }} />
            )}
            <StatusText>
              {hasConfig
                ? 'APIs configuradas, mas conexão não testada. Clique em "Testar Conexão" para validar.'
                : 'Nenhuma API configurada. Configure pelo menos uma API para iniciar a curadoria.'}
            </StatusText>
          </StatusBanner>

          <StepsSection>
            <SectionTitle>Como configurar</SectionTitle>
            <StepsList>
              <StepRow>
                <StepNumber>
                  <StepNumText>1</StepNumText>
                </StepNumber>
                <StepContent>
                  <StepTitle>Abra as Configurações</StepTitle>
                  <StepDesc>Clique no botão "Configurações" na barra lateral esquerda.</StepDesc>
                </StepContent>
              </StepRow>

              <StepRow>
                <StepNumber>
                  <StepNumText>2</StepNumText>
                </StepNumber>
                <StepContent>
                  <StepTitle>Obtenha suas chaves de API</StepTitle>
                  <StepDesc>Cadastre-se nos serviços abaixo para obter suas credenciais:</StepDesc>
                  <ApiLinks>
                    <ApiLink
                      href="https://api-docs.igdb.com/#account-creation"
                      target="_blank"
                      rel="noopener noreferrer"
                      $color="var(--color-retro-primary, #a855f7)"
                    >
                      <LuExternalLink className="w-3 h-3" />
                      IGDB (Twitch Developer) - api-docs.igdb.com
                    </ApiLink>
                    <ApiLink
                      href="https://thegamesdb.net/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      $color="var(--color-retro-secondary, #6366f1)"
                    >
                      <LuExternalLink className="w-3 h-3" />
                      TheGamesDB - thegamesdb.net/api
                    </ApiLink>
                  </ApiLinks>
                </StepContent>
              </StepRow>

              <StepRow>
                <StepNumber>
                  <StepNumText>3</StepNumText>
                </StepNumber>
                <StepContent>
                  <StepTitle>Preencha as credenciais</StepTitle>
                  <StepDesc>Cole o Client ID, Client Secret (IGDB) e API Key (TGDB) nos campos correspondentes.</StepDesc>
                </StepContent>
              </StepRow>

              <StepRow>
                <StepNumber $color="--color-retro-success-rgb, 34, 197, 94">
                  <StepNumText $color="--color-retro-success, #22c55e">4</StepNumText>
                </StepNumber>
                <StepContent>
                  <StepTitle>Teste a conexão</StepTitle>
                  <StepDesc>Clique em "Testar Conexão" para validar as credenciais. Pelo menos uma API precisa conectar.</StepDesc>
                </StepContent>
              </StepRow>
            </StepsList>
          </StepsSection>

          <InfoBanner>
            <InfoContent>
              <LuCircleCheckBig className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-retro-success, #22c55e)" }} />
              <InfoText>
                Basta configurar <InfoHighlight>uma das APIs</InfoHighlight> para que a curadoria seja habilitada. O app usa a IGDB como principal e a TheGamesDB como fallback.
              </InfoText>
            </InfoContent>
          </InfoBanner>
        </Content>

        <Footer>
          <CancelFooterButton onClick={onClose}>
            Fechar
          </CancelFooterButton>
          <PrimaryFooterButton onClick={() => { onClose(); onOpenSettings(); }}>
            <LuSettings className="w-4 h-4" />
            Ir para Configurações
          </PrimaryFooterButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
