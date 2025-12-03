import React from 'react';
 
import Badge from '../../components/ui/Badge';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { colors } from '../../styles/colors';

// world map removed — we don't render a background there anymore

const Clients: React.FC = () => {

 return (
 <section 
 id="clients"
 className="w-full py-20 transition-colors border-b"
 style={{
	 borderBottomColor: colors.borderDark
 }}
 >
 {/* Cabeçalho */}
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">
 <div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14">
 <Badge icon="heart" text="Depoimentos" />
 <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-white mt-6 mb-4">
 O que nossos clientes dizem sobre nós
 </h2>
 <p className="text-lg text-gray-300 max-w-2xl md:mx-auto">
 Clientes satisfeitos ao redor do mundo, conectados por nossas soluções digitais.
 </p>
 </div>
 </div>
 </div>

 {/* Depoimentos - Carrossel Infinito - Full Width */}
 <div className="mt-8 relative">
 <div className="relative overflow-hidden">
 {/* Container do carrossel */}
 <div className="flex gap-6 animate-scroll">
 {/* Primeira cópia */}
 <TestimonialCard name="Carlos Henrique" role="CEO" company="TechFlow Solutions" text="A Wefronti transformou completamente nossa visão em realidade. O app desenvolvido superou todas as expectativas em funcionalidade e design." rating={5} image="/images/depoimento-1.webp" />
 <TestimonialCard name="Mariana Costa" role="Diretora de Marketing" company="Innovate Corp" text="O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês." rating={5} image="/images/depoimento-2.webp" />
 <TestimonialCard name="Roberto Almeida" role="Fundador" company="StartupXYZ" text="Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente." rating={5} image="/images/depoimento-3.webp" />
 <TestimonialCard name="Julia Santos" role="Gerente de Projetos" company="Digital Solutions" text="A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido." rating={5} image="/images/depoimento-4.webp" />
 <TestimonialCard name="André Ferreira" role="CTO" company="FinTech Pro" text="Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita." rating={5} image="/images/depoimento-5.webp" />
 {/* Segunda cópia - para loop infinito */}
 <TestimonialCard name="Carlos Henrique" role="CEO" company="TechFlow Solutions" text="A Wefronti transformou completamente nossa visão em realidade. O app desenvolvido superou todas as expectativas em funcionalidade e design." rating={5} image="/images/depoimento-1.webp" />
 <TestimonialCard name="Mariana Costa" role="Diretora de Marketing" company="Innovate Corp" text="O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês." rating={5} image="/images/depoimento-2.webp" />
 <TestimonialCard name="Roberto Almeida" role="Fundador" company="StartupXYZ" text="Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente." rating={5} image="/images/depoimento-3.webp" />
 <TestimonialCard name="Julia Santos" role="Gerente de Projetos" company="Digital Solutions" text="A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido." rating={5} image="/images/depoimento-4.webp" />
 <TestimonialCard name="André Ferreira" role="CTO" company="FinTech Pro" text="Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita." rating={5} image="/images/depoimento-5.webp" />
 </div>
 </div>
 </div>
 </section>
 );
};

export default Clients;
