import React from 'react';
import Image from 'next/image';

const ClientsBadge: React.FC = () => {
  const clientImages = [
    '/images/depoimento-1.webp',
    '/images/depoimento-2.webp',
    '/images/depoimento-3.webp',
    '/images/depoimento-4.webp',
    '/images/depoimento-5.webp',
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10">

      <div className="flex items-center -space-x-2">
        {clientImages.map((image, index) => (
          <Image 
            key={index}
            src={image} 
            alt={`Cliente ${index + 1}`}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full border-2 border-slate-900 object-cover"
            loading="eager"
            quality={75}
          />
        ))}
      </div>
      

      <div className="h-4 w-px bg-white/50"></div>
      
      <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
        Eles aprovam e indicam nossos serviços
      </span>
    </div>
  );
};

export default ClientsBadge;
