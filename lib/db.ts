import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
 throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Tipos para o banco de dados
export interface QuoteRequest {
 id?: number;
 name: string;
 phone: string;
 email: string;
 company: string;
 investment: string;
 project_type: string;
 urgency: string;
 details: string;
 created_at?: Date;
 updated_at?: Date;
}
