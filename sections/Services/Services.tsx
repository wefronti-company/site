import React from 'react';
import Badge from '../../components/ui/Badge';
import ServiceCard from '../../components/ui/ServiceCard';

const Services: React.FC = () => {

 return (
 <section 
 id="services"
 className="w-full py-20 transition-colors border-b"
 >
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">

	{/* Header stacked above the cards (column layout) */}
	<div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14">
		<Badge text="O que fazemos" icon="rocket" />
		<h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-white mt-6 mb-4">
			Serviços
		</h2>
		<p className="text-lg text-gray-300 max-w-2xl md:mx-auto">
			Transformamos suas ideias em realidade digital.
		</p>
	</div>

	{/* Service cards grid */}
	<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
		<ServiceCard
			title="Aplicativo Mobile, Software, Saas."
			description="Criação de sistemas, plataformas, áreas de membros e aplicações web."
			features={[
				'Integrações API',
				'Tecnologias modernas',
				'Sistema escalável',
				'Acompanhamento pós entrega',
				'100% personalizado'
			]}
			timeline="Prazo: 3 à 6 meses"
		/>
		<ServiceCard
			title="Site, Landing Page, E-commerce."
			description="Desenvolvimento web para sites institucionais e loja virtual."
			features={[
				'Responsivo para todas as telas',
				'Design que retém e converte',
				'Manutenção mensal',
				'Estratégias de conversão',
				'100% otimizado'
			]}
			timeline="Prazo: 1 à 2 meses"
		/>
	</div>

 </div>
 </div>
 </section>
 );
};

export default Services;
