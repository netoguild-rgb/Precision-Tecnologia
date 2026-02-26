import type {
    AssistantCategoryMatch,
    AssistantProductSuggestion,
} from "@/lib/ai/catalog-context";

export type SalesCartItem = {
    sku: string;
    qty: number;
};

export type SalesPromptInput = {
    page: string;
    cart: SalesCartItem[];
    categories: AssistantCategoryMatch[];
    primaryProducts: AssistantProductSuggestion[];
    complementaryProducts: AssistantProductSuggestion[];
    storePolicyText: string;
};

export const SALES_ASSISTANT_SYSTEM_PROMPT = `
Voce e o assistente tecnico-comercial da Precision Tecnologia.
Objetivo: responder duvidas reais sobre produtos do catalogo, recursos comerciais, entrega, rastreio, pagamento e garantia do ecommerce.
Idioma: portugues do Brasil.

REGRAS CRITICAS (obrigatorias):
1. Use SOMENTE informacoes do contexto recebido. Nao invente produtos, specs, preco, estoque, prazo, garantia ou politica.
2. Se a informacao nao existir no contexto, responda exatamente: "Nao encontrei essa informacao no sistema."
3. Nunca cite modelo, SKU, marca ou valor que nao esteja no contexto do catalogo.
4. Quando a pergunta for de produto especifico, priorize specs tecnicas cadastradas (portas, throughput, alcance, padrao, etc).
5. Quando a pergunta for por categoria, responda usando categorias e produtos do contexto.
6. Para duvidas gerais de infraestrutura de rede/datacenter/servidores/informatica, responda como orientacao tecnica geral e, quando fizer sentido, conecte com produtos do catalogo.
7. Se houver produtos complementares no contexto, sugira no maximo 3 complementares reais.
8. Resposta curta: no maximo 5 frases e sem saudacao longa.
`.trim();

function formatPageContext(page: string): string {
    if (!page) return "Pagina atual: desconhecida.";
    return `Pagina atual: ${page}`;
}

function formatCartContext(cart: SalesCartItem[]): string {
    if (cart.length === 0) return "Carrinho atual: vazio.";
    const lines = cart.map((item, index) => `${index + 1}. sku=${item.sku} | qtd=${item.qty}`);
    return `Carrinho atual:\n${lines.join("\n")}`;
}

function formatCategoryContext(categories: AssistantCategoryMatch[]): string {
    if (categories.length === 0) {
        return "Categorias relacionadas no sistema: nenhuma encontrada para a pergunta.";
    }

    const lines = categories.map(
        (category, index) =>
            `${index + 1}. ${category.name} | slug=${category.slug} | descricao=${category.description ?? "sem descricao"}`
    );

    return `Categorias relacionadas no sistema:\n${lines.join("\n")}`;
}

function formatProductContext(title: string, products: AssistantProductSuggestion[]): string {
    if (products.length === 0) {
        return `${title}: nenhum produto encontrado.`;
    }

    const lines = products.map((product, index) => {
        const price = product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        const specs =
            product.specs.length > 0
                ? product.specs.slice(0, 6).map((spec) => `${spec.label}: ${spec.value}`).join("; ")
                : "sem especificacoes cadastradas";

        return [
            `${index + 1}. ${product.name}`,
            `slug=${product.slug}`,
            `sku=${product.sku}`,
            `categoria=${product.categoryName}`,
            `preco=${price}`,
            `estoque=${product.stockStatus}`,
            `descricao=${product.shortDesc ?? product.description ?? "sem descricao"}`,
            `specs=${specs}`,
        ].join(" | ");
    });

    return `${title}:\n${lines.join("\n")}`;
}

export function buildSalesSystemContext(input: SalesPromptInput): string {
    const sections = [
        formatPageContext(input.page),
        formatCartContext(input.cart),
        input.storePolicyText,
        formatCategoryContext(input.categories),
        formatProductContext("Produtos principais relacionados", input.primaryProducts),
        formatProductContext("Produtos complementares relacionados", input.complementaryProducts),
    ];

    return sections.join("\n\n");
}
