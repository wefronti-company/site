import Redis from 'ioredis';

let redis: Redis | null = null;

/**
 * Obtém instância do Redis (singleton)
 * Se REDIS_URL não estiver configurado, retorna null (fallback para in-memory)
 */
export function getRedisClient(): Redis | null {
  // Se já existe instância, retornar
  if (redis) return redis;

  // Se não tem REDIS_URL configurado, retornar null
  if (!process.env.REDIS_URL) {
    console.warn('[REDIS] REDIS_URL não configurado. Rate limiting usará memória (não recomendado para produção).');
    return null;
  }

  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('[REDIS ERROR]', err);
    });

    redis.on('connect', () => {
      console.log('[REDIS] Conectado com sucesso');
    });

    // Conectar de forma assíncrona
    redis.connect().catch((err) => {
      console.error('[REDIS] Falha na conexão:', err);
      redis = null;
    });

    return redis;
  } catch (error) {
    console.error('[REDIS] Erro ao criar cliente:', error);
    return null;
  }
}

/**
 * Rate limiting com Redis
 * @param key - Chave única (ex: IP do cliente)
 * @param maxAttempts - Número máximo de tentativas
 * @param windowMs - Janela de tempo em milissegundos
 * @returns true se permitido, false se excedeu limite
 */
export async function checkRateLimitRedis(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): Promise<boolean> {
  const client = getRedisClient();

  // Fallback: se Redis não disponível, retornar true (permitir)
  if (!client) {
    return true;
  }

  try {
    const redisKey = `rate_limit:${key}`;
    const current = await client.incr(redisKey);

    // Se é a primeira tentativa, definir expiração
    if (current === 1) {
      await client.pexpire(redisKey, windowMs);
    }

    return current <= maxAttempts;
  } catch (error) {
    console.error('[REDIS] Erro ao verificar rate limit:', error);
    // Em caso de erro, permitir (fail-open para não bloquear usuários legítimos)
    return true;
  }
}

/**
 * Limpar rate limit de uma chave específica
 */
export async function clearRateLimit(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(`rate_limit:${key}`);
  } catch (error) {
    console.error('[REDIS] Erro ao limpar rate limit:', error);
  }
}
