import type { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory active visitors tracker for demo purposes.
// Keeps a map of visitorId -> lastSeen timestamp (ms).
// Returns the number of visitors seen in the last WINDOW_MS.

const WINDOW_MS = 60 * 1000; // 60 seconds

// Module-level map persists across invocations in the same server process.
const activeVisitors: Map<string, number> = new Map();

function cleanup() {
  const threshold = Date.now() - WINDOW_MS;
  for (const [id, ts] of activeVisitors.entries()) {
    if (ts < threshold) activeVisitors.delete(id);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { visitorId } = req.query;
    if (visitorId && typeof visitorId === 'string') {
      activeVisitors.set(visitorId, Date.now());
    }

    cleanup();

    res.status(200).json({ active: activeVisitors.size });
  } catch (err) {
    console.error('[API/active-users] error', err);
    res.status(500).json({ error: 'internal' });
  }
}
