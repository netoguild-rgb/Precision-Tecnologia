# 🎨 Precision Tecnologia — Plano de Evolução UX/Frontend v2

> **Escopo:** Apenas Frontend (Next.js + React + CSS)  
> **Objetivo:** Transformar o e-commerce em uma referência visual e funcional para infraestrutura de rede  
> **Data:** Fevereiro 2026  
> **Status:** Planejamento

---

## 1. Design System — O Visual da Eficiência

### 1.1 Modo Claro (Fundo Branco) — Nova Identidade

Migrar do tema escuro atual para um **modo claro profissional** que transmita estabilidade e robustez.

| Token | Valor Atual (Dark) | Novo Valor (Light) | Justificativa |
|---|---|---|---|
| `--color-bg` | `#0A0E1A` | `#FFFFFF` | Fundo limpo e profissional |
| `--color-bg-elevated` | `#111827` | `#F8FAFC` | Superfícies elevadas sutis |
| `--color-bg-card` | `#1A1F2E` | `#FFFFFF` | Cards com bordas e sombras leves |
| `--color-bg-card-hover` | `#222840` | `#F1F5F9` | Hover suave |
| `--color-text` | `#F0F4F8` | `#0F172A` | Texto escuro sobre fundo claro |
| `--color-text-muted` | `#94A3B8` | `#64748B` | Texto secundário |
| `--color-text-dim` | `#64748B` | `#94A3B8` | Texto terciário |
| `--color-border` | `#1E293B` | `#E2E8F0` | Bordas sutis |
| `--color-border-hover` | `#334155` | `#CBD5E1` | Bordas hover |

### 1.2 Cores de Destaque (Accent Colors)

| Cor | Hex | Uso |
|---|---|---|
| **Azul Marinho / Royal** | `#1E3A8A` → `#2563EB` | Cor primária, CTAs principais, links, header |
| **Verde Esmeralda** | `#059669` → `#10B981` | "Disponível em Estoque", status online, LEDs de servidor |
| **Vermelho Alerta** | `#DC2626` | "Fora de Estoque", alertas críticos |
| **Âmbar** | `#D97706` | "Sob Encomenda", avisos |

### 1.3 Tipografia

| Elemento | Fonte | Peso | Justificativa |
|---|---|---|---|
| **Headings** | `Inter` ou `Roboto` | 700-800 | Limpa e moderna |
| **Body** | `Inter` ou `Roboto` | 400-500 | Alta legibilidade |
| **SKU / Part Number / Specs** | `Ubuntu Mono` ou `JetBrains Mono` | 400 | Ar de "terminal de comando" sofisticado |
| **Preços** | `Inter` | 700 | Destaque com peso bold |

```css
/* Exemplo de aplicação */
.sku-code {
  font-family: 'Ubuntu Mono', 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}
```

### 1.4 Componentes Visuais

- **Cards de produto**: Fundo branco, borda `1px solid var(--color-border)`, sombra sutil no hover
- **Badges de status**: Verde pulsante para "Em Estoque", âmbar para "Sob Encomenda", bordas arredondadas
- **Botões primários**: Azul Royal sólido com hover escurecido
- **Botões secundários**: Borda azul, fundo transparente
- **Botão "Solicitar Orçamento"**: Verde Esmeralda (associação com "ação positiva")

---

## 2. UX Focada em Infraestrutura de Rede

### 2.1 Filtros Inteligentes (Sidebar de Filtragem)

> **Princípio:** O cliente técnico quer encontrar o produto em **3 cliques**.

#### Filtros por Categoria

| Categoria | Filtros Específicos |
|---|---|
| **Switches** | Qtd. Portas (8, 16, 24, 48), Velocidade (10/100, Gigabit, 10G), Gerenciável/Não-Gerenciável, PoE (Sim/Não + Watts), Layer (L2/L3), Montagem (Desktop/Rack 1U) |
| **Roteadores** | Tipo (SD-WAN, Edge, Branch), Throughput, Interfaces (WAN/LAN), VPN suportada |
| **Access Points** | Padrão Wi-Fi (5/6/6E/7), Indoor/Outdoor, MU-MIMO, Alimentação (PoE/Adaptador) |
| **GBICs / SFP** | Tipo (SFP, SFP+, SFP28, QSFP+, QSFP28), Velocidade (1G-400G), Distância (300m-120km), Fibra (MM/SM), Conector (LC, SC, RJ45) |
| **Patch Cords** | Tipo (UTP/Fibra), Categoria (Cat5e/6/6a), Metragem, Conector (RJ45, LC, SC) |
| **Patch Panels** | Portas (12/24/48), Tipo (UTP/Fibra/Descarregado), Padrão rack |
| **Conectores** | Tipo (RJ-45, LC, SC, Keystone, Fast Connect) |
| **Firewalls** | Throughput, Licenciamento, Portas |

