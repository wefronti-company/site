import type { NextApiRequest, NextApiResponse } from 'next';
import { sql, QuoteRequest } from '../../lib/db';

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  id?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { name, whatsapp, email, company, role, revenue, challenge, timeline } = req.body;

    // Validação básica
    if (!name || !whatsapp || !email || !company || !role || !revenue || !challenge || !timeline) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios'
      });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Inserir no banco de dados
    const result = await sql`
      INSERT INTO quote_requests (
        name, 
        whatsapp, 
        email, 
        company, 
        role, 
        revenue, 
        challenge, 
        timeline
      )
      VALUES (
        ${name},
        ${whatsapp},
        ${email},
        ${company},
        ${role},
        ${revenue},
        ${challenge},
        ${timeline}
      )
      RETURNING id
    `;

    const insertedId = result[0]?.id;

    // Log para monitoramento (opcional - remover em produção)
    console.log(`Nova solicitação de orçamento recebida: ID ${insertedId}, Email: ${email}`);

    return res.status(201).json({
      success: true,
      message: 'Solicitação enviada com sucesso! Entraremos em contato em breve.',
      id: insertedId
    });

  } catch (error) {
    console.error('Erro ao salvar solicitação de orçamento:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar sua solicitação. Tente novamente mais tarde.'
    });
  }
}
