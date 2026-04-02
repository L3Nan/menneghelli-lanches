import { loadProducts } from "./data.js";

const STORE = {
  whatsapp: "5511912345678",
  deliveryFee: 8.9,
  freeDeliveryFrom: 50
};

const CATEGORY_LABELS = {
  burgers: "Burger",
  combos: "Combo",
  acompanhamentos: "Acompanhamento",
  bebidas: "Bebida"
};

const DEFAULT_PRODUCTS = [
  {
    id: "xbacon",
    slug: "x-bacon",
    category: "burgers",
    categoryLabel: "Burger",
    featured: true,
    name: "X-Bacon",
    subtitle: "Artesanal",
    price: 29.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1550547660-d9450f859349&w=1100&q=85",
    description: "Pão brioche, burger bovino 180g, queijo derretido, bacon crocante, maionese da casa e salada fresca.",
    highlights: ["Burger 180g na brasa", "Bacon crocante", "Pão brioche macio"]
  },
  {
    id: "smash-duplo",
    slug: "smash-burger-duplo",
    category: "burgers",
    categoryLabel: "Burger",
    featured: true,
    name: "Smash Burger",
    subtitle: "Duplo",
    price: 34.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1568901346375-23c9450c58cd&w=1100&q=85",
    description: "Dois smash burgers prensados na chapa, cheddar cremoso, cebola caramelizada e molho especial Meneghelli.",
    highlights: ["Duplo smash", "Cheddar extra", "Molho especial da casa"]
  },
  {
    id: "combo-familia",
    slug: "combo-familia",
    category: "combos",
    categoryLabel: "Combo",
    featured: true,
    name: "Combo Família",
    subtitle: "4 Burgers + Batata G + Refri 2L",
    price: 89.9,
    image: "./uploads/combo%20f.png",
    description: "Perfeito para dividir: quatro burgers artesanais, batata grande crocante e refrigerante 2L gelado.",
    highlights: ["Serve até 4 pessoas", "Batata grande", "Refrigerante 2L"]
  },
  {
    id: "batata-cheddar-bacon",
    slug: "batata-cheddar-bacon",
    category: "acompanhamentos",
    categoryLabel: "Acompanhamento",
    featured: true,
    name: "Batata Cheddar",
    subtitle: "E Bacon",
    price: 19.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1630384060421-cb20d0e0649d&w=1100&q=85",
    description: "Batatas crocantes cobertas com cheddar cremoso e bacon em cubos para completar seu pedido.",
    highlights: ["Porção generosa", "Cheddar cremoso", "Bacon em cubos"]
  },
  {
    id: "x-salada",
    slug: "x-salada-brasa",
    category: "burgers",
    categoryLabel: "Burger",
    featured: false,
    name: "X-Salada",
    subtitle: "Clássico da Casa",
    price: 26.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1572802419224-296b0aeee0d9&w=1100&q=85",
    description: "Burger bovino, queijo, alface crocante, tomate fresco, cebola roxa e maionese artesanal.",
    highlights: ["Molho artesanal", "Vegetais frescos", "Ponto ideal da carne"]
  },
  {
    id: "combo-casal",
    slug: "combo-casal",
    category: "combos",
    categoryLabel: "Combo",
    featured: false,
    name: "Combo Casal",
    subtitle: "2 Burgers + Batata + Refri 1L",
    price: 59.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1561758033-d89a9ad46330&w=1100&q=85",
    description: "Dois burgers premium, batata média para compartilhar e refrigerante 1L para completar a noite.",
    highlights: ["Ideal para 2 pessoas", "Ótimo custo-benefício", "Bebida inclusa"]
  },
  {
    id: "refrigerante-2l",
    slug: "refrigerante-2-litros",
    category: "bebidas",
    categoryLabel: "Bebida",
    featured: false,
    name: "Refrigerante 2L",
    subtitle: "Escolha o sabor disponível",
    price: 12.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1622483767028-3f66f32aef97&w=1100&q=85",
    description: "Garrafa de 2 litros bem gelada para acompanhar os burgers e combos do cardápio.",
    highlights: ["Bem gelado", "Perfeito para combos", "Sabores sujeitos à disponibilidade"]
  },
  {
    id: "milkshake-oreo",
    slug: "milkshake-oreo",
    category: "bebidas",
    categoryLabel: "Bebida",
    featured: false,
    name: "Milk-shake Oreo",
    subtitle: "400 ml",
    price: 18.9,
    image: "https://wsrv.nl/?url=images.unsplash.com/photo-1579954115563-e72bf1381629&w=1100&q=85",
    description: "Milk-shake cremoso com biscoito Oreo triturado, finalizado com chantilly e calda especial.",
    highlights: ["Textura cremosa", "Cobertura especial", "400 ml"]
  }
];

