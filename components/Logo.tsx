import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity ${className}`}>
      {/* Logo escuro para fundo claro, logo claro para fundo escuro */}
      <Image 
        src="/images/isologo-white.webp" 
        alt="Logo" 
        width={122} 
        height={122}
        className="block dark:block"
        priority
      />
    </Link>
  );
};

export default Logo;
