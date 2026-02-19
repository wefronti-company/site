import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  isDark?: boolean;
  href?: string;
  ariaLabel?: string;
}

const linkStyle: React.CSSProperties = {
  display: 'inline-block',
  textDecoration: 'none',
};

const imgBaseStyle: React.CSSProperties = {
  objectFit: 'contain',
  maxHeight: 48,
  maxWidth: 160,
};

const Logo: React.FC<LogoProps> = ({
  style,
  isDark = false,
  href = 'https://wefronti.com',
  ariaLabel = 'Wefronti — voltar para a página inicial',
}) => {
  return (
    <Link href={href} aria-label={ariaLabel} style={linkStyle}>
      <Image
        src={isDark ? '/images/brand/isologo-black.webp' : '/images/brand/isologo-white.webp'}
        alt="Wefronti Logo"
        width={160}
        height={43}
        style={{ ...imgBaseStyle, ...style }}
        priority
      />
    </Link>
  );
};

export default Logo;
