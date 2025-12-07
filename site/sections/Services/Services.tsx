import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import ButtonCta from '../../components/ui/ButtonCta';

const services = [
  { 
    name: 'App Mobile',
    description: 'Aplicativos nativos e híbridos para iOS e Android com performance otimizada e experiência fluida.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    )
  },
  { 
    name: 'Sistema Web',
    description: 'Sistemas web robustos e escaláveis para gerenciar processos complexos do seu negócio.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    )
  },
  { 
    name: 'SaaS',
    description: 'Plataformas como serviço completas, prontas para escalar e gerar receita recorrente.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    )
  },
  { 
    name: 'Dashboard',
    description: 'Painéis analíticos interativos para visualizar dados e métricas em tempo real.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  { 
    name: 'E-commerce',
    description: 'Lojas virtuais completas com checkout otimizado, gestão de produtos e integrações de pagamento.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    )
  },
  { 
    name: 'API Integration',
    description: 'Integrações seguras com APIs externas, conectando sistemas e automatizando processos.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    )
  },
  { 
    name: 'Site',
    description: 'Sites institucionais modernos e responsivos que fortalecem sua presença digital.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  { 
    name: 'Checkout Page',
    description: 'Páginas de checkout otimizadas para conversão máxima com experiência de pagamento rápida.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )
  },
];

const Services: React.FC = () => {
 const [isVisible, setIsVisible] = useState(false);
 const sectionRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
   const observer = new IntersectionObserver(
     ([entry]) => {
       if (entry.isIntersecting) {
         setIsVisible(true);
       } else {
         setIsVisible(false);
       }
     },
     { threshold: 0.2 }
   );

   if (sectionRef.current) {
     observer.observe(sectionRef.current);
   }

   return () => observer.disconnect();
 }, []);

 return (
 <section 
 ref={sectionRef}
 id="services"
 className="w-full py-20 md:py-40 transition-colors border-b"
 style={{ borderBottomColor: colors.borderDark }}
 >
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">

	{/* Header */}
	<div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14 flex flex-col items-start md:items-center">
		<motion.div 
			className="mb-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md bg-white/5 border border-white/10"
			initial={{ opacity: 0, y: 20 }}
			animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
				<defs>
					<linearGradient id="servicesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: colors.gradientOne }} />
						<stop offset="100%" style={{ stopColor: colors.gradientTwo }} />
					</linearGradient>
				</defs>
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#servicesGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
			<span className="text-xs font-regular text-white whitespace-nowrap">
				O que fazemos
			</span>
		</motion.div>
		<motion.h2 
			className="text-4xl md:text-4xl lg:text-5xl font-medium mt-4 mb-3 bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent"
			initial={{ opacity: 0, y: 20 }}
			animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
		>
			Serviços
		</motion.h2>
		<motion.p 
			className="text-xl text-gray-300 max-w-2xl md:mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
		>
			Transformamos suas ideias em realidade digital.
		</motion.p>
	</div>

	{/* Service cards grid - 4x4 */}
	<motion.div 
		className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
		initial={{ opacity: 0, y: 30 }}
		animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
		transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
	>
		
		{services.map((service, index) => (
			<div 
				key={index}
				className="group relative p-5 rounded-[10px] bg-gradient-to-br from-white/5 to-white/[0.02] transition-all duration-500 hover:-translate-y-1"
				style={{ background: colors.cardsColor, borderWidth: '1px', borderColor: colors.borderDark }}
			>
				
				<div className="relative z-10">
					{/* Icon */}
					<div 
						className="w-10 h-10 rounded-[60px] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
						style={{
							background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
							borderWidth: '1px',
							borderColor: colors.whiteColor
						}}
					>
						<div className="w-5 h-5 flex items-center justify-center" style={{ color: colors.blackColor }}>
							{service.icon}
						</div>
					</div>

					{/* Title */}
					<h3 className="font-semibold text-white mb-2" style={{ fontSize: '20px' }}>
						{service.name}
					</h3>

					{/* Description */}
					<p className="text-gray-400 leading-relaxed" style={{ fontSize: '14px' }}>
						{service.description}
					</p>
				</div>
			</div>
		))}

	</motion.div>

	{/* CTA Section */}
	<motion.div 
		className="mt-16 md:mt-20 text-center flex flex-col items-center"
		initial={{ opacity: 0, y: 30 }}
		animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
		transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
	>
		<h3 className="text-3xl md:text-4xl font-medium text-white mb-4">
			Pronto para transformar sua ideia em realidade?
		</h3>
		<p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto whitespace-nowrap">
			Entre em contato conosco e descubra como podemos ajudar seu negócio a crescer.
		</p>
		<ButtonCta label="Iniciar um projeto" />
	</motion.div>

 </div>
 </div>
 </section>
 );
};

export default Services;
