/**
 * Conteúdo padrão de cada seção do site (usado quando não há registro no banco).
 * O admin pode editar e gravar no site_conteudo; a leitura retorna DB ou este default.
 */
export type HeroConteudo = {
  titulo: string;
  subtitulo: string;
  chips: string[];
  botaoPrincipal: string;
  botaoSecundario: string;
};

export type TechnologyConteudo = {
  badge: string;
  titulo: string;
  intro: string;
  botao: string;
};

export type AboutConteudo = {
  badge: string;
  titulo: string;
  descricao: string;
};

export type PricingConteudo = {
  badge: string;
  titulo: string;
  subtitulo: string;
  landingTitulo: string;
  landingDescricao: string;
  landingPreco: string;
  landingBotao: string;
  siteTitulo: string;
  siteDescricao: string;
  sitePreco: string;
  siteBotao: string;
};

export type FaqItem = { pergunta: string; resposta: string };
export type FaqConteudo = { badge: string; titulo: string; itens: FaqItem[] };

export type CtaConteudo = {
  titulo: string;
  subtitulo: string;
  botao: string;
  mensagemWhatsApp: string;
};

export type FooterConteudo = {
  redesLabel: string;
  cnpjTexto: string;
};

export type TimelineStep = { titulo: string; descricao: string };
export type TimelineConteudo = {
  badge: string;
  titulo: string;
  subtitulo: string;
  botao: string;
  passos: TimelineStep[];
};

export type PortfolioConteudo = {
  badge: string;
  titulo: string;
  subtitulo: string;
};

export type TestimonialsConteudo = {
  badge: string;
  titulo: string;
  subtitulo: string;
};

export type ComparisonConteudo = {
  badge: string;
  titulo: string;
  subtitulo: string;
  outrasAgencias: string[];
  wefronti: string[];
};

export const DEFAULT_HERO: HeroConteudo = {
  titulo: 'Transformamos seu site em uma máquina online de vendas',
  subtitulo:
    'Planejamento, tecnologia e otimização contínua para tornar seu site um verdadeiro canal de aquisição.',
  chips: [
    'Site rápido e seguro',
    'Design de alto nível',
    'Focado em conversão',
    'Otimizado para Google',
  ],
  botaoPrincipal: 'Quero um site que vende',
  botaoSecundario: 'Ver Portfolio',
};

export const DEFAULT_TECHNOLOGY: TechnologyConteudo = {
  badge: 'Tecnologia',
  titulo: 'Excelência em\ntecnologia e criação de sites',
  intro:
    'Usamos as melhores tecnologias do mercado para elevar o nível do seu projeto. O resultado é um site extremamente rápido, bonito e, principalmente, preparado para converter visitantes em clientes e fazer sua empresa faturar mais.',
  botao: 'Quero um site que vende',
};

export const DEFAULT_ABOUT: AboutConteudo = {
  badge: 'Sobre',
  titulo: 'Nascemos para provar que site bom é site que vende',
  descricao:
    'A Wefronti surgiu da frustração de ver empresas sérias presas a sites lentos, feios e invisíveis no Google enquanto pagavam caro por isso. Decidimos fazer diferente: unir design de alto nível, tecnologia de ponta e estratégia de conversão em um único lugar. Transparência, prazos reais e suporte de verdade porque o seu sucesso é a única métrica que nos importa.',
};

export const DEFAULT_PRICING: PricingConteudo = {
  badge: 'Preços',
  titulo: 'Escolha como vamos transformar seu site em uma máquina de vendas',
  subtitulo: 'Escolha o que faz mais sentido para o seu momento e deixe o resto com a gente.',
  landingTitulo: 'Landing Page',
  landingDescricao:
    'A solução ideal para empresas que precisam de uma página de alta conversão para campanhas, lançamentos ou captação de leads. Rápida, objetiva e focada em um único resultado.',
  landingPreco: '1.397,00',
  landingBotao: 'Quero uma landing page',
  siteTitulo: 'Site completo',
  siteDescricao:
    'Para empresas que querem construir uma presença digital sólida, aparecer no Google e ter um site que gera clientes de forma contínua não só em campanhas.',
  sitePreco: '3.497,00',
  siteBotao: 'Quero um site',
};

export const DEFAULT_FAQ: FaqConteudo = {
  badge: 'FAQ',
  titulo: 'Perguntas\nfrequentes',
  itens: [
    {
      pergunta: 'Em quanto tempo meu site vai estar no ar?',
      resposta:
        'O prazo varia conforme o escopo. Uma landing page fica pronta em até 5 dias. Um site completo entre 14 e 21 dias. Trabalhamos com prazos reais sem enrolar e sem surpresas no meio do caminho.',
    },
    {
      pergunta: 'O site vai aparecer no Google?',
      resposta:
        'Sim. Todo projeto sai com SEO estruturado, não é opcional é obrigatório. Trabalhamos a arquitetura, os títulos, as descrições e a performance para o Google entender e ranquear o seu site.',
    },
    {
      pergunta: 'Preciso ter todo o conteúdo pronto para começar?',
      resposta:
        'Não necessariamente. No processo de onboarding mergulhamos no seu negócio e podemos te orientar sobre o conteúdo ideal. Quanto mais você nos passar, mais estratégico o resultado final.',
    },
    {
      pergunta: 'O site vai funcionar bem no celular?',
      resposta:
        'Todo site que entregamos é 100% responsivo e otimizado para mobile porque hoje mais de 60% dos acessos vêm do celular, e um site que trava no smartphone perde venda na hora.',
    },
    {
      pergunta: 'E se eu precisar de ajuda depois que o site for entregue?',
      resposta:
        'Garantimos suporte no lançamento para que tudo vá ao ar funcionando perfeitamente. Para melhorias e otimizações contínuas, temos planos de manutenção mensal disponíveis.',
    },
    {
      pergunta: 'O site vai ser meu ou fico preso com vocês?',
      resposta:
        'O site é 100% seu. Entregamos todos os acessos, credenciais e arquivos ao final do projeto sem dependência, sem armadilha.',
    },
  ],
};

