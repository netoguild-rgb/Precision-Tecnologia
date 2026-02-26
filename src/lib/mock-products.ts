export interface Product {
    id: string;
    name: string;
    slug: string;
    category: string;
    categorySlug: string;
    sku: string;
    partNumber: string;
    price: number;
    priceFormatted: string;
    installment: string;
    stockStatus: "IN_STOCK" | "ON_ORDER" | "OUT_OF_STOCK";
    stockLabel: string;
    description: string;
    specs: Record<string, string>;
    ports?: number;
    speed?: string;
    manageable?: boolean;
    poe?: boolean;
    poeWatts?: number;
    connectorType?: string;
    fiberType?: string;
    distance?: string;
    wifiStandard?: string;
    featured?: boolean;
    isNew?: boolean;
    images: string[];
}

export interface FilterOption {
    label: string;
    value: string;
    count: number;
}

export interface FilterGroup {
    key: string;
    label: string;
    type: "checkbox" | "radio" | "range";
    options: FilterOption[];
}

export const mockProducts: Product[] = [
    // ============ SWITCHES ============
    {
        id: "sw-001",
        name: "CloudEngine S5735-L24P4X-A1",
        slug: "cloudengine-s5735-l24p4x-a1",
        category: "Switches",
        categorySlug: "switches",
        sku: "98012021",
        partNumber: "S5735-L24P4X-A1",
        price: 2890,
        priceFormatted: "R$ 2.890,00",
        installment: "12x R$ 240,83",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Switch campus 24 portas Gigabit PoE+ L2 gerenciável com 4x SFP+ 10G uplinks",
        specs: {
            "Portas": "24x GE RJ45 + 4x 10GE SFP+",
            "Gerenciamento": "Layer 2 / Layer 3 Lite",
            "PoE": "PoE+ 802.3at (370W)",
            "Switching": "336 Gbps",
            "Throughput": "130 Mpps",
            "Montagem": "1U Rack 19\"",
        },
        ports: 24,
        speed: "Gigabit",
        manageable: true,
        poe: true,
        poeWatts: 370,
        featured: true,
        images: ["/images/products/cloudengine-s5735-l-v2.png"],
    },
    {
        id: "sw-002",
        name: "CloudEngine S5735-L48T4X-A1",
        slug: "cloudengine-s5735-l48t4x-a1",
        category: "Switches",
        categorySlug: "switches",
        sku: "98012023",
        partNumber: "S5735-L48T4X-A1",
        price: 4250,
        priceFormatted: "R$ 4.250,00",
        installment: "12x R$ 354,17",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Switch campus 48 portas Gigabit L2 gerenciável com 4x SFP+ 10G uplinks",
        specs: {
            "Portas": "48x GE RJ45 + 4x 10GE SFP+",
            "Gerenciamento": "Layer 2 / Layer 3 Lite",
            "PoE": "Não",
            "Switching": "576 Gbps",
            "Throughput": "216 Mpps",
            "Montagem": "1U Rack 19\"",
        },
        ports: 48,
        speed: "Gigabit",
        manageable: true,
        poe: false,
        featured: false,
        images: ["/images/products/switch-48p.png"],
    },
    {
        id: "sw-003",
        name: "CloudEngine S12700E-8",
        slug: "cloudengine-s12700e-8",
        category: "Switches",
        categorySlug: "switches",
        sku: "02354FCF",
        partNumber: "S12700E-8",
        price: 45000,
        priceFormatted: "R$ 45.000,00",
        installment: "12x R$ 3.750,00",
        stockStatus: "ON_ORDER",
        stockLabel: "Sob Encomenda",
        description: "Switch core modular de alta performance para data center e campus",
        specs: {
            "Slots": "8 slots de serviço",
            "Gerenciamento": "Layer 3 Full",
            "Switching": "57.6 Tbps",
            "Throughput": "14.4 Bpps",
            "Montagem": "14U Rack 19\"",
        },
        ports: 0,
        speed: "10G",
        manageable: true,
        poe: false,
        featured: false,
        images: ["/images/products/cloudengine-s12700e-8.png"],
    },
    {
        id: "sw-004",
        name: "CloudEngine S5735-S24P4X",
        slug: "cloudengine-s5735-s24p4x",
        category: "Switches",
        categorySlug: "switches",
        sku: "98012045",
        partNumber: "S5735-S24P4X",
        price: 3450,
        priceFormatted: "R$ 3.450,00",
        installment: "12x R$ 287,50",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Switch campus avançado 24 portas PoE+ com routing L3",
        specs: {
            "Portas": "24x GE RJ45 + 4x 10GE SFP+",
            "Gerenciamento": "Layer 3",
            "PoE": "PoE+ 802.3at (370W)",
            "Switching": "336 Gbps",
        },
        ports: 24,
        speed: "Gigabit",
        manageable: true,
        poe: true,
        poeWatts: 370,
        featured: true,
        isNew: true,
        images: ["/images/products/switch-24p.png"],
    },

    // ============ ROTEADORES ============
    {
        id: "rt-001",
        name: "NetEngine AR650",
        slug: "netengine-ar650",
        category: "Roteadores",
        categorySlug: "roteadores",
        sku: "02311TSJ",
        partNumber: "AR650",
        price: 3200,
        priceFormatted: "R$ 3.200,00",
        installment: "12x R$ 266,67",
        stockStatus: "ON_ORDER",
        stockLabel: "Sob Encomenda",
        description: "Roteador enterprise compacto SD-WAN para escritórios remotos",
        specs: {
            "WAN": "2x GE RJ45",
            "LAN": "4x GE RJ45",
            "Throughput": "2 Gbps",
            "VPN": "IPsec, GRE, L2TP",
        },
        featured: true,
        images: ["/images/products/netengine-ar650.png"],
    },
    {
        id: "rt-002",
        name: "NetEngine AR6700",
        slug: "netengine-ar6700",
        category: "Roteadores",
        categorySlug: "roteadores",
        sku: "02352TUG",
        partNumber: "AR6700",
        price: 18500,
        priceFormatted: "R$ 18.500,00",
        installment: "12x R$ 1.541,67",
        stockStatus: "ON_ORDER",
        stockLabel: "Sob Encomenda",
        description: "Roteador enterprise modular de alto desempenho para campus e WAN",
        specs: {
            "Slots": "4 slots de serviço",
            "Throughput": "20 Gbps",
            "VPN": "IPsec, SSL, GRE",
            "SD-WAN": "Sim",
        },
        images: [],
    },

    // ============ ACCESS POINTS ============
    {
        id: "ap-001",
        name: "AirEngine 5773-22P",
        slug: "airengine-5773-22p",
        category: "Access Points",
        categorySlug: "access-points",
        sku: "50084766",
        partNumber: "5773-22P",
        price: 1450,
        priceFormatted: "R$ 1.450,00",
        installment: "12x R$ 120,83",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Access Point Wi-Fi 6 indoor de alto desempenho com PoE",
        specs: {
            "Padrão": "Wi-Fi 6 (802.11ax)",
            "Bandas": "Dual-band 2.4/5 GHz",
            "Velocidade": "Até 2.975 Mbps",
            "MIMO": "2x2 / 4x4",
            "Alimentação": "PoE (802.3at)",
        },
        wifiStandard: "Wi-Fi 6",
        featured: true,
        images: ["/images/products/airengine-5773-22p.png"],
    },
    {
        id: "ap-002",
        name: "AirEngine 8760-X1-PRO",
        slug: "airengine-8760-x1-pro",
        category: "Access Points",
        categorySlug: "access-points",
        sku: "50086780",
        partNumber: "8760-X1-PRO",
        price: 4800,
        priceFormatted: "R$ 4.800,00",
        installment: "12x R$ 400,00",
        stockStatus: "ON_ORDER",
        stockLabel: "Sob Encomenda",
        description: "Access Point Wi-Fi 7 ultra alto desempenho para ambientes corporativos",
        specs: {
            "Padrão": "Wi-Fi 7 (802.11be)",
            "Bandas": "Tri-band 2.4/5/6 GHz",
            "Velocidade": "Até 18.44 Gbps",
            "MIMO": "4x4 / 8x8",
            "Alimentação": "PoE++ (802.3bt)",
        },
        wifiStandard: "Wi-Fi 7",
        isNew: true,
        images: ["/images/products/airengine-8760-x1-pro.png"],
    },

    // ============ GBICs / SFP ============
    {
        id: "sfp-001",
        name: "SFP+ 10G LR 10km SM",
        slug: "sfp-plus-10g-lr-10km",
        category: "GBICs / SFP",
        categorySlug: "gbics-sfp",
        sku: "34060599",
        partNumber: "SFP-10G-LR",
        price: 320,
        priceFormatted: "R$ 320,00",
        installment: "3x R$ 106,67",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Módulo óptico SFP+ 10Gbps Long Range para fibra monomodo até 10km",
        specs: {
            "Tipo": "SFP+",
            "Velocidade": "10 Gbps",
            "Distância": "10 km",
            "Fibra": "Monomodo (SMF)",
            "Conector": "LC Duplex",
            "Lambda": "1310 nm",
        },
        connectorType: "LC",
        fiberType: "SM",
        distance: "10km",
        speed: "10G",
        featured: true,
        images: ["/images/products/sfp-plus-10g-lr-10km.png"],
    },
    {
        id: "sfp-002",
        name: "SFP 1G LX 20km SM",
        slug: "sfp-1g-lx-20km",
        category: "GBICs / SFP",
        categorySlug: "gbics-sfp",
        sku: "34060321",
        partNumber: "SFP-1G-LX",
        price: 180,
        priceFormatted: "R$ 180,00",
        installment: "2x R$ 90,00",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Módulo óptico SFP 1Gbps para fibra monomodo até 20km",
        specs: {
            "Tipo": "SFP",
            "Velocidade": "1 Gbps",
            "Distância": "20 km",
            "Fibra": "Monomodo (SMF)",
            "Conector": "LC Duplex",
        },
        connectorType: "LC",
        fiberType: "SM",
        distance: "20km",
        speed: "Gigabit",
        images: [],
    },
    {
        id: "sfp-003",
        name: "QSFP28 100G LR4 10km",
        slug: "qsfp28-100g-lr4-10km",
        category: "GBICs / SFP",
        categorySlug: "gbics-sfp",
        sku: "34061199",
        partNumber: "QSFP-100G-LR4",
        price: 2800,
        priceFormatted: "R$ 2.800,00",
        installment: "12x R$ 233,33",
        stockStatus: "ON_ORDER",
        stockLabel: "Sob Encomenda",
        description: "Módulo óptico QSFP28 100Gbps para data center",
        specs: {
            "Tipo": "QSFP28",
            "Velocidade": "100 Gbps",
            "Distância": "10 km",
            "Fibra": "Monomodo (SMF)",
            "Conector": "LC Duplex",
        },
        connectorType: "LC",
        fiberType: "SM",
        distance: "10km",
        speed: "100G",
        isNew: true,
        images: [],
    },

    // ============ PATCH CORDS ============
    {
        id: "pc-001",
        name: "Patch Cord UTP Cat6 1.5m Azul",
        slug: "patch-cord-utp-cat6-1-5m-azul",
        category: "Patch Cords",
        categorySlug: "patch-cords",
        sku: "PC6-015-AZ",
        partNumber: "PC-CAT6-1.5M",
        price: 12,
        priceFormatted: "R$ 12,00",
        installment: "",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Patch cord UTP Cat6 de 1.5m com conectores RJ-45 moldados",
        specs: {
            "Tipo": "UTP",
            "Categoria": "Cat6",
            "Comprimento": "1.5m",
            "Conector": "RJ-45",
        },
        images: ["/images/products/patch-cord-utp-cat6-1-5m-azul.jpg"],
    },
    {
        id: "pc-002",
        name: "Patch Cord Fibra SM LC-LC 3m",
        slug: "patch-cord-fibra-sm-lc-lc-3m",
        category: "Patch Cords",
        categorySlug: "patch-cords",
        sku: "FO-SM-LC-3M",
        partNumber: "FO-LC-LC-SM-3M",
        price: 35,
        priceFormatted: "R$ 35,00",
        installment: "",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Patch cord de fibra óptica monomodo LC-LC duplex 3m",
        specs: {
            "Tipo": "Fibra Óptica",
            "Fibra": "Monomodo (SM)",
            "Conector": "LC-LC Duplex",
            "Comprimento": "3m",
        },
        connectorType: "LC",
        fiberType: "SM",
        images: ["/images/products/patch-cord-fibra-sm-lc-lc-3m.jpg"],
    },

    // ============ PATCH PANELS ============
    {
        id: "pp-001",
        name: "Patch Panel 24P Cat6 UTP 1U",
        slug: "patch-panel-24p-cat6-utp-1u",
        category: "Patch Panels",
        categorySlug: "patch-panels",
        sku: "PP-24-C6",
        partNumber: "PP-24P-CAT6",
        price: 120,
        priceFormatted: "R$ 120,00",
        installment: "2x R$ 60,00",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Patch panel 24 portas Cat6 UTP para rack 19\" 1U",
        specs: {
            "Portas": "24",
            "Categoria": "Cat6",
            "Tipo": "UTP",
            "Montagem": "1U Rack 19\"",
        },
        ports: 24,
        images: ["/images/products/patch-panel-24p-cat6-utp-1u.jpg"],
    },

    // ============ FIREWALLS ============
    {
        id: "fw-001",
        name: "HiSecEngine USG6500E",
        slug: "hisecengine-usg6500e",
        category: "Firewalls",
        categorySlug: "firewalls",
        sku: "02352PFD",
        partNumber: "USG6500E",
        price: 8900,
        priceFormatted: "R$ 8.900,00",
        installment: "12x R$ 741,67",
        stockStatus: "IN_STOCK",
        stockLabel: "Em Estoque",
        description: "Firewall next-gen com IA para PMEs e filiais",
        specs: {
            "Throughput FW": "10 Gbps",
            "Throughput IPS": "3.5 Gbps",
            "Sessões": "2M concorrentes",
            "VPN": "IPsec, SSL",
            "IA": "HiSec Engine com detecção avançada",
        },
        featured: true,
        images: ["/images/products/hisecengine-usg6500e.png"],
    },
];

