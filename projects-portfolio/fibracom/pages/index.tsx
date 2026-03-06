import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Zap, Gauge, Upload, CheckCircle2, FileText, Headphones, Wifi, TrendingUp, Server, ShieldCheck, Cpu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';

const MapSaoPaulo = dynamic(() => import('../components/MapSaoPaulo'), { ssr: false });

type BillingPeriod = 'mensal' | 'trimestral';

const PLANOS = [
  {
    name: 'Fibra Starter',
    megas: '600 Mbps',
    desc: 'Ideal para começar',
    chips: [
      '600 Mbps download',
      '300 Mbps upload',
      'Fibra óptica',
      'Suporte 8h',
      'Instalação inclusa',
    ],
    priceMensal: 99.99,
    priceTrimestral: 89.99,
    descontoTrimestral: 10,
  },
  {
    name: 'Fibra PRO',
    megas: '800 Mbps',
    desc: 'Para quem joga e transmite',
    chips: [
      '800 Mbps download',
      '400 Mbps upload',
      'Fibra óptica',
      'Suporte 12h',
      'Latência otimizada',
    ],
    priceMensal: 149.99,
    priceTrimestral: 131.99,
    descontoTrimestral: 12,
  },
  {
    name: 'Fibra Ultra',
    megas: '1 Gbps',
    desc: 'Máxima performance',
    chips: [
      '1 Gbps download',
      '500 Mbps upload',
      'Fibra óptica',
      'Suporte 24h',
      'Prioridade na rede',
    ],
    priceMensal: 199.99,
    priceTrimestral: 169.99,
    descontoTrimestral: 15,
  },
] as const;

const HERO_CLIENT_IMAGES = [
  '/images/clients/ana-paula-costa.webp',
  '/images/clients/andre-luiz-santos.webp',
  '/images/clients/camila-rocha.webp',
  '/images/clients/juliana-martins.webp',
];

const pulseShadowStyles = `
  @keyframes hero-cta-pulse-shadow {
    0% { box-shadow: 0 0 0 0 rgba(75, 149, 116, 0.45); }
    100% { box-shadow: 0 0 0 14px rgba(75, 149, 116, 0); }
  }
  .hero-cta-pulse {
    animation: hero-cta-pulse-shadow 2s ease-out infinite;
  }
  @keyframes hero-badge-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .hero-badge-float-1 { animation: hero-badge-float 4s ease-in-out infinite; }
  .hero-badge-float-2 { animation: hero-badge-float 3.5s ease-in-out infinite 0.5s; }
  .hero-badge-float-3 { animation: hero-badge-float 4.2s ease-in-out infinite 1s; }
`;

