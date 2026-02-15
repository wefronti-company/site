import React from 'react';
// Using native <img> to avoid Next.js dev warning about CSS resizing

import Link from 'next/link';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  href?: string;
  ariaLabel?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'hero-logo', isDark = false, href = 'https://wefronti.com', ariaLabel = 'Wefronti — voltar para a página inicial' }) => {
  return (
    <Link href={href} aria-label={ariaLabel} className="logo-link">
      <img
        src={isDark ? "/images/brand/isologo-black.webp" : "/images/brand/isologo-white.webp"}
        alt="Wefronti Logo"
        width={120}
        height={32}
        className={className}
        style={{ objectFit: 'contain', maxHeight: 40, maxWidth: 140 }}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