export function getFilterGroups(categorySlug?: string): FilterGroup[] {
    const base: FilterGroup[] = [
        {
            key: "category",
            label: "Categoria",
            type: "checkbox",
            options: [
                { label: "Switches", value: "switches", count: 4 },
                { label: "Roteadores", value: "roteadores", count: 2 },
                { label: "Access Points", value: "access-points", count: 2 },
                { label: "GBICs / SFP", value: "gbics-sfp", count: 3 },
                { label: "Patch Cords", value: "patch-cords", count: 2 },
                { label: "Patch Panels", value: "patch-panels", count: 1 },
                { label: "Firewalls", value: "firewalls", count: 1 },
            ],
        },
        {
            key: "stockStatus",
            label: "Disponibilidade",
            type: "checkbox",
            options: [
                { label: "Em Estoque", value: "IN_STOCK", count: 10 },
                { label: "Sob Encomenda", value: "ON_ORDER", count: 5 },
            ],
        },
    ];

    if (!categorySlug || categorySlug === "switches") {
        base.push(
            {
                key: "ports",
                label: "Portas",
                type: "checkbox",
                options: [
                    { label: "8 portas", value: "8", count: 0 },
                    { label: "16 portas", value: "16", count: 0 },
                    { label: "24 portas", value: "24", count: 2 },
                    { label: "48 portas", value: "48", count: 1 },
                ],
            },
            {
                key: "poe",
                label: "PoE",
                type: "radio",
                options: [
                    { label: "Com PoE", value: "true", count: 2 },
                    { label: "Sem PoE", value: "false", count: 2 },
                ],
            },
            {
                key: "manageable",
                label: "Gerenciamento",
                type: "radio",
                options: [
                    { label: "Gerenciável", value: "true", count: 4 },
                    { label: "Não-gerenciável", value: "false", count: 0 },
                ],
            }
        );
    }

    if (!categorySlug || categorySlug === "gbics-sfp") {
        base.push({
            key: "speed",
            label: "Velocidade",
            type: "checkbox",
            options: [
                { label: "1 Gbps", value: "Gigabit", count: 1 },
                { label: "10 Gbps", value: "10G", count: 1 },
                { label: "100 Gbps", value: "100G", count: 1 },
            ],
        });
    }

    return base;
}
