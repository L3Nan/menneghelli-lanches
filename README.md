# Meneghelli Lanches

Site institucional e **vitrine de cardápio** para a Meneghelli Lanches — hambúrgueres, combos, acompanhamentos e bebidas. O cliente monta o pedido no carrinho e **finaliza pelo WhatsApp** com a mensagem já formatada.

<p align="center">
  <img src="https://img.shields.io/badge/site-estático-111827?style=for-the-badge&labelColor=1f2937" alt="Site estático" />
  <img src="https://img.shields.io/badge/JS-modules-111827?style=for-the-badge&labelColor=1f2937" alt="JavaScript modules" />
  <img src="https://img.shields.io/badge/checkout-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Checkout WhatsApp" />
</p>

---

## O que é este projeto

É um **site estático** (HTML + CSS + JavaScript) pensado para uma hamburgueria:

- **Home** com destaques e chamadas para ação  
- **Cardápio / loja** com categorias (burgers, combos, acompanhamentos, bebidas)  
- **Página de produto** com galeria, descrição e destaques  
- **Carrinho** no navegador (dados salvos localmente)  
- **Finalização via WhatsApp** — nenhum pagamento online no site; o fluxo leva o cliente para conversar com o atendimento  

Não há banco de dados nem servidor da aplicação: o conteúdo do cardápio vem de arquivos **JSON** e imagens na pasta **`uploads/`**.

---

## Funcionalidades principais

| Área | Descrição |
|------|-----------|
| Cardápio | Lista de produtos com preço, imagem, categoria, texto e opcional de galeria |
| Destaques | Itens marcados como `featured` aparecem nos destaques da home |
| Carrinho | Quantidades, subtotal, frete simbólico e total |
| WhatsApp | Botões que abrem `wa.me` com mensagem pronta (produto ou carrinho inteiro) |
| Admin (opcional) | Pasta **`/admin`** com **Decap CMS** para editar o cardápio com interface visual quando o backend estiver configurado |

---

## Stack técnica