export const DEFAULT_CTA: CtaConteudo = {
  titulo: 'Vamos transformar o seu site em uma máquina de vendas?',
  subtitulo:
    'Fale com a gente pelo WhatsApp, vamos conversar sobre o seu negócio e como podemos ajudar.',
  botao: 'Falar no WhatsApp',
  mensagemWhatsApp: 'Olá, tenho algumas dúvidas e gostaria de conversar.',
};

export const DEFAULT_FOOTER: FooterConteudo = {
  redesLabel: 'Nossas redes',
  cnpjTexto: 'CNPJ: 64.507.638/0001-04 | Wefronti Tecnologia Ltda',
};

export const DEFAULT_TIMELINE: TimelineConteudo = {
  badge: 'Processo',
  titulo: 'Um processo sem surpresas, do início ao resultado',
  subtitulo:
    'Cada fase do nosso processo foi pensada para eliminar retrabalho, garantir qualidade e entregar um site que trabalha por você todos os dias.',
  botao: 'Quero um site que vende',
  passos: [
    {
      titulo: 'Onboarding',
      descricao:
        'Mergulhamos no seu negócio, entendemos seus objetivos e alinhamos tudo antes de escrever uma linha de código. Aqui nasce a estratégia.',
    },
    {
      titulo: 'Planejamento',
      descricao:
        'Desenhamos a arquitetura do site com foco em conversão cada página, cada seção e cada CTA pensados para transformar visitante em cliente.',
    },
    {
      titulo: 'Desenvolvimento',
      descricao:
        'Construímos o site com as melhores tecnologias do mercado, garantindo velocidade máxima, SEO estruturado e uma experiência que impressiona.',
    },
    {
      titulo: 'Lançamento',
      descricao:
        'Colocamos tudo no ar com atenção a cada detalhe testado, otimizado e pronto para começar a gerar resultado desde o primeiro acesso',
    },
    {
      titulo: 'Suporte',
      descricao:
        'Não sumimos depois da entrega. Acompanhamos, melhoramos e otimizamos continuamente para o seu site vender cada vez mais.',
    },
  ],
};

export const DEFAULT_PORTFOLIO: PortfolioConteudo = {
  badge: 'Portfólio',
  titulo: 'Veja o que entregamos para nossos clientes',
  subtitulo:
    'Conheça alguns dos projetos que desenvolvemos e imagine o que podemos fazer pelo seu negócio.',
};

export const DEFAULT_TESTIMONIALS: TestimonialsConteudo = {
  badge: 'Depoimentos',
  titulo: 'Resultados reais de quem apostou em um site que vende',
  subtitulo: 'Veja o que aconteceu quando elas decidiram levar o digital a sério.',
};

export const DEFAULT_COMPARISON: ComparisonConteudo = {
  badge: 'Diferenciais',
  titulo: 'Você já passou por isso\ncom outra empresa?',
  subtitulo:
    'Veja o que acontece na prática com a maioria das empresas do mercado, e por que líderes escolhem a Wefronti:',
  outrasAgencias: [
    'Pagou pelo site, ficou esperando e sumiram com o seu dinheiro',
    'Te prometeram um site incrível e entregaram algo que você teve vergonha de mostrar',
    'O prazo era 30 dias e 4 meses depois o site ainda não estava no ar',
    'Recebeu um site bonito que não gerou um único lead sequer',
    'Abriu um chamado de suporte e nunca mais teve resposta',
  ],
  wefronti: [
    'Processo 100% transparente: você acompanha cada etapa, do briefing à entrega',
    'Site entregue no prazo combinado, sem desculpas, sem surpresas',
    'Design estratégico pensado para converter visitantes em clientes',
    'SEO estruturado para você aparecer no Google e atrair clientes',
    'Entrega com suporte: o site no ar, testado e funcionando perfeitamente.',
  ],
};

const SECOES_VALIDAS = [
  'hero',
  'technology',
  'testimonials',
  'timeline',
  'portfolio',
  'about',
  'pricing',
  'comparison',
  'faq',
  'cta',
  'footer',
] as const;

export type SecaoSlug = (typeof SECOES_VALIDAS)[number];

export function isSecaoValida(s: string): s is SecaoSlug {
  return (SECOES_VALIDAS as readonly string[]).includes(s);
}

/** Defaults por slug (objeto para merge com DB) */
export const DEFAULT_SITE_CONTEUDO: Record<SecaoSlug, unknown> = {
  hero: DEFAULT_HERO,
  technology: DEFAULT_TECHNOLOGY,
  testimonials: DEFAULT_TESTIMONIALS,
  timeline: DEFAULT_TIMELINE,
  portfolio: DEFAULT_PORTFOLIO,
  about: DEFAULT_ABOUT,
  pricing: DEFAULT_PRICING,
  comparison: DEFAULT_COMPARISON,
  faq: DEFAULT_FAQ,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
};
