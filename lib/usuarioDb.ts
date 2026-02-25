/**
 * Persistência de usuários (indique e ganhe) e tokens de reset de senha.
 */
import { createHash } from 'crypto';
import { sql } from './db';
import { sanitizeTextForStorage } from './sanitize-server';

export interface Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  codigoReferencia: string;
  celular?: string;
  dataNascimento?: string;
  cpf?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  chavePix?: string;
  banco?: string;
  nomeTitular?: string;
  whatsappNumero?: string;
  whatsappMensagem?: string;
  /** false quando o participante está banido (link de indicação indisponível; dashboard continua acessível). */
  ativo?: boolean;
}

function rowToUsuario(row: Record<string, unknown>): Usuario {
  const d = (v: unknown) => (v != null && v !== '' ? String(v) : undefined);
  const dateVal = row.data_nascimento;
  const dataNascStr =
    dateVal instanceof Date
      ? dateVal.toISOString().slice(0, 10)
      : typeof dateVal === 'string'
        ? dateVal.slice(0, 10)
        : undefined;
  return {
    id: String(row.id ?? ''),
    nomeCompleto: String(row.nome_completo ?? ''),
    email: String(row.email ?? ''),
    codigoReferencia: String(row.codigo_referencia ?? ''),
    celular: d(row.celular),
    dataNascimento: dataNascStr,
    cpf: d(row.cpf),
    enderecoLogradouro: d(row.endereco_logradouro),
    enderecoNumero: d(row.endereco_numero),
    enderecoComplemento: d(row.endereco_complemento),
    enderecoBairro: d(row.endereco_bairro),
    enderecoCidade: d(row.endereco_cidade),
    enderecoUf: d(row.endereco_uf),
    enderecoCep: d(row.endereco_cep),
    chavePix: d(row.chave_pix),
    banco: d(row.banco),
    nomeTitular: d(row.nome_titular),
    whatsappNumero: d(row.whatsapp_numero),
    whatsappMensagem: d(row.whatsapp_mensagem),
    ativo: row.ativo === undefined ? true : !!row.ativo,
  };
}

function gerarCodigoReferencia(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = 'wf-';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export interface CreateUsuarioInput {
  nomeCompleto: string;
  email: string;
  senhaHash: string;
}

export async function createUsuario(input: CreateUsuarioInput): Promise<Usuario> {
  if (!sql) throw new Error('Banco não configurado');
  const email = input.email.toLowerCase().trim();
  const nome = input.nomeCompleto.trim().slice(0, 200);
  let codigoRef = gerarCodigoReferencia();
  for (let t = 0; t < 20; t++) {
    const existing = await sql`SELECT 1 FROM usuarios WHERE codigo_referencia = ${codigoRef} LIMIT 1`;
    if (existing.length === 0) break;
    codigoRef = gerarCodigoReferencia();
  }
  const rows = await sql`
    INSERT INTO usuarios (nome_completo, email, codigo_acesso_hash, codigo_referencia)
    VALUES (${nome}, ${email}, ${input.senhaHash}, ${codigoRef})
    RETURNING id, nome_completo, email, codigo_referencia
  `;
  const row = rows[0] as Record<string, unknown>;
  return rowToUsuario(row);
}

/** Busca usuário por e-mail (ativo ou banido — para login, esqueci-senha, etc.). */
export async function getUsuarioByEmail(email: string): Promise<Usuario | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, banco, nome_titular, whatsapp_numero, whatsapp_mensagem
      FROM usuarios
      WHERE email = ${email.toLowerCase().trim()}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    return row ? rowToUsuario(row) : null;
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === '42703') {
      const rows = await sql`
        SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
               endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
               endereco_cidade, endereco_uf, endereco_cep, chave_pix
        FROM usuarios
        WHERE email = ${email.toLowerCase().trim()}
        LIMIT 1
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      return row ? rowToUsuario(row) : null;
    }
    throw e;
  }
}

/** Busca usuário por ID (ativo ou banido — participante banido continua acessando o dashboard). */
export async function getUsuarioById(id: string): Promise<Usuario | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, banco, nome_titular, whatsapp_numero, whatsapp_mensagem, ativo
      FROM usuarios
      WHERE id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    return row ? rowToUsuario(row) : null;
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === '42703') {
      const rows = await sql`
        SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
               endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
               endereco_cidade, endereco_uf, endereco_cep, chave_pix, ativo
        FROM usuarios
        WHERE id = ${id}
        LIMIT 1
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      return row ? rowToUsuario(row) : null;
    }
    throw e;
  }
}

