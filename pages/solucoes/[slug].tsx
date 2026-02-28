import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import SEO from '../../components/SEO';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const LIVE_ACCENT = '#7ad49dAF';
const LIVE_TEXT_MUTED = '#6BB58A';

type SolutionSlug =
  | 'softwares-e-sistemas'
  | 'micro-saas'
  | 'design-ui-ux'
  | 'integracao-e-apis'
  | 'manutencao-e-suporte';

interface SolutionContent {
  title: string;
  subtitle: string;
  canonical: string;
  description: string;
  details: string[];
  animation: 'systems' | 'saas' | 'figma' | 'api' | 'support';
}

const SOLUTIONS: Record<SolutionSlug, SolutionContent> = {
  'softwares-e-sistemas': {
    title: 'Softwares e sistemas',
    subtitle:
      'Desenvolvemos sistemas sob medida para organizar operações, reduzir retrabalho e dar previsibilidade ao crescimento da sua empresa.',
    canonical: '/solucoes/softwares-e-sistemas',
    description:
      'Sistemas personalizados para empresas que precisam escalar processos com controle, eficiência e visão de dados.',
    animation: 'systems',
    details: [
      'A solução de Softwares e Sistemas da Wefronti é ideal para empresas que já validaram o negócio e agora precisam de estrutura tecnológica para ganhar escala sem perder controle operacional.',
      'Começamos com diagnóstico de processo: identificamos gargalos, etapas manuais e pontos de risco. Em seguida, modelamos a arquitetura da solução para refletir com fidelidade a operação real do seu time.',
      'Criamos painéis, permissões por perfil, fluxos de aprovação, módulos customizados e relatórios orientados à tomada de decisão. Isso reduz ruído, melhora produtividade e dá mais clareza sobre desempenho.',
      'A implementação é feita com foco em estabilidade, segurança e evolução contínua. O sistema nasce preparado para receber novos módulos à medida que a empresa cresce.',
      'No fim, você passa a operar com mais velocidade e previsibilidade: menos retrabalho, menos dependência de planilhas soltas e mais inteligência em cada etapa do processo.',
    ],
  },
  'micro-saas': {
    title: 'Micro-SaaS',
    subtitle:
      'Criamos produtos SaaS enxutos e escaláveis para validar mercado, gerar receita recorrente e evoluir com base em dados reais de uso.',
    canonical: '/solucoes/micro-saas',
    description:
      'Da ideia ao produto: estratégia, tecnologia e experiência para transformar conhecimento em assinatura.',
    animation: 'saas',
    details: [
      'A solução de Micro-SaaS da Wefronti foi desenhada para empreendedores e empresas que querem lançar um produto digital com potencial de receita recorrente.',
      'Estruturamos o produto com foco em proposta de valor clara, onboarding eficiente e jornada de ativação que conduz o usuário até o momento de pagamento.',
      'Implementamos autenticação, planos, cobrança recorrente, área do cliente e painel de gestão. Tudo isso com base técnica sólida para escalar sem reescrever do zero.',
      'Além do desenvolvimento, orientamos priorização de funcionalidades para validar rápido, aprender com comportamento real e iterar com precisão.',
      'O resultado é um produto comercialmente viável, com base pronta para crescimento e governança técnica para sustentar evolução contínua.',
    ],
  },
  'design-ui-ux': {
    title: 'Design UI-UX',
    subtitle:
      'Projetamos experiências digitais com clareza e intenção: wireframe, protótipo e interface final para converter melhor e reduzir fricção.',
    canonical: '/solucoes/design-ui-ux',
    description:
      'Interface bonita é importante. Interface estratégica, intuitiva e orientada a resultado é essencial.',
    animation: 'figma',
    details: [
      'A solução de Design UI-UX da Wefronti combina visão de negócio com usabilidade para criar experiências que funcionam no mundo real.',
      'Começamos pelo entendimento do contexto: público, objetivos, fluxo de decisão e barreiras de navegação. A partir disso, desenhamos wireframes que validam estrutura e hierarquia de informação.',
      'No Figma, evoluímos para protótipos interativos, testamos fluxos críticos e refinamos o visual com consistência de componentes e linguagem de marca.',
      'Cada tela é pensada para guiar o usuário com naturalidade: menos esforço cognitivo, mais clareza de ação e maior taxa de conclusão.',
      'O resultado é uma experiência coesa, pronta para desenvolvimento e com impacto direto em percepção de valor, confiança e conversão.',
    ],
  },
  'integracao-e-apis': {
    title: 'Integração e APIs',
    subtitle:
      'Conectamos sistemas, ferramentas e fluxos de dados para eliminar retrabalho manual e criar uma operação digital realmente integrada.',
    canonical: '/solucoes/integracao-e-apis',
    description:
      'Integração bem feita transforma processos fragmentados em uma operação fluida, confiável e escalável.',
    animation: 'api',
    details: [
      'A solução de Integração e APIs da Wefronti é para empresas que cresceram com várias ferramentas e agora precisam que tudo converse sem fricção.',
      'Mapeamos fluxos de dados entre sistemas (ERP, CRM, pagamentos, logística, atendimento) e definimos contratos robustos para troca de informação.',
      'Implementamos integrações com controle de erros, retentativas, logs e monitoramento para garantir confiabilidade operacional.',
      'Também construímos APIs sob medida quando necessário, permitindo que seu ecossistema evolua sem depender de soluções engessadas.',
      'O resultado é ganho real de eficiência: menos trabalho manual, menos inconsistência de dados e mais velocidade para executar com qualidade.',
    ],
  },
  'manutencao-e-suporte': {
    title: 'Manutenção e suporte',
    subtitle:
      'Garantimos estabilidade, evolução e performance contínua para que seu produto digital mantenha qualidade e acompanhe o crescimento do negócio.',
    canonical: '/solucoes/manutencao-e-suporte',
    description:
      'Suporte técnico estratégico para manter seu ativo digital seguro, rápido e sempre alinhado ao seu momento de negócio.',
    animation: 'support',
    details: [
      'A solução de Manutenção e Suporte da Wefronti foi criada para empresas que já possuem sistema ou site no ar e precisam garantir operação contínua com tranquilidade.',
      'Atuamos em monitoramento, correções, ajustes evolutivos e otimização de performance, sempre com priorização orientada ao impacto no negócio.',
      'Também fazemos prevenção: revisões técnicas, melhoria de segurança, atualização de dependências e hardening da aplicação para reduzir risco futuro.',
      'Com acompanhamento recorrente, seu time ganha resposta rápida para incidentes e uma esteira de melhorias constante.',
      'O resultado é um ativo digital confiável, estável e preparado para evoluir sem travar a operação.',
    ],
  },
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'transparent',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 400,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  opacity: 0.88,
  fontSize: '1.15rem',
  lineHeight: 1.7,
};

const detailTextStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  opacity: 0.9,
  fontSize: '1.08rem',
  lineHeight: 1.8,
};

const liveBrowserStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 18,
  border: `1px solid ${colors.neutral.border}`,
  background: '#F8FFFB',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: '24px minmax(0, 1fr)',
};

const liveBrowserTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  borderBottom: `1px solid ${colors.neutral.border}`,
  background: '#F8FFFB',
};

const liveDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#D1D5DB',
};

const liveBodyStyle: React.CSSProperties = {
  position: 'relative',
  padding: spacing[3],
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: spacing[3],
  background: colors.text.primary,
};

const skeleton = (w: string): React.CSSProperties => ({
  width: w,
  height: 6,
  borderRadius: 999,
  background: 'rgba(15, 23, 42, 0.12)',
});

const pillStyle: React.CSSProperties = {
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: 'rgba(122,212,157,0.2)',
  color: LIVE_TEXT_MUTED,
  fontSize: 9,
  fontWeight: 600,
  padding: '2px 8px',
};

const badgeStyle: React.CSSProperties = {
  position: 'absolute',
  right: spacing[3],
  bottom: spacing[3],
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: '#F8FFFB',
  color: LIVE_TEXT_MUTED,
  fontSize: 10,
  fontWeight: 600,
  padding: '4px 10px',
};

