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
  /** Tecnologias ou ferramentas usadas */
  techStack: string[];
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
    techStack: ['Framer', 'Design responsivo', 'SEO', 'Conversão'],
    results: 'Site alinhado ao posicionamento da marca, com foco em conversão e experiência de primeira para gestores de imóveis.',
    liveUrl: 'https://moovis.framer.ai/',
    gallery: ['/images/portfolio/moovis-site.png'],
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
    techStack: ['Framer', 'Design responsivo', 'SEO', 'Conversão'],
    results: 'Site alinhado ao posicionamento premium da marca e fluxo de contato otimizado para novos projetos.',
    liveUrl: 'https://openspace.framer.ai/',
    gallery: ['/images/portfolio/projeto-open-space.webp'],
  },
  // Projeto 3 – descomente ao adicionar imagens e conteúdo
  // {
  //   slug: 'projeto-3',
  //   name: 'Projeto 3',
  //   cover: '/images/portfolio/moovis-site.png',
  //   description: 'Breve descrição do projeto e do resultado entregue.',
  //   client: 'Cliente / Setor',
  //   challenges: [
  //     'Necessidade de uma landing page para campanha de lançamento.',
  //     'Alto volume de acessos esperado no dia do lançamento.',
  //     'Objetivo de capturar e-mails e qualificar leads.',
  //   ],
  //   solution:
  //     'Criamos uma landing page enxuta e rápida, otimizada para conversão e para suportar picos de acesso. Formulário em etapas e copy direcionado aumentaram a taxa de cadastro e a qualidade dos leads.',
  //   techStack: ['Next.js', 'Formulários em etapas', 'Otimização de performance'],
  //   results: 'Meta de cadastros atingida e site estável durante o pico de acessos.',
  //   liveUrl: 'https://exemplo.com',
  //   gallery: ['/images/portfolio/moovis-site.png'],
  // },
  // Projeto 4 – descomente ao adicionar imagens e conteúdo
  // {
  //   slug: 'projeto-4',
  //   name: 'Projeto 4',
  //   cover: '/images/portfolio/moovis-site.png',
  //   description: 'Breve descrição do projeto e do resultado entregue.',
  //   client: 'Cliente / Setor',
  //   challenges: [
  //     'Múltiplos serviços e públicos em um único negócio.',
  //     'Site anterior confuso e com alta taxa de rejeição.',
  //     'Necessidade de destacar diferenciais em um mercado competitivo.',
  //   ],
  //   solution:
  //     'Reorganizamos a arquitetura de informação em páginas por serviço e persona. O novo fluxo de navegação e os blocos de prova social (depoimentos, casos) reforçam a confiança e direcionam o visitante para a ação desejada.',
  //   techStack: ['Next.js', 'React', 'SEO', 'Google Analytics'],
  //   results: 'Redução da taxa de rejeição e crescimento no número de solicitações de orçamento.',
  //   liveUrl: 'https://exemplo.com',
  //   gallery: ['/images/portfolio/moovis-site.png'],
  // },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
