/**
 * API para estatísticas da dashboard (admin).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/auth';
import { getSecurityEventCount, getSecurityEvents } from '../../../lib/securityEventsDb';
import { getPageViewsToday, getPageViewsThisWeek, getCountryCounts } from '../../../lib/siteViewsDb';

function getTokenFromCookie(req: NextApiRequest): string | null {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }

  try {
    const [pageViewsToday, pageViewsWeek, securityCount, securityEvents, countryCounts] =
      await Promise.all([
        getPageViewsToday(),
        getPageViewsThisWeek(),
        getSecurityEventCount(24),
        getSecurityEvents(10, 24),
        getCountryCounts(30),
      ]);

    return res.status(200).json({
      pageViews: {
        today: pageViewsToday,
        thisWeek: pageViewsWeek,
      },
      security: {
        countLast24h: securityCount,
        recentEvents: securityEvents,
      },
      countryCounts,
    });
  } catch (e) {
    console.error('[admin/dashboard-stats]', e);
    return res.status(500).json({ error: 'Erro ao carregar estatísticas' });
  }
}
