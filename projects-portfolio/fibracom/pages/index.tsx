import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Gauge, Upload, CheckCircle2, FileText, Headphones, Wifi, TrendingUp, Server, ShieldCheck, Cpu, Clock, Gamepad2, Video, Instagram, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<string | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [planosIndex, setPlanosIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (!mq.matches) return;
    const t = setInterval(() => setPlanosIndex((i) => (i + 1) % PLANOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const openAssinarModal = (planName: string) => {
    setModalPlan(planName);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalPlan(null);
    setFormNome('');
    setFormEmail('');
    setFormWhatsapp('');
  };
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar para API
    closeModal();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pulseShadowStyles }} />
      <Head>
        <title>Fibracom | Internet fibra para gamers e streamers</title>
        <meta name="description" content="Planos de internet fibra para gamers e streamers. Baixa latência, upload de sobra para live e estabilidade para não cair no meio do game." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        className="hero-main"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2rem 0 2rem 0',
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
        <div className="hero-badges-mobile-hide" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
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
          <div className="hero-content-inner" style={{ maxWidth: '680px' }}>
         
          <h1 style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', fontWeight: 400, margin: 0, marginBottom: '0.5rem', lineHeight: 1.15 }}>
          Internet de alta performance para gamers e streamers
          </h1>
          <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 400, opacity: 0.9, margin: 0, marginBottom: '1.5rem', lineHeight: 1.4, textAlign: 'left' }}>
          Conexão estável, baixa latência e upload ideal para lives e partidas sem interrupções.
          </h2>
          <a
            href="#planos"
            className="hero-cta-pulse hero-cta"
            style={{
              display: 'inline-block',
              padding: '1rem 2.25rem',
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
          overflow: 'hidden',
        }}
      >
        <div
          className="planos-grain"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/grain.svg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '64px 64px',
            backgroundPosition: '0 0',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <div
          className="planos-inner"
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1190px',
            margin: '0 auto',
            paddingLeft: 'clamp(1.25rem, 4vw, 1.5rem)',
            paddingRight: 'clamp(1.25rem, 4vw, 1.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            className="section-title"
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
              className="planos-toggle-wrap"
              style={{
                position: 'relative',
                width: 200,
                height: 40,
                borderRadius: 20,
                border: '1px solid rgba(75, 149, 116, 0.45)',
                background: 'rgba(75, 149, 116, 0.10)',
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
                  border: '1px solid rgba(75, 149, 116, 0.35)',
                  boxShadow: '0 2px 6px rgba(75, 149, 116, 0.15)',
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
          {/* Desktop: grid layout - escondido em mobile */}
          <div
            className="planos-cards-grid planos-desktop"
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
                    backgroundColor: 'rgba(75, 149, 116, 0.10)',
                    borderRadius: '14px',
                    border: '1px solid rgba(75, 149, 116, 0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0, color: '#525252' }}>{plan.name}</h3>
                  <p style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {plan.megas.split(' ')[0]}
                    <span style={{ fontSize: '0.6em', fontWeight: 600, color: '#737373' }}>{plan.megas.includes('Gbps') ? ' GIGA' : ' MEGA'}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#525252', marginBottom: '0.25rem' }}>{plan.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {plan.chips.map((chip) => (
                      <div key={chip} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B9574', flexShrink: 0 }}>
                          <CheckCircle2 size={18} strokeWidth={2} />
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#1a1a1a' }}>{chip}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: 700, color: '#1a1a1a' }}>R$ {price.toFixed(2).replace('.', ',')}</span>
                    <span style={{ fontSize: '0.9rem', color: '#525252' }}>/mês{billing === 'trimestral' ? ' (cobrado trimestralmente)' : ''}</span>
                    {billing === 'trimestral' && (
                      <span style={{ padding: '0.2rem 0.5rem', backgroundColor: 'rgba(75, 149, 116, 0.2)', color: '#4B9574', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{plan.descontoTrimestral}% off</span>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <button type="button" onClick={() => openAssinarModal(plan.name)} style={{ display: 'block', width: '100%', padding: '1rem 1.25rem', backgroundColor: '#4B9574', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', textAlign: 'center', boxSizing: 'border-box' }}>
                      Assinar {plan.name.replace('Fibra ', '')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Mobile: carrossel - escondido em desktop */}
          <div className="planos-cards-wrap planos-mobile" style={{ overflow: 'hidden', width: '100%', margin: '0 auto' }}>
            <div
              className="planos-cards-track"
              style={{
                display: 'flex',
                width: '300%',
                transform: `translateX(-${planosIndex * (100 / 3)}%)`,
                transition: 'transform 0.35s ease-out',
              }}
            >
              {PLANOS.map((plan) => {
                const price = billing === 'mensal' ? plan.priceMensal : plan.priceTrimestral;
                return (
                  <div
                    key={plan.name}
                    className="planos-slide"
                    style={{
                      width: '33.333%',
                      flexShrink: 0,
                      padding: '0 0.25rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        padding: '1.75rem',
                        backgroundColor: 'rgba(75, 149, 116, 0.10)',
                        borderRadius: '14px',
                        border: '1px solid rgba(75, 149, 116, 0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        height: '100%',
                        boxSizing: 'border-box',
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {plan.chips.map((chip) => (
                          <div key={chip} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B9574', flexShrink: 0 }}>
                              <CheckCircle2 size={18} strokeWidth={2} />
                            </span>
                            <span style={{ fontSize: '0.9rem', color: '#1a1a1a' }}>{chip}</span>
                          </div>
                        ))}
                      </div>
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
                        <button
                          type="button"
                          onClick={() => openAssinarModal(plan.name)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '1rem 1.25rem',
                            backgroundColor: '#4B9574',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            fontFamily: 'inherit',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                          }}
                        >
                          Assinar {plan.name.replace('Fibra ', '')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="planos-carousel-arrows"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setPlanosIndex((i) => (i - 1 + PLANOS.length) % PLANOS.length)}
                aria-label="Plano anterior"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid rgba(75, 149, 116, 0.5)',
                  background: 'rgba(75, 149, 116, 0.12)',
                  color: '#4B9574',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={24} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setPlanosIndex((i) => (i + 1) % PLANOS.length)}
                aria-label="Próximo plano"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid rgba(75, 149, 116, 0.5)',
                  background: 'rgba(75, 149, 116, 0.12)',
                  color: '#4B9574',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={24} strokeWidth={2} />
              </button>
            </div>
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
          padding: '5.5rem clamp(1.5rem, 4vw, 3rem)',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, transparent 55%), linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, transparent 55%), url(/images/background/image-cliente.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#1a1a1a',
        }}
      >
        <div
          className="cliente-inner"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            className="section-title"
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
            className="cliente-boxes-grid"
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
                className="cliente-box"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem 1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid rgba(75, 149, 116, 0.3)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  textDecoration: 'none',
                  aspectRatio: '1',
                  minHeight: 140,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B9574' }}>
                  <Icon size={32} strokeWidth={2} />
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.25, color: '#1a1a1a' }}>
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
        className="cobertura-section"
        style={{
          position: 'relative',
          padding: '4rem clamp(1.5rem, 4vw, 3rem)',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          overflow: 'hidden',
        }}
      >
        <div
          className="cobertura-grain"
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/grain.svg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '64px 64px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1190px',
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
          <div className="cobertura-texts">
            <h2
              className="section-title"
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
              className="cobertura-p"
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
              className="cobertura-p"
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
              className="cobertura-chips"
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
                  className="cobertura-chip"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(75, 149, 116, 0.12)',
                    color: '#2d6b4a',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    border: '1px solid rgba(75, 149, 116, 0.45)',
                  }}
                >
                  <Icon size={20} strokeWidth={2} style={{ flexShrink: 0 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div
            className="cobertura-map-wrap"
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              minHeight: 520,
            }}
          >
            <MapSaoPaulo />
          </div>
        </div>
      </section>

      <section
        id="cta"
        style={{
          position: 'relative',
          padding: '5.5rem clamp(1.5rem, 4vw, 3rem)',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 70%), linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 70%), url(/images/background/background-cta-fibracom.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#1a1a1a',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1190px',
            margin: '0 auto',
            paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 400,
              margin: 0,
              marginBottom: '2.5rem',
              textAlign: 'center',
              color: '#ffffff',
              lineHeight: 1.35,
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Seja para fazer lives ou jogar com os amigos, Fibracom é sua melhor parceira!
          </h2>
          <div
            className="cta-benefits-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {[
              { icon: Clock, title: 'Ping baixo', desc: 'Latência otimizada para não atrapalhar suas partidas.' },
              { icon: Upload, title: 'Upload de sobra', desc: 'Transmita em alta qualidade sem travar a conexão.' },
              { icon: Gamepad2, title: 'Feita para jogar', desc: 'Prioridade na rede para jogos e streaming.' },
              { icon: Video, title: 'Ideal para live', desc: 'Upload robusto para Twitch, YouTube e afins.' },
              { icon: Zap, title: 'Alta velocidade', desc: 'Até 1 Gbps para download e upload simultâneos.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="cta-benefit-card"
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid rgba(75, 149, 116, 0.3)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#4B9574', marginRight: '0.75rem', flexShrink: 0 }}>
                  <Icon size={28} strokeWidth={2} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, marginBottom: '0.35rem', color: '#1a1a1a' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: '#525252', lineHeight: 1.4 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', margin: 0 }}>
            <a
              href="#planos"
              className="hero-cta-pulse hero-cta"
              style={{
                display: 'inline-block',
                padding: '1rem 2.25rem',
                backgroundColor: '#4B9574',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Assinar agora
            </a>
          </p>
        </div>
      </section>

      <footer
        style={{
          padding: '6.5rem clamp(1rem, 3vw, 1.5rem) 4.5rem',
          backgroundColor: '#000000',
          color: '#a3a3a3',
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
          <div className="footer-left">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1.25rem', textDecoration: 'none' }}>
              <Image
                src="/images/brand/logo.png"
                alt="Fibracom"
                width={125}
                height={38}
                style={{ width: '125px', height: 'auto', maxHeight: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p style={{ margin: 0, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d4d4d4' }}>
              Receba ofertas e promoções
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Seu e-mail"
                aria-label="E-mail para newsletter"
                style={{
                  width: '220px',
                  maxWidth: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="button"
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#4B9574',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cadastrar
              </button>
            </div>
          </div>
          <div className="footer-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20%', backgroundColor: '#ffffff', color: '#4B9574' }}>
                <Instagram size={20} strokeWidth={2} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20%', backgroundColor: '#ffffff', color: '#4B9574' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20%', backgroundColor: '#ffffff', color: '#4B9574' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20%', backgroundColor: '#ffffff', color: '#4B9574' }}>
                <Youtube size={20} strokeWidth={2} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20%', backgroundColor: '#ffffff', color: '#4B9574' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#737373', textAlign: 'right' }}>
              <span>Política de privacidade</span>
              <span style={{ margin: '0 0.5rem' }}>·</span>
              <span>Termos de uso</span>
            </div>
          </div>
        </div>
        <p style={{ margin: '3rem 0 0', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', textAlign: 'left', color: '#737373', maxWidth: '1190px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: 'clamp(1rem, 3vw, 1.5rem)', paddingRight: 'clamp(1rem, 3vw, 1.5rem)' }}>
          © {new Date().getFullYear()} Fibracom. Todos os direitos reservados.
        </p>
      </footer>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={closeModal}
        >
          <div
            className="modal-content-wrap"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 id="modal-title" style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, color: '#1a1a1a' }}>
                {modalPlan ? `Assinar ${modalPlan.replace('Fibra ', '')}` : 'Solicitar contato'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Fechar"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  color: '#737373',
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <label htmlFor="modal-nome" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
                Nome
              </label>
              <input
                id="modal-nome"
                type="text"
                placeholder="Seu nome"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <label htmlFor="modal-email" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
                E-mail
              </label>
              <input
                id="modal-email"
                type="email"
                placeholder="seu@email.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <label htmlFor="modal-whatsapp" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
                WhatsApp
              </label>
              <input
                id="modal-whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formWhatsapp}
                onChange={(e) => setFormWhatsapp(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  marginBottom: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4B9574',
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
        </div>
      )}
    </>
  );
}
