/**
 * Dados dos projetos do portfólio.
 * Cada projeto tem dados para o card na home e conteúdo da página de detalhes.
 */
export type Project = {
  slug: string;
  name: string;
  cover: string;
  description: string;
  /** Nome do cliente ou setor (opcional) */
  client?: string;
  /** Desafios que o cliente trouxe */
  challenges: string[];
  /** Como foi resolvido / abordagem */
  solution: string;
  /** Resultados alcançados (opcional) */
  results?: string;
  /** URL do site no ar (opcional) */
  liveUrl?: string;
  /** Imagens extras para a galeria na página de detalhes (opcional) */
  gallery?: string[];
};

export const projects: Project[] = [
  {
    slug: 'moovis',
    name: 'Moovis',
    cover: '/images/portfolio/projeto-moovis.webp',
    description: 'Plataforma de gestão imobiliária com site institucional focado em conversão e apresentação dos planos de assinatura.',
    client: 'Serviços imobiliários',
    challenges: [
      'Posicionar a marca como referência em gestão imobiliária no Brasil.',
      'Comunicar claramente os serviços (administração, locação, venda) e diferenciais.',
      'Converter visitantes em cadastros e trial do aplicativo com CTAs estratégicos.',
      'Apresentar os planos de preços de forma clara e atrativa.',
    ],
    solution:
      'Desenvolvemos um site institucional completo com hero impactante, seção de serviços detalhada, tabela de preços comparativa e prova social com depoimentos reais. O design em tom profissional transmite confiança e o fluxo de navegação guia o visitante até o cadastro. Incluímos FAQ e blog para reforçar autoridade e SEO.',
    results: 'Site alinhado ao posicionamento da marca, com foco em conversão e experiência de primeira para gestores de imóveis.',
    liveUrl: 'https://moovis.framer.ai/',
    gallery: ['/images/portfolio/projeto-moovis.webp'],
  },
  {
    slug: 'openspace',
    name: 'Open Space',
    cover: '/images/portfolio/projeto-open-space.webp',
    description: 'Site institucional para empresa de reforma de alto padrão, com foco em conversão e apresentação de serviços especializados.',
    client: 'Reforma residencial de alto padrão',
    challenges: [
      'Comunicar a proposta de valor em um mercado competitivo de reformas.',
      'Apresentar múltiplos serviços (cozinhas gourmet, banheiros, extensões, etc.) de forma clara.',
      'Transmitir credibilidade e sofisticação para captar clientes de alto padrão.',
      'Reduzir objeções com FAQ e prova social (depoimentos e projetos concluídos).',
    ],
    solution:
      'Desenvolvemos um site institucional elegante com hero impactante, seção de serviços detalhada (cozinhas, banheiros, extensões, restaurações, obras externas), galeria de projetos, depoimentos de clientes e FAQ estratégico. O design transmite excelência e o CTA "Iniciar um projeto" guia o visitante para o contato. Modelo turnkey e transparência no processo reforçam a confiança.',
    results: 'Site alinhado ao posicionamento premium da marca e fluxo de contato otimizado para novos projetos.',
    liveUrl: 'https://openspace.framer.ai/',
    gallery: ['/images/portfolio/projeto-open-space.webp'],
  },
  {
    slug: 'r3-digital',
    name: 'R3-Digital',
    cover: '/images/portfolio/projeto-r3-digital.webp',
    description: 'Site institucional para agência de marketing digital com foco em conversão e apresentação de serviços estratégicos.',
    client: 'Marketing digital',
    challenges: [
      'Posicionar a agência como referência em estratégias digitais e resultados mensuráveis.',
      'Comunicar múltiplos serviços (marketing, consultoria, leads, branding, conteúdo) de forma clara.',
      'Diferenciar da concorrência com prova social (casos de sucesso, depoimentos, métricas).',
      'Converter visitantes em agendamentos de apresentação com CTA estratégico.',
    ],
    solution:
      'Desenvolvemos um site institucional completo com hero impactante "Expanda seu negócio, domine cada etapa", seção de serviços detalhada, casos de sucesso com resultados (ROI, receita gerada), comparação R3-Digital vs outras agências, depoimentos e FAQ. O design transmite profissionalismo e o CTA "Agendar uma apresentação" guia o visitante para o contato. Métricas em destaque (+2 mil campanhas, +R$11.2M receita) reforçam credibilidade.',
    results: 'Site alinhado ao posicionamento da agência, com foco em KPIs reais e fluxo otimizado para captação de leads.',
    liveUrl: 'https://r3-digital.framer.ai/',
    gallery: ['/images/portfolio/projeto-r3-digital.webp'],
  },
  {
    slug: 'aibazz',
    name: 'Aibazz',
    cover: '/images/portfolio/projeto-aibazz.webp',
    description: 'Plataforma de automação com IA com site institucional focado em conversão e apresentação de planos de assinatura.',
    client: 'Automação com IA',
    challenges: [
      'Posicionar a marca como parceiro de automação de IA para empresas.',
      'Comunicar serviços (automação de fluxos, modelos de IA, chatbots, insights) de forma clara.',
      'Transmitir credibilidade com prova social (10k+ usuários, 250k+ horas economizadas).',
      'Converter visitantes em cadastros com planos de preços (Starter grátis, PRO, Enterprise).',
    ],
    solution:
      'Desenvolvemos um site institucional completo com hero impactante "Automatize processos com IA e produza mais", seção de processo em 3 etapas (avaliação, implementação, suporte), serviços de automação de IA, galeria de projetos (OnzeLabs, MedAssist AI, AutoTag Pro), depoimentos de clientes, tabela de preços e integrações. O design transmite inovação e os CTAs "Comece agora grátis" guiam o visitante até o cadastro.',
    results: 'Site alinhado ao posicionamento da plataforma, com foco em conversão e credibilidade no mercado de IA.',
    liveUrl: 'https://aibazz.framer.ai/',
    gallery: ['/images/portfolio/projeto-aibazz.webp'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