export async function getUsuarioByCodigoReferencia(codigoReferencia: string): Promise<Usuario | null> {
  if (!sql) return null;
  const ref = String(codigoReferencia || '').trim().toLowerCase();
  if (!ref) return null;
  try {
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, banco, nome_titular, whatsapp_numero, whatsapp_mensagem
      FROM usuarios
      WHERE LOWER(codigo_referencia) = ${ref} AND ativo = true
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    return row ? rowToUsuario(row) : null;
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === '42703') {
      const rows = await sql`
        SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
               endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
               endereco_cidade, endereco_uf, endereco_cep, chave_pix
        FROM usuarios
        WHERE LOWER(codigo_referencia) = ${ref} AND ativo = true
        LIMIT 1
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      return row ? rowToUsuario(row) : null;
    }
    throw e;
  }
}

/** Formato esperado do código de referência (wf- + 6 caracteres alfanuméricos; case-insensitive para compatibilidade). */
const REF_CODIGO_REGEX = /^wf-[a-z0-9]{6}$/i;

export function validarCodigoReferencia(ref: string): boolean {
  return REF_CODIGO_REGEX.test(String(ref || '').trim());
}

/** Busca usuário por código de referência sem filtrar por ativo (para checar se link está congelado/banido). */
export async function getUsuarioByCodigoReferenciaIncludeInativo(codigoReferencia: string): Promise<(Usuario & { ativo: boolean }) | null> {
  if (!sql) return null;
  const ref = String(codigoReferencia || '').trim().toLowerCase();
  if (!ref) return null;
  try {
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, whatsapp_numero, whatsapp_mensagem, ativo
      FROM usuarios
      WHERE LOWER(codigo_referencia) = ${ref}
      LIMIT 1
    `;
    const row = rows[0] as (Record<string, unknown> & { ativo?: boolean }) | undefined;
    if (!row) return null;
    const usuario = rowToUsuario(row);
    return { ...usuario, ativo: row.ativo !== false };
  } catch (e: unknown) {
    if ((e as { code?: string })?.code !== '42703') throw e;
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, ativo
      FROM usuarios
      WHERE LOWER(codigo_referencia) = ${ref}
      LIMIT 1
    `;
    const row = rows[0] as (Record<string, unknown> & { ativo?: boolean }) | undefined;
    if (!row) return null;
    const usuario = rowToUsuario(row);
    return { ...usuario, ativo: row.ativo !== false };
  }
}

/**
 * Registra um acesso via link de indicação (?ref=).
 * Se ipHash for informado, só registra se não existir outro acesso do mesmo IP para o mesmo indicador nas últimas 24h (anti-fraude).
 */
export async function registrarAcessoIndicacao(codigoReferencia: string, ipHash?: string): Promise<boolean> {
  if (!sql) return false;
  const ref = String(codigoReferencia || '').trim().toLowerCase();
  if (!ref || !validarCodigoReferencia(ref)) return false;
  const usuario = await getUsuarioByCodigoReferencia(ref);
  if (!usuario) return false;

  if (ipHash) {
    const recentes = await sql`
      SELECT 1 FROM indicacao_acessos
      WHERE usuario_id = ${usuario.id} AND ip_hash = ${ipHash}
        AND criado_em > NOW() - INTERVAL '24 hours'
      LIMIT 1
    `;
    if (recentes.length > 0) return false;
  }

  await sql`
    INSERT INTO indicacao_acessos (usuario_id, ip_hash)
    VALUES (${usuario.id}, ${ipHash || null})
  `;
  return true;
}

/** Retorna o total de acessos (cliques) no link de indicação do usuário. */
export async function getTotalIndicacoes(usuarioId: string): Promise<number> {
  if (!sql) return 0;
  const rows = await sql`
    SELECT COUNT(*)::text as count
    FROM indicacao_acessos
    WHERE usuario_id = ${usuarioId}
  `;
  const row = Array.isArray(rows) ? (rows[0] as { count?: string } | undefined) : undefined;
  const count = row?.count;
  return count ? parseInt(count, 10) : 0;
}

/** Item da listagem de participantes (admin). */
export interface ParticipanteListItem {
  id: string;
  nomeCompleto: string;
  email: string;
  codigoReferencia: string;
  cliques: number;
  valorPago: number;
  valorPendente: number;
  ativo: boolean;
  chavePix?: string;
  banco?: string;
  nomeTitular?: string;
}

function rowToParticipanteListItem(row: Record<string, unknown> & { cliques: number; ativo: boolean }): ParticipanteListItem {
  return {
    id: String(row.id ?? ''),
    nomeCompleto: String(row.nome_completo ?? ''),
    email: String(row.email ?? ''),
    codigoReferencia: String(row.codigo_referencia ?? ''),
    cliques: Number(row.cliques ?? 0),
    valorPago: 0,
    valorPendente: 0,
    ativo: row.ativo !== false,
    chavePix: row.chave_pix != null && row.chave_pix !== '' ? String(row.chave_pix) : undefined,
    banco: row.banco != null && row.banco !== '' ? String(row.banco) : undefined,
    nomeTitular: row.nome_titular != null && row.nome_titular !== '' ? String(row.nome_titular) : undefined,
  };
}

/** Lista todos os participantes (ativos e banidos) com contagem de cliques. */
export async function listParticipantesIndicacao(): Promise<ParticipanteListItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT u.id, u.nome_completo, u.email, u.codigo_referencia, u.ativo, u.chave_pix, u.banco, u.nome_titular,
             COALESCE((SELECT COUNT(*)::int FROM indicacao_acessos a WHERE a.usuario_id = u.id), 0) AS cliques
      FROM usuarios u
      ORDER BY u.criado_em DESC
    `;
    return (rows as (Record<string, unknown> & { cliques: number; ativo: boolean })[]).map(rowToParticipanteListItem);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === '42703') {
      const rows = await sql`
        SELECT u.id, u.nome_completo, u.email, u.codigo_referencia, u.ativo, u.chave_pix,
               COALESCE((SELECT COUNT(*)::int FROM indicacao_acessos a WHERE a.usuario_id = u.id), 0) AS cliques
        FROM usuarios u
        ORDER BY u.criado_em DESC
      `;
      return (rows as (Record<string, unknown> & { cliques: number; ativo: boolean })[]).map(rowToParticipanteListItem);
    }
    throw e;
  }
}

