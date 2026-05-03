/* src/js/app.js — Pizza Mary · Menú de mesa */

/* =========================================================
   Datos de ejemplo (eliminar si usas tu propio menu.js)
   ========================================================= */
const MENU_DATA_FALLBACK = [
  {
    id: 'pizzas', name: 'Pizzas', icon: 'fa-pizza-slice',
    items: [
      { id: 'p1', name: 'Pizza Margherita', description: 'Salsa de tomate, mozzarella y albahaca fresca', price: 450, imageUrl: 'https://picsum.photos/seed/marg-pz/400/300', popular: true },
      { id: 'p2', name: 'Pizza Pepperoni', description: 'Pepperoni americano, mozzarella y salsa de tomate', price: 500, imageUrl: 'https://picsum.photos/seed/pepp-pz/400/300', popular: true },
      { id: 'p3', name: 'Pizza Hawaiana', description: 'Jamon, pina y mozzarella gratinada', price: 480, imageUrl: 'https://picsum.photos/seed/hawa-pz/400/300' },
      { id: 'p4', name: 'Pizza Cuatro Quesos', description: 'Mozzarella, gorgonzola, parmesano y provolone', price: 520, imageUrl: 'https://picsum.photos/seed/4cheese/400/300' },
      { id: 'p5', name: 'Pizza Vegetariana', description: 'Pimientos, cebolla, champinones y aceitunas negras', price: 460, imageUrl: 'https://picsum.photos/seed/veg-pz/400/300' },
      { id: 'p6', name: 'Pizza Barbacoa', description: 'Pollo barbacoa, cebolla caramelizada y queso', price: 530, imageUrl: 'https://picsum.photos/seed/bbq-pz/400/300' },
      { id: 'p7', name: 'Pizza Napolitana', description: 'Tomate fresco, ajo, oregano y aceite de oliva', price: 440, imageUrl: 'https://picsum.photos/seed/nap-pz/400/300' },
    ]
  },
  {
    id: 'pastas', name: 'Pastas', icon: 'fa-bowl-food',
    items: [
      { id: 'pa1', name: 'Espaguetis Carbonara', description: 'Crema, huevo, bacon crocante y parmesano', price: 380, imageUrl: 'https://picsum.photos/seed/carbonara/400/300' },
      { id: 'pa2', name: 'Fettuccine Alfredo', description: 'Salsa Alfredo con pollo grillado y parmesano', price: 400, imageUrl: 'https://picsum.photos/seed/alfredo/400/300' },
      { id: 'pa3', name: 'Lasagna Bolognesa', description: 'Capas de pasta, carne, bechamel y queso gratinado', price: 420, imageUrl: 'https://picsum.photos/seed/lasagna/400/300', popular: true },
      { id: 'pa4', name: 'Ravioli de Ricotta', description: 'Rellenos de ricotta espinaca con salsa de tomate', price: 390, imageUrl: 'https://picsum.photos/seed/ravioli/400/300' },
    ]
  },
  {
    id: 'ensaladas', name: 'Ensaladas', icon: 'fa-leaf',
    items: [
      { id: 'e1', name: 'Ensalada Cesar', description: 'Lechuga romana, pollo, crutones, parmesano y aderezo', price: 280, imageUrl: 'https://picsum.photos/seed/cesar/400/300' },
      { id: 'e2', name: 'Ensalada Mediterranea', description: 'Tomate cherry, queso feta, aceitunas y oregano', price: 260, imageUrl: 'https://picsum.photos/seed/medit/400/300' },
      { id: 'e3', name: 'Ensalada Caprese', description: 'Tomate, mozzarella fresca, albahaca y reduccion', price: 290, imageUrl: 'https://picsum.photos/seed/caprese/400/300' },
    ]
  },
  {
    id: 'bebidas', name: 'Bebidas', icon: 'fa-mug-hot',
    items: [
      { id: 'b1', name: 'Refresco', description: 'Coca-Cola, Fanta o Sprite 330ml', price: 80, imageUrl: 'https://picsum.photos/seed/soda-dr/400/300' },
      { id: 'b2', name: 'Jugo Natural', description: 'Naranja, mango o guayaba natural', price: 100, imageUrl: 'https://picsum.photos/seed/juice-dr/400/300' },
      { id: 'b3', name: 'Agua Mineral', description: 'Ciego Montero 500ml', price: 50, imageUrl: 'https://picsum.photos/seed/water-dr/400/300' },
      { id: 'b4', name: 'Cerveza', description: 'Cristal o Bucanero 330ml', price: 120, imageUrl: 'https://picsum.photos/seed/beer-dr/400/300' },
      { id: 'b5', name: 'Mojito', description: 'Ron, limon, hierbabuena, azucar y soda', price: 180, imageUrl: 'https://picsum.photos/seed/mojito-dr/400/300', popular: true },
    ]
  },
  {
    id: 'postres', name: 'Postres', icon: 'fa-ice-cream',
    items: [
      { id: 'po1', name: 'Tiramisu', description: 'Clasico italiano con mascarpone y cafe', price: 250, imageUrl: 'https://picsum.photos/seed/tiramisu-d/400/300', popular: true },
      { id: 'po2', name: 'Helado', description: 'Dos bolas: vainilla, chocolate o limon', price: 120, imageUrl: 'https://picsum.photos/seed/icecream-d/400/300' },
      { id: 'po3', name: 'Flan Casero', description: 'Con caramelo artesanal', price: 100, imageUrl: 'https://picsum.photos/seed/flan-d/400/300' },
    ]
  },
  {
    id: 'combos', name: 'Combos', icon: 'fa-box-open',
    items: [
      { id: 'c1', name: 'Combo Pizza + Refresco', description: 'Pizza mediana Margherita + refresco 330ml', price: 500, imageUrl: 'https://picsum.photos/seed/combo1-d/400/300', popular: true },
      { id: 'c2', name: 'Combo Pasta + Ensalada', description: 'Espaguetis Carbonara + ensalada Cesar', price: 600, imageUrl: 'https://picsum.photos/seed/combo2-d/400/300' },
      { id: 'c3', name: 'Combo Familiar', description: '2 pizzas medianas + 4 refrescos + postre para compartir', price: 1500, imageUrl: 'https://picsum.photos/seed/combo3-d/400/300' },
      { id: 'c4', name: 'Combo Pareja', description: 'Pizza mediana + 2 cervezas + tiramisu', price: 850, imageUrl: 'https://picsum.photos/seed/combo4-d/400/300', soldOut: true },
    ]
  }
];

