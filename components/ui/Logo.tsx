import React from 'react';
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
      <img
        src={isDark ? '/images/brand/isologo-black.webp' : '/images/brand/isologo-white.webp'}
        alt="Wefronti Logo"
        width={140}
        height={38}
        style={{ ...imgBaseStyle, ...style }}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
