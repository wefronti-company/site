import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ProjectCoverCard from '../../components/ProjectCoverCard';
import SectionSparkles from '../../components/SectionSparkles';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

type TestimonialItem = {
  name: string;
  state: string;
  country: string;
  description: string;
  audioSrc?: string;
  projectCoverSrc?: string;
  /** URL do site do projeto — o card da imagem fica clicável e abre direto no site */
  projectLiveUrl?: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Carlos H. Mendes',
    state: 'Minas Gerais',
    country: 'Brasil',
    description: 'Precisávamos de um site rápido e profissional. Entregaram no prazo, bem feito, e já recebemos vários contatos.',
    audioSrc: '/audio/testimonials/carlos-mendes.mp3',
    projectCoverSrc: '/images/portfolio/finora.webp',
    projectLiveUrl:
      process.env.NEXT_PUBLIC_FINORA_URL || 'https://finora.wefronti.com',
  },
  {
    name: 'Fernanda Frigs',
    state: 'Santa Catarina',
    country: 'Brasil',
    description: 'Trabalho de excelência do início ao fim. Comunicação constante, prazos cumpridos.',
    audioSrc: '/audio/testimonials/fernanda-frigs.mp3',
    projectCoverSrc: '/images/testimonials/capa-fernanda.webp',
  },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'transparent',
};

/** Imagem de fundo da seção */
const testimonialsBgImageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/images/brand/background-testimonials.webp)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
};

