/**
 * Seed admin users
 * Run: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed-admins.ts
 * Or: npx tsx prisma/seed-admins.ts
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const admins = [
    {
        name: "Arthur Data Admin",
        email: "arthurdataadmin@superadmin.com",
        password: "Pr3c!s10n@Arthr2026#",
    },
    {
        name: "Neto Data Admin",
        email: "netodataadmin@superadmin.com",
        password: "Pr3c!s10n@Net02026#",
    },
];

async function main() {
    console.log("🔐 Creating admin accounts...\n");

    for (const admin of admins) {
        const existing = await prisma.user.findUnique({
            where: { email: admin.email },
        });

        if (existing) {
            console.log(`⚠️  ${admin.email} already exists, skipping`);
            continue;
        }

        const passwordHash = await hash(admin.password, 12);

        await prisma.user.create({
            data: {
                name: admin.name,
                email: admin.email,
                passwordHash,
                role: "ADMIN",
            },
        });

        console.log(`✅ Created: ${admin.email}`);
        console.log(`   Password: ${admin.password}`);
    }

    console.log("\n🎉 Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
