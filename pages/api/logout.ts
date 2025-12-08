import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  // Clear the cookie
  res.setHeader('Set-Cookie', `console_auth=deleted; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`)
  return res.status(200).json({ success: true })
}
