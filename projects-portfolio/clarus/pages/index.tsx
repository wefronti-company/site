import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Pencil, RefreshCw, Sparkles, Instagram, CircleAlert, Calendar, ShieldCheck, Award, Clock, Palette, UserCheck } from 'lucide-react';
const CORAL = '#C8293F';

const CAROUSEL_TEXTS = [
  'Poucos horários disponíveis!',
  'Agende já sua avaliação',
  'Últimas vagas da semana',
] as const;
const CORAL_LIGHT = 'rgba(200, 41, 63, 0.12)';
const CORAL_BORDER = 'rgba(200, 41, 63, 0.35)';

const SERVICES = [
  {
    icon: Pencil,
    title: 'Contorno labial',
    desc: 'Definição do arco de cupido e bordas dos lábios com micropigmentação para um resultado natural e duradouro.',
  },
  {
    icon: Heart,
    title: 'Preenchimento labial',
    desc: 'Aplicação de pigmentos na área interna dos lábios para cor e volume sem precisar de maquiagem.',
  },
  {
    icon: RefreshCw,
    title: 'Correção de assimetria',
    desc: 'Ajuste fino para equilibrar o formato dos lábios e harmonizar a região da boca.',
  },
  {
    icon: Sparkles,
    title: 'Retoque e manutenção',
    desc: 'Sessões de retoque para manter a cor e o delineamento com o passar do tempo.',
  },
  {
    icon: Palette,
    title: 'Correção de cor',
    desc: 'Ajuste e retoque de pigmentos que perderam intensidade ou mudaram de tom ao longo do tempo.',
  },
  {
    icon: UserCheck,
    title: 'Design personalizado',
    desc: 'Avaliação individual para definir o formato e a cor ideal dos lábios de cada pessoa.',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Clarus | Micropigmentação Labial</title>
        <meta name="description" content="Especialistas em micropigmentação labial. Contorno, preenchimento e correção com resultado natural. Agende sua avaliação." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f11',
          color: '#e4e4e7',
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 0,
            backgroundImage: 'url(/images/background/background-hero-clarus.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Carrossel urgência - duplo (igual Wefronti) */}
          <div
            style={{
              width: '100vw',
              position: 'absolute' as const,
              top: 0,
              left: '50%',
              marginLeft: '-50vw',
              overflow: 'hidden',
              zIndex: 10,
              padding: '0.75rem 0',
            }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
@keyframes clarus-carousel-scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(calc(-100% / 6), 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .clarus-carousel-track { animation: none !important; }
}
                `.trim(),
              }}
            />
            {(() => {
              const items = [...CAROUSEL_TEXTS, ...CAROUSEL_TEXTS, ...CAROUSEL_TEXTS, ...CAROUSEL_TEXTS, ...CAROUSEL_TEXTS, ...CAROUSEL_TEXTS];
              const badgeStyle: React.CSSProperties = {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#331213',
                fontSize: '0.9rem',
                fontWeight: 500,
                whiteSpace: 'nowrap' as const,
                flexShrink: 0,
              };
              return (
                <div
                  className="clarus-carousel-track"
                  style={{
                    display: 'flex',
                    width: 'max-content',
                    gap: '1rem',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden' as const,
                    animation: 'clarus-carousel-scroll 40s linear infinite',
                  }}
                  aria-hidden
                >
                  {items.map((text, i) => (
                    <span key={`${text}-${i}`} style={badgeStyle}>
                      <CircleAlert size={18} strokeWidth={2} style={{ flexShrink: 0, color: '#C8293F' }} />
                      {text}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
          <div
            className="hero-content"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: '1190px',
              margin: '0 auto',
              paddingLeft: 'clamp(1.25rem, 4vw, 1.5rem)',
              paddingRight: 'clamp(1.25rem, 4vw, 1.5rem)',
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <div style={{ maxWidth: '620px' }}>
              <Image
                src="/images/brand/logo.png"
                alt="Clarus"
                width={140}
                height={44}
                style={{ width: 'auto', height: '44px', maxWidth: '180px', marginBottom: '1.5rem', display: 'block' }}
              />
              <h1
                className="clarus-title"
                style={{
                  fontFamily: "'IBM Plex Serif', Georgia, serif",
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: '1rem',
                  lineHeight: 1.15,
                  color: '#331213',
                }}
              >
                Micropigmentação labial com resultado natural
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                  margin: 0,
                  marginBottom: '2rem',
                  lineHeight: 1.5,
                  color: '#331213',
                }}
              >
                Especialistas em micro nos lábios. Contorno, preenchimento e correção com técnica e cuidado para um resultado que valoriza sua beleza.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <Link
                  href="#contato"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 1.75rem',
                    backgroundColor: '#C8293F',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    fontSize: '1rem',
                  }}
                >
                  <Calendar size={20} strokeWidth={2} style={{ flexShrink: 0 }} />
                  Agendar avaliação
                </Link>
                <Link
                  href="#servicos"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 1.75rem',
                    backgroundColor: 'transparent',
                    color: '#331213',
                    textDecoration: 'none',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    border: '2px solid #331213',
                  }}
                >
                  Procedimentos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios Clarus */}
        <div
          style={{
            backgroundColor: '#C8293F',
            padding: '2rem clamp(1.5rem, 4vw, 3rem)',
          }}
        >
          <div
            style={{
              maxWidth: '1190px',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {[
              { icon: ShieldCheck, label: 'Segurança e higiene' },
              { icon: Sparkles, label: 'Resultado natural' },
              { icon: Award, label: 'Técnica profissional' },
              { icon: Clock, label: 'Durabilidade' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#ffffff',
                }}
              >
                <Icon size={24} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Serviços / Procedimentos */}
        <section
          id="servicos"
          style={{
            padding: '5rem clamp(1.5rem, 4vw, 3rem)',
            backgroundColor: '#FFE9E2',
            color: '#1a1a1a',
          }}
        >
          <div
            style={{
              maxWidth: '1190px',
              margin: '0 auto',
              paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
              paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
              boxSizing: 'border-box',
            }}
          >
            <h2
              className="clarus-title"
              style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                margin: 0,
                marginBottom: '0.5rem',
                color: '#331213',
                textAlign: 'center',
              }}
            >
              Micropigmentação labial
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#52525b',
                textAlign: 'center',
                margin: 0,
                marginBottom: '3rem',
                maxWidth: 540,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Procedimentos focados exclusivamente em micro nos lábios, com técnica e cuidado para um resultado natural.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              {SERVICES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    padding: '2rem',
                    backgroundColor: CORAL_LIGHT,
                    border: `1px solid ${CORAL_BORDER}`,
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ display: 'flex', color: CORAL, marginBottom: '1rem' }}>
                    <Icon size={32} strokeWidth={2} />
                  </span>
                  <h3 className="clarus-title" style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, margin: 0, marginBottom: '0.5rem', color: '#331213' }}>
                    {title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#52525b' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          style={{
            padding: '5rem clamp(1.5rem, 4vw, 3rem)',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
          }}
        >
          <div
            style={{
              maxWidth: '1190px',
              margin: '0 auto',
              paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
              paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
              boxSizing: 'border-box',
            }}
          >
            <h2
              className="clarus-title"
              style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                margin: 0,
                marginBottom: '0.5rem',
                color: '#331213',
                textAlign: 'center',
              }}
            >
              Como funciona
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: '#52525b',
                textAlign: 'center',
                margin: 0,
                marginBottom: '3rem',
                maxWidth: 540,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Do início ao fim, acompanhe cada etapa do procedimento.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'flex-start',
                position: 'relative',
              }}
            >
              {[
                { step: 1, title: 'Avaliação', desc: 'Consulta para análise do formato dos lábios e definição do melhor procedimento e cor.', img: '/images/processo/etapa-1.jpg' },
                { step: 2, title: 'Preparação', desc: 'Higienização e preparo da área para receber os pigmentos com segurança.', img: '/images/processo/etapa-2.jpg' },
                { step: 3, title: 'Aplicação', desc: 'Micropigmentação realizada com técnica e cuidado para um resultado natural.', img: '/images/processo/etapa-3.jpg' },
                { step: 4, title: 'Resultado', desc: 'Finalização e orientações para cuidados pós-procedimento e durabilidade.', img: '/images/processo/etapa-4.jpg' },
              ].map((item, index) => (
                <div
                  key={item.step}
                  style={{
                    flex: '1 1 220px',
                    maxWidth: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {index > 0 && (
                    <div
                      className="clarus-timeline-connector"
                      style={{
                        position: 'absolute',
                        left: '-1rem',
                        top: '80px',
                        width: '2rem',
                        height: 2,
                        backgroundColor: CORAL_BORDER,
                      }}
                      aria-hidden
                    />
                  )}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      backgroundColor: '#FFE9E2',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={`Etapa ${item.step}: ${item.title}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.clarus-step-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'clarus-step-placeholder';
                          placeholder.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:700;color:rgba(200,41,63,0.3);font-family:serif';
                          placeholder.textContent = String(item.step);
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: CORAL,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.step}
                  </span>
                  <h3
                    className="clarus-title"
                    style={{
                      fontFamily: "'IBM Plex Serif', Georgia, serif",
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      margin: 0,
                      marginBottom: '0.5rem',
                      color: '#331213',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#52525b' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sobre */}
        <section
          id="sobre"
          style={{
            padding: '5rem clamp(1.5rem, 4vw, 3rem)',
            backgroundColor: '#18181b',
            color: '#e4e4e7',
          }}
        >
          <div
            style={{
              maxWidth: '1190px',
              margin: '0 auto',
              paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
              paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            <h2
              className="clarus-title"
              style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                margin: 0,
                marginBottom: '1rem',
                color: '#ffffff',
              }}
            >
              Sobre a Clarus
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                maxWidth: 640,
                margin: '0 auto',
                color: '#a1a1aa',
              }}
            >
              Especialistas em micropigmentação labial. Nosso foco é exclusivamente micro nos lábios: contorno, 
              preenchimento e correção com técnica, segurança e resultado natural.
            </p>
          </div>
        </section>

        {/* CTA / Contato */}
        <section
          id="contato"
          style={{
            padding: '5rem clamp(1.5rem, 4vw, 3rem)',
            backgroundColor: 'rgba(224, 122, 95, 0.12)',
            borderTop: '1px solid rgba(224, 122, 95, 0.2)',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '2.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(224, 122, 95, 0.3)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            <h2
              className="clarus-title"
              style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
                fontWeight: 500,
                margin: 0,
                marginBottom: '0.5rem',
                color: '#1a1a1a',
                textAlign: 'center',
              }}
            >
              Agende sua avaliação
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#52525b',
                textAlign: 'center',
                margin: 0,
                marginBottom: '2rem',
              }}
            >
              Entre em contato pelo WhatsApp ou preencha o formulário.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <input
                type="text"
                placeholder="Nome"
                aria-label="Nome"
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="tel"
                placeholder="Telefone / WhatsApp"
                aria-label="Telefone"
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.9rem 1.5rem',
                  backgroundColor: '#C8293F',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '4rem clamp(1rem, 3vw, 1.5rem) 2rem',
            backgroundColor: '#0f0f11',
            color: '#71717a',
          }}
        >
          <div
            style={{
              maxWidth: '1190px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              alignItems: 'start',
            }}
            className="footer-grid"
          >
            <div>
              <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' }}>
                <Image
                  src="/images/brand/logo.png"
                  alt="Clarus"
                  width={125}
                  height={38}
                  style={{ width: '125px', height: 'auto', maxHeight: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                />
              </Link>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#a1a1aa' }}>
                Especialistas em micropigmentação labial.
              </p>
            </div>
            <div
              className="footer-right"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '20%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#C8293F',
                }}
              >
                <Instagram size={20} strokeWidth={2} />
              </a>
            </div>
          </div>
          <p
            style={{
              margin: '2rem 0 0',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.85rem',
              textAlign: 'left',
              color: '#52525b',
            }}
          >
            © {new Date().getFullYear()} Clarus. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </>
  );
}
