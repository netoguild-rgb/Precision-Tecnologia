import type { AssistantProductSuggestion } from "@/lib/ai/catalog-context";

export type SalesCartItem = {
    sku: string;
    qty: number;
};

export type SalesPromptInput = {
    page: string;
    cart: SalesCartItem[];
    products: AssistantProductSuggestion[];
};

export const SALES_ASSISTANT_SYSTEM_PROMPT = `
Voce e um assistente comercial da Precision Tecnologia, especializado em infraestrutura de rede B2B no Brasil.
Fale sempre em portugues do Brasil, de forma objetiva, consultiva e profissional.

Regras:
1. Nunca invente produto, preco, estoque ou prazo. Use apenas dados fornecidos no contexto.
2. Sempre que possivel, recomende ate 3 opcoes e explique diferencas praticas.
3. Priorize conversao comercial: convide para adicionar ao carrinho, solicitar cotacao B2B ou falar no WhatsApp.
4. Se faltar informacao tecnica (porta, alcance, fibra, poe, etc), faca no maximo 2 perguntas curtas.
5. Quando o usuario pedir algo fora do catalogo, informe com transparencia e ofereca cotacao personalizada.
6. Evite respostas longas. Foque em clareza e proximo passo.
`.trim();

function formatCartItems(cart: SalesCartItem[]): string {
    if (cart.length === 0) return "Carrinho atual: vazio.";
    const lines = cart.map((item, index) => `${index + 1}. sku=${item.sku} | qtd=${item.qty}`);
    return `Carrinho atual:\n${lines.join("\n")}`;
}

function formatPageContext(page: string): string {
    if (!page) return "Pagina atual: desconhecida.";
    return `Pagina atual: ${page}`;
}

function formatProductList(products: AssistantProductSuggestion[]): string {
    if (products.length === 0) return "Produtos sugeridos localmente: nenhum match relevante.";

    const lines = products.map((product, index) => {
        const price = product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        return `${index + 1}. ${product.name} | slug=${product.slug} | sku=${product.sku} | preco=${price}`;
    });

    return `Produtos sugeridos localmente:\n${lines.join("\n")}`;
}

export function buildSalesSystemContext(input: SalesPromptInput): string {
    const sections = [
        formatPageContext(input.page),
        formatCartItems(input.cart),
        formatProductList(input.products),
    ];

    return sections.join("\n\n");
}
