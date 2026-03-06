import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header
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
        padding: '0.85rem clamp(1rem, 3vw, 1.5rem)',
        marginTop: '2rem',
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
        <User size={18} strokeWidth={2} />
        Área do assinante
      </Link>
    </header>
  );
}