const SolutionAnimation: React.FC<{ type: SolutionContent['animation'] }> = ({ type }) => {
  if (type === 'systems') {
    return (
      <motion.div style={liveBrowserStyle} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div style={liveBrowserTopStyle}><span style={liveDotStyle} /><span style={liveDotStyle} /><span style={liveDotStyle} /></div>
        <div style={liveBodyStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: spacing[2] }}>
            {['+28%', '132', '99.9%'].map((v, idx) => (
              <div key={v} style={{ borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '6px 8px', display: 'grid', gap: 4 }}>
                <div style={skeleton('60%')} />
                <motion.span style={{ fontSize: 11, fontWeight: 700, color: LIVE_TEXT_MUTED }} animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}>
                  {v}
                </motion.span>
              </div>
            ))}
          </div>
          <div style={{ height: 56, borderRadius: 10, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '8px 10px', display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            {[22, 30, 18, 38, 28, 46, 36].map((h, idx) => (
              <motion.span key={idx} style={{ width: 10, height: h, borderRadius: 4, background: LIVE_ACCENT }} animate={{ height: [h - 4, h + 4, h] }} transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.08 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB' }} />
            <motion.span style={{ height: 2, borderRadius: 999, background: LIVE_ACCENT, transformOrigin: 'left center' }} animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.1, repeat: Infinity }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB' }} />
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'saas') {
    return (
      <motion.div style={liveBrowserStyle} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div style={liveBrowserTopStyle}><span style={liveDotStyle} /><span style={liveDotStyle} /><span style={liveDotStyle} /></div>
        <div style={liveBodyStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
            {['Basic', 'Pro'].map((plan, idx) => (
              <div key={plan} style={{ borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '6px 8px', display: 'grid', gap: 4 }}>
                <div style={skeleton('65%')} />
                <motion.span style={pillStyle} animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 1.8, repeat: Infinity, delay: idx * 0.2 }}>{plan}</motion.span>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: 10, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '8px 10px', display: 'grid', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 8 }}>
              <div style={skeleton('48%')} />
              <motion.span style={{ fontSize: 12, fontWeight: 700, color: LIVE_TEXT_MUTED }} animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 2.1, repeat: Infinity }}>
                R$ 12.4k
              </motion.span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 34 }}>
              {[10, 14, 12, 17, 16, 22, 20].map((h, idx) => (
                <motion.span key={idx} style={{ width: 6, height: h, borderRadius: 999, background: LIVE_ACCENT }} animate={{ height: [h - 2, h + 3, h] }} transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.09 }} />
              ))}
            </div>
          </div>
          <motion.div style={badgeStyle} animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -4] }} transition={{ duration: 2.8, repeat: Infinity }}>
            +3 assinaturas
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (type === 'figma') {
    return (
      <motion.div style={liveBrowserStyle} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div style={liveBrowserTopStyle}><span style={liveDotStyle} /><span style={liveDotStyle} /><span style={liveDotStyle} /></div>
        <div style={liveBodyStyle}>
          <div style={{ borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '6px 8px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: spacing[2] }}>
            <div style={skeleton('60%')} />
            <span style={pillStyle}>Figma</span>
          </div>
          <div style={{ position: 'relative', height: 98, borderRadius: 10, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 8, top: 10, width: 64, height: 76, borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: 6, display: 'grid', gap: 4 }}>
              <div style={skeleton('80%')} /><div style={skeleton('62%')} /><div style={{ width: '100%', height: 26, borderRadius: 6, background: LIVE_ACCENT }} />
            </div>
            <div style={{ position: 'absolute', left: 130, top: 16, width: 64, height: 66, borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: 6, display: 'grid', gap: 4 }}>
              <div style={skeleton('72%')} /><div style={{ width: '100%', height: 30, borderRadius: 6, background: LIVE_ACCENT }} />
            </div>
            <motion.span style={{ position: 'absolute', left: 78, top: 56, minWidth: 44, borderRadius: 6, border: `1px solid ${LIVE_ACCENT}`, background: '#F1FFF6', color: LIVE_TEXT_MUTED, fontSize: 9, fontWeight: 600, padding: '3px 8px' }} animate={{ x: [0, 22, 46, 22, 0], y: [0, -8, -14, -8, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
              card
            </motion.span>
            <motion.span style={{ position: 'absolute', left: 70, top: 66, color: LIVE_TEXT_MUTED }} animate={{ x: [0, 22, 46, 22, 0], y: [0, -8, -14, -8, 0], rotate: [0, -2, -4, -2, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
              <MousePointer2 size={14} strokeWidth={2.2} />
            </motion.span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: spacing[2] }}>
            <div style={skeleton('52%')} />
            <span style={pillStyle}>Wireframe → UI</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'support') {
    return (
      <motion.div style={liveBrowserStyle} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div style={liveBrowserTopStyle}><span style={liveDotStyle} /><span style={liveDotStyle} /><span style={liveDotStyle} /></div>
        <div style={liveBodyStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
            {['99.98%', '0 críticos'].map((v, idx) => (
              <div key={v} style={{ borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '6px 8px', display: 'grid', gap: 4 }}>
                <div style={skeleton('60%')} />
                <motion.span style={{ fontSize: 11, fontWeight: 700, color: LIVE_TEXT_MUTED }} animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}>
                  {v}
                </motion.span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gap: 6, borderRadius: 10, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '8px 10px' }}>
            {['API gateway', 'Banco principal', 'Checkout'].map((s, idx) => (
              <div key={s} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 6 }}>
                <motion.span style={{ width: 8, height: 8, borderRadius: '50%', background: LIVE_ACCENT, boxShadow: `0 0 0 4px ${LIVE_ACCENT}` }} animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.8, repeat: Infinity, delay: idx * 0.2 }} />
                <span style={{ ...skeleton('72%'), width: '100%' }} />
                <span style={pillStyle}>OK</span>
              </div>
            ))}
          </div>
          <motion.div style={badgeStyle} animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -4] }} transition={{ duration: 2.7, repeat: Infinity }}>
            +7 alertas resolvidos
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div style={liveBrowserStyle} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <div style={liveBrowserTopStyle}><span style={liveDotStyle} /><span style={liveDotStyle} /><span style={liveDotStyle} /></div>
      <div style={liveBodyStyle}>
        <div style={{ borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '6px 8px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: spacing[2] }}>
          <div style={skeleton('68%')} />
          <span style={pillStyle}>API</span>
        </div>
        <div style={{ position: 'relative', height: 94, borderRadius: 10, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 8, top: 12, width: 52, borderRadius: 7, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '4px 6px', display: 'grid', gap: 4 }}>
            <div style={skeleton('78%')} />
            <div style={skeleton('58%')} />
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 64, borderRadius: 8, border: `1px solid ${LIVE_ACCENT}`, background: '#F1FFF6', padding: '5px 7px', display: 'grid', gap: 4 }}>
            <div style={skeleton('62%')} />
            <div style={{ width: '100%', height: 14, borderRadius: 6, background: LIVE_ACCENT }} />
          </div>
          <div style={{ position: 'absolute', left: 140, top: 10, width: 52, borderRadius: 7, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '4px 6px', display: 'grid', gap: 4 }}>
            <div style={skeleton('74%')} />
            <div style={skeleton('52%')} />
          </div>
          <div style={{ position: 'absolute', left: 140, top: 56, width: 52, borderRadius: 7, border: `1px solid ${LIVE_ACCENT}`, background: '#F8FFFB', padding: '4px 6px', display: 'grid', gap: 4 }}>
            <div style={skeleton('70%')} />
            <div style={skeleton('50%')} />
          </div>
          <motion.span style={{ position: 'absolute', left: 60, top: 31, width: 45, height: 2, borderRadius: 999, background: LIVE_ACCENT, transform: 'rotate(-8deg)', transformOrigin: 'left center' }} animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.span style={{ position: 'absolute', left: 108, top: 34, width: 32, height: 2, borderRadius: 999, background: LIVE_ACCENT, transform: 'rotate(-12deg)', transformOrigin: 'left center' }} animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: 0.25 }} />
          <motion.span style={{ position: 'absolute', left: 108, top: 57, width: 32, height: 2, borderRadius: 999, background: LIVE_ACCENT, transform: 'rotate(14deg)', transformOrigin: 'left center' }} animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: 0.45 }} />
          <motion.span style={{ position: 'absolute', left: 66, top: 28, width: 8, height: 8, borderRadius: '50%', background: LIVE_TEXT_MUTED, boxShadow: `0 0 0 3px ${LIVE_ACCENT}` }} animate={{ x: [0, 26, 40], y: [0, -2, -5], opacity: [0, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity }} />
          <motion.span style={{ position: 'absolute', left: 106, top: 36, width: 8, height: 8, borderRadius: '50%', background: LIVE_TEXT_MUTED, boxShadow: `0 0 0 3px ${LIVE_ACCENT}` }} animate={{ x: [0, 22, 30], y: [0, -3, -6], opacity: [0, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: 0.45 }} />
          <motion.span style={{ position: 'absolute', left: 106, top: 54, width: 8, height: 8, borderRadius: '50%', background: LIVE_TEXT_MUTED, boxShadow: `0 0 0 3px ${LIVE_ACCENT}` }} animate={{ x: [0, 22, 30], y: [0, 3, 6], opacity: [0, 1, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: 0.9 }} />
          <span style={{ ...pillStyle, position: 'absolute', left: 75, top: 70 }}>sync</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: spacing[2] }}>
          <div style={skeleton('56%')} />
          <motion.span style={pillStyle} animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.7, repeat: Infinity }}>
            Online
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export async function getStaticPaths() {
  const paths = (Object.keys(SOLUTIONS) as SolutionSlug[]).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug as SolutionSlug;
  const solution = SOLUTIONS[slug];
  if (!solution) return { notFound: true };
  return { props: { slug } };
}