export default function Home() {
  const [billing, setBilling] = useState<BillingPeriod>('mensal');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseShadowStyles }} />
      <Head>
        <title>Fibracom | Internet fibra para gamers e streamers</title>
        <meta name="description" content="Planos de internet fibra para gamers e streamers. Baixa latência, upload de sobra para live e estabilidade para não cair no meio do game." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2rem 2rem 2rem clamp(2rem, 6vw, 4rem)',
          backgroundImage: 'url(/images/hero/background-hero-fibracom.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#e4e4e7',
          isolation: 'isolate',
        }}
      >
        <Header />
        {/* Overlay: gradiente preto da esquerda para direita */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0,0,0,0.35) 60%, transparent 75%)',
            pointerEvents: 'none',
          }}
          aria-hidden
        />
        {/* Badges benefícios - lado direito, efeito vidro + floating */}
        <div
          className="hero-badge-float-1"
          style={{
            position: 'absolute',
            top: '26%',
            right: '22%',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.9rem 1.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4B9574' }}>
            <Zap size={28} strokeWidth={2} />
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#e4e4e7' }}>Latência baixa</span>
        </div>
        <div
          className="hero-badge-float-2"
          style={{
            position: 'absolute',
            top: '44%',
            right: '18%',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.9rem 1.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4B9574' }}>
            <Gauge size={28} strokeWidth={2} />
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#e4e4e7' }}>Planos de até 1GB</span>
        </div>
        <div
          className="hero-badge-float-3"
          style={{
            position: 'absolute',
            top: '62%',
            right: '24%',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.9rem 1.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#4B9574' }}>
            <Upload size={28} strokeWidth={2} />
          </span>
          <span style={{ fontSize: '1.05rem', fontWeight: 500, color: '#e4e4e7' }}>Upload livre</span>
        </div>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
         
          <h1 style={{ fontSize: 'clamp(3rem, 7.5vw, 5rem)', fontWeight: 400, margin: 0, marginBottom: '0.5rem', lineHeight: 1.15 }}>
            Internet fibra para gamers e streamers
          </h1>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 400, opacity: 0.9, margin: 0, marginBottom: '1.5rem', lineHeight: 1.4, textAlign: 'left' }}>
            Baixa latência, upload de sobra para live e estabilidade para não cair no meio do game.
          </h2>
          <a
            href="#planos"
            className="hero-cta-pulse"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2.25rem',
              backgroundColor: '#4B9574',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Assinar agora
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {HERO_CLIENT_IMAGES.map((src, i) => (
                <span
                  key={src}
                  style={{
                    display: 'inline-block',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    marginLeft: i === 0 ? 0 : -10,
                    position: 'relative' as const,
                    zIndex: HERO_CLIENT_IMAGES.length - i,
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', width: 40, height: 40 }}
                  />
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.95rem', color: '#e4e4e7', opacity: 0.9 }}>
              Confiado por mais de 10 mil clientes.
            </span>
          </div>
          </div>
        </div>
      </main>

      <section
        id="planos"
        style={{
          position: 'relative',
          padding: '4rem clamp(1.5rem, 4vw, 3rem)',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          overflow: 'visible',
        }}
      >
        {/* Shape com pico no topo da seção – sobe sobre a hero com margin negativo */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            marginTop: -80,
            lineHeight: 0,
            display: 'block',
          }}
          aria-hidden
        >
          <svg
            viewBox="0 -30 1440 110"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 80, display: 'block' }}
          >
            {/* Pico em (720, -25) sobe para cima */}
            <path
              d="M0 80 L 0 0 L 400 0 L 720 -25 L 1040 0 L 1440 0 L 1440 80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              margin: 0,
              marginBottom: '0.75rem',
              textAlign: 'center',
              color: '#1a1a1a',
            }}
          >
            Planos
          </h2>
          {/* Toggle com dot: Mensal / Trimestral + % off */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 200,
                height: 40,
                borderRadius: 20,
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#e5e5e5',
                display: 'flex',
              }}
            >
              {/* Dot deslizante (atrás do texto) */}
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  left: billing === 'mensal' ? 4 : 102,
                  width: 94,
                  height: 32,
                  borderRadius: 16,
                  background: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  transition: 'left 0.2s ease',
                  pointerEvents: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setBilling('mensal')}
                style={{
                  flex: 1,
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: billing === 'mensal' ? '#0a0a0f' : '#737373',
                  fontFamily: 'inherit',
                }}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setBilling('trimestral')}
                style={{
                  flex: 1,
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: billing === 'trimestral' ? '#0a0a0f' : '#737373',
                  fontFamily: 'inherit',
                }}
              >
                Trimestral
              </button>
            </div>
            {billing === 'trimestral' && (
              <span
                style={{
                  padding: '0.25rem 0.6rem',
                  backgroundColor: '#4B9574',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                Até 15% off
              </span>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              alignItems: 'stretch',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {PLANOS.map((plan) => {
              const price = billing === 'mensal' ? plan.priceMensal : plan.priceTrimestral;
              return (
                <div
                  key={plan.name}
                  style={{
                    padding: '1.75rem',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '14px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      margin: 0,
                      color: '#525252',
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.35rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {plan.megas.split(' ')[0]}
                    <span style={{ fontSize: '0.6em', fontWeight: 600, color: '#737373' }}>
                      {plan.megas.includes('Gbps') ? ' GIGA' : ' MEGA'}
                    </span>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#525252', marginBottom: '0.25rem' }}>{plan.desc}</p>
                  {/* Chips em coluna com ícone */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {plan.chips.map((chip) => (
                      <div
                        key={chip}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#4B9574',
                            flexShrink: 0,
                          }}
                        >
                          <CheckCircle2 size={18} strokeWidth={2} />
                        </span>
                        <span
                          style={{
                            fontSize: '0.9rem',
                            color: '#1a1a1a',
                          }}
                        >
                          {chip}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Preço */}
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1a1a1a' }}>
                      R$ {price.toFixed(2).replace('.', ',')}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#525252' }}>
                      /mês{billing === 'trimestral' ? ' (cobrado trimestralmente)' : ''}
                    </span>
                    {billing === 'trimestral' && (
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'rgba(75, 149, 116, 0.2)',
                          color: '#4B9574',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {plan.descontoTrimestral}% off
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <a
                      href="#area-assinante"
                      style={{
                        display: 'inline-block',
                        padding: '0.65rem 1.25rem',
                        backgroundColor: '#4B9574',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                      }}
                    >
                      Assinar {plan.name.replace('Fibra ', '')}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <p
            style={{
              marginTop: '2.5rem',
              marginBottom: 0,
              maxWidth: 720,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.875rem',
              color: '#525252',
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            Todos os planos e serviços estão sujeitos à viabilidade técnica. Consulte nosso FAQ para conhecer as regras que complementam o contrato de prestação de serviço, bem como os serviços agregados a cada plano.
          </p>
        </div>
      </section>

      <section
        style={{
          padding: '4rem clamp(1.5rem, 4vw, 3rem)',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 25%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 25%), url(/images/background/image-cliente.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 400,
              margin: 0,
              marginBottom: '2rem',
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            É cliente Fibracom?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            {[
              { label: '2ª via', icon: FileText, href: '#2via' },
              { label: 'Suporte', icon: Headphones, href: '#suporte' },
              { label: 'Problemas de conexão', icon: Wifi, href: '#conexao' },
              { label: 'Upgrade de plano', icon: TrendingUp, href: '#upgrade' },
            ].map((item) => {
              const Icon = item.icon;
              return (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                  textDecoration: 'none',
                  color: '#ffffff',
                  aspectRatio: '1',
                  minHeight: 140,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <Icon size={32} strokeWidth={2} />
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, textAlign: 'center', lineHeight: 1.25, color: '#ffffff' }}>
                  {item.label}
                </span>
              </a>
            ); })
          }
          </div>
        </div>
      </section>

      <section
        id="cobertura"
        style={{
          position: 'relative',
          padding: '4rem clamp(1.5rem, 4vw, 3rem)',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1280px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'center',
          }}
          className="cobertura-grid"
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 400,
                margin: 0,
                marginBottom: '1rem',
                color: '#1a1a1a',
              }}
            >
              Área de cobertura
            </h2>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                margin: 0,
                marginBottom: '1rem',
                color: '#444',
              }}
            >
              Atendemos o estado de São Paulo com nossa rede de fibra óptica. 
              Verifique se sua região está coberta e aproveite internet de alta 
              performance para streaming e jogos.
            </p>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.6,
                margin: 0,
                marginBottom: '1.5rem',
                color: '#666',
              }}
            >
              Consulte a disponibilidade na sua cidade e solicite uma visita 
              técnica sem compromisso.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              {[
                { icon: Server, label: 'Servidores entre os melhores do Brasil' },
                { icon: ShieldCheck, label: 'Infraestrutura segura e redundante' },
                { icon: Cpu, label: 'Tecnologia de ponta para baixa latência' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'rgba(75, 149, 116, 0.12)',
                    color: '#2d6b4a',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </div>
            <a
              href="#planos"
              style={{
                display: 'inline-block',
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4B9574',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Assina agora
            </a>
          </div>
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              minHeight: 540,
            }}
          >
            <MapSaoPaulo />
          </div>
        </div>
      </section>
    </>
  );
}
