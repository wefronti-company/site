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
    slug: 'projeto-1',
    name: 'Projeto 1',
    cover: '/images/portfolio/capa-01.png',
    description: 'Breve descrição do projeto e do resultado entregue.',
    client: 'Cliente / Setor',
    challenges: [
      'Prazo apertado para lançamento da marca.',
      'Necessidade de um site que convertesse visitantes em leads.',
      'Integração com ferramentas de marketing já utilizadas pela equipe.',
    ],
    solution:
      'Desenvolvemos um site institucional focado em conversão, com páginas otimizadas para SEO e formulários estratégicos. O layout foi pensado para guiar o visitante até o contato, e a estrutura permitiu que o cliente atualizasse conteúdo com facilidade.',
    techStack: ['Next.js', 'React', 'TypeScript', 'SEO'],
    results: 'Aumento de leads qualificados e redução do tempo de carregamento da página principal.',
    liveUrl: 'https://exemplo.com',
    gallery: ['/images/portfolio/capa-01.png'],
  },
  {
    slug: 'projeto-2',
    name: 'Projeto 2',
    cover: '/images/portfolio/capa-01.png',
    description: 'Breve descrição do projeto e do resultado entregue.',
    client: 'Cliente / Setor',
    challenges: [
      'Site antigo lento e fora dos padrões de busca.',
      'Identidade visual desatualizada.',
      'Dificuldade em manter o conteúdo atualizado.',
    ],
    solution:
      'Refizemos o site do zero com foco em performance e experiência do usuário. A nova identidade visual alinhou-se ao posicionamento da marca e implementamos um painel simples para o cliente publicar notícias e ofertas.',
    techStack: ['Next.js', 'React', 'Cloudflare', 'Design responsivo'],
    results: 'Melhora significativa na velocidade e no posicionamento no Google.',
    liveUrl: 'https://exemplo.com',
    gallery: ['/images/portfolio/capa-01.png'],
  },
  {
    slug: 'projeto-3',
    name: 'Projeto 3',
    cover: '/images/portfolio/capa-01.png',
    description: 'Breve descrição do projeto e do resultado entregue.',
    client: 'Cliente / Setor',
    challenges: [
      'Necessidade de uma landing page para campanha de lançamento.',
      'Alto volume de acessos esperado no dia do lançamento.',
      'Objetivo de capturar e-mails e qualificar leads.',
    ],
    solution:
      'Criamos uma landing page enxuta e rápida, otimizada para conversão e para suportar picos de acesso. Formulário em etapas e copy direcionado aumentaram a taxa de cadastro e a qualidade dos leads.',
    techStack: ['Next.js', 'Formulários em etapas', 'Otimização de performance'],
    results: 'Meta de cadastros atingida e site estável durante o pico de acessos.',
    liveUrl: 'https://exemplo.com',
    gallery: ['/images/portfolio/capa-01.png'],
  },
  {
    slug: 'projeto-4',
    name: 'Projeto 4',
    cover: '/images/portfolio/capa-01.png',
    description: 'Breve descrição do projeto e do resultado entregue.',
    client: 'Cliente / Setor',
    challenges: [
      'Múltiplos serviços e públicos em um único negócio.',
      'Site anterior confuso e com alta taxa de rejeição.',
      'Necessidade de destacar diferenciais em um mercado competitivo.',
    ],
    solution:
      'Reorganizamos a arquitetura de informação em páginas por serviço e persona. O novo fluxo de navegação e os blocos de prova social (depoimentos, casos) reforçam a confiança e direcionam o visitante para a ação desejada.',
    techStack: ['Next.js', 'React', 'SEO', 'Google Analytics'],
    results: 'Redução da taxa de rejeição e crescimento no número de solicitações de orçamento.',
    liveUrl: 'https://exemplo.com',
    gallery: ['/images/portfolio/capa-01.png'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
