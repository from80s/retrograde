import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
  LuX,
  LuMonitor,
  LuCalendar,
  LuGamepad2,
  LuCpu,
  LuBookOpen,
  LuStar,
} from "react-icons/lu";
import ParallaxSlider from "../ParallaxSlider";
import {
  getSystemMetadata,
  getLogoUrl,
  getHardwareUrl,
} from "@/utils/metadata";
import { getFanartUrl } from "@/utils/fanart";
import {
  Wrapper,
  CloseButton,
  ScrollContainer,
  HeroWrapper,
  HeroSection,
  MaskContainer,
  FanartLayersContainer,
  FanartLayer,
  FanartOverlay,
  LogoImage,
  ScrollIconWrapper,
  ScrollIconSvg,
  ScrollSpacer,
  ContentPanelWrapper,
  ContentLayout,
  LeftColumn,
  HardwareCard,
  HardwareImage,
  HardwareOverlay,
  HardwareContent,
  SystemTitle,
  SystemDescription,
  RightColumn,
  CardsContainer,
  CardRevealWrapper,
  Card3D,
  CardShine,
  CardInner,
  CardHeader,
  CardHeaderLarge,
  SpecsGrid,
  SpecItem,
  SpecLabel,
  SpecValue,
  YearValue,
  YearUnknown,
  SubSection,
  SubLabel,
  TagList,
  EmuTag,
  ExtTag,
  InfoItem,
  CuriositiesList,
  CuriosityItem,
  CuriosityDot,
  NoDataText,
  NotFound,
  NotFoundContent,
  NotFoundTitle,
  NotFoundSubtitle,
} from "./styles";

