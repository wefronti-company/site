import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

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
        maxWidth: '1190px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem clamp(1.25rem, 4vw, 1.5rem)',
        marginTop: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image
          src="/images/brand/logo.png"
          alt="Fibracom"
          width={125}
          height={38}
          style={{ width: '125px', height: 'auto', maxHeight: '36px', objectFit: 'contain' }}
          priority
        />
      </Link>
      <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <span className="header-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/#planos" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Planos
          </Link>
          <Link href="/#cobertura" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Área de cobertura
          </Link>
          <Link href="/#cta" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
            Assine já
          </Link>
        </span>
        <Link
          href="/area-assinante"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            backgroundColor: '#ffffff',
            color: '#0a0a0f',
            textDecoration: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            fontSize: '0.95rem',
          }}
        >
          <User size={18} strokeWidth={2} className="header-btn-icon" />
          <span className="header-btn-label-desktop">Área do assinante</span>
          <span className="header-btn-label-mobile">Entrar</span>
        </Link>
      </nav>
    </header>
  );
}