#### Layout do Filtro (Desktop)

```
┌─────────────────────┬──────────────────────────────────────────────┐
│  FILTROS            │  RESULTADOS                                  │
│                     │                                              │
│  ▼ Categoria        │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│    ☑ Switches       │  │ Prod │ │ Prod │ │ Prod │ │ Prod │       │
│    ☐ Roteadores     │  └──────┘ └──────┘ └──────┘ └──────┘       │
│                     │                                              │
│  ▼ Velocidade       │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│    ☐ 10/100 Mbps    │  │ Prod │ │ Prod │ │ Prod │ │ Prod │       │
│    ☑ Gigabit        │  └──────┘ └──────┘ └──────┘ └──────┘       │
│    ☐ 10G            │                                              │
│                     │  Ordenar: Relevância | Preço ↑ | Preço ↓    │
│  ▼ Portas           │                                              │
│    ☐ 8    ☐ 16      │                                              │
│    ☑ 24   ☐ 48      │                                              │
│                     │                                              │
│  ▼ PoE              │                                              │
│    ○ Sim  ○ Não     │                                              │
│                     │                                              │
│  ▼ Gerenciamento    │                                              │
│    ○ Gerenciável    │                                              │
│    ○ Não-gerenciável│                                              │
│                     │                                              │
│  ▼ Disponibilidade  │                                              │
│    ☑ Pronta Entrega │                                              │
│    ☐ Sob Encomenda  │                                              │
└─────────────────────┴──────────────────────────────────────────────┘
```

### 2.2 Tabela de Compatibilidade de GBICs (Santo Graal da Conversão)

Botão proeminente na página de GBICs/SFPs: **"Verificar Compatibilidade"**

```
┌──────────────────────────────────────────────────────────┐
│  🔍 VERIFICAR COMPATIBILIDADE                            │
│                                                          │
│  Selecione o fabricante do seu equipamento:              │
│                                                          │
│  [ Huawei ▼ ]  [ Modelo do Switch ▼ ]                   │
│                                                          │
│  ✅ Este GBIC é compatível com:                          │
│     • Huawei S5735-L (todas revisões)                    │
│     • Huawei S6730-H                                     │
│     • Huawei CloudEngine 16800                           │
│                                                          │
│  ⚠️ Requer firmware v200R019 ou superior                 │
│                                                          │
│  Marcas suportadas: Huawei | Cisco | HP/Aruba |          │
│                     Dell | Juniper | Mikrotik            │
└──────────────────────────────────────────────────────────┘
```

**Implementação frontend:** Modal ou seção expansível com selects cascata (marca → modelo). Dados estáticos em JSON até ter backend.

---

## 3. Página de Produto — Estrutura para Switches/Equipamentos

### 3.1 Topo da Página (Visão de 3 Segundos)

O técnico precisa confirmar em 3 segundos que entrou no link certo.

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Switches > Campus > S5735-L-V2             │
│                                                                 │
│  ┌──────────────┐   SWITCH HUAWEI CLOUDENGINE S5735-L-V2       │
│  │              │   24 Portas Gigabit PoE+ L2 Gerenciável       │
│  │   [FOTO 1]  │                                                │
│  │   Frente    │   SKU: 98012021    Part: S5735-L24P4X-A1       │
│  │              │                                                │
│  │              │   • Switching: 336 Gbps                        │
│  │              │   • Throughput: 130 Mpps                       │
│  │              │   • PoE+: 370W Budget                          │
│  │              │   • Montagem: 1U Rack 19"                      │
│  │              │   • Garantia: 12 meses                         │
│  │──────────────│                                                │
│  │ 📸 📸 📸 📸 │   ┌─────────────────────────────────────┐      │
│  └──────────────┘   │  R$ 2.890,00  à vista (PIX -5%)    │      │
│                     │  ou 12x R$ 253,33 sem juros         │      │
│                     │                                     │      │
│                     │  🟢 Em Estoque — Envio em 24h       │      │
│                     │                                     │      │
│                     │  [ 🛒 COMPRAR AGORA          ]      │      │
│                     │  [ 📋 SOLICITAR ORÇAMENTO LOTE]      │      │
│                     │                                     │      │
│                     │  📦 Calcular frete: [CEP] [Calcular]│      │
│                     │  🏢 Retirada em mãos: São Paulo     │      │
│                     └─────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Galeria de Fotos "Explodida"

