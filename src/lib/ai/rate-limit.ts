type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type RateLimitOptions = {
    limit?: number;
    windowMs?: number;
};

type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
};

const memoryStore = new Map<string, RateLimitEntry>();

function nowMs(): number {
    return Date.now();
}

function cleanupExpiredEntries(currentTime: number) {
    for (const [key, value] of memoryStore.entries()) {
        if (value.resetAt <= currentTime) {
            memoryStore.delete(key);
        }
    }
}

export function applyRateLimit(key: string, options: RateLimitOptions = {}): RateLimitResult {
    const limit = options.limit ?? 20;
    const windowMs = options.windowMs ?? 60_000;
    const current = nowMs();

    if (memoryStore.size > 8000) {
        cleanupExpiredEntries(current);
    }

    const existing = memoryStore.get(key);

    if (!existing || existing.resetAt <= current) {
        memoryStore.set(key, {
            count: 1,
            resetAt: current + windowMs,
        });

        return {
            allowed: true,
            remaining: Math.max(0, limit - 1),
            retryAfterSeconds: Math.ceil(windowMs / 1000),
        };
    }

    if (existing.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
        };
    }

    existing.count += 1;
    memoryStore.set(key, existing);

    return {
        allowed: true,
        remaining: Math.max(0, limit - existing.count),
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
    };
}
