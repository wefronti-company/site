import React from 'react';
import SEO from '../components/SEO';
import { colors } from '../styles/colors';
import ButtonCta from '../components/ui/ButtonCta';
import ServiceCard from '../components/ui/ServiceCard';
import { Monitor, ShoppingCart, Server, Box, Layout, LifeBuoy, Cloud, Code, LayoutDashboard, ArrowDown, Rocket } from 'lucide-react';

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

          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full animate-float" style={{ border: `1px solid ${colors.neutral.borderLight}`, backgroundColor: 'rgba(115,111,176,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.45)' }}>
              <Box size={16} style={{ color: colors.purple.tertiary }} aria-hidden />
              <span className="text-sm font-medium" style={{ color: colors.text.light }}>O que fazemos</span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1]"
              style={{ color: colors.primary.white }}
              aria-level={2}
              role="heading"
            >
              Tecnologia aplicada para destravar crescimento, eficiência e escala.
            </h2>
          </div>

          <h3
            className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl font-light mb-8"
            style={{ color: colors.text.light, opacity: 0.95 }}
            aria-level={3}
            role="heading"
          >
            Construímos soluções digitais que resolvem gargalos reais do seu negócio, aumentam receita, reduzem custos e trazem controle.
          </h3>

        </div>
      </section>

      <section className="py-20" aria-label="Serviços">
        <div className="w-full max-w-5xl mx-auto px-6">

          <div className="mb-8 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-md" style={{ border: `1px solid ${colors.neutral.borderLight}`, borderRadius: '6px', backgroundColor: 'rgba(115,111,176,0.06)', color: colors.purple.tertiary }} aria-hidden>
              <Rocket size={21} />
            </div>

            <h3 className="text-lg md:text-xl lg:text-2xl font-regular m-0" style={{ color: colors.primary.black }}>Veja como podemos ajudar seu negócio</h3>

            <div className="flex-1 h-px ml-4" style={{ backgroundColor: colors.neutral.borderLight }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Sites institucionais',
                description: 'Seu site não pode ser apenas bonito ele precisa convencer, gerar confiança e vender. Criamos sites rápidos e estratégicos que comunicam valor com clareza e transformam visitas em oportunidades reais de negócio.',
                icon: <Monitor size={20} />,
                image: '/images/developement/desenvolvimento-de-sites.webp'
              },
              {
                title: 'E‑commerce',
                description: 'Vender online não é só subir produtos. Desenvolvemos lojas virtuais seguras, escaláveis e pensadas para converter mais, integrar meios de pagamento e crescer sem dor operacional.',
                icon: <ShoppingCart size={20} />,
                image: '/images/developement/desenvolvimento-de-ecommerce.webp'
              },
              {
                title: 'Sistemas',
                description: 'Processos manuais, retrabalho e falta de controle travam empresas.Criamos sistemas sob medida para automatizar operações, centralizar informações e dar visão real do negócio para quem toma decisão.',
                icon: <Server size={20} />,
                image: '/images/developement/desenvolvimento-de-sistemas.webp'
              },
              {
                title: 'APIs e Integrações',
                description: 'Quando sistemas não se conversam, o negócio perde eficiência. Conectamos plataformas, parceiros e serviços para eliminar falhas, ganhar velocidade e garantir dados confiáveis em toda a operação.',
                icon: <Code size={20} />,
                image: '/images/developement/desenvolvimento-de-api.webp'
              },
              {
                title: 'Dashboard',
                description: 'Decidir no escuro custa caro. Desenvolvemos dashboards claros e objetivos para transformar dados em decisões rápidas e estratégicas, com métricas que realmente importam.',
                icon: <LayoutDashboard size={20} />,
                image: '/images/developement/desenvolvimento-de-dashboard.webp'
              },
              {
                title: 'Saas',
                description: 'Ideias boas precisam de execução sólida. Apoiamos empresas na criação, evolução e escala de produtos SaaS, com tecnologia preparada para crescer, manter performance e gerar receita recorrente.',
                icon: <Cloud size={20} />,
                image: '/images/developement/desenvolvimento-de-saas.webp'
              }
            ].map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} icon={s.icon} imageSrc={s.image} imageAlt={s.title} />
            ))}
          </div>

          {/* Divider with centered down arrow to next section */}
          <div className="w-full flex items-center justify-center mt-10">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-md"
              style={{ backgroundColor: 'rgba(115,111,176,0.06)', color: colors.purple.tertiary, borderRadius: '6px', border: `1px solid ${colors.neutral.borderLight}` }}
            >
              <ArrowDown size={18} />
            </button>
          </div>

        </div>
      </section>

      <section id="como-fazemos" className="py-20 bg-black/20" aria-label="Nosso processo">
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
