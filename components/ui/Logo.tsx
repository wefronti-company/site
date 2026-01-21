import React from 'react';
// Using native <img> to avoid Next.js dev warning about CSS resizing

import Link from 'next/link';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  href?: string;
  ariaLabel?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', isDark = false, href = 'https://wefronti.com', ariaLabel = 'Wefronti — voltar para a página inicial' }) => {
  return (
    <Link href={href} aria-label={ariaLabel} className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity`}>
      <img
        src={isDark ? "/images/brand/isologo-black.webp" : "/images/brand/isologo-white.webp"}
        alt="Wefronti Logo"
        width={120}
        height={32}
        className={className}
        style={{ width: 'auto', height: 'auto', maxWidth: '120px', maxHeight: '32px' }}
        loading="eager"
      />
    </Link>
  );
};

export default Logo;
