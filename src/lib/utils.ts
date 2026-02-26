// Formatação de moeda BRL
export function formatCurrency(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(num);
}

// Formatação de moeda USD
export function formatUSD(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(num);
}

// Gerar slug a partir do nome
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

// Gerar número de pedido
export function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");
    return `PT-${year}-${random}`;
}

// Gerar número de cotação
export function generateQuoteNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");
    return `COT-${year}-${random}`;
}

// Truncar texto
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
}

// Validar CNPJ
export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, "");
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let sum = 0;
    let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) sum += parseInt(cnpj[i]) * weight[i];
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cnpj[12]) !== digit1) return false;

    sum = 0;
    weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) sum += parseInt(cnpj[i]) * weight[i];
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cnpj[13]) !== digit2) return false;

    return true;
}

// Validar CPF
export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (parseInt(cpf[9]) !== remainder) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (parseInt(cpf[10]) !== remainder) return false;

    return true;
}

// Formatar CNPJ
export function formatCNPJ(cnpj: string): string {
    cnpj = cnpj.replace(/[^\d]/g, "");
    return cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
    );
}

// Formatar CPF
export function formatCPF(cpf: string): string {
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

// Formatar CEP
export function formatCEP(cep: string): string {
    cep = cep.replace(/[^\d]/g, "");
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

// Classificar nome de stock status
export function stockStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        IN_STOCK: "Pronta Entrega",
        LOW_STOCK: "Últimas Unidades",
        ON_ORDER: "Sob Encomenda",
        OUT_OF_STOCK: "Indisponível",
    };
    return labels[status] || status;
}

// Cor do badge de stock
export function stockStatusColor(status: string): string {
    const colors: Record<string, string> = {
        IN_STOCK: "bg-green-500",
        LOW_STOCK: "bg-yellow-500",
        ON_ORDER: "bg-blue-500",
        OUT_OF_STOCK: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
}
