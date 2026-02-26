type MinimalUser = {
    role?: string | null;
    email?: string | null;
};

function parseConfiguredEmails(): string[] {
    const raw = process.env.SUPER_ADMIN_EMAILS || "";
    return raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export function isSuperAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    const configured = parseConfiguredEmails();

    if (configured.length > 0) {
        return configured.includes(normalized);
    }

    // Default fallback for this project seeds.
    return normalized.endsWith("@superadmin.com");
}

export function isSuperAdminUser(user: MinimalUser | null | undefined): boolean {
    if (!user) return false;
    return user.role === "ADMIN" && isSuperAdminEmail(user.email);
}

