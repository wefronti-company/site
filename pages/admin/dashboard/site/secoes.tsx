import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { theme } from '@/styles/theme';
import {
  LayoutTemplate,
  Cpu,
  MessageCircle,
  GitBranch,
  LayoutGrid,
  Info,
  DollarSign,
  GitCompare,
  HelpCircle,
  Megaphone,
  FileText,
} from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const SECOES = [
  {
    slug: 'hero',
    titulo: 'Seção Hero',
    descricao: 'Banner principal da página inicial: título, subtítulo, chips e botões de ação.',
    Icon: LayoutTemplate,
  },
  {
    slug: 'technology',
    titulo: 'Tecnologia',
    descricao: 'Conteúdo da seção de tecnologias e ferramentas utilizadas.',
    Icon: Cpu,
  },
  {
    slug: 'testimonials',
    titulo: 'Depoimentos',
    descricao: 'Exibir depoimentos e avaliações de clientes.',
    Icon: MessageCircle,
  },
  {
    slug: 'timeline',
    titulo: 'Timeline',
    descricao: 'Etapas do processo ou linha do tempo do projeto.',
    Icon: GitBranch,
  },
  {
    slug: 'portfolio',
    titulo: 'Portfólio',
    descricao: 'Projetos em destaque com imagens, títulos e links.',
    Icon: LayoutGrid,
  },
  {
    slug: 'about',
    titulo: 'Sobre',
    descricao: 'Texto sobre a empresa, lista de diferenciais e imagem do diretor.',
    Icon: Info,
  },
  {
    slug: 'pricing',
    titulo: 'Preços',
    descricao: 'Planos, valores e mensagens dos botões de contato.',
    Icon: DollarSign,
  },
  {
    slug: 'comparison',
    titulo: 'Comparação',
    descricao: 'Conteúdo da seção de comparação entre planos ou opções.',
    Icon: GitCompare,
  },
  {
    slug: 'faq',
    titulo: 'Perguntas frequentes',
    descricao: 'Perguntas e respostas em formato organizado.',
    Icon: HelpCircle,
  },
  {
    slug: 'cta',
    titulo: 'Chamada para ação',
    descricao: 'Título, subtítulo e botão da seção final de conversão.',
    Icon: Megaphone,
  },
  {
    slug: 'footer',
    titulo: 'Footer',
    descricao: 'Rodapé: descrição, links, política de privacidade e termos.',
    Icon: FileText,
  },
];

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[8],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[6],
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: spacing[4],
  padding: spacing[6],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  minHeight: 200,
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s',
};

const cardIconWrapStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text.light,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  lineHeight: 1.5,
  margin: 0,
  flex: 1,
};

export default function GerenciarSecoesPage() {
  return (
    <>
      <Head>
        <title>Gerenciar seções | Admin | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Gerenciar conteúdo do site</h1>
        <p style={pageSubtitleStyle}>
          Clique em uma seção para editar títulos, subtítulos e textos exibidos na página inicial.
        </p>
        <div style={gridStyle}>
          {SECOES.map(({ slug, titulo, descricao, Icon }) => (
            <Link
              key={slug}
              href={`/admin/dashboard/site/secoes/${slug}`}
              style={cardStyle}
              className="admin-nav-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.blue.primary;
                e.currentTarget.style.backgroundColor = 'rgba(53, 152, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.neutral.borderDark;
                e.currentTarget.style.backgroundColor = colors.admin.inactive;
              }}
            >
              <div style={cardIconWrapStyle}>
                <Icon size={24} strokeWidth={1.5} aria-hidden />
              </div>
              <h2 style={cardTitleStyle}>{titulo}</h2>
              <p style={cardDescStyle}>{descricao}</p>
            </Link>
          ))}
        </div>
      </AdminLayout>
    </>
  );
}
