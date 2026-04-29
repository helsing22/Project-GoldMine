/* app.js - lógica completa del frontend */
(function () {
  /* Helpers */
  function formatPrice(value) { return `${Number(value).toLocaleString('es-CU')} CUP`; }
  function el(selector) { return document.querySelector(selector); }
  function on(selector, event, handler) { document.addEventListener(event, (e) => { if (e.target.closest && e.target.closest(selector)) handler(e); }); }

  /* Render: categorías y menú */
  function renderSidebar(categories) {
    const sidebar = el('#sidebar-categories');
    sidebar.innerHTML = categories.map(cat => `<button class="sidebar__link" data-target="${cat.id}">${cat.name}</button>`).join('');
    sidebar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-target]');
      if (!btn) return;
      const id = btn.dataset.target;
      const section = document.getElementById(`section-${id}`);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderMenuSections(categories) {
    const container = el('#menu-sections');
    container.innerHTML = categories.map(cat => `
      <section class="menu-section" id="section-${cat.id}">
        <h2 class="menu-section__title">${cat.name}</h2>
        <div class="menu-grid">
          ${cat.items.map(item => `
            <article class="menu-card ${item.soldOut ? 'menu-card--soldout' : ''}">
              <div class="menu-card__header">
                <h3>${item.name}</h3>
                ${item.popular ? '<span class="tag tag--popular">Popular</span>' : ''}
              </div>
              ${item.description ? `<p class="menu-card__description">${item.description}</p>` : ''}
              <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                <p class="menu-card__price">${formatPrice(item.price)}</p>
                <button class="btn-add" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}" ${item.soldOut ? 'disabled' : ''}>Agregar</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');
  }

  function escapeHtml(str) { return String(str).replace(/"/g, '&quot;'); }

  /* Carrito en memoria */
  const CART = {
    items: [],
    add(item) {
      const found = this.items.find(i => i.id === item.id);
      if (found) found.qty += item.qty || 1;
      else this.items.push({ ...item, qty: item.qty || 1 });
      renderCartCount();
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      renderCart();
      renderCartCount();
    },
    clear() { this.items = []; renderCart(); renderCartCount(); },
    total() { return this.items.reduce((s,i) => s + (i.price * i.qty), 0); }
  };

  /* UI carrito */
  function renderCartCount() {
    const elCount = el('#cart-count');
    if (elCount) elCount.textContent = CART.items.reduce((s,i) => s + i.qty, 0);
  }

  function renderCart() {
    const container = el('#cart-items');
    if (!container) return;
    if (CART.items.length === 0) {
      container.innerHTML = '<p class="muted">Tu carrito está vacío.</p>';
      el('#cart-total').textContent = formatPrice(0);
      return;
    }
    container.innerHTML = CART.items.map(it => `
      <div class="cart-row">
        <div class="cart-row__left">
          <strong>${it.name}</strong>
          <div class="muted">x${it.qty} · ${formatPrice(it.price)}</div>
        </div>
        <div class="cart-row__right">
          <button class="cart-remove" data-id="${it.id}">Eliminar</button>
        </div>
      </div>
    `).join('');
    el('#cart-total').textContent = formatPrice(CART.total());
  }

  /* Eventos globales: agregar, eliminar */
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const name = addBtn.dataset.name;
      const price = Number(addBtn.dataset.price);
      CART.add({ id, name, price, qty: 1 });
      // micro-feedback
      addBtn.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 160 });
      return;
    }
    const rem = e.target.closest('.cart-remove');
    if (rem) {
      CART.remove(rem.dataset.id);
      return;
    }
  });

  /* Abrir / cerrar carrito */
  const cartButton = el('#cart-button');
  const cartModal = el('#cart-modal');
  const closeCart = el('#close-cart');
  cartButton.addEventListener('click', () => { renderCart(); cartModal.classList.remove('hidden'); });
  closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
  // cerrar modal al click en backdrop
  document.querySelectorAll('.modal__backdrop').forEach(b => b.addEventListener('click', (e) => {
    const parent = e.target.closest('.modal');
    if (parent) parent.classList.add('hidden');
  }));

  /* Comprar: copiar monto y abrir modal de métodos */
  el('#checkout-buy').addEventListener('click', async () => {
    if (CART.items.length === 0) { alert('Carrito vacío'); return; }
    const total = CART.total();
    try {
      await navigator.clipboard.writeText(`${total} CUP`);
      // animación de confirmación breve
      cartButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 });
    } catch (err) {
      console.warn('No se pudo copiar al portapapeles', err);
    }
    el('#payment-modal').classList.remove('hidden');
  });

  /* Cerrar modal de pago */
  el('#close-payment').addEventListener('click', () => el('#payment-modal').classList.add('hidden'));

  /* Manejo selección de método de pago */
  document.querySelectorAll('.btn-pay').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const method = btn.dataset.method;
      const total = CART.total();
      // Obtener shift del día para enlaces y QR
      const shiftResp = await fetch('/api/shift');
      let shift = null;
      if (shiftResp.ok) shift = await shiftResp.json();
      else {
        // fallback a default en client si no hay endpoint
        const shifts = window.SHIFTS_JSON || null;
        const today = new Date().toISOString().slice(0,10);
        shift = (shifts && (shifts[today] || shifts['default'])) || { links: {}, qr: 'default-transfer.png', staff: 'turno' };
      }

      if (method === 'zelle' || method === 'paypal' || method === 'visa') {
        // abrir enlace configurado en shifts.json
        const link = (shift.links && shift.links[method]) || (window.SHIFTS_JSON && window.SHIFTS_JSON['default'] && window.SHIFTS_JSON['default'].links[method]) || '#';
        // Abrir en nueva pestaña
        window.open(link, '_blank');
        // cerrar modales y limpiar carrito
        el('#payment-modal').classList.add('hidden');
        el('#cart-modal').classList.add('hidden');
        CART.clear();
      } else if (method === 'transfermovil') {
        // pedir QR al backend
        try {
          const res = await fetch('/api/qr');
          if (!res.ok) throw new Error('No QR');
          const data = await res.json();
          el('#qr-image').src = data.qrUrl;
          el('#qr-note').textContent = `Total: ${formatPrice(total)} · Turno: ${data.staff || 'turno'}`;
          el('#payment-modal').classList.add('hidden');
          el('#qr-modal').classList.remove('hidden');
          // limpiar carrito tras mostrar QR
          CART.clear();
          el('#cart-modal').classList.add('hidden');
        } catch (err) {
          alert('No se pudo obtener el QR. Intenta nuevamente.');
        }
      }
    });
  });

  el('#close-qr').addEventListener('click', () => el('#qr-modal').classList.add('hidden'));

  /* Observador de secciones para activar categoría */
  function observeSections() {
    const sections = document.querySelectorAll('.menu-section');
    const options = { root: null, threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.sidebar__link').forEach(b => b.classList.remove('active'));
          const id = entry.target.id.replace('section-','');
          const btn = document.querySelector(`.sidebar__link[data-target="${id}"]`);
          if (btn) btn.classList.add('active');
        }
      });
    }, options);
    sections.forEach(s => observer.observe(s));
  }

  /* Inicialización */
  document.addEventListener('DOMContentLoaded', () => {
    // Cargar menú
    renderSidebar(MENU_DATA);
    renderMenuSections(MENU_DATA);
    observeSections();
    el('#year').textContent = new Date().getFullYear();
    renderCartCount();

    // Exponer SHIFTS_JSON si se cargó como script tag (index.html incluye shifts.json as script)
    try {
      const script = document.querySelector('script[type="application/json"][src="./src/data/shifts.json"]');
      // fallback: window.SHIFTS_JSON puede ser inyectado por server si se desea
    } catch (err) { /* ignore */ }
  });

  // Exponer CART para depuración
  window.CART = CART;
})();