/** Busca participantes por nome, e-mail, código de indicação ou CPF (admin; apenas ativos). */
export async function searchParticipantesIndicacao(q: string): Promise<ParticipanteListItem[]> {
  if (!sql) return [];
  const raw = String(q || '').trim();
  if (raw.length < 2) return [];
  const term = '%' + raw.replace(/%/g, '') + '%';
  const termLower = '%' + raw.toLowerCase().replace(/%/g, '') + '%';
  const cpfDigits = raw.replace(/\D/g, '');
  try {
    const rows = await sql`
      SELECT u.id, u.nome_completo, u.email, u.codigo_referencia, u.ativo, u.chave_pix, u.banco, u.nome_titular,
             COALESCE((SELECT COUNT(*)::int FROM indicacao_acessos a WHERE a.usuario_id = u.id), 0) AS cliques
      FROM usuarios u
      WHERE u.ativo = true
        AND (
          u.nome_completo ILIKE ${term}
          OR u.email ILIKE ${term}
          OR LOWER(u.codigo_referencia) LIKE ${termLower}
          OR (LENGTH(${cpfDigits}) >= 2 AND REPLACE(REPLACE(REPLACE(COALESCE(u.cpf, ''), '.', ''), '-', ''), ' ', '') LIKE ${'%' + cpfDigits + '%'})
        )
      ORDER BY u.nome_completo
      LIMIT 20
    `;
    return (rows as (Record<string, unknown> & { cliques: number; ativo: boolean })[]).map(rowToParticipanteListItem);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === '42703') {
      const rows = await sql`
        SELECT u.id, u.nome_completo, u.email, u.codigo_referencia, u.ativo, u.chave_pix,
               COALESCE((SELECT COUNT(*)::int FROM indicacao_acessos a WHERE a.usuario_id = u.id), 0) AS cliques
        FROM usuarios u
        WHERE u.ativo = true
          AND (
            u.nome_completo ILIKE ${term}
            OR u.email ILIKE ${term}
            OR LOWER(u.codigo_referencia) LIKE ${termLower}
            OR (LENGTH(${cpfDigits}) >= 2 AND REPLACE(REPLACE(REPLACE(COALESCE(u.cpf, ''), '.', ''), '-', ''), ' ', '') LIKE ${'%' + cpfDigits + '%'})
          )
        ORDER BY u.nome_completo
        LIMIT 20
      `;
      return (rows as (Record<string, unknown> & { cliques: number; ativo: boolean })[]).map(rowToParticipanteListItem);
    }
    throw e;
  }
}

