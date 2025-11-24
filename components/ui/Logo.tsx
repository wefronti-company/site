import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
 className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
 return (
 <Link href="/" className={`flex items-center gap-2 select-none hover:opacity-80 transition-opacity ${className}`}>
 {/* Logo branco para modo escuro */}
 <Image 
 src="/images/isologo-white.webp" 
 alt="Logo" 
 width={32} 
 height={32}
 className="hidden"
 priority
 />
 {/* Logo preto para modo claro */}
 <Image 
 src="/images/isologo-black.webp" 
 alt="Logo" 
 width={32} 
 height={32}
 className="block"
 priority
 />
 </Link>
 );
};

export default Logo;
