import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
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
  href = 'https://wefronti.com',
  ariaLabel = 'Wefronti — voltar para a página inicial',
}) => {
  return (
    <Link href={href} aria-label={ariaLabel} style={linkStyle}>
      <Image
        src="/images/brand/isologo-wefronti.webp"
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
