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
        width={180} 
        height={40}
        priority
        style={{ width: 'auto', height: '40px' }}
      />
    </Link>
  );
};

export default Logo;
