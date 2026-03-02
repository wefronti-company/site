import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CountryList } from '../../../components/admin/CountryList';
import { theme } from '../../../styles/theme';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { Eye, Shield } from 'lucide-react';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/auth';
import { getDashboardStats, type DashboardStats } from '../../../lib/adminDashboardStats';

const WorldMapClient = dynamic(
  () => import('../../../components/admin/WorldMap').then((m) => ({ default: m.WorldMap })),
  { ssr: false }
);

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const cardWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: spacing[6],
  marginBottom: spacing[8],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  padding: spacing[6],
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.9,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
};

const cardValueStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  margin: 0,
};

const cardHintStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.6,
  margin: 0,
};

const eventsListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
};

const eventItemStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: spacing[2],
  padding: spacing[2],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  fontSize: fontSizes.sm,
  color: colors.text.light,
};

const tipoLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  fontSize: fontSizes.xs,
  opacity: 0.9,
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    ip_bloqueado: 'IP bloqueado',
    bot_suspeito: 'Bot suspeito',
    origem_invalida: 'Origem inválida',
    path_traversal: 'Path traversal',
    arquivo_sensivel: 'Arquivo sensível',
    admin_login_falhou: 'Login admin falhou',
  };
  return labels[tipo] || tipo;
}

function getTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const getServerSideProps: GetServerSideProps<{ stats: DashboardStats }> = async (ctx) => {
  const token = getTokenFromCookie(ctx.req.headers.cookie);
  if (!token || !(await verifySessionToken(token))) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  try {
    const stats = await getDashboardStats();
    return { props: { stats } };
  } catch (e) {
    console.error('[admin/dashboard] getServerSideProps', e);
    const fallback: DashboardStats = {
      pageViews: { today: 0, thisWeek: 0 },
      security: { countLast24h: 0, recentEvents: [] },
      countryCounts: {},
    };
    return { props: { stats: fallback } };
  }
};

interface PageProps {
  stats: DashboardStats;
}

const AdminDashboardPage: React.FC<PageProps> = ({ stats }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  return (
    <>
      <Head>
        <title>Dashboard | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Visão geral</h1>

        <div style={cardWrapStyle}>
          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Eye size={20} aria-hidden style={{ color: colors.blue.primary }} />
              Visitas hoje
            </p>
            <p style={{ ...cardValueStyle, color: colors.blue.primary }}>
              {stats.pageViews.today}
            </p>
            <p style={cardHintStyle}>Pageviews no site público</p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Eye size={20} aria-hidden style={{ color: colors.blue.primary }} />
              Visitas (7 dias)
            </p>
            <p style={{ ...cardValueStyle, color: colors.blue.primary }}>
              {stats.pageViews.thisWeek}
            </p>
            <p style={cardHintStyle}>Últimos 7 dias</p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Shield size={20} aria-hidden style={{ color: '#eab308' }} />
              Eventos de segurança
            </p>
            <p style={{ ...cardValueStyle, color: '#eab308' }}>
              {stats.security.countLast24h}
            </p>
            <p style={cardHintStyle}>Últimas 24 horas</p>
          </div>
        </div>

        {stats.security.recentEvents.length > 0 && (
          <section style={{ marginTop: spacing[6] }}>
            <h2 style={{ ...pageTitleStyle, fontSize: fontSizes.base, marginBottom: spacing[3] }}>
              Eventos de segurança recentes
            </h2>
            <ul style={eventsListStyle}>
              {stats.security.recentEvents.map((ev) => (
                <li key={ev.id} style={eventItemStyle}>
                  <span style={tipoLabelStyle}>{getTipoLabel(ev.tipo)}</span>
                  {ev.ip && <span>IP: {ev.ip}</span>}
                  {ev.path && <span>Path: {ev.path}</span>}
                  <span style={{ opacity: 0.7 }}>{formatDateTime(ev.criado_em)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {stats.security.countLast24h === 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[6],
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 12,
              marginTop: spacing[6],
            }}
          >
            <Shield size={24} style={{ color: '#22c55e', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.text.light }}>
              Nenhum evento de segurança nas últimas 24 horas. O site está protegido.
            </p>
          </div>
        )}

        <section
          style={{
            marginTop: spacing[8],
            display: 'grid',
            gridTemplateColumns: isMd ? 'minmax(0, 1fr) minmax(280px, 320px)' : '1fr',
            gap: spacing[8],
            alignItems: 'start',
          }}
        >
          <div
            style={{
              backgroundColor: colors.admin.inactive,
              border: `1px solid ${colors.neutral.borderDark}`,
              borderRadius: 16,
              padding: spacing[6],
              overflow: 'hidden',
              minHeight: 280,
            }}
          >
            <h2 style={{ ...pageTitleStyle, fontSize: fontSizes.base, marginBottom: spacing[4] }}>
              Visitas por país
            </h2>
            <WorldMapClient countryCounts={stats.countryCounts ?? {}} />
          </div>
          <div
            style={{
              backgroundColor: colors.admin.inactive,
              border: `1px solid ${colors.neutral.borderDark}`,
              borderRadius: 16,
              padding: spacing[6],
              maxHeight: isMd ? 360 : 400,
              overflowY: 'auto',
            }}
          >
            <CountryList countryCounts={stats.countryCounts ?? {}} />
          </div>
        </section>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
