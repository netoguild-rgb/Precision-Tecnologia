import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // ==========================================
    // CATEGORIAS
    // ==========================================
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: "switches" },
            update: {},
            create: {
                name: "Switches",
                slug: "switches",
                description: "Switches de rede Huawei para campus e data center",
                icon: "Network",
                sortOrder: 1,
            },
        }),
        prisma.category.upsert({
            where: { slug: "roteadores" },
            update: {},
            create: {
                name: "Roteadores",
                slug: "roteadores",
                description: "Roteadores enterprise Huawei NetEngine AR",
                icon: "Router",
                sortOrder: 2,
            },
        }),
        prisma.category.upsert({
            where: { slug: "access-points" },
            update: {},
            create: {
                name: "Access Points",
                slug: "access-points",
                description: "Access Points Huawei AirEngine Wi-Fi 6 e Wi-Fi 7",
                icon: "Wifi",
                sortOrder: 3,
            },
        }),
        prisma.category.upsert({
            where: { slug: "gbics-sfp" },
            update: {},
            create: {
                name: "GBICs / SFP",
                slug: "gbics-sfp",
                description: "Módulos ópticos SFP, SFP+, SFP28, QSFP28",
                icon: "Cable",
                sortOrder: 4,
            },
        }),
        prisma.category.upsert({
            where: { slug: "patch-cords" },
            update: {},
            create: {
                name: "Patch Cords",
                slug: "patch-cords",
                description: "Patch cords UTP e fibra óptica",
                icon: "Cable",
                sortOrder: 5,
            },
        }),
        prisma.category.upsert({
            where: { slug: "patch-panels" },
            update: {},
            create: {
                name: "Patch Panels",
                slug: "patch-panels",
                description: "Patch panels UTP e fibra óptica para rack 19\"",
                icon: "Server",
                sortOrder: 6,
            },
        }),
        prisma.category.upsert({
            where: { slug: "conectores" },
            update: {},
            create: {
                name: "Conectores",
                slug: "conectores",
                description: "Conectores RJ-45, LC, SC, Keystone e Fast Connect",
                icon: "HardDrive",
                sortOrder: 7,
            },
        }),
        prisma.category.upsert({
            where: { slug: "firewalls" },
            update: {},
            create: {
                name: "Firewalls",
                slug: "firewalls",
                description: "Firewalls next-gen HiSecEngine com inteligência artificial",
                icon: "Shield",
                sortOrder: 8,
            },
        }),
    ]);

    console.log(`✅ ${categories.length} categorias criadas`);

    // ==========================================
    // PRODUTOS
    // ==========================================
    const switchesCat = categories[0];
    const roteadoresCat = categories[1];
    const apsCat = categories[2];
    const gbicsCat = categories[3];
    const patchCordsCat = categories[4];
    const patchPanelsCat = categories[5];
    const conectoresCat = categories[6];
    const firewallsCat = categories[7];

    const products: Prisma.ProductUncheckedCreateInput[] = [
        // SWITCHES
        {
            sku: "HW-S5735-L24T4X-V2",
            name: "CloudEngine S5735-L24T4X-V2",
            slug: "cloudengine-s5735-l24t4x-v2",
            description: "Switch de campus Huawei CloudEngine com 24 portas GE e 4 portas 10GE SFP+. Ideal para redes corporativas, educação e pequenas empresas. Suporte a PoE+, VLAN, ACL e gerenciamento via iMaster NCE.",
            shortDesc: "Switch 24 portas GE + 4x 10GE SFP+",
            price: 2890.00,
            comparePrice: 3490.00,
            categoryId: switchesCat.id,
            brand: "Huawei",
            partNumber: "98012020",
            model: "S5735-L24T4X-V2",
            weight: 4.2,
            stockQty: 15,
            stockStatus: "IN_STOCK",
            isFeatured: true,
            isNew: true,
        },
        {
            sku: "HW-S5735-L48T4X-V2",
            name: "CloudEngine S5735-L48T4X-V2",
            slug: "cloudengine-s5735-l48t4x-v2",
            description: "Switch de campus com 48 portas GE e 4 portas 10GE SFP+. Alta performance para redes de médio e grande porte.",
            shortDesc: "Switch 48 portas GE + 4x 10GE SFP+",
            price: 4350.00,
            comparePrice: 5200.00,
            categoryId: switchesCat.id,
            brand: "Huawei",
            partNumber: "98012022",
            model: "S5735-L48T4X-V2",
            weight: 5.8,
            stockQty: 8,
            stockStatus: "IN_STOCK",
            isFeatured: true,
        },
        {
            sku: "HW-S12700E-4",
            name: "CloudEngine S12700E-4",
            slug: "cloudengine-s12700e-4",
            description: "Switch de core campus CloudEngine de alta performance. 4 slots, suporte a 400GE, AI Fabric e iMaster NCE.",
            shortDesc: "Switch Core 4 slots - até 400GE",
            price: 45000.00,
            categoryId: switchesCat.id,
            brand: "Huawei",
            partNumber: "02352SGM",
            model: "S12700E-4",
            weight: 25.0,
            stockQty: 0,
            stockStatus: "ON_ORDER",
            leadTimeDays: 15,
        },

        // ROTEADORES
        {
            sku: "HW-AR650",
            name: "NetEngine AR650",
            slug: "netengine-ar650",
            description: "Roteador enterprise compacto ideal para filiais e escritórios. Suporte a SD-WAN, VPN IPSec, QoS e gerenciamento centralizado.",
            shortDesc: "Roteador Enterprise - SD-WAN",
            price: 3200.00,
            comparePrice: 3800.00,
            categoryId: roteadoresCat.id,
            brand: "Huawei",
            partNumber: "02354GBF",
            model: "AR650",
            weight: 2.5,
            stockQty: 12,
            stockStatus: "IN_STOCK",
            isFeatured: true,
        },
        {
            sku: "HW-AR6300",
            name: "NetEngine AR6300",
            slug: "netengine-ar6300",
            description: "Roteador enterprise de alto desempenho para sedes e grandes filiais. SD-WAN, IPSec VPN, MPLS. Portas WAN/LAN flexíveis.",
            shortDesc: "Roteador Enterprise Alto Desempenho",
            price: 12500.00,
            categoryId: roteadoresCat.id,
            brand: "Huawei",
            model: "AR6300",
            weight: 8.0,
            stockQty: 3,
            stockStatus: "LOW_STOCK",
        },

        // ACCESS POINTS
        {
            sku: "HW-AP5773-22P",
            name: "AirEngine 5773-22P",
            slug: "airengine-5773-22p",
            description: "Access Point Wi-Fi 6 indoor de alto desempenho. Dual-band, antenas inteligentes, PoE, suporte a mais de 256 usuários simultâneos.",
            shortDesc: "AP Wi-Fi 6 Indoor - Dual Band",
            price: 1450.00,
            comparePrice: 1800.00,
            categoryId: apsCat.id,
            brand: "Huawei",
            partNumber: "02353VUT",
            model: "5773-22P",
            weight: 1.1,
            stockQty: 25,
            stockStatus: "IN_STOCK",
            isFeatured: true,
            isNew: true,
        },
        {
            sku: "HW-AP6760-X1",
            name: "AirEngine 6760-X1",
            slug: "airengine-6760-x1",
            description: "Access Point Wi-Fi 6E de última geração. Tri-band, MU-MIMO 8x8, até 10.75 Gbps de throughput agregado.",
            shortDesc: "AP Wi-Fi 6E Tri-Band - Premium",
            price: 3800.00,
            categoryId: apsCat.id,
            brand: "Huawei",
            model: "6760-X1",
            weight: 1.5,
            stockQty: 5,
            stockStatus: "LOW_STOCK",
            isNew: true,
        },

        // GBICs / SFP
        {
            sku: "HW-SFP-GE-LX",
            name: "SFP 1G LX 10km",
            slug: "sfp-1g-lx-10km",
            description: "Módulo óptico SFP 1G LX para fibra monomodo. Alcance de 10km, conector LC duplex, 1310nm.",
            shortDesc: "SFP 1G Monomodo 10km",
            price: 180.00,
            categoryId: gbicsCat.id,
            brand: "Huawei",
            partNumber: "02315200",
            weight: 0.05,
            stockQty: 100,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "HW-SFP-10G-LR",
            name: "SFP+ 10G LR 10km",
            slug: "sfp-plus-10g-lr-10km",
            description: "Módulo óptico SFP+ 10G LR para fibra monomodo. Alcance de 10km, conector LC duplex, 1310nm. DDM integrado.",
            shortDesc: "SFP+ 10G Monomodo 10km",
            price: 320.00,
            comparePrice: 420.00,
            categoryId: gbicsCat.id,
            brand: "Huawei",
            partNumber: "02315204",
            weight: 0.05,
            stockQty: 80,
            stockStatus: "IN_STOCK",
            isFeatured: true,
        },
        {
            sku: "HW-SFP-10G-SR",
            name: "SFP+ 10G SR 300m",
            slug: "sfp-plus-10g-sr-300m",
            description: "Módulo óptico SFP+ 10G SR para fibra multimodo. Alcance de 300m, conector LC duplex, 850nm.",
            shortDesc: "SFP+ 10G Multimodo 300m",
            price: 250.00,
            categoryId: gbicsCat.id,
            brand: "Huawei",
            weight: 0.05,
            stockQty: 60,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "HW-QSFP-100G-LR4",
            name: "QSFP28 100G LR4 10km",
            slug: "qsfp28-100g-lr4-10km",
            description: "Módulo óptico QSFP28 100G LR4 para data center. Fibra monomodo, 10km, LC duplex.",
            shortDesc: "QSFP28 100G Monomodo 10km",
            price: 4500.00,
            categoryId: gbicsCat.id,
            brand: "Huawei",
            weight: 0.08,
            stockQty: 10,
            stockStatus: "IN_STOCK",
        },

        // PATCH CORDS
        {
            sku: "PC-CAT6-1M-AZ",
            name: "Patch Cord Cat6 UTP 1m Azul",
            slug: "patch-cord-cat6-utp-1m-azul",
            description: "Patch cord UTP Cat6 de 1 metro com conectores RJ-45. Cor azul, ideal para conexões de rack e data center.",
            shortDesc: "Cat6 UTP 1m - Azul",
            price: 12.90,
            categoryId: patchCordsCat.id,
            brand: "Precision",
            weight: 0.05,
            stockQty: 500,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "PC-CAT6-3M-AZ",
            name: "Patch Cord Cat6 UTP 3m Azul",
            slug: "patch-cord-cat6-utp-3m-azul",
            description: "Patch cord UTP Cat6 de 3 metros com conectores RJ-45.",
            shortDesc: "Cat6 UTP 3m - Azul",
            price: 18.90,
            categoryId: patchCordsCat.id,
            brand: "Precision",
            weight: 0.1,
            stockQty: 300,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "PC-FO-LC-LC-SM-3M",
            name: "Patch Cord Fibra SM LC-LC 3m",
            slug: "patch-cord-fibra-sm-lc-lc-3m",
            description: "Patch cord de fibra óptica monomodo LC-LC duplex de 3 metros. 9/125μm, amarelo.",
            shortDesc: "Fibra SM LC-LC 3m",
            price: 35.00,
            categoryId: patchCordsCat.id,
            brand: "Precision",
            weight: 0.08,
            stockQty: 200,
            stockStatus: "IN_STOCK",
        },

        // PATCH PANELS
        {
            sku: "PP-CAT6-24P",
            name: "Patch Panel Cat6 24 Portas",
            slug: "patch-panel-cat6-24-portas",
            description: "Patch panel Cat6 UTP com 24 portas RJ-45. Rack 19\", 1U. Inclui acessórios de fixação.",
            shortDesc: "Cat6 24P - Rack 19\" 1U",
            price: 189.00,
            comparePrice: 240.00,
            categoryId: patchPanelsCat.id,
            brand: "Precision",
            weight: 1.2,
            stockQty: 40,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "PP-CAT6-48P",
            name: "Patch Panel Cat6 48 Portas",
            slug: "patch-panel-cat6-48-portas",
            description: "Patch panel Cat6 UTP com 48 portas RJ-45. Rack 19\", 2U.",
            shortDesc: "Cat6 48P - Rack 19\" 2U",
            price: 320.00,
            categoryId: patchPanelsCat.id,
            brand: "Precision",
            weight: 2.0,
            stockQty: 20,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "DIO-FO-24F",
            name: "DIO Fibra Óptica 24 Fibras",
            slug: "dio-fibra-optica-24-fibras",
            description: "Distribuidor Interno Óptico (DIO) para 24 fibras. Rack 19\", 1U. Adaptadores LC inclusos.",
            shortDesc: "DIO 24F - Rack 19\" 1U",
            price: 280.00,
            categoryId: patchPanelsCat.id,
            brand: "Precision",
            weight: 1.5,
            stockQty: 30,
            stockStatus: "IN_STOCK",
        },

        // CONECTORES
        {
            sku: "CON-RJ45-CAT6-50",
            name: "Conector RJ-45 Cat6 (Pacote 50un)",
            slug: "conector-rj45-cat6-50un",
            description: "Conector RJ-45 Cat6 para crimpar. Pacote com 50 unidades. Contato banhado a ouro.",
            shortDesc: "RJ-45 Cat6 - 50un",
            price: 45.00,
            categoryId: conectoresCat.id,
            brand: "Precision",
            weight: 0.15,
            stockQty: 200,
            stockStatus: "IN_STOCK",
        },
        {
            sku: "CON-KEYSTONE-CAT6",
            name: "Keystone Cat6 Fêmea (Pacote 10un)",
            slug: "keystone-cat6-femea-10un",
            description: "Conector Keystone Cat6 fêmea para patch panels e tomadas de rede. Pacote com 10 unidades.",
            shortDesc: "Keystone Cat6 - 10un",
            price: 65.00,
            categoryId: conectoresCat.id,
            brand: "Precision",
            weight: 0.1,
            stockQty: 150,
            stockStatus: "IN_STOCK",
        },

        // FIREWALLS
        {
            sku: "HW-USG6510E",
            name: "HiSecEngine USG6510E",
            slug: "hisecengine-usg6510e",
            description: "Firewall next-gen com IA para PMEs. Throughput 2 Gbps, IPS, antivírus, filtragem URL, VPN IPSec/SSL.",
            shortDesc: "NGFW AI - 2 Gbps",
            price: 8500.00,
            categoryId: firewallsCat.id,
            brand: "Huawei",
            model: "USG6510E",
            weight: 3.5,
            stockQty: 4,
            stockStatus: "LOW_STOCK",
            isFeatured: true,
        },
    ];

    for (const productData of products) {
        const product = await prisma.product.upsert({
            where: { sku: productData.sku },
            update: {},
            create: productData,
        });

        // Adicionar specs para os primeiros produtos
        if (productData.sku === "HW-S5735-L24T4X-V2") {
            await prisma.productSpec.createMany({
                data: [
                    { productId: product.id, group: "Rede", label: "Portas GE", value: "24x RJ-45", sortOrder: 1 },
                    { productId: product.id, group: "Rede", label: "Portas 10GE", value: "4x SFP+", sortOrder: 2 },
                    { productId: product.id, group: "Rede", label: "Switching Capacity", value: "128 Gbps", sortOrder: 3 },
                    { productId: product.id, group: "Rede", label: "PoE+", value: "Sim - 370W", sortOrder: 4 },
                    { productId: product.id, group: "Rede", label: "VLAN", value: "4K", sortOrder: 5 },
                    { productId: product.id, group: "Físico", label: "Peso", value: "4.2 kg", sortOrder: 6 },
                    { productId: product.id, group: "Físico", label: "Dimensões", value: "442 x 420 x 43.6 mm", sortOrder: 7 },
                    { productId: product.id, group: "Alimentação", label: "Consumo", value: "Max 580W (PoE)", sortOrder: 8 },
                ],
                skipDuplicates: true,
            });
        }

        if (productData.sku === "HW-AP5773-22P") {
            await prisma.productSpec.createMany({
                data: [
                    { productId: product.id, group: "Wireless", label: "Padrão", value: "Wi-Fi 6 (802.11ax)", sortOrder: 1 },
                    { productId: product.id, group: "Wireless", label: "Bandas", value: "Dual-band 2.4GHz + 5GHz", sortOrder: 2 },
                    { productId: product.id, group: "Wireless", label: "Throughput", value: "Até 2.975 Gbps", sortOrder: 3 },
                    { productId: product.id, group: "Wireless", label: "MU-MIMO", value: "4x4", sortOrder: 4 },
                    { productId: product.id, group: "Wireless", label: "Usuários", value: "Até 256 simultâneos", sortOrder: 5 },
                    { productId: product.id, group: "Rede", label: "Ethernet", value: "1x GE + 1x 2.5GE", sortOrder: 6 },
                    { productId: product.id, group: "Rede", label: "PoE", value: "802.3at", sortOrder: 7 },
                    { productId: product.id, group: "Físico", label: "Peso", value: "1.1 kg", sortOrder: 8 },
                ],
                skipDuplicates: true,
            });
        }
    }

    console.log(`✅ ${products.length} produtos criados`);

    // ==========================================
    // ADMIN USER
    // ==========================================
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.user.upsert({
        where: { email: "admin@precisiontecnologia.com.br" },
        update: {},
        create: {
            email: "admin@precisiontecnologia.com.br",
            passwordHash: hashedPassword,
            name: "Administrador",
            role: "ADMIN",
            tier: "DIAMOND",
        },
    });

    console.log("✅ Usuário admin criado");

    // ==========================================
    // SETTINGS
    // ==========================================
    const settings = [
        { key: "store_name", value: "Precision Tecnologia", type: "string" },
        { key: "store_email", value: "contato@precisiontecnologia.com.br", type: "string" },
        { key: "store_phone", value: "(11) 4002-8922", type: "string" },
        { key: "free_shipping_above", value: "5000", type: "number" },
        { key: "max_installments", value: "12", type: "number" },
        { key: "pix_discount_percent", value: "5", type: "number" },
    ];

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: setting,
        });
    }

    console.log("✅ Configurações criadas");
    console.log("\n🚀 Seed completo!");
}

main()
    .catch((e) => {
        console.error("❌ Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
