function buildFallbackSecret() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return undefined;

    // Stable fallback so auth does not crash when NEXTAUTH_SECRET is missing.
    return `dburl:${databaseUrl}`;
}

export const authSecret =
    process.env.NEXTAUTH_SECRET ??
    process.env.AUTH_SECRET ??
    buildFallbackSecret();
