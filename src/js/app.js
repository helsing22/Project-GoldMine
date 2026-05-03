/* src/js/app.js — Pizza Mary · Menú de mesa */

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
   Carga de datos externos
   ========================================================= */
let shiftsData = null;

async function loadShifts() {
  /* Intenta cargar desde la API primero */
  try {
    const res = await fetch('/api/shift');
    if (res.ok) { shiftsData = await res.json(); return; }
  } catch (e) { /* sin API */ }

  /* Fallback: fetch al archivo JSON local */
  try {
    const res = await fetch('./src/data/shifts.json');
    if (res.ok) {
      const json = await res.json();
      const today = new Date().toISOString().slice(0, 10);
      shiftsData = json[today] || json['default'] || json;
      return;
    }
  } catch (e) { /* sin archivo */ }

  /* Último recurso: variable global (por si algo la inyecta) */
  if (window.SHIFTS_JSON) {
    const today = new Date().toISOString().slice(0, 10);
    shiftsData = window.SHIFTS_JSON[today] || window.SHIFTS_JSON['default'] || window.SHIFTS_JSON;
    return;
  }

  /* Si no hay nada, objeto vacío para que no rompa */
  shiftsData = { links: {}, qr: '', staff: 'turno' };
}

function getShiftLinks() {
  return (shiftsData && shiftsData.links) || {};
}
function getShiftQr() {
  return (shiftsData && shiftsData.qr) || '';
}
function getShiftStaff() {
  return (shiftsData && shiftsData.staff) || 'turno';
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

  /* SVG inline para placeholder cuando una imagen falla */
  const placeholderSvg = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2288%22 height=%2288%22><rect fill=%22%23f0ece6%22 width=%2288%22 height=%2288%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23bbb%22 font-size=%2212%22>Sin imagen</text></svg>`;

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
                <img class="card-img" src="${esc(item.imageUrl)}" alt="${esc(item.name)}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.classList.add('loaded');this.src='${placeholderSvg}'" />
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
  const app = $('#app');
  if (app) app.setAttribute('inert', '');
  document.body.style.overflow = 'hidden';
  modal.offsetHeight;
  modal.classList.add('visible');
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
  const idx = modalStack.indexOf(id);
  if (idx > -1) modalStack.splice(idx, 1);
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
   Lógica de pago
   ========================================================= */
async function handlePayment(method) {
  const total = Cart.total();

  if (method === 'transfermovil') {
    let qrUrl = getShiftQr();
    let staff = getShiftStaff();

    /* Intenta obtener QR dinámico desde la API */
    try {
      const res = await fetch('/api/qr');
      if (res.ok) {
        const data = await res.json();
        qrUrl = data.qrUrl || qrUrl;
        staff = data.staff || staff;
      }
    } catch (e) { /* usa lo que ya tiene */ }

    if (!qrUrl) {
      showToast('No hay QR disponible para este turno');
      return;
    }

    $('#qr-img').src = qrUrl;
    $('#qr-note').textContent = `Total: ${formatPrice(total)} · Turno: ${staff}`;
    closeModal('payment-modal');
    openModal('qr-modal');
  } else {
    /* Zelle, PayPal, Visa: abrir enlace del turno */
    const links = getShiftLinks();
    const link = links[method];
    if (link) {
      window.open(link, '_blank');
    } else {
      showToast('Enlace no disponible para este turno');
      return;
    }
    closeModal('payment-modal');
  }

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

  /* --- Cerrar modal --- */
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

  /* --- Checkout --- */
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
document.addEventListener('DOMContentLoaded', async () => {
  /* Cargar turnos en segundo plano (no bloquea el render) */
  loadShifts();

  /* Renderizar menú usando window.MENU_DATA de tu menu.js */
  const data = window.MENU_DATA || [];
  renderNav(data);
  renderMenu(data);
  initSectionObserver();
  Cart.renderBadge();
  $('#year').textContent = new Date().getFullYear();
});
