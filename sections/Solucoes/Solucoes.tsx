import React from 'react';
import Link from 'next/link';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Globe, Layout, Package, Palette, Plug, Wrench, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FiFigma } from 'react-icons/fi';

const { colors, spacing, fontSizes, radii } = theme;

const SOLUCOES: {
  titulo: string;
  descricao: string;
  Icon: LucideIcon;
  slug: string;
}[] = [
  {
    titulo: 'Desenvolvimento Web',
    descricao: 'Sites institucionais, landing pages e e-commerce. Desenvolvemos experiências rápidas, responsivas e otimizadas para converter visitantes em clientes.',
    Icon: Globe,
    slug: 'desenvolvimento-web',
  },
  {
    titulo: 'Softwares e sistemas',
    descricao: 'Sistemas sob medida, ERPs, CRMs e aplicações web para automatizar processos e escalar sua operação.',
    Icon: Layout,
    slug: 'softwares-e-sistemas',
  },
  {
    titulo: 'Micro-saas',
    descricao: 'Produtos digitais e software como serviço. Criamos soluções escaláveis para validar e monetizar sua ideia no mercado.',
    Icon: Package,
    slug: 'micro-saas',
  },
  {
    titulo: 'Design UI-UX',
    descricao: 'Interfaces intuitivas e experiências pensadas no usuário. Prototipação e design em Figma para produtos que encantam e convertem.',
    Icon: FiFigma as unknown as LucideIcon,
    slug: 'design-ui-ux',
  },
  {
    titulo: 'Integração e APIs',
    descricao: 'Conectamos seus sistemas, automações e fluxos de dados. APIs, webhooks e integrações para um ecossistema unificado.',
    Icon: Plug,
    slug: 'integracao-e-apis',
  },
  {
    titulo: 'Manutenção e suporte',
    descricao: 'Suporte contínuo, evolução de projetos e monitoramento. Seu sistema seguro, atualizado e performando no dia a dia.',
    Icon: Wrench,
    slug: 'manutencao-e-suporte',
  },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
};

const innerStyleBase: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: colors.neutral.accordeon,
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.text.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  textAlign: 'left',
};

/** Palavra destacada no título: serif italic (mesmo estilo da Hero) */
const highlightWordStyle: React.CSSProperties = {
  color: '#5c9369AF',
};

function renderSolucoesTitle(text: string): React.ReactNode {
  const regex = /(soluções?)/gi;
  const parts = text.split(regex);
  return parts.map((part, i) =>
    /^soluções?$/i.test(part) ? (
      <span key={`h-${i}-${part}`} style={highlightWordStyle}>{part}</span>
    ) : (
      <React.Fragment key={`h-${i}`}>{part}</React.Fragment>
    )
  );
}

const introStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.65,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'left',
  maxWidth: 720,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: spacing[6],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: spacing[6],
  width: '100%',
};

const cardStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: colors.neutral.accordeon,
  padding: spacing[6],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
};

const iconWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  background: colors.neutral.borderLight,
  flexShrink: 0,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 400,
  color: colors.text.primary,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.secondary,
  margin: 0,
  flex: 1,
};

const saibaMaisStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  textDecoration: 'none',
  transition: 'opacity 0.2s, gap 0.2s',
  marginTop: 'auto',
};

interface SolucoesProps {
  conteudo?: Record<string, unknown>;
}

const Solucoes: React.FC<SolucoesProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const sectionPaddingX = isMd ? spacing[10] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Soluções';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Nossas soluções';
  const intro = (conteudo?.intro != null ? String(conteudo.intro) : '') || 'Desenvolvimento web, softwares, design, integração e suporte. Tudo o que sua empresa precisa para crescer no digital.';

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  const gridLayout: React.CSSProperties = isMd
    ? { ...gridStyle, gridTemplateColumns: 'repeat(3, 1fr)' }
    : { ...gridStyle, gridTemplateColumns: '1fr' };

  return (
    <section id="solucoes" style={sectionStyle} aria-labelledby="solucoes-heading">
      <div style={innerStyleBase}>
        <div style={headerStyle}>
          <span style={badgeStyle} aria-hidden>
            <span
              className="badge-dot-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors.blue.primary,
              }}
            />
            {badge}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: spacing[4] }}>
            <h2 id="solucoes-heading" style={titleStyle}>
              {renderSolucoesTitle(titulo)}
            </h2>
            <p style={introStyle}>{intro}</p>
          </div>
        </div>

        <div style={gridLayout}>
          {SOLUCOES.map((item) => (
            <div key={item.slug} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={iconWrapStyle}>
                  <item.Icon size={24} color="#059669" strokeWidth={1.8} />
                </div>
                <h3 style={cardTitleStyle}>{item.titulo}</h3>
              </div>
              <p style={cardDescStyle}>{item.descricao}</p>
              <Link
                href={`/solucoes/${item.slug}`}
                style={saibaMaisStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.gap = '12px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.gap = '8px';
                }}
              >
                Saiba mais
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solucoes;
