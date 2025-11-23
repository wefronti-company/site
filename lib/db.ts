import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Tipos para o banco de dados
export interface QuoteRequest {
  id?: number;
  name: string;
  whatsapp: string;
  email: string;
  company: string;
  role: string;
  revenue: string;
  challenge: string;
  timeline: string;
  privacy_consent: boolean;  // LGPD: Consentimento do usuário
  consented_at?: Date;       // LGPD: Data/hora do consentimento
  created_at?: Date;
}