/* Turnos por defecto (fallback si no hay API ni JSON externo) */
const DEFAULT_SHIFTS = {
  links: { zelle: '#', paypal: '#', visa: '#' },
  qr: 'https://picsum.photos/seed/qr-default/300/300',
  staff: 'turno actual'
};

/* =========================================================
   Utilidades
   ========================================================= */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

function formatPrice(val) {
  return Number(val).toLocaleString('es-CU') + ' CUP';
}

/* Escapar HTML de forma segura usando el DOM */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

/* =========================================================
   Sistema de toasts
   ========================================================= */
const toastWrap = $('#toast-wrap');

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  toastWrap.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove());
  }, 2000);
}

/* =========================================================
   Carrito
   ========================================================= */
const Cart = {
  items: [],

  add(id, name, price) {
    const existing = this.items.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ id, name, price: Number(price), qty: 1 });
    }
    this.renderBadge();
  },

  changeQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }
    this.renderBadge();
    renderCartModal();
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.renderBadge();
    renderCartModal();
  },

  clear() {
    this.items = [];
    this.renderBadge();
    renderCartModal();
  },

  total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  },

  renderBadge() {
    const badge = $('#cart-badge');
    const count = this.count();
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent = count;
      /* Forzar reflow para reiniciar la animación */
      badge.classList.remove('bounce');
      void badge.offsetWidth;
      badge.classList.add('bounce');
    } else {
      badge.style.display = 'none';
    }
  }
};

/* =========================================================
   Renderizado del carrito en el modal
   ========================================================= */
function renderCartModal() {
  const body = $('#cart-body');
  const footer = $('#cart-footer');
  const totalEl = $('#cart-total');

  if (Cart.items.length === 0) {
    body.innerHTML = '<p class="cart-empty"><i class="fa-regular fa-face-meh" style="font-size:1.6rem;display:block;margin-bottom:8px"></i>Tu carrito esta vacio</p>';
    footer.style.display = 'none';
    totalEl.textContent = formatPrice(0);
    return;
  }

  footer.style.display = 'flex';
  body.innerHTML = Cart.items.map(it => `
    <div class="cart-row">
      <div class="cart-row-info">
        <div class="cart-row-name">${esc(it.name)}</div>
        <div class="cart-row-sub">${formatPrice(it.price)} c/u</div>
      </div>
      <div class="cart-qty">
        <button data-qty-change="${it.id}" data-delta="-1" aria-label="Reducir cantidad"><i class="fa-solid fa-minus" style="font-size:0.65rem"></i></button>
        <span>${it.qty}</span>
        <button data-qty-change="${it.id}" data-delta="1" aria-label="Aumentar cantidad"><i class="fa-solid fa-plus" style="font-size:0.65rem"></i></button>
      </div>
      <div class="cart-row-total">${formatPrice(it.price * it.qty)}</div>
    </div>
  `).join('');

  totalEl.textContent = formatPrice(Cart.total());
}

