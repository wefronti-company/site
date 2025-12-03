import React from 'react';
import Badge from '../../components/ui/Badge';
import ServiceCard from '../../components/ui/ServiceCard';
import { ptBR } from '../../locales/pt-BR';

const Services: React.FC = () => {
	const t = ptBR;

 return (
 <section 
 id="services"
 className="w-full py-20 transition-colors border-b"
 >
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">

	{/* Header stacked above the cards (column layout) */}
	<div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14">
		<Badge text={t.services.badge} icon="rocket" />
		<h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-white mt-6 mb-4">
			{t.services.title}
		</h2>
		<p className="text-lg text-gray-300 max-w-2xl md:mx-auto">
			{t.services.subtitle}
		</p>
	</div>

	{/* Service cards grid */}
	<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
		{t.services.offerings.map((service, index) => (
			<ServiceCard
				key={index}
				title={service.title}
				description={service.description}
				features={service.features}
				timeline={service.timeline}
			/>
		))}
	</div>

 </div>
 </div>
 </section>
 );
};

export default Services;