/** Busca usuário por ID sem filtrar por ativo (uso admin). */
export async function getUsuarioByIdForAdmin(id: string): Promise<Usuario | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
             endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
             endereco_cidade, endereco_uf, endereco_cep, chave_pix, banco, nome_titular, whatsapp_numero, whatsapp_mensagem, ativo
      FROM usuarios
      WHERE id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    return row ? rowToUsuario(row) : null;
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === '42703') {
      const rows = await sql`
        SELECT id, nome_completo, email, codigo_referencia, celular, data_nascimento, cpf,
               endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro,
               endereco_cidade, endereco_uf, endereco_cep, chave_pix
        FROM usuarios
        WHERE id = ${id}
        LIMIT 1
      `;
      const row = rows[0] as Record<string, unknown> | undefined;
      return row ? rowToUsuario(row) : null;
    }
    throw e;
  }
}

/** Define se o participante está ativo (admin: banir/reativar). */
export async function setUsuarioAtivo(usuarioId: string, ativo: boolean): Promise<boolean> {
  if (!sql) return false;
  const rows = await sql`
    UPDATE usuarios SET ativo = ${ativo} WHERE id = ${usuarioId}
    RETURNING id
  `;
  return Array.isArray(rows) && rows.length > 0;
}

export interface UpdateUsuarioPerfilInput {
  nomeCompleto?: string;
  celular?: string;
  dataNascimento?: string;
  cpf?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  chavePix?: string;
  banco?: string;
  nomeTitular?: string;
  whatsappNumero?: string;
  whatsappMensagem?: string;
}