/** Gradiente: preto no topo e na base, meio da imagem visível */
const testimonialsGradientOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(to bottom, ${colors.background.general} 0%, ${colors.background.general} 18%, transparent 38%, transparent 62%, ${colors.background.general} 82%, ${colors.background.general} 100%)`,
  zIndex: 1,
  pointerEvents: 'none',
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
};

const titleStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  textAlign: 'center',
};

/** Card capa do projeto — acima do card de áudio */
const projectCoverCardStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '16/10',
  borderRadius: 20,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
};

const projectCoverImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const clientColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
  maxWidth: 640,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  textAlign: 'center',
};

/** Card com efeito vidro desfocado */
const cardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[6],
  padding: spacing[6],
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: 'rgba(24, 24, 27, 0.5)',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
};

const playButtonStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.1)',
  color: colors.blue.primary,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'background 0.2s, transform 0.2s',
};

const playerCenterStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
};

const timeDisplayStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.7,
  margin: 0,
  fontVariantNumeric: 'tabular-nums',
};

const photoWrapStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  overflow: 'visible',
  flexShrink: 0,
  position: 'relative' as const,
  border: `2px solid ${colors.blue.primary}`,
};

const photoImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  borderRadius: '50%',
};

const micOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: -2,
  left: -2,
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: colors.blue.primary,
  color: colors.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(24, 24, 27, 0.9)',
};

const progressBarTrackStyle: React.CSSProperties = {
  width: '100%',
  height: 6,
  borderRadius: 9999,
  background: 'rgba(255, 255, 255, 0.15)',
  cursor: 'pointer',
  position: 'relative' as const,
  overflow: 'visible',
};

const progressBarFillStyle = (percent: number): React.CSSProperties => ({
  position: 'absolute' as const,
  left: 0,
  top: 0,
  bottom: 0,
  width: `${percent}%`,
  borderRadius: 9999,
  background: colors.blue.primary,
  transition: percent === 0 ? 'none' : 'width 0.1s linear',
});

const progressBarThumbStyle: React.CSSProperties = {
  position: 'absolute' as const,
  top: '50%',
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: colors.blue.primary,
  boxShadow: '0 0 6px rgba(212, 105, 62, 0.5)',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: spacing[6],
  marginTop: spacing[4],
};

interface TestimonialsProps {
  conteudo?: Record<string, unknown>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setPlayingIndex(null);
      setProgress(0);
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [playingIndex]);

  const getTestimonialPhotoSrc = useCallback((name: string) => {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `/images/testimonials/${slug}.webp`;
  }, []);

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Quem já decolou com a Wefronti';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Empresas que investiram em site ou landing page e hoje vendem mais.';
  const sectionPaddingX = isMd ? spacing[12] : 0;
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
    paddingTop: isMd ? spacing[16] : spacing[10],
    paddingBottom: isMd ? spacing[16] : spacing[10],
  };

  const handlePlayPause = (index: number, audioSrc?: string) => {
    if (!audioSrc) return;
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.play().catch(() => {});
    setPlayingIndex(index);
    setProgress(0);
    setDuration(audio.duration || 0);
  };

  const handleSeek = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (playingIndex !== index || !audioRef.current) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * audioRef.current.duration;
    if (Number.isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const items = Array.isArray(conteudo?.testimonials)
    ? (conteudo.testimonials as TestimonialItem[]).map((t) => ({
        ...t,
        audioSrc: t.audioSrc ?? undefined,
      }))
    : TESTIMONIALS;

  return (
    <section id="depoimentos" style={sectionStyle} aria-labelledby="testimonials-heading">
      <div style={testimonialsBgImageStyle} aria-hidden />
      <div style={testimonialsGradientOverlayStyle} aria-hidden />
      <SectionSparkles />
      <div style={{
        ...innerStyleBase,
        paddingLeft: isMd ? spacing[8] : 0,
        paddingRight: isMd ? spacing[8] : 0,
        gap: isMd ? spacing[12] : spacing[8],
      }}>
        <div style={{
          ...headerStyle,
          gap: isMd ? spacing[6] : spacing[4],
          alignItems: isMd ? 'center' : 'flex-start',
          textAlign: isMd ? 'center' : 'left',
        }}>
          <h2 id="testimonials-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            {titulo}
          </h2>
          <p style={{ ...subtitleStyle, textAlign: isMd ? 'center' : 'left' }}>{subtitulo}</p>
        </div>

        <div style={{ ...gridStyle, gridTemplateColumns: isMd ? '1fr 1fr' : '1fr' }}>
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} style={clientColumnStyle}>
              {item.projectCoverSrc && (
                <ProjectCoverCard href={item.projectLiveUrl} external={!!item.projectLiveUrl}>
                  <div style={projectCoverCardStyle} aria-hidden>
                    <img
                      src={item.projectCoverSrc}
                      alt={`Capa do projeto - ${item.name}`}
                      style={projectCoverImageStyle}
                      loading="lazy"
                    />
                  </div>
                </ProjectCoverCard>
              )}
              <div style={cardStyle}>
              <button
                type="button"
                style={playButtonStyle}
                onClick={() => handlePlayPause(index, item.audioSrc)}
                disabled={!item.audioSrc}
                onMouseEnter={(e) => {
                  if (item.audioSrc) {
                    e.currentTarget.style.background = 'rgba(212, 105, 62, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label={playingIndex === index ? 'Pausar depoimento' : 'Ouvir depoimento em áudio'}
                aria-pressed={playingIndex === index}
              >
                {playingIndex === index ? <Pause size={22} strokeWidth={2.5} /> : <Play size={22} strokeWidth={2.5} style={{ marginLeft: 2 }} />}
              </button>

              <div style={playerCenterStyle}>
                {item.audioSrc && (
                  <>
                    <p style={timeDisplayStyle}>
                      {playingIndex === index ? formatTime(progress) : '00:00'}
                    </p>
                    <div
                      ref={playingIndex === index ? progressBarRef : undefined}
                      style={progressBarTrackStyle}
                      onClick={(e) => handleSeek(index, e)}
                      role="slider"
                      tabIndex={playingIndex === index ? 0 : -1}
                      aria-valuemin={0}
                      aria-valuemax={duration || 100}
                      aria-valuenow={playingIndex === index ? progress : 0}
                      aria-label="Posição do áudio - clique para avançar"
                    >
                      <div style={progressBarFillStyle(playingIndex === index && duration > 0 ? (progress / duration) * 100 : 0)} />
                      <div
                        style={{
                          ...progressBarThumbStyle,
                          left: `${playingIndex === index && duration > 0 ? (progress / duration) * 100 : 0}%`,
                        }}
                        aria-hidden
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={photoWrapStyle} aria-hidden>
                <img
                  src={getTestimonialPhotoSrc(item.name)}
                  alt={`Foto de ${item.name}`}
                  style={photoImageStyle}
                  loading="lazy"
                  decoding="async"
                />
                <span style={micOverlayStyle} aria-hidden>
                  <Mic size={12} strokeWidth={2.5} />
                </span>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
