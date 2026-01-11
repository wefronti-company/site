import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { startTime, endTime, eventTypeId } = req.query;

  try {
    const response = await fetch(
      `https://api.cal.com/v1/availability?apiKey=${process.env.KEY_CAL_LIVE}&startTime=${startTime}&endTime=${endTime}&eventTypeId=${eventTypeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch availability');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Cal.com availability error:', error);
    return res.status(500).json({ error: 'Failed to fetch availability' });
  }
}
