import React from 'react';
import SEO from '../components/SEO';
import { colors } from '../styles/colors';
import ButtonCta from '../components/ui/ButtonCta';
import ServiceCard from '../components/ui/ServiceCard';
import { Monitor, ShoppingCart, Server, Box, Layout, LifeBuoy, Cloud, Code, LayoutDashboard } from 'lucide-react';

const Solucoes: React.FC = () => {
  return (
    <main>
      <SEO title="O que fazemos" description="Serviços: desenvolvimento de produtos digitais, plataformas, APIs, design e consultoria técnica." />

      <section
        className="relative min-h-[60vh] flex items-center overflow-hidden rounded-b-2xl md:rounded-b-4xl"
        aria-label="O que fazemos - hero"
        style={{
          backgroundImage: 'url(/images/site/background-site-wefronti.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative w-full max-w-5xl mx-auto px-6 pt-12 md:pt-20 lg:pt-28 pb-12 flex flex-col items-center justify-center text-center">
          {/*
            Semântico / SEO:
            - H1 é reservado para a homepage por requisito do produto.
            - Aqui usamos H2 (título da página) e H3 (subtítulo) para manter hierarquia correta.
            - Visualmente as classes seguem o mesmo sistema tipográfico do hero principal.
          */}

          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-6"
            style={{ color: colors.primary.white }}
            aria-level={2}
            role="heading"
          >
            O que fazemos
          </h2>

          <h3
            className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl font-light mb-8"
            style={{ color: colors.text.light, opacity: 0.95 }}
            aria-level={3}
            role="heading"
          >
            Construímos produtos digitais e plataformas escaláveis da concepção ao lançamento e operação com foco em segurança, performance e resultado de negócio.
          </h3>

        </div>
      </section>

      <section className="py-20" aria-label="Serviços">
        <div className="w-full max-w-5xl mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Sites institucionais',
                description: 'Sites rápidos e focados em conversão para comunicar sua proposta e gerar negócios.',
                icon: <Monitor size={20} />,
                image: '/images/developement/desenvolvimento-de-sites.webp'
              },
              {
                title: 'E‑commerce',
                description: 'Lojas online seguras e escaláveis para vender e crescer sem dor.',
                icon: <ShoppingCart size={20} />,
                image: '/images/developement/desenvolvimento-de-ecommerce.webp'
              },
              {
                title: 'Sistemas',
                description: 'Soluções que automatizam processos e resolvem problemas reais do seu negócio.',
                icon: <Server size={20} />,
                image: '/images/developement/desenvolvimento-de-sistemas.webp'
              },
              {
                title: 'APIs e Integrações',
                description: 'APIs confiáveis para conectar seus serviços, parceiros e canais.',
                icon: <Code size={20} />,
                image: '/images/developement/desenvolvimento-de-api.webp'
              },
              {
                title: 'Dashboard',
                description: 'Pesquisa, prototipagem e design que garantem decisões centradas no usuário.',
                icon: <LayoutDashboard size={20} />,
                image: '/images/developement/desenvolvimento-de-dashboard.webp'
              },
              {
                title: 'Saas',
                description: 'Parceria contínua: evoluímos seu produto com suporte e roadmaps estratégicos.',
                icon: <Cloud size={20} />,
                image: '/images/developement/desenvolvimento-de-saas.webp'
              }
            ].map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} icon={s.icon} imageSrc={s.image} imageAlt={s.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black/20" aria-label="Nosso processo">
        <div className="w-full max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-medium mb-6" style={{ color: colors.primary.white }}>Como trabalhamos</h2>
          <ol className="space-y-6 list-decimal pl-6 text-gray-300">
            <li>
              Discovery — pesquisa e definição de hipóteses de negócio.
            </li>
            <li>
              Prototipação & validação — testes rápidos com usuários reais.
            </li>
            <li>
              Entrega incremental — squads dedicados, entregas contínuas e monitoramento.
            </li>
          </ol>
        </div>
      </section>

      <section className="py-20">
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium" style={{ color: colors.primary.white }}>Pronto para começar?</h3>
            <p className="text-sm text-gray-300">Agende uma conversa com nosso time e valide seu case em poucas semanas.</p>
          </div>
          <ButtonCta label="Entrar em contato" />
        </div>
      </section>

    </main>
  );
};

export default Solucoes;
