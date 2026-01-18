import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  href?: string;
  ariaLabel?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', isDark = false, href = 'https://wefronti.com', ariaLabel = 'Wefronti — voltar para a página inicial' }) => {
  return (
    <Link href={href} aria-label={ariaLabel} className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity ${className}`}>
      <Image 
        src={isDark ? "/images/brand/isologo-black.webp" : "/images/brand/isologo-white.webp"}
        alt="Wefronti Logo" 
        width={120} 
        height={28}
        priority
        style={{ width: 'auto', height: 'auto', maxHeight: '28px' }}
      />
    </Link>
  );
};

export default Logo;