let PRODUCTS = [...DEFAULT_PRODUCTS];

const CART_KEY = "meneghelli_cart_v1";

function formatCurrency(value){
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));
}

function slugify(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeGalleryImage(image, fallbackAlt){
  if(typeof image === "string" && image){
    return {
      src: image,
      alt: fallbackAlt
    };
  }

  if(image && typeof image === "object"){
    const src = image.src || image.image || "";

    if(src){
      return {
        src,
        alt: image.alt || fallbackAlt
      };
    }
  }

  return null;
}

function normalizeProduct(product, index){
  const category = String(product?.category || "").trim().toLowerCase();

  if(!CATEGORY_LABELS[category]){
    return null;
  }

  const fallbackName = `Produto ${index + 1}`;
  const name = String(product?.name || fallbackName).trim();
  const images = Array.isArray(product?.images) ? product.images : [];
  const gallerySource = Array.isArray(product?.galleryImages) && product.galleryImages.length ? product.galleryImages : images;
  const galleryImages = gallerySource
    .map((image) => normalizeGalleryImage(image, name))
    .filter(Boolean);
  const mainImage = typeof product?.image === "string" && product.image
    ? product.image
    : galleryImages[0]?.src || "";

  if(!mainImage){
    return null;
  }

  return {
    id: String(product?.id || `produto-${index + 1}`),
    slug: String(product?.slug || slugify(name) || `produto-${index + 1}`),
    category,
    categoryLabel: CATEGORY_LABELS[category],
    featured: Boolean(product?.featured),
    active: product?.active !== false && product?.inStock !== false,
    name,
    subtitle: String(product?.subtitle || "").trim(),
    price: Number(product?.price || 0),
    image: mainImage,
    galleryImages: galleryImages.length ? galleryImages : undefined,
    description: String(product?.description || "").trim(),
    highlights: Array.isArray(product?.highlights)
      ? product.highlights.map((item) => String(item).trim()).filter(Boolean)
      : []
  };
}

async function hydrateProducts(){
  const loadedProducts = await loadProducts();
  const normalizedProducts = loadedProducts
    .map(normalizeProduct)
    .filter((product) => product && product.active);

  if(normalizedProducts.length){
    PRODUCTS = normalizedProducts;
  }
}

function getProduct(idOrSlug){
  return PRODUCTS.find((product) => product.id === idOrSlug || product.slug === idOrSlug) || null;
}

function getCart(){
  try{
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  }catch{
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount(){
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal(){
  return getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getShippingValue(total){
  if(total <= 0){
    return 0;
  }

  return total >= STORE.freeDeliveryFrom ? 0 : STORE.deliveryFee;
}

function buildProductUrl(product){
  return `./produto.html?produto=${encodeURIComponent(product.slug)}`;
}

function openWhatsApp(message){
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function showToast(message){
  let stack = document.querySelector(".toast-stack");

  if(!stack){
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.append(stack);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = message;
  stack.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function animateCartCounter(){
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.classList.remove("is-bump");
    window.requestAnimationFrame(() => badge.classList.add("is-bump"));
  });
}

function updateCartCounters(animate = false){
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
  });

  if(animate){
    animateCartCounter();
  }
}

function addToCart(productId, quantity = 1){
  const product = getProduct(productId);

  if(!product){
    return;
  }

  const cart = getCart();
  const found = cart.find((item) => item.id === product.id);

  if(found){
    found.quantity += quantity;
  }else{
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      subtitle: product.subtitle,
      image: product.image,
      slug: product.slug,
      quantity
    });
  }

  saveCart(cart);
  updateCartCounters(true);
  renderCartPage();
  showToast(`<strong>${product.name}</strong> adicionado ao pedido.`);
}

function updateCartQuantity(productId, nextQuantity){
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if(!item){
    return;
  }

  item.quantity = Math.max(1, Number(nextQuantity || 1));
  saveCart(cart);
  updateCartCounters();
  renderCartPage();
}

function removeCartItem(productId){
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCounters();
  renderCartPage();
  showToast("Item removido do pedido.");
}

function clearCart(){
  saveCart([]);
  updateCartCounters();
  renderCartPage();
}

function buildCartWhatsAppMessage(){
  const cart = getCart();
  const subtotal = getCartTotal();
  const shipping = getShippingValue(subtotal);
  const total = subtotal + shipping;
  const items = cart.map((item, index) => `${index + 1}. ${item.name} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`);

  return [
    "Olá! Quero fechar este pedido da Meneghelli Lanches:",
    "",
    ...items,
    "",
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Entrega: ${shipping === 0 ? "Grátis" : formatCurrency(shipping)}`,
    `Total: ${formatCurrency(total)}`,
    "",
    "Pode confirmar disponibilidade e prazo de entrega?"
  ].join("\n");
}

function createProductMedia(product, className, loading = "lazy"){
  if(product.galleryImages?.length){
    return `
      <div class="${className} combo-gallery">
        ${product.galleryImages.map((image, index) => `
          <img class="combo-gallery-image combo-gallery-image-${index + 1}" src="${image.src}" alt="${image.alt || product.name}" loading="${loading}">
        `).join("")}
      </div>
    `;
  }

  return `
    <div class="${className}">
      <img src="${product.image}" alt="${product.name}" loading="${loading}">
    </div>
  `;
}

function createProductCard(product){
  return `
    <article class="menu-card fade-in">
      ${createProductMedia(product, "menu-card-media")}
      <div class="menu-card-body">
        <h3 class="menu-card-title">${product.name}</h3>
        <p class="menu-card-subtitle">${product.subtitle}</p>
        <div class="menu-card-price">${formatCurrency(product.price)}</div>
        <div class="menu-card-actions">
          <button class="order-button" type="button" data-add-to-cart="${product.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.8.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.4-.5-2.6-1.6-.9-.8-1.5-1.9-1.7-2.2-.2-.3 0-.5.1-.6.2-.2.3-.4.5-.6.1-.2.2-.4.3-.6.1-.2 0-.5 0-.6 0-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.8-.5h-.7c-.2 0-.6.1-.8.4-.3.3-1.1 1-1.1 2.5s1.2 2.9 1.4 3.1c.2.2 2.3 3.6 5.6 5 .8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 1.8-.8 2-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.4zM12.1 2C6.6 2 2.1 6.5 2.1 12c0 1.8.5 3.6 1.4 5.1L2 22l5-1.3c1.5.8 3.2 1.2 5 1.2 5.5 0 10-4.5 10-10S17.6 2 12.1 2z"></path>
            </svg>
            Adicionar ao pedido
          </button>
          <a class="details-button" href="${buildProductUrl(product)}">Ver detalhes</a>
        </div>
      </div>
    </article>
  `;
}

function renderMenuCards(){
  const featuredGrid = document.getElementById("menuCards");

  if(featuredGrid){
    featuredGrid.innerHTML = PRODUCTS.filter((product) => product.featured).map(createProductCard).join("");
  }

  document.querySelectorAll("[data-category-grid]").forEach((grid) => {
    const category = grid.getAttribute("data-category-grid");
    const products = PRODUCTS.filter((product) => product.category === category);
    grid.innerHTML = products.map(createProductCard).join("");
  });
}

function renderProductPage(){
  const detail = document.querySelector("[data-product-detail]");
  const related = document.querySelector("[data-related-products]");

  if(!detail){
    return;
  }

  const slug = new URLSearchParams(window.location.search).get("produto");
  const product = getProduct(slug) || PRODUCTS[0];

  document.title = `${product.name} — Meneghelli Lanches`;

  detail.innerHTML = `
    <div class="product-layout">
      <div class="product-panel">
        ${createProductMedia(product, "product-gallery", "eager")}
      </div>
      <div class="product-panel">
        <span class="product-category">${product.categoryLabel}</span>
        <h1 class="product-title">${product.name}</h1>
        <p class="product-subtitle">${product.subtitle}</p>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <p class="product-description">${product.description}</p>
        <ul class="product-highlights">
          ${product.highlights.map((highlight) => `<li>• ${highlight}</li>`).join("")}
        </ul>
        <div class="product-actions">
          <button class="button-primary" type="button" data-add-to-cart="${product.id}">Adicionar ao pedido</button>
          <button class="button-secondary" type="button" data-whatsapp-product="${product.id}">Pedir no WhatsApp</button>
        </div>
      </div>
    </div>
  `;

  if(related){
    related.innerHTML = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4).map(createProductCard).join("");
  }
}

function renderCartPage(){
  const itemsRoot = document.querySelector("[data-cart-items]");
  const summaryRoot = document.querySelector("[data-cart-summary]");
  const emptyRoot = document.querySelector("[data-cart-empty]");

  if(!itemsRoot || !summaryRoot || !emptyRoot){
    return;
  }

  const cart = getCart();
  const subtotal = getCartTotal();
  const shipping = getShippingValue(subtotal);
  const total = subtotal + shipping;

  if(cart.length === 0){
    emptyRoot.hidden = false;
    itemsRoot.innerHTML = "";
    summaryRoot.innerHTML = `
      <h2 class="summary-title">Resumo</h2>
      <div class="summary-rows">
        <div class="summary-row"><span>Itens</span><strong>0</strong></div>
        <div class="summary-row"><span>Subtotal</span><strong>${formatCurrency(0)}</strong></div>
        <div class="summary-row"><span>Total</span><strong>${formatCurrency(0)}</strong></div>
      </div>
    `;
    return;
  }

  emptyRoot.hidden = true;
  itemsRoot.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div class="cart-item-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div>
        <h2 class="cart-item-name">${item.name}</h2>
        <p class="cart-item-note">${item.subtitle}</p>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control" aria-label="Quantidade de ${item.name}">
          <button class="qty-button" type="button" data-qty-action="decrease" data-product-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-button" type="button" data-qty-action="increase" data-product-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="text-link" type="button" data-remove-item="${item.id}">Remover</button>
      </div>
    </article>
  `).join("");

  summaryRoot.innerHTML = `
    <h2 class="summary-title">Resumo do pedido</h2>
    <div class="summary-rows">
      <div class="summary-row"><span>Itens</span><strong>${getCartCount()}</strong></div>
      <div class="summary-row"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
      <div class="summary-row"><span>Entrega</span><strong>${shipping === 0 ? "Grátis" : formatCurrency(shipping)}</strong></div>
      <div class="summary-row"><span>Frete grátis</span><strong>acima de ${formatCurrency(STORE.freeDeliveryFrom)}</strong></div>
    </div>
    <hr class="summary-divider">
    <div class="summary-row"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
    <div class="summary-actions">
      <button class="button-primary" type="button" data-cart-checkout>Finalizar no WhatsApp</button>
      <button class="button-secondary" type="button" data-clear-cart>Limpar pedido</button>
    </div>
  `;
}

function bindMenu(){
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");

  if(!toggle || !nav){
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if(event.target.closest("a")){
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function bindActions(){
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    const whatsappButton = event.target.closest("[data-whatsapp-product]");
    const removeButton = event.target.closest("[data-remove-item]");
    const quantityButton = event.target.closest("[data-qty-action]");
    const checkoutButton = event.target.closest("[data-cart-checkout]");
    const clearButton = event.target.closest("[data-clear-cart]");
    const searchButton = event.target.closest("[data-search-trigger]");

    if(addButton){
      addToCart(addButton.getAttribute("data-add-to-cart"));
      return;
    }

    if(whatsappButton){
      const product = getProduct(whatsappButton.getAttribute("data-whatsapp-product"));

      if(product){
        openWhatsApp(`Olá! Quero pedir o produto ${product.name} por ${formatCurrency(product.price)}.`);
      }

      return;
    }

    if(removeButton){
      removeCartItem(removeButton.getAttribute("data-remove-item"));
      return;
    }

    if(quantityButton){
      const productId = quantityButton.getAttribute("data-product-id");
      const item = getCart().find((cartItem) => cartItem.id === productId);

      if(item){
        const delta = quantityButton.getAttribute("data-qty-action") === "increase" ? 1 : -1;
        updateCartQuantity(productId, item.quantity + delta);
      }

      return;
    }

    if(checkoutButton){
      if(getCart().length === 0){
        showToast("Adicione produtos antes de finalizar o pedido.");
      }else{
        openWhatsApp(buildCartWhatsAppMessage());
      }

      return;
    }

    if(clearButton){
      clearCart();
      showToast("Pedido limpo.");
      return;
    }

    if(searchButton){
      showToast("Busca visual em destaque será liberada em breve.");
    }
  });

  document.getElementById("heroCta")?.addEventListener("click", () => {
    openWhatsApp("Olá! Quero fazer um pedido pelo site oficial da Meneghelli Lanches.");
  });
}

function applyFadeDelays(){
  document.querySelectorAll(".fade-in").forEach((element, index) => {
    element.style.animationDelay = `${index * 70}ms`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await hydrateProducts();
  renderMenuCards();
  renderProductPage();
  renderCartPage();
  bindMenu();
  bindActions();
  updateCartCounters();
  applyFadeDelays();
});
