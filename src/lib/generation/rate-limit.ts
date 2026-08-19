/**
 * Best-effort per-user rate limit for generate/export (Phase 2).
 * In-memory — resets per serverless isolate; monthly cap remains the hard cost control.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertUserRateLimit(
  userId: string,
  options: { windowMs?: number; max?: number; action: string } = {
    action: "generate",
  },
): void {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 8;
  const key = `${options.action}:${userId}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= max) {
    const err = new Error(
      "Too many requests in a short time. Wait a minute, then try again.",
    );
    (err as Error & { code?: string }).code = "RATE_LIMIT";
    throw err;
  }

  current.count += 1;
}