const SolutionPage: React.FC<{ slug: SolutionSlug }> = ({ slug }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];
  const solution = SOLUTIONS[slug];

  return (
    <>
      <SEO
        title={solution.title}
        description={solution.description}
        canonical={solution.canonical}
      />
      <main style={pageStyle}>
        <div
          style={{
            width: '100%',
            maxWidth: containerMaxWidth.wide,
            margin: '0 auto',
            paddingLeft: paddingX,
            paddingRight: paddingX,
            display: 'grid',
            gap: spacing[12],
          }}
        >
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: isMd ? '1.05fr 0.95fr' : '1fr',
              alignItems: 'center',
              gap: spacing[8],
            }}
          >
            <div style={{ display: 'grid', gap: spacing[5] }}>
              <h1 style={titleStyle}>{solution.title}</h1>
              <p style={subtitleStyle}>{solution.subtitle}</p>
              <div>
                <ButtonCta
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.href = '/#precos';
                  }}
                >
                  Quero avançar com esse projeto
                </ButtonCta>
              </div>
            </div>
            <SolutionAnimation type={solution.animation} />
          </section>

          <section style={{ display: 'grid', gap: spacing[5] }}>
            {solution.details.map((text, idx) => (
              <p key={idx} style={detailTextStyle}>
                {text}
              </p>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default SolutionPage;