export async function updateUsuarioPerfil(
  usuarioId: string,
  input: UpdateUsuarioPerfilInput
): Promise<boolean> {
  if (!sql) return false;
  const set = (val: string | undefined, maxLen: number) =>
    val != null ? (sanitizeTextForStorage(val).slice(0, maxLen) || null) : undefined;
  const setDate = (val: string | undefined) =>
    val != null && val.trim() ? val.trim().slice(0, 10) : null;

  if (input.nomeCompleto !== undefined) {
    const nome = set(input.nomeCompleto, 200);
    if (nome) await sql`UPDATE usuarios SET nome_completo = ${nome} WHERE id = ${usuarioId}`;
  }
  if (input.celular !== undefined) {
    await sql`UPDATE usuarios SET celular = ${set(input.celular, 20)} WHERE id = ${usuarioId}`;
  }
  if (input.dataNascimento !== undefined) {
    const dt = setDate(input.dataNascimento);
    await sql`UPDATE usuarios SET data_nascimento = ${dt} WHERE id = ${usuarioId}`;
  }
  if (input.cpf !== undefined) {
    await sql`UPDATE usuarios SET cpf = ${set(input.cpf, 14)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoLogradouro !== undefined) {
    await sql`UPDATE usuarios SET endereco_logradouro = ${set(input.enderecoLogradouro, 150)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoNumero !== undefined) {
    await sql`UPDATE usuarios SET endereco_numero = ${set(input.enderecoNumero, 20)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoComplemento !== undefined) {
    await sql`UPDATE usuarios SET endereco_complemento = ${set(input.enderecoComplemento, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoBairro !== undefined) {
    await sql`UPDATE usuarios SET endereco_bairro = ${set(input.enderecoBairro, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoCidade !== undefined) {
    await sql`UPDATE usuarios SET endereco_cidade = ${set(input.enderecoCidade, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoUf !== undefined) {
    await sql`UPDATE usuarios SET endereco_uf = ${set(input.enderecoUf, 2)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoCep !== undefined) {
    await sql`UPDATE usuarios SET endereco_cep = ${set(input.enderecoCep, 10)} WHERE id = ${usuarioId}`;
  }
  if (input.chavePix !== undefined) {
    await sql`UPDATE usuarios SET chave_pix = ${set(input.chavePix, 255)} WHERE id = ${usuarioId}`;
  }
  if (input.banco !== undefined) {
    try {
      await sql`UPDATE usuarios SET banco = ${set(input.banco, 100)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.nomeTitular !== undefined) {
    try {
      await sql`UPDATE usuarios SET nome_titular = ${set(input.nomeTitular, 200)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.whatsappNumero !== undefined) {
    try {
      await sql`UPDATE usuarios SET whatsapp_numero = ${set(input.whatsappNumero, 20)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.whatsappMensagem !== undefined) {
    try {
      await sql`UPDATE usuarios SET whatsapp_mensagem = ${set(input.whatsappMensagem, 400)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  return true;
}

/** Atualiza perfil do usuário sem exigir ativo = true (uso admin: editar participante banido). */
export async function updateUsuarioPerfilByAdmin(
  usuarioId: string,
  input: UpdateUsuarioPerfilInput
): Promise<boolean> {
  if (!sql) return false;
  const set = (val: string | undefined, maxLen: number) =>
    val != null ? (sanitizeTextForStorage(val).slice(0, maxLen) || null) : undefined;
  const setDate = (val: string | undefined) =>
    val != null && val.trim() ? val.trim().slice(0, 10) : null;

  if (input.nomeCompleto !== undefined) {
    const nome = set(input.nomeCompleto, 200);
    if (nome) await sql`UPDATE usuarios SET nome_completo = ${nome} WHERE id = ${usuarioId}`;
  }
  if (input.celular !== undefined) {
    await sql`UPDATE usuarios SET celular = ${set(input.celular, 20)} WHERE id = ${usuarioId}`;
  }
  if (input.dataNascimento !== undefined) {
    const dt = setDate(input.dataNascimento);
    await sql`UPDATE usuarios SET data_nascimento = ${dt} WHERE id = ${usuarioId}`;
  }
  if (input.cpf !== undefined) {
    await sql`UPDATE usuarios SET cpf = ${set(input.cpf, 14)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoLogradouro !== undefined) {
    await sql`UPDATE usuarios SET endereco_logradouro = ${set(input.enderecoLogradouro, 150)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoNumero !== undefined) {
    await sql`UPDATE usuarios SET endereco_numero = ${set(input.enderecoNumero, 20)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoComplemento !== undefined) {
    await sql`UPDATE usuarios SET endereco_complemento = ${set(input.enderecoComplemento, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoBairro !== undefined) {
    await sql`UPDATE usuarios SET endereco_bairro = ${set(input.enderecoBairro, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoCidade !== undefined) {
    await sql`UPDATE usuarios SET endereco_cidade = ${set(input.enderecoCidade, 80)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoUf !== undefined) {
    await sql`UPDATE usuarios SET endereco_uf = ${set(input.enderecoUf, 2)} WHERE id = ${usuarioId}`;
  }
  if (input.enderecoCep !== undefined) {
    await sql`UPDATE usuarios SET endereco_cep = ${set(input.enderecoCep, 10)} WHERE id = ${usuarioId}`;
  }
  if (input.chavePix !== undefined) {
    await sql`UPDATE usuarios SET chave_pix = ${set(input.chavePix, 255)} WHERE id = ${usuarioId}`;
  }
  if (input.banco !== undefined) {
    try {
      await sql`UPDATE usuarios SET banco = ${set(input.banco, 100)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.nomeTitular !== undefined) {
    try {
      await sql`UPDATE usuarios SET nome_titular = ${set(input.nomeTitular, 200)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.whatsappNumero !== undefined) {
    try {
      await sql`UPDATE usuarios SET whatsapp_numero = ${set(input.whatsappNumero, 20)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  if (input.whatsappMensagem !== undefined) {
    try {
      await sql`UPDATE usuarios SET whatsapp_mensagem = ${set(input.whatsappMensagem, 400)} WHERE id = ${usuarioId}`;
    } catch (e: unknown) {
      if ((e as { code?: string })?.code !== '42703') throw e;
    }
  }
  return true;
}

function hashCodigo(codigo: string): string {
  return createHash('sha256').update(codigo).digest('hex');
}

/** Gera código de 6 dígitos para reset de senha. Expira em 1h. */
export async function createResetCodigo(usuarioId: string): Promise<string> {
  if (!sql) throw new Error('Banco não configurado');
  const codigo = String(Math.floor(100000 + Math.random() * 900000));
  const codigoHash = hashCodigo(codigo);
  const expiraEm = new Date(Date.now() + 60 * 60 * 1000);
  await sql`DELETE FROM usuario_reset_tokens WHERE usuario_id = ${usuarioId}`;
  await sql`
    INSERT INTO usuario_reset_tokens (usuario_id, token, expira_em)
    VALUES (${usuarioId}, ${codigoHash}, ${expiraEm})
  `;
  return codigo;
}

/** Valida email + código 6 dígitos. Retorna usuarioId se válido. */
export async function validarCodigoReset(email: string, codigo: string): Promise<string | null> {
  if (!sql || !codigo || codigo.length !== 6) return null;
  const codigoHash = hashCodigo(codigo);
  const rows = await sql`
    SELECT r.usuario_id
    FROM usuario_reset_tokens r
    JOIN usuarios u ON u.id = r.usuario_id AND u.email = ${email.toLowerCase().trim()}
    WHERE r.token = ${codigoHash}
      AND r.usado = false
      AND r.expira_em > NOW()
    LIMIT 1
  `;
  const row = rows[0] as { usuario_id: string } | undefined;
  return row ? row.usuario_id : null;
}

/** Valida código, atualiza senha e marca como usado */
export async function consumirCodigoEAtualizarSenha(
  email: string,
  codigo: string,
  novaSenhaHash: string
): Promise<boolean> {
  if (!sql || !codigo || codigo.length !== 6) return false;
  const codigoHash = hashCodigo(codigo);
  const rows = await sql`
    UPDATE usuario_reset_tokens r
    SET usado = true
    FROM usuarios u
    WHERE r.usuario_id = u.id
      AND u.email = ${email.toLowerCase().trim()}
      AND r.token = ${codigoHash}
      AND r.usado = false
      AND r.expira_em > NOW()
    RETURNING r.usuario_id
  `;
  const usuarioId = (rows[0] as { usuario_id?: string } | undefined)?.usuario_id;
  if (!usuarioId) return false;
  await sql`
    UPDATE usuarios
    SET codigo_acesso_hash = ${novaSenhaHash}
    WHERE id = ${usuarioId}
  `;
  return true;
}
