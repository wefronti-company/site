import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, end, name, email, metadata } = req.body;

  if (!start || !end || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const eventTypeId = process.env.EVENT_ID;
  
  if (!eventTypeId) {
    return res.status(500).json({ error: 'Event ID not configured' });
  }

  try {
    const response = await fetch(
      `https://api.cal.com/v1/bookings?apiKey=${process.env.KEY_CAL_LIVE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventTypeId: parseInt(eventTypeId),
          start,
          end,
          responses: {
            name,
            email,
            guests: [],
            notes: metadata?.notes || '',
          },
          metadata: metadata || {},
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Cal.com booking error:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
}