- **HTML5** — páginas como `index.html`, `loja.html`, `produto.html`, `carrinho.html`, etc.  
- **CSS** — `css/style.css`  
- **JavaScript (ES modules)** — `js/app.js` (lógica do site), `js/data.js` (carregar JSON)  
- **Dados** — `data/*.json` (produtos, configurações auxiliares, frete, etc.)  
- **CMS** — [Decap CMS](https://decapcms.org/) em `admin/`, com `admin/config.yml` definindo o formulário do cardápio  

---

## Estrutura do repositório (resumo)

```
├── index.html          # Home
├── loja.html           # Cardápio completo
├── produto.html        # Detalhe do produto (?produto=slug)
├── carrinho.html       # Carrinho e resumo
├── contato.html, sobre.html, …   # Institucionais
├── css/style.css
├── js/
│   ├── app.js          # Carrinho, renderização, WhatsApp, frete no checkout
│   └── data.js         # fetch dos JSON em data/
├── data/
│   ├── products.json   # ⭐ Cardápio (principal arquivo de conteúdo)
│   ├── settings.json   # Nome da loja, logo, WhatsApp (referência)
│   ├── shipping.json   # Dados de frete / regiões (quando usados)
│   └── …
├── uploads/            # Imagens do cardápio e identidade
└── admin/              # Painel Decap CMS + config.yml
```

---

## Como funciona o cardápio

1. Ao abrir o site, o script **lê** `data/products.json`.  
2. Cada item é um objeto com campos como `id`, `slug`, `name`, `category`, `price`, `image`, `description`, `highlights`, etc.  
3. Só entram na loja os produtos com **`active: true`** (e categoria reconhecida pelo site).  
4. **`featured: true`** coloca o item nos **destaques da home**.  
5. **`slug`** deve ser único e é usado na URL: `produto.html?produto=seu-slug`.

### Categorias válidas (valor do campo `category`)

| Valor em JSON | Uso |
|---------------|-----|
| `burgers` | Burgers |
| `combos` | Combos |
| `acompanhamentos` | Acompanhamentos |
| `bebidas` | Bebidas |

### Imagens

- Pode usar caminho relativo para arquivos em **`uploads/`** (ex.: `./uploads/nome-do-arquivo.png`).  
- Evite espaços nos nomes de arquivo quando possível (ou use `%20` na URL, como já feito em alguns assets).  
- Também é possível usar URL externa de imagem, se preferir.

---

## Duas formas de editar o conteúdo

### 1) Direto no JSON (simples e sempre funciona)

1. Abra **`data/products.json`**.  
2. Edite a lista em `"products": [ ... ]`.  
3. Salve, faça commit e publique (ou atualize os arquivos no servidor).  
4. Recarregue o site no navegador (se o cache atrapalhar, use atualização forçada).

Para **nome da marca no título**, textos institucionais e **logo no topo**, os arquivos **`*.html`** em `uploads/` referenciam imagens — ajuste os caminhos conforme necessário.

### 2) Pelo painel `/admin` (Decap CMS)

- Acesse **`/admin/`** no mesmo domínio onde o site está hospedado.  
- O arquivo **`admin/config.yml`** descreve o formulário (“Cards do Cardápio”) ligado a `data/products.json`.  
- Em **produção** com Netlify, costuma-se usar **Netlify Identity** + **Git Gateway** para salvar alterações direto no Git.  
- Em **desenvolvimento local**, o projeto pode usar backend local do Decap (`local_backend: true` no `config.yml`); veja [Working with a Local Git Repository](https://decapcms.org/docs/working-with-a-local-git-repository/) no site do Decap CMS para o proxy local.

> **Resumo:** para mudanças rápidas no cardápio, editar `products.json` é o caminho mais direto. O admin é ideal quando toda a equipe edita pela interface gráfica e o deploy está integrado ao Git.

---

## WhatsApp e frete no checkout

As regras usadas ao montar o valor de **entrega** no carrinho e o **número do WhatsApp** estão no objeto **`STORE`**, no início de **`js/app.js`**:

- `whatsapp` — número no formato internacional **sem** `+` (ex.: `5511999998888`)  
- `deliveryFee` — valor do frete quando abaixo do pedido mínimo  
- `freeDeliveryFrom` — subtotal a partir do qual o frete aparece como grátis na simulação  

O arquivo **`data/settings.json`** guarda metadados como `storeName`, `logoUrl` e `whatsAppNumber` — útil como **referência**; mantenha esse número alinhado com o `STORE.whatsapp` para o cliente não ser redirecionado para um número errado.

---

## Carrinho (local)

- Os itens ficam no **`localStorage`** do navegador (chave interna `meneghelli_cart_v1`).  
- Limpar dados do site ou usar outro aparelho **zera** o carrinho.  
- Isso é intencional para um site sem login e sem servidor próprio.

---

## Como rodar localmente

O projeto usa **`import`/`export`** em módulos ES. Abrir o `index.html` direto do disco (`file://`) costuma bloquear o carregamento do JSON. Use um servidor HTTP simples na pasta do projeto:

```bash
# Exemplo com Python 3
python -m http.server 8080
```

Depois abra [http://localhost:8080](http://localhost:8080).

Alternativas: extensão “Live Server” no VS Code, `npx serve`, etc.

---

## Deploy

Qualquer hospedagem de **site estático** serve: Netlify, Vercel, GitHub Pages, servidor próprio com Nginx, etc.  
Basta publicar os arquivos mantendo a estrutura de pastas (`data/`, `js/`, `css/`, `uploads/`).

Se usar **Netlify** e quiser o **`/admin`** gravando no repositório, configure Identity + Git Gateway conforme a documentação da Netlify e do Decap CMS.

---

## Licença e créditos

Projeto da **Meneghelli Lanches**. Ajuste esta secção se quiser declarar licença explícita (ex.: privado, uso interno).

---

<p align="center">
  Feito com foco em cardápio claro, pedido rápido e atendimento humano no <strong>WhatsApp</strong>.
</p>
