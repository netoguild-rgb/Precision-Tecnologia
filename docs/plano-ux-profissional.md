# Melhorias UX Profissional — Precision Tecnologia

O site já tem uma base visual sólida (design system light mode, hero com vídeo, catálogo funcional). O objetivo é **elevar o nível de profissionalismo** com micro-interações, elementos de conversão/marketing e polish visual que transformem o e-commerce em referência no segmento de infraestrutura de rede.

---

## Proposed Changes

### 1. Micro-interações & Animações

#### [MODIFY] [globals.css](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/globals.css)
- Adicionar animações CSS: `scroll-reveal` (fade-in + translateY ao entrar no viewport), `count-up` para números, `marquee` para scroll infinito de logos, `typewriter` para texto animado
- Adicionar classes `.whatsapp-fab` (botão flutuante com pulse), `.scroll-to-top` (botão de voltar ao topo)
- Melhorar `.product-card` com hover mais sofisticado (escala suave + overlay de ações rápidas)
- Adicionar `.skeleton-card` com shimmer animation para loading states

---

#### [MODIFY] [page.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/page.tsx) (Home)
- Stats do hero: substituir texto estático por **contadores animados** (`useEffect` com incremento ao ficar visível via `IntersectionObserver`)
- Seções de categorias e featured: adicionar **scroll-reveal** (animação de entrada ao scroll)
- Seção de marcas: transformar em **marquee infinita** (scroll horizontal automático contínuo)
- **Nova seção**: "O Que Nossos Clientes Dizem" — carrossel de depoimentos com avatar, nome, empresa e texto
- **Nova seção**: "Por Que Escolher a Precision" — grid com 3 cards (Parceiro Oficial Huawei, Estoque Próprio no Brasil, Suporte Técnico Pós-Venda)

---

### 2. Elementos de Conversão & Marketing

#### [MODIFY] [Header.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/components/layout/Header.tsx)
- Top bar: transformar o texto estático em **promo banner rotativo** com 3 mensagens alternando a cada 4s:
  1. "⚡ Frete grátis para compras acima de R$ 5.000"
  2. "🔥 Pronta entrega para todo o Brasil — envio em 24h"
  3. "💼 Condições especiais B2B — Solicite sua cotação"

---

#### [MODIFY] [Footer.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/components/layout/Footer.tsx)
- Adicionar **newsletter signup** com input de email no topo do footer
- Adicionar **trust badges** visuais: "Pagamento Seguro SSL", "Garantia Oficial Huawei", "Parceiro Autorizado", CNPJ formatado
- Melhorar ícones de redes sociais com hover animado

---

#### [NEW] [WhatsAppFab.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/components/layout/WhatsAppFab.tsx)
- Botão flutuante verde do WhatsApp no canto inferior direito
- Ícone SVG oficial do WhatsApp + pulse animation para atrair atenção
- Tooltip "Fale conosco" ao hover
- Link direto para WhatsApp Business com mensagem pré-preenchida
- Aparece com delay de 2s após page load para não atrapalhar

---

#### [NEW] [ScrollToTop.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/components/layout/ScrollToTop.tsx)
- Botão que aparece quando scroll > 400px
- Animação de entrada/saída suave
- Ícone de seta para cima com ripple effect ao clicar

---

#### [MODIFY] [layout.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/layout.tsx)
- Incluir `<WhatsAppFab />` e `<ScrollToTop />` no layout global

---

### 3. Polish Visual

#### [MODIFY] [ProductCard.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/components/product/ProductCard.tsx)
- Hover aprimorado: overlay semitransparente com botão "Ver Detalhes" e "Adicionar ao Carrinho"
- Micro-animação no badge de estoque (pulse no ponto verde)
- Adicionar "tag de destaque" quando produto é featured

---

#### [MODIFY] Catálogo [produtos/page.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/produtos/page.tsx)
- Substituir loading text por **skeleton cards** animados (shimmer)
- Adicionar animação de entrada nos cards ao carregar

---

#### [MODIFY] [login/page.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/login/page.tsx) e [cadastro/page.tsx](file:///c:/Users/Neto/Documents/GitHub/Precision%20Tecnologia/precision-ecommerce/src/app/cadastro/page.tsx)
- Transformar em layout split-screen: lado esquerdo com branding e benefícios (visual atrativo), lado direito com formulário
- Adicionar ícones animados e transição suave entre login/cadastro

---

## Verification Plan

### Build Automatizado
- Rodar `npm run build` no diretório do projeto para garantir zero erros de compilação

### Verificação Visual (Browser)
- Navegar por todas as páginas modificadas usando o browser tool:
  1. **Home** (`/`): verificar hero com contadores, seção de depoimentos, marquee de marcas, scroll-reveal
  2. **Catálogo** (`/produtos`): verificar skeleton loading, hover nos cards
  3. **Login/Cadastro** (`/login`, `/cadastro`): verificar layout split-screen
  4. **WhatsApp FAB**: verificar visibilidade e posicionamento em todas as páginas
  5. **Scroll-to-top**: verificar aparecimento após scroll
  6. **Header**: verificar promo banner rotativo
  7. **Footer**: verificar trust badges e newsletter