| Foto | O que mostra | Por quê |
|---|---|---|
| **Foto 1 (Principal)** | Frente — layout das portas e LEDs | Confirma o modelo e portas |
| **Foto 2** | Traseira — entrada de energia, ventoinhas, console | Verifica conectores de energia |
| **Foto 3** | Lateral — profundidade do equipamento | Saber se cabe no rack raso |
| **Foto 4** | Interface de software (Print da GUI) | Segurança sobre facilidade de uso |
| **Foto 5** | Equipamento no rack (contexto real) | Referência visual de instalação |

### 3.3 Buy Box Estratégico

Componente `<BuyBox />` com:

- **Preço à vista** (com desconto PIX) em destaque
- **Preço parcelado** (12x sem juros)
- **Status de estoque** com LED visual (🟢 verde pulsante)
- **Botão "Comprar Agora"**: Cor sólida Verde ou Azul, grande
- **Botão "Solicitar Orçamento em Lote"**: Logo abaixo, borda, menor
- **Calculadora de Frete** com opção "Retirada em Mãos"
- **Prazo de envio**: "Envio em 24h" ou "Prazo estimado: 5-10 dias"

### 3.4 Especificações Técnicas (Tabela Organizada)

Tabela limpa com categorias colapsáveis:

| Categoria | Especificação |
|---|---|
| **Portas** | 24x 10/100/1000 Mbps RJ45 + 2x SFP 1Gbps |
| **Gerenciamento** | Layer 2 / Layer 3 Lite (VLAN, IGMP Snooping, LACP) |
| **Energia** | PoE+ 802.3at (Total 120W) |
| **Performance** | Latência < 3ms, Buffer de pacotes 4.1MB |
| **Dimensões** | 442 x 220 x 43.6 mm (1U) |
| **Peso** | 3.2 kg |
| **Temperatura** | Operação: 0°C a 45°C |
| **Certificações** | CE, FCC, UL, ANATEL |

### 3.5 Central de Downloads e Recursos

```
┌──────────────────────────────────────────────────┐
│  📄 DOWNLOADS E RECURSOS                         │
│                                                  │
│  📑 Datasheet Oficial (PDF, 2.1MB)    [⬇ Baixar] │
│  📘 Manual de Instalação Rápida       [⬇ Baixar] │
│  📋 Guia de Compatibilidade GBICs    [⬇ Baixar] │
│  🔧 Firmware mais recente            [🔗 Huawei] │
│  📐 Dimensões para projeto (DWG/PDF) [⬇ Baixar] │
└──────────────────────────────────────────────────┘
```

### 3.6 Cross-Selling Inteligente (Aumentando Ticket Médio)

Sugestões contextuais, não aleatórias:

