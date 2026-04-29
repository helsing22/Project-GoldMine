/* app.js - scroll vertical y UX consistente */
(function () {
  /* Helpers */
  function formatPrice(value) { return `${Number(value).toLocaleString('es-CU')} CUP`; }
  function el(sel) { return document.querySelector(sel); }
  function on(sel, ev, fn) { document.addEventListener(ev, (e) => { if (e.target.closest && e.target.closest(sel)) fn(e); }); }

  /* Render: sidebar y menú (igual que antes) */
  function renderSidebar(categories) {
    const sidebar = el('#sidebar-categories');
    sidebar.innerHTML = categories.map(cat => `<button class="sidebar__link" data-target="${cat.id}" aria-controls="section-${cat.id}">${cat.name}</button>`).join('');
    // keyboard navigation
    sidebar.addEventListener('keydown', (e) => {
      const focusable = Array.from(sidebar.querySelectorAll('.sidebar__link'));
      const idx = focusable.indexOf(document.activeElement);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = focusable[(idx + 1) % focusable.length];
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
        prev.focus();
      } else if (e.key === 'Enter' && document.activeElement.classList.contains('sidebar__link')) {
        document.activeElement.click();
      }
    });
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
      <section class="menu-section" id="section-${cat.id}" tabindex="-1">
        <h2 class="menu-section__title">${cat.name}</h2>
        <div class="menu-grid ${window.innerWidth >= 768 ? 'two-col' : ''}">
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

  /* Cart */
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

  /* Events: add/remove */
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const name = addBtn.dataset.name;
      const price = Number(addBtn.dataset.price);
      CART.add({ id, name, price, qty: 1 });
      addBtn.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 160 });
      return;
    }
    const rem = e.target.closest('.cart-remove');
    if (rem) {
      CART.remove(rem.dataset.id);
      return;
    }
  });

  /* Modal handling with body scroll lock */
  function openModal(selector) {
    el(selector).classList.remove('hidden');
    document.body.classList.add('no-scroll');
    // focus first focusable element
    const focusable = el(selector).querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }
  function closeModal(selector) {
    el(selector).classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  const cartButton = el('#cart-button');
  const cartModal = el('#cart-modal');
  const closeCart = el('#close-cart');
  cartButton.addEventListener('click', () => { renderCart(); openModal('#cart-modal'); });
  closeCart.addEventListener('click', () => closeModal('#cart-modal'));
  // backdrop close
  document.querySelectorAll('.modal__backdrop').forEach(b => b.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) closeModal(`#${modal.id}`);
  }));

  /* Buy flow: copy to clipboard + payment modal */
  el('#checkout-buy').addEventListener('click', async () => {
    if (CART.items.length === 0) { alert('Carrito vacío'); return; }
    const total = CART.total();
    try {
      await navigator.clipboard.writeText(`${total} CUP`);
      // small visual confirmation
      cartButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 });
    } catch (err) {
      console.warn('Clipboard failed', err);
    }
    openModal('#payment-modal');
  });

  el('#close-payment').addEventListener('click', () => closeModal('#payment-modal'));

  /* Payment selection */
  document.querySelectorAll('.btn-pay').forEach(btn => {
    btn.addEventListener('click', async () => {
      const method = btn.dataset.method;
      const total = CART.total();
      // get shift info
      let shift = null;
      try {
        const resp = await fetch('/api/shift');
        if (resp.ok) shift = await resp.json();
      } catch (err) { /* ignore */ }
      // fallback to client-side shifts if available
      if (!shift && window.SHIFTS_JSON) {
        const today = new Date().toISOString().slice(0,10);
        shift = window.SHIFTS_JSON[today] || window.SHIFTS_JSON['default'];
      }
      if (!shift) shift = { links: {}, qr: 'default-transfer.png', staff: 'turno' };

      if (method === 'zelle' || method === 'paypal' || method === 'visa') {
        const link = (shift.links && shift.links[method]) || '#';
        window.open(link, '_blank');
        closeModal('#payment-modal');
        closeModal('#cart-modal');
        CART.clear();
      } else if (method === 'transfermovil') {
        try {
          const res = await fetch('/api/qr');
          if (!res.ok) throw new Error('No QR');
          const data = await res.json();
          el('#qr-image').src = data.qrUrl;
          el('#qr-note').textContent = `Total: ${formatPrice(total)} · Turno: ${data.staff || 'turno'}`;
          closeModal('#payment-modal');
          openModal('#qr-modal');
          closeModal('#cart-modal');
          CART.clear();
        } catch (err) {
          alert('No se pudo obtener el QR. Intenta nuevamente.');
        }
      }
    });
  });

  el('#close-qr').addEventListener('click', () => closeModal('#qr-modal'));

  /* IntersectionObserver to highlight category */
  function observeSections() {
    const sections = document.querySelectorAll('.menu-section');
    if (!sections.length) return;
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

  /* Init */
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(MENU_DATA);
    renderMenuSections(MENU_DATA);
    observeSections();
    el('#year').textContent = new Date().getFullYear();
    renderCartCount();
    // expose SHIFTS_JSON if shifts.json was loaded as inline script (optional)
    try {
      const script = document.querySelector('script[type="application/json"][src="./src/data/shifts.json"]');
      // nothing to do; server endpoint used as primary source
    } catch (err) { /* ignore */ }
  });

  window.CART = CART;
})();
