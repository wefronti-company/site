import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', isDark = false }) => {
  return (
    <Link href="https://wefronti.com" className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity ${className}`}>
      <Image 
        src={isDark ? "/images/brand/isologo-black.png" : "/images/brand/isologo-white.png"}
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
