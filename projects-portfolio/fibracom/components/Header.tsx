import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem clamp(1.5rem, 4vw, 3rem)',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Image
          src="/images/brand/logo.png"
          alt="Fibracom"
          width={160}
          height={48}
          style={{ height: 'auto', maxHeight: '48px', width: 'auto' }}
          priority
        />
      </Link>
      <Link
        href="#area-assinante"
        style={{
          display: 'inline-block',
          padding: '0.6rem 1.25rem',
          backgroundColor: '#0a0a0f',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 500,
          borderRadius: '6px',
          fontSize: '0.95rem',
        }}
      >
        Área do assinante
      </Link>
    </header>
  );
}
