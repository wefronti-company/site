/**
 * Estatísticas da dashboard admin.
 * Usado tanto pela API quanto por getServerSideProps para evitar delay de carregamento.
 */
import { getSecurityEventCount, getSecurityEvents } from './securityEventsDb';
import { getPageViewsToday, getPageViewsThisWeek, getCountryCounts } from './siteViewsDb';

export interface DashboardStats {
  pageViews: { today: number; thisWeek: number };
  security: {
    countLast24h: number;
    recentEvents: Array<{
      id: string;
      tipo: string;
      ip: string | null;
      path: string | null;
      criado_em: string;
    }>;
  };
  countryCounts: Record<string, number>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [pageViewsToday, pageViewsWeek, securityCount, securityEvents, countryCounts] =
    await Promise.all([
      getPageViewsToday(),
      getPageViewsThisWeek(),
      getSecurityEventCount(24),
      getSecurityEvents(10, 24),
      getCountryCounts(30),
    ]);

  return {
    pageViews: { today: pageViewsToday, thisWeek: pageViewsWeek },
    security: {
      countLast24h: securityCount,
      recentEvents: securityEvents.map((ev) => ({
        id: ev.id,
        tipo: ev.tipo,
        ip: ev.ip,
        path: ev.path,
        criado_em: ev.criado_em,
      })),
    },
    countryCounts: countryCounts ?? {},
  };
}