function ScrollDownIcon({ className }: { className?: string }) {
  return (
    <ScrollIconSvg
      viewBox="0 0 18062 22578"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7285 12l3492 0c688,0 1314,282 1767,735 454,453 735,1079 735,1768l0 7439c0,688 -281,1314 -735,1767 -453,454 -1079,735 -1767,735l-3492 0c-688,0 -1314,-281 -1767,-735 -453,-453 -735,-1079 -735,-1767l0 -7439c0,-689 282,-1315 735,-1768 453,-453 1079,-735 1767,-735zm3492 556l-3492 0c-535,0 -1021,219 -1374,572 -353,353 -572,840 -572,1375l0 7439c0,535 219,1021 572,1374 353,353 839,572 1374,572l3492 0c535,0 1021,-219 1374,-572 353,-353 572,-839 572,-1374l0 -7439c0,-535 -219,-1022 -572,-1375 -353,-353 -839,-572 -1374,-572z"
        fillRule="nonzero"
      />
      <polygon points="9309,2541 9309,4935 8753,4935 8753,2541" />
      <polygon points="8755,9594 9307,9594 9307,16953 8755,16953" />
      <polygon points="9008,18050 7631,16026 8040,15670 8801,16811 9214,16797 9977,15692 10432,16015" />
    </ScrollIconSvg>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const LOGO_INITIAL = 18;
const LOGO_FINAL = 500;
const LOGO_FADE_END = 0.4;
const MASK_REMOVE_PROGRESS = 0.72;

const BLUR_ANGLE = 160;
const BLUR_FADE = 10;
const BLUR_LAYERS = [
  { blur: 0, start: 0, end: 75 },
  { blur: 4, start: 60, end: 85 },
  { blur: 10, start: 72, end: 92 },
  { blur: 20, start: 82, end: 100 },
  { blur: 32, start: 90, end: 100 },
];

interface SystemDetailProps {
  systemName: string;
  onClose: () => void;
}

export function SystemDetail({ systemName, onClose }: SystemDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const contentVisibleRef = useRef(false);

  const meta = getSystemMetadata(systemName);
  const logoUrl = getLogoUrl(systemName);
  const fanartUrl = getFanartUrl(systemName);
  const hardwareUrl = getHardwareUrl(systemName);

  const maskImageValue = useMemo(() => {
    if (!logoUrl) return undefined;
    return `url(${logoUrl})`;
  }, [logoUrl]);

  const setContentVisibility = useCallback((visible: boolean) => {
    if (visible === contentVisibleRef.current) return;
    contentVisibleRef.current = visible;
    setContentVisible(visible);
  }, []);

  const updateAnimation = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const heroRevealDistance = Math.min(el.clientHeight, maxScroll || Infinity);
    const progress =
      heroRevealDistance > 0 ? Math.min(scrollTop / heroRevealDistance, 1) : 0;

    const scrollIcon = scrollIconRef.current;
    if (scrollIcon) {
      scrollIcon.style.opacity = String(Math.max(0, 1 - progress * 8));
    }

    const logoEl = logoRef.current;
    const maskEl = maskRef.current;

    if (!logoEl || !maskEl || !maskImageValue) {
      setContentVisibility(progress >= MASK_REMOVE_PROGRESS);
      return;
    }

    const t = easeInOutCubic(progress);
    const logoSize = LOGO_INITIAL + (LOGO_FINAL - LOGO_INITIAL) * t;

    const logoFadeProgress = Math.min(progress / LOGO_FADE_END, 1);
    const logoOpacity = 1 - easeInOutCubic(logoFadeProgress);
    logoEl.style.opacity = String(logoOpacity);
    logoEl.style.width = `${logoSize}vw`;
    logoEl.style.height = `${logoSize}vw`;

    if (progress >= MASK_REMOVE_PROGRESS) {
      maskEl.style.webkitMaskImage = "none";
      maskEl.style.maskImage = "none";
    } else {
      maskEl.style.webkitMaskImage = maskImageValue;
      maskEl.style.maskImage = maskImageValue;
      maskEl.style.webkitMaskSize = `${logoSize}vw`;
      maskEl.style.maskSize = `${logoSize}vw`;
    }

    setContentVisibility(progress >= MASK_REMOVE_PROGRESS);
  }, [maskImageValue, setContentVisibility]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateAnimation();
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    updateAnimation();
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateAnimation]);

  // Quando o conteúdo fica visível, faz scroll automático do containerRef
  // para alinhar o topo do contentRef com o topo da viewport.
  // Isso garante que o containerRef.scrollTop chegue ao máximo, eliminando
  // o spacer do scroll chain — a partir daí qualquer wheel event vai
  // diretamente para o containerRef (que já está no fim) e naturalmente
  // não avança mais, revertendo a animação ao rolar para cima.
  useEffect(() => {
    if (!contentVisible) return;
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: maxScroll, behavior: "instant" });
  }, [contentVisible]);

  return (
    <Wrapper>
      <CloseButton onClick={onClose}>
        <LuX />
      </CloseButton>

      {/*
        containerRef é o ÚNICO scroll container.
        O contentRef NÃO tem overflow — ele é position:fixed para cobrir
        a tela, mas não participa do scroll chain do browser.
        Scroll interno do conteúdo é gerenciado pelo wheel handler abaixo.
      */}
      <ScrollContainer ref={containerRef}>
        <HeroWrapper>
          <HeroSection>
            <MaskContainer
              ref={maskRef}
              style={{
                WebkitMaskImage: maskImageValue ?? "none",
                maskImage: maskImageValue ?? "none",
                WebkitMaskSize: `${LOGO_INITIAL}vw`,
                maskSize: `${LOGO_INITIAL}vw`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            >
              <FanartLayersContainer>
                {fanartUrl &&
                  BLUR_LAYERS.map((layer) => (
                    <FanartLayer
                      key={layer.blur}
                      $blur={layer.blur}
                      $backgroundImage={`url(${fanartUrl})`}
                      $gradientMask={`linear-gradient(${BLUR_ANGLE}deg, transparent ${layer.start - BLUR_FADE}%, black ${layer.start + BLUR_FADE}%, black ${layer.end - BLUR_FADE}%, transparent ${layer.end + BLUR_FADE}%)`}
                    />
                  ))}
                <FanartOverlay />
              </FanartLayersContainer>

              {/*
                MUDANÇA PRINCIPAL:
                - Removido overflowY dinâmico — contentRef nunca é scroll container
                - Scroll interno simulado via wheel handler no containerRef
                - contentRef usa position:absolute mas overflow:hidden sempre
                - Um ref interno (innerScrollRef) controla a posição visual via translateY
              */}
              <ContentPanel
                contentRef={contentRef}
                containerRef={containerRef}
                contentVisible={contentVisible}
                meta={meta}
                hardwareUrl={hardwareUrl}
                systemName={systemName}
              />
            </MaskContainer>

            {logoUrl && (
              <LogoImage
                ref={logoRef}
                src={logoUrl}
                alt={systemName}
                style={{
                  width: `${LOGO_INITIAL}vw`,
                  height: `${LOGO_INITIAL}vw`,
                  opacity: "1",
                }}
              />
            )}

            <ScrollIconWrapper ref={scrollIconRef}>
              <ScrollDownIcon />
            </ScrollIconWrapper>
          </HeroSection>

          <ScrollSpacer />
        </HeroWrapper>
      </ScrollContainer>
    </Wrapper>
  );
}

function ParallaxCard3D({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = `${-rotateY * 0.8}px ${rotateX * 0.8}px 20px rgba(0,0,0,0.25)`;

    if (shineRef.current) {
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.1) 0%, transparent 50%)`;
      shineRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "box-shadow 0.15s ease-out";
    card.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.1)";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.1)";
    if (shineRef.current) {
      shineRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <CardRevealWrapper
      $delay={index * 0.05}
      style={{
        opacity: revealed ? 1 : 0,
        transform: `translateY(${revealed ? 0 : 12}px)`,
        transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Card3D
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
        <CardShine ref={shineRef} />
      </Card3D>
    </CardRevealWrapper>
  );
}

// ContentPanel isolado para manter o useRef do scroll interno limpo
function ContentPanel({
  contentRef,
  containerRef,
  contentVisible,
  meta,
  hardwareUrl,
  systemName,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentVisible: boolean;
  meta: ReturnType<typeof getSystemMetadata>;
  hardwareUrl: string | null;
  systemName: string;
}) {
  // innerScrollTop: posição de scroll virtual do conteúdo interno.
  // É um ref (não state) para não causar re-renders a cada evento wheel.
  const innerScrollTop = useRef(0);
  const innerContentRef = useRef<HTMLDivElement>(null);

  // Reseta scroll interno quando o painel fecha
  useEffect(() => {
    if (!contentVisible) {
      innerScrollTop.current = 0;
      if (innerContentRef.current) {
        innerContentRef.current.style.transform = "translateY(0px)";
      }
    }
  }, [contentVisible]);

  // Wheel handler no containerRef — intercepta TODOS os eventos quando
  // o conteúdo está visível e decide manualmente para onde vai o scroll.
  // Como o containerRef é o único scroll container, não há disputa.
  useEffect(() => {
    const outerEl = containerRef.current;
    if (!outerEl || !contentVisible) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      let px = e.deltaY;
      if (e.deltaMode === 1) px *= 24;
      else if (e.deltaMode === 2) px *= window.innerHeight;

      const inner = innerContentRef.current;
      const viewport = contentRef.current;
      if (!inner || !viewport) return;

      const maxInnerScroll = inner.scrollHeight - viewport.clientHeight;
      const atInnerTop = innerScrollTop.current <= 0;
      const atInnerBottom = innerScrollTop.current >= maxInnerScroll;
      const isUp = px < 0;
      const isDown = px > 0;

      if ((atInnerTop && isUp) || (atInnerBottom && isDown)) {
        // Limites do scroll interno atingidos: redireciona para o outer
        outerEl.scrollBy({ top: px, behavior: "instant" });
      } else {
        // Scroll dentro do conteúdo via translateY
        const next = Math.max(
          0,
          Math.min(maxInnerScroll, innerScrollTop.current + px),
        );
        innerScrollTop.current = next;
        inner.style.transform = `translateY(${-next}px)`;
      }
    };

    // Listener no containerRef (não no contentRef) — assim não há
    // segundo scroll container para o browser considerar no hit test.
    outerEl.addEventListener("wheel", onWheel, { passive: false });
    return () => outerEl.removeEventListener("wheel", onWheel);
  }, [contentVisible, containerRef, contentRef]);

  return (
    <ContentPanelWrapper
      ref={contentRef as React.Ref<HTMLDivElement>}
      $visible={contentVisible}
    >
      {meta ? (
        <ContentLayout>
          {/* LEFT COLUMN - card fixo com descrição + BG do hardware */}
          <LeftColumn>
            <HardwareCard>
              {hardwareUrl && (
                <>
                  <HardwareImage src={hardwareUrl} alt="" />
                  <HardwareOverlay />
                </>
              )}
              <HardwareContent>
                <SystemTitle>{meta.name}</SystemTitle>
                <SystemDescription>{meta.description}</SystemDescription>
              </HardwareContent>
            </HardwareCard>
          </LeftColumn>

          {/* RIGHT COLUMN - cards scrolláveis com parallax 3D */}
          <RightColumn ref={innerContentRef}>
            <CardsContainer>
              <ParallaxCard3D index={0}>
                <CardInner>
                  <CardHeader>
                    <LuCpu />
                    <span>Especificações</span>
                  </CardHeader>
                  <SpecsGrid>
                    {[
                      ["Fabricante", meta.manufacturer],
                      ["Origem", meta.origin_country],
                      ["Tipo", meta.type],
                      ["Geração", meta.generation],
                      ["CPU", meta.cpu],
                      ["Memória", meta.memory],
                      ["Armazenamento", meta.storage],
                      ["Mídia", meta.media],
                      ["SO", meta.os],
                      ["Display", meta.display],
                      ["Gráficos", meta.graphics],
                      ["Som", meta.sound],
                      ["Conectividade", meta.connectivity],
                    ].filter(([, v]) => v).map(([label, value]) => (
                      <SpecItem key={label as string}>
                        <SpecLabel>{label as string}</SpecLabel>
                        <SpecValue>{value as string}</SpecValue>
                      </SpecItem>
                    ))}
                  </SpecsGrid>
                </CardInner>
              </ParallaxCard3D>

              <ParallaxCard3D index={1}>
                <CardInner>
                  <CardHeader>
                    <LuCalendar />
                    <span>Ano de Lançamento</span>
                  </CardHeader>
                  {meta.release_year > 0 ? (
                    <YearValue>{meta.release_year}</YearValue>
                  ) : (
                    <YearUnknown>Desconhecido</YearUnknown>
                  )}
                </CardInner>
              </ParallaxCard3D>

              <ParallaxCard3D index={2}>
                <CardInner>
                  <CardHeader>
                    <LuMonitor />
                    <span>Sistema & Periféricos</span>
                  </CardHeader>
                  {meta.emulators.length > 0 && (
                    <SubSection>
                      <SubLabel>Emuladores</SubLabel>
                      <TagList>
                        {meta.emulators.map((emu) => (
                          <EmuTag key={emu}>{emu}</EmuTag>
                        ))}
                      </TagList>
                    </SubSection>
                  )}
                  {meta.supported_extensions.length > 0 && (
                    <SubSection>
                      <SubLabel>Mídia Suportada</SubLabel>
                      <TagList>
                        {meta.supported_extensions.map((ext) => (
                          <ExtTag key={ext}>{ext}</ExtTag>
                        ))}
                      </TagList>
                    </SubSection>
                  )}
                  {[
                    ["Preço de Lançamento", meta.launch_price],
                    ["Unidades Vendidas", meta.units_sold],
                    ["Predecessor", meta.predecessor],
                    ["Sucessor", meta.successor],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <InfoItem key={label as string}>
                      <SpecLabel>{label as string}</SpecLabel>
                      <SpecValue>{value as string}</SpecValue>
                    </InfoItem>
                  ))}
                </CardInner>
              </ParallaxCard3D>

              <ParallaxCard3D index={3}>
                <CardInner>
                  <CardHeader>
                    <LuBookOpen />
                    <span>Curiosidades</span>
                  </CardHeader>
                  {meta.curiosities.length > 0 ? (
                    <CuriositiesList>
                      {meta.curiosities.map((curiosity, i) => (
                        <CuriosityItem key={i}>
                          <CuriosityDot />
                          {curiosity}
                        </CuriosityItem>
                      ))}
                    </CuriositiesList>
                  ) : (
                    <NoDataText>Nenhuma curiosidade registrada.</NoDataText>
                  )}
                </CardInner>
              </ParallaxCard3D>

              {meta.top_games && meta.top_games.length > 0 && (
                <ParallaxCard3D index={4}>
                  <CardInner>
                    <CardHeaderLarge>
                      <LuStar />
                      <span>Principais Títulos</span>
                    </CardHeaderLarge>
                    <ParallaxSlider games={meta.top_games} />
                  </CardInner>
                </ParallaxCard3D>
              )}
            </CardsContainer>
          </RightColumn>
        </ContentLayout>
      ) : (
        <NotFound>
          <NotFoundContent>
            <LuGamepad2 />
            <NotFoundTitle>Sistema não encontrado</NotFoundTitle>
            <NotFoundSubtitle>
              Nenhum metadado disponível para {systemName}.
            </NotFoundSubtitle>
          </NotFoundContent>
        </NotFound>
      )}
    </ContentPanelWrapper>
  );
}