```
┌──────────────────────────────────────────────────────────────┐
│  🔗 COMPLETE SUA INSTALAÇÃO                                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ SFP 1Gb  │  │ Patch    │  │ Guia de  │  │ Patch    │    │
│  │ LC 10km  │  │ Cord     │  │ Cabos 1U │  │ Panel    │    │
│  │          │  │ Cat6 0.5m│  │          │  │ 24p Cat6 │    │
│  │ R$ 89    │  │ R$ 12    │  │ R$ 45    │  │ R$ 120   │    │
│  │ [Comprar]│  │ [Comprar]│  │ [Comprar]│  │ [Comprar]│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  💡 "Recomendados para Switch S5735-L-V2"                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Funcionalidades B2B (Frontend)

### 4.1 Botão "Orçamento em Lote"

Em toda página de produto e no carrinho:
- Modal com campos: Quantidade, CNPJ, E-mail, Telefone, Observações
- Opção de anexar lista de produtos (planilha)
- Resposta automática com prazo estimado

### 4.2 Faturamento para Empresas

Seção visível no checkout e footer:
- "Aceitamos boleto faturado para CNPJ (30/60/90 dias)"
- Badge de confiança na sidebar do checkout

### 4.3 Calculadora de Unidades de Rack (U)

Widget interativo:

```
┌──────────────────────────────────────────────┐
│  📐 CALCULADORA DE RACK                      │
│                                              │
│  Equipamentos no carrinho:                   │
│  ┌────────────────────────────────┐          │
│  │ ████████████████████████ │ 1U  │ S5735-L  │
│  │ ████████████████████████ │ 1U  │ Patch P. │
│  │ ████████████████████████ │ 1U  │ Guia Cab.│
│  │                          │     │          │
│  │                          │     │ (vazio)  │
│  │                          │     │          │
│  └────────────────────────────────┘          │
│                                              │
│  Ocupação: 3U de 42U (7%)                   │
│  Espaço restante: 39U                        │
└──────────────────────────────────────────────┘
```

---

## 5. Conteúdo Técnico / Marketing

### 5.1 Downloads de Datasheets
- Botão de download visível em **todas** as páginas de produto
- Ícone PDF proeminente
- Link direto (sem registro obrigatório)

### 5.2 Fotos de Detalhes
- Fotos reais (não renders de fábrica)
- Ângulos: frente, traseira, lateral, interface GUI
- Zoom com lupa no hover

### 5.3 Kit de Montagem / Cross-Selling
- Seção "Complete sua instalação" em toda página de produto
- Sugestões baseadas em compatibilidade real
- "Quem comprou X também comprou Y"

---

## 6. Componentes Frontend a Criar

### Novos Componentes

| Componente | Arquivo | Descrição |
|---|---|---|
| `FilterSidebar` | `src/components/catalog/FilterSidebar.tsx` | Filtros laterais com checkboxes, ranges, toggles |
| `FilterChips` | `src/components/catalog/FilterChips.tsx` | Chips de filtros ativos com botão remover |
| `ProductCard` | `src/components/product/ProductCard.tsx` | Card de produto para grid de catálogo |
| `ProductGallery` | `src/components/product/ProductGallery.tsx` | Galeria de fotos com zoom e thumbnails |
| `BuyBox` | `src/components/product/BuyBox.tsx` | Preço + botões + frete + estoque |
| `SpecsTable` | `src/components/product/SpecsTable.tsx` | Tabela de especificações colapsável |
| `DownloadsSection` | `src/components/product/DownloadsSection.tsx` | Links para datasheets e manuais |
| `CrossSelling` | `src/components/product/CrossSelling.tsx` | Produtos complementares inteligentes |
| `CompatibilityChecker` | `src/components/product/CompatibilityChecker.tsx` | Modal de verificação de compatibilidade GBIC |
| `RackCalculator` | `src/components/tools/RackCalculator.tsx` | Calculadora visual de rack |
| `QuoteBulkModal` | `src/components/b2b/QuoteBulkModal.tsx` | Modal de orçamento em lote |
| `CatalogPage` | `src/app/produtos/page.tsx` | Página de catálogo com filtros |
| `ProductPage` | `src/app/produtos/[slug]/page.tsx` | Página de detalhe do produto |

### Páginas a Criar/Modificar

| Página | Rota | Status |
|---|---|---|
| Home (redesenhada) | `/` | ✅ Já atualizada |
| Catálogo com filtros | `/produtos` | 🆕 Criar |
| Detalhe do produto | `/produtos/[slug]` | 🆕 Criar |
| Cotação B2B | `/cotacao` | 🆕 Criar |

---

## 7. Ordem de Implementação (Frontend Only)

### Fase A — Design System Light Mode (1-2 dias)
- [ ] Migrar tokens CSS para modo claro
- [ ] Adicionar fonte monospace (`Ubuntu Mono`) para SKUs
- [ ] Atualizar Header e Footer para modo claro
- [ ] Ajustar hero banner para funcionar no modo claro com vídeo

### Fase B — Página de Catálogo com Filtros (2-3 dias)
- [ ] Criar `FilterSidebar` com filtros por categoria
- [ ] Criar `ProductCard` (modo claro)
- [ ] Criar `FilterChips` para filtros ativos
- [ ] Layout responsivo (sidebar → drawer no mobile)
- [ ] Ordenação (preço, nome, disponibilidade)
- [ ] Dados mockados em JSON até integração com backend

### Fase C — Página de Produto Detalhada (2-3 dias)
- [ ] Criar `ProductGallery` com zoom
- [ ] Criar `BuyBox` com preço/PIX/parcelamento + estoque + frete
- [ ] Criar `SpecsTable` colapsável
- [ ] Criar `DownloadsSection`
- [ ] Criar `CrossSelling` com produtos complementares
- [ ] Breadcrumb component
- [ ] SKU/Part Number com fonte monospace

### Fase D — Funcionalidades B2B (1-2 dias)
- [ ] Criar `QuoteBulkModal`
- [ ] Criar `CompatibilityChecker` (dados mockados)
- [ ] Criar `RackCalculator`
- [ ] Seção de faturamento para empresas no checkout

### Fase E — Polish e Responsivo (1 dia)
- [ ] Testar todas as páginas em mobile
- [ ] Animações de transição entre páginas
- [ ] Loading states (skeletons)
- [ ] SEO meta tags para páginas de produto

---

## 8. Referências Visuais

| Referência | O que Capturar |
|---|---|
| **fs.com** | Filtros técnicos, especificações de GBIC, compatibilidade |
| **ui.com (Ubiquiti)** | Design limpo, fotos de produto, fundo branco |
| **tp-link.com** | Estrutura de especificações, downloads |
| **Amazon Business** | Buy box, orçamento em lote, cross-selling |