/* =========================================================
   Renderizado de categorías (navegación)
   ========================================================= */
function renderNav(categories) {
  const nav = $('#app-nav');
  nav.innerHTML = categories.map(cat => `
    <button class="nav-item" data-target="${cat.id}" aria-controls="section-${cat.id}">
      <i class="fa-solid ${cat.icon || 'fa-utensils'}"></i>
      <span>${esc(cat.name)}</span>
    </button>
  `).join('');
}

/* =========================================================
   Renderizado de secciones y cards del menú
   ========================================================= */
function renderMenu(categories) {
  const container = $('#menu-sections');
  let cardIndex = 0;

  container.innerHTML = categories.map(cat => `
    <section class="menu-section" id="section-${cat.id}">
      <h2 class="section-title">${esc(cat.name)}</h2>
      <div class="menu-grid">
        ${cat.items.map(item => {
          const delay = cardIndex * 50;
          cardIndex++;
          return `
            <article class="menu-card${item.soldOut ? ' menu-card--soldout' : ''}" style="animation-delay:${delay}ms" data-item-id="${item.id}">
              <div class="card-img-wrap">
                <img class="card-img" src="${esc(item.imageUrl)}" alt="${esc(item.name)}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.classList.add('loaded');this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2288%22 height=%2288%22><rect fill=%22%23f0ece6%22 width=%2288%22 height=%2288%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23bbb%22 font-size=%2212%22>Sin imagen</text></svg>'" />
              </div>
              <div class="card-body">
                <div class="card-top">
                  <h3 class="card-name">${esc(item.name)}</h3>
                  ${item.popular ? '<span class="tag tag--popular">Popular</span>' : ''}
                </div>
                ${item.description ? `<p class="card-desc">${esc(item.description)}</p>` : ''}
                <div class="card-bottom">
                  <span class="card-price">${formatPrice(item.price)}</span>
                  ${!item.soldOut ? `<button class="btn-add" data-add-id="${item.id}" data-add-name="${esc(item.name)}" data-add-price="${item.price}"><i class="fa-solid fa-plus" style="font-size:0.7rem"></i> Agregar</button>` : ''}
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

/* =========================================================
   Sistema de modales
   ========================================================= */
const modalStack = [];

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modalStack.push(id);
  modal.setAttribute('aria-hidden', 'false');
  /* Bloquear fondo */
  const app = $('#app');
  if (app) app.setAttribute('inert', '');
  document.body.style.overflow = 'hidden';
  /* Forzar reflow y mostrar con animación */
  modal.offsetHeight;
  modal.classList.add('visible');
  /* Foco al primer botón interactivo */
  requestAnimationFrame(() => {
    const focusable = modal.querySelector('.modal-close, button:not([data-close])');
    if (focusable) focusable.focus();
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  /* Remover del stack */
  const idx = modalStack.indexOf(id);
  if (idx > -1) modalStack.splice(idx, 1);
  /* Desbloquear fondo si no hay más modales abiertos */
  if (modalStack.length === 0) {
    const app = $('#app');
    if (app) app.removeAttribute('inert');
    document.body.style.overflow = '';
  }
}

function closeTopModal() {
  if (modalStack.length > 0) {
    closeModal(modalStack[modalStack.length - 1]);
  }
}

/* =========================================================
   Observador de secciones para categoría activa
   ========================================================= */
function initSectionObserver() {
  const sections = $$('.menu-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('section-', '');
        $$('.nav-item').forEach(btn => btn.classList.remove('active'));
        const activeBtn = $(`.nav-item[data-target="${id}"]`);
        if (activeBtn) {
          activeBtn.classList.add('active');
          /* En móvil, scroll horizontal para centrar el botón activo */
          if (window.innerWidth < 1024) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* =========================================================
   Obtener datos del turno (API o fallback)
   ========================================================= */
async function getShift() {
  try {
    const res = await fetch('/api/shift');
    if (res.ok) return await res.json();
  } catch (e) { /* sin API */ }
  /* Fallback: usar variable global si existe (desde shifts.json externo) */
  if (window.SHIFTS_JSON) {
    const today = new Date().toISOString().slice(0, 10);
    return window.SHIFTS_JSON[today] || window.SHIFTS_JSON['default'] || DEFAULT_SHIFTS;
  }
  return DEFAULT_SHIFTS;
}

/* =========================================================
   Lógica de pago
   ========================================================= */
async function handlePayment(method) {
  const total = Cart.total();

  if (method === 'transfermovil') {
    try {
      const res = await fetch('/api/qr');
      if (!res.ok) throw new Error();
      const data = await res.json();
      $('#qr-img').src = data.qrUrl;
      $('#qr-note').textContent = `Total: ${formatPrice(total)} · Turno: ${data.staff || 'turno'}`;
    } catch (e) {
      /* Fallback si no hay API */
      const shift = await getShift();
      $('#qr-img').src = shift.qr;
      $('#qr-note').textContent = `Total: ${formatPrice(total)} · Turno: ${shift.staff}`;
    }
    closeModal('payment-modal');
    openModal('qr-modal');
  } else {
    /* Zelle, PayPal, Visa: abrir enlace */
    const shift = await getShift();
    const link = (shift.links && shift.links[method]) || '#';
    window.open(link, '_blank');
    closeModal('payment-modal');
  }

  /* Limpiar carrito y cerrar modal del carrito */
  Cart.clear();
  closeModal('cart-modal');
}

/* =========================================================
   Delegación de eventos global
   ========================================================= */
document.addEventListener('click', (e) => {
  /* --- Agregar al carrito --- */
  const addBtn = e.target.closest('.btn-add');
  if (addBtn) {
    const { addId, addName, addPrice } = addBtn.dataset;
    Cart.add(addId, addName, addPrice);
    /* Feedback visual: checkmark temporal */
    addBtn.classList.add('is-added');
    addBtn.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.7rem"></i> Listo';
    setTimeout(() => {
      addBtn.classList.remove('is-added');
      addBtn.innerHTML = '<i class="fa-solid fa-plus" style="font-size:0.7rem"></i> Agregar';
    }, 700);
    showToast(`${addName} agregada`);
    return;
  }

  /* --- Cambiar cantidad en carrito --- */
  const qtyBtn = e.target.closest('[data-qty-change]');
  if (qtyBtn) {
    Cart.changeQty(qtyBtn.dataset.qtyChange, Number(qtyBtn.dataset.delta));
    return;
  }

  /* --- Navegación por categorías --- */
  const navBtn = e.target.closest('.nav-item');
  if (navBtn) {
    const target = document.getElementById(`section-${navBtn.dataset.target}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  /* --- Cerrar modal (backdrop o botón con data-close) --- */
  const closeTrigger = e.target.closest('[data-close]');
  if (closeTrigger) {
    const modal = closeTrigger.closest('.modal-overlay');
    if (modal) closeModal(modal.id);
    return;
  }

  /* --- Botón del carrito flotante --- */
  if (e.target.closest('#cart-fab')) {
    renderCartModal();
    openModal('cart-modal');
    return;
  }

  /* --- Vaciar carrito --- */
  if (e.target.closest('#cart-clear-btn')) {
    Cart.clear();
    return;
  }

  /* --- Checkout: copiar total y abrir pago --- */
  if (e.target.closest('#checkout-btn')) {
    if (Cart.items.length === 0) return;
    const total = Cart.total();
    navigator.clipboard.writeText(`${total} CUP`).catch(() => {});
    openModal('payment-modal');
    return;
  }

  /* --- Método de pago --- */
  const payBtn = e.target.closest('.pay-btn');
  if (payBtn) {
    handlePayment(payBtn.dataset.method);
    return;
  }
});

/* Escape para cerrar modal */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeTopModal();
});

/* =========================================================
   Inicialización
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* Usar MENU_DATA externo si existe, si no el fallback */
  const data = window.MENU_DATA || MENU_DATA_FALLBACK;
  renderNav(data);
  renderMenu(data);
  initSectionObserver();
  Cart.renderBadge();
  $('#year').textContent = new Date().getFullYear();
});
