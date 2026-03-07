import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

export default function Header() {
  return (
    <header
      className="site-header"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem clamp(1.25rem, 4vw, 1.5rem)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'saturate(150%) blur(16px)',
        WebkitBackdropFilter: 'saturate(150%) blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 0,
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image
          src="/images/brand/logo.png"
          alt="Clarus"
          width={125}
          height={38}
          style={{ width: '125px', height: 'auto', maxHeight: '36px', objectFit: 'contain' }}
          priority
        />
      </Link>
      <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <span className="header-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/#servicos" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Serviços
          </Link>
          <Link href="/#sobre" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Sobre
          </Link>
          <Link href="/#contato" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Contato
          </Link>
        </span>
        <Link
          href="/#contato"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            backgroundColor: '#E07A5F',
            color: '#ffffff',
            textDecoration: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            fontSize: '0.95rem',
          }}
        >
          <Calendar size={18} strokeWidth={2} className="header-btn-icon" />
          <span className="header-btn-label-desktop">Agendar consulta</span>
          <span className="header-btn-label-mobile">Agendar</span>
        </Link>
      </nav>
    </header>
  );
}
