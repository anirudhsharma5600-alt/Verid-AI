// ─── In-memory rate limiter ───
// Per-IP: max 1 request per 3 seconds.
// Global:  max 20 requests per 60 seconds.

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const ipBuckets = new Map<string, TokenBucket>();
const IP_MAX_TOKENS = 1;
const IP_REFILL_MS = 3_000; // 1 token every 3 s

let globalTokens = 20;
let globalLastRefill = Date.now();
const GLOBAL_MAX_TOKENS = 20;
const GLOBAL_REFILL_MS = 60_000; // 20 tokens per 60 s

/** Cleanup stale entries every 5 minutes */
setInterval(() => {
  const cutoff = Date.now() - 120_000;
  for (const [ip, bucket] of ipBuckets) {
    if (bucket.lastRefill < cutoff) ipBuckets.delete(ip);
  }
}, 300_000);

function refillGlobal() {
  const now = Date.now();
  const elapsed = now - globalLastRefill;
  if (elapsed >= GLOBAL_REFILL_MS) {
    globalTokens = GLOBAL_MAX_TOKENS;
    globalLastRefill = now;
  }
}

function getIpBucket(ip: string): TokenBucket {
  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    bucket = { tokens: IP_MAX_TOKENS, lastRefill: Date.now() };
    ipBuckets.set(ip, bucket);
  }
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  if (elapsed >= IP_REFILL_MS) {
    bucket.tokens = IP_MAX_TOKENS;
    bucket.lastRefill = now;
  }
  return bucket;
}

/**
 * Returns `true` if the request is allowed, `false` if rate-limited.
 * Call with the client's IP (from x-forwarded-for or request header).
 */
export function checkRateLimit(ip: string): boolean {
  // Global bucket
  refillGlobal();
  if (globalTokens <= 0) return false;

  // Per-IP bucket
  const bucket = getIpBucket(ip);
  if (bucket.tokens <= 0) return false;

  // Consume tokens
  globalTokens--;
  bucket.tokens--;
  return true;
}
