import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="https://wefronti.com" className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity ${className}`}>
      <Image 
        src="/images/isologo-white.webp"
        alt="Wefronti Logo" 
        width={150} 
        height={150}
        priority
      />
    </Link>
  );
};

export default Logo;
