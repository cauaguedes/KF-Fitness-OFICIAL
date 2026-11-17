// ==========================================
// 1. DADOS INICIAIS E ESTADO DA APLICAÇÃO
// ==========================================
const seedProducts = [
  {
    id: 'p1',
    name: 'Camiseta KF Performance',
    category: 'Masculino',
    price: 89.9,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85',
    description: 'Camiseta esportiva confortável e versátil.',
    sizes: 'P, M, G, GG'
  },
  {
    id: 'p2',
    name: 'Conjunto KF Training',
    category: 'Feminino',
    price: 169.9,
    image: 'https://images.unsplash.com/photo-1506629905607-d9f6b5e7e8a6?auto=format&fit=crop&w=800&q=85',
    description: 'Conjunto para treinos com liberdade de movimento.',
    sizes: 'P, M, G'
  },
  {
    id: 'p3',
    name: 'Short KF Active',
    category: 'Masculino',
    price: 99.9,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85',
    description: 'Short leve para treinos intensos.',
    sizes: 'P, M, G, GG'
  },
  {
    id: 'p4',
    name: 'Legging KF Essential',
    category: 'Feminino',
    price: 139.9,
    image: 'https://images.unsplash.com/photo-1506629905607-d9f6b5e7e8a6?auto=format&fit=crop&w=800&q=85',
    description: 'Legging de cintura alta para acompanhar seu ritmo.',
    sizes: 'P, M, G'
  },
  {
    id: 'p5',
    name: 'Camiseta KF Kids',
    category: 'Infantil',
    price: 59.9,
    image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=800&q=85',
    description: 'Conforto para os pequenos em movimento.',
    sizes: '4, 6, 8, 10, 12'
  },
  {
    id: 'p6',
    name: 'Garrafa KF 700ml',
    category: 'Acessórios',
    price: 39.9,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
    description: 'Garrafa para hidratação durante o treino.',
    sizes: 'Único'
  },
  {
    id: 'p7',
    name: 'Moletom KF Urban',
    category: 'Masculino',
    price: 189.9,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85',
    description: 'Moletom premium para antes e depois do treino.',
    sizes: 'P, M, G, GG'
  },
  {
    id: 'p8',
    name: 'Bolsa KF Training',
    category: 'Acessórios',
    price: 129.9,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85',
    description: 'Espaço e praticidade para levar seus itens.',
    sizes: 'Único'
  }
];

let products = JSON.parse(localStorage.getItem('kf_products') || 'null') || seedProducts;
let cart = JSON.parse(localStorage.getItem('kf_cart') || '[]');
let activeCategory = 'Todos';
let authMode = 'login';
let adminTab = 'products';
let currentUser = null;

// ==========================================
// 2. UTILITÁRIOS E PERSISTÊNCIA
// ==========================================
const $ = selector => document.querySelector(selector); const $$ = selector => document.querySelectorAll(selector);

const money = value =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function safe(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(str ?? '').replace(/[&<>"']/g, char => map[char]);
}

function save() {
  localStorage.setItem('kf_products', JSON.stringify(products));
  localStorage.setItem('kf_cart', JSON.stringify(cart));
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}

// ==========================================
// 3. VITRINE DE PRODUTOS E FILTROS
// ==========================================
function renderProducts() {
  const filteredList = products.filter(
    product => activeCategory === 'Todos' || product.category === activeCategory
  );

  $('#productGrid').innerHTML = filteredList .map( product => ` <article class="product-card"> <div class="product-image"> <img src="${safe(product.image)}" alt="${safe(product.name)}" loading="lazy"> <span class="product-tag">${safe(product.category.toUpperCase())}</span> </div> <div class="product-info"> <small>KF FITNESS / PERFORMANCE</small> <h3>${safe(product.name)}</h3> <div class="product-bottom"> <span class="price">${money(product.price)}</span> <button class="add-btn" data-add="${product.id}">+ ADICIONAR</button> </div> </div> </article> ` ) .join('') \vert{}\vert{} '<p class="muted">Nenhum produto nesta categoria.</p>';    $$('[data-add]').forEach(btn => {
    btn.onclick = () => addToCart(btn.dataset.add);
  });
}

$$('.filter').forEach(btn => { btn.onclick = () => { $$
('.filter').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderProducts();
  };
});

// ==========================================
// 4. CARRINHO DE COMPRAS (SACOLA)
// ==========================================
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  save();
  renderCart();
  toast('Produto adicionado à sacola.');
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product?.price || 0) * item.qty;
  }, 0);

  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = money(total);
  $('#statCart').textContent = count;
  $('#statRevenue').textContent = money(total);

  $('#cartItems').innerHTML =
    cart
      .map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        return `
          <div class="cart-row">
            <img src="${safe(product.image)}" alt="${safe(product.name)}">
            <div style="flex: 1">
              <h4>${safe(product.name)}</h4>
              <small>${money(product.price)}</small>
              <div class="qty">
                <button data-qty="${product.id}" data-delta="-1">−</button>
                <span>${item.qty}</span>
                <button data-qty="${product.id}" data-delta="1">+</button>
                <button data-remove="${product.id}" style="margin-left: auto">Remover</button>
              </div>
            </div>
          </div>
        `;
      })
      .join('') || '<p class="muted">Sua sacola está vazia.</p>';

  $$('[data-qty]').forEach(btn => { btn.onclick = () => { const item = cart.find(x => x.id === btn.dataset.qty); item.qty += Number(btn.dataset.delta); if (item.qty < 1) { cart = cart.filter(x => x !== item); } save(); renderCart(); }; });    $$
('[data-remove]').forEach(btn => {
    btn.onclick = () => {
      cart = cart.filter(x => x.id !== btn.dataset.remove);
      save();
      renderCart();
    };
  });
}

// ==========================================
// 5. CONTROLE DE MODAIS E PAINÉIS
// ==========================================
function openPanel(id) {
  $('#overlay').classList.add('show');
  $(id).classList.add('open');

  if (id === '#accountModal'