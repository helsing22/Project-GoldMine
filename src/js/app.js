/* src/js/app.js */
(function () {
  function formatPrice(value) { return `${Number(value).toLocaleString('es-CU')} CUP`; }
  function el(sel) { return document.querySelector(sel); }

  /* ---------- Sidebar & Menu rendering ---------- */
  function renderSidebar(categories) {
    const sidebar = el('#sidebar-categories');
    if (!sidebar) return;
    sidebar.innerHTML = categories.map(cat => `<button class="sidebar__link" data-target="${cat.id}" aria-controls="section-${cat.id}">${cat.name}</button>`).join('');
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
    if (!container) return;
    container.innerHTML = categories.map(cat => `
      <section class="menu-section" id="section-${cat.id}" tabindex="-1">
        <h2 class="menu-section__title section-title">${cat.name}</h2>
        <div class="menu-grid ${window.innerWidth >= 768 ? 'two-col' : ''}">
          ${cat.items.map(item => `
            <article class="menu-card ${item.soldOut ? 'menu-card--soldout' : ''}" data-item-id="${item.id}">
              <div class="menu-card__imgwrap">
                <img class="menu-card__img lazy-loading" data-src="${item.imageUrl}" alt="${escapeHtml(item.name)}" loading="lazy">
              </div>
              <div class="menu-card__content">
                <div class="menu-card__header">
                  <h3>${item.name}</h3>
                  ${item.popular ? '<span class="tag tag--popular">Popular</span>' : ''}
                </div>
                ${item.description ? `<p class="menu-card__description">${item.description}</p>` : ''}
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                  <p class="menu-card__price">${formatPrice(item.price)}</p>
                  <button class="btn-add" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}" ${item.soldOut ? 'disabled' : ''}>Agregar</button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');

    initLazyImages();
  }

  function escapeHtml(str) { return String(str).replace(/"/g, '&quot;'); }

  /* ---------- Lazy images ---------- */
  function initLazyImages() {
    const imgs = document.querySelectorAll('img.menu-card__img');
    if (!imgs.length) return;
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(img => loadImage(img));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          obs.unobserve(img);
        }
      });
    }, { root: null, threshold: 0.1 });
    imgs.forEach(img => io.observe(img));
  }

  function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    img.onload = () => {
      img.classList.remove('lazy-loading');
      img.classList.add('loaded');
    };
    img.onerror = () => {
      img.classList.remove('lazy-loading');
      img.classList.add('loaded');
      img.src = '/public/images/placeholder.png';
    };
  }

  /* ---------- Cart logic ---------- */
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

  /* ---------- Global click handlers ---------- */
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add');
    if (addBtn) {
      const id = addBtn.dataset.id;
      const name = addBtn.dataset.name;
      const price = Number(addBtn.dataset.price);
      CART.add({ id, name, price, qty: 1 });
      try { addBtn.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 160 }); } catch (err) {}
      return;
    }
    const rem = e.target.closest('.cart-remove');
    if (rem) {
      CART.remove(rem.dataset.id);
      return;
    }
  });

  /* ---------- Modal helpers ---------- */
  function openModal(selector) {
    const modal = el(selector);
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }
  function closeModal(selector) {
    const modal = el(selector);
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  /* ---------- Modal wiring ---------- */
  const cartButton = el('#cart-button');
  const closeCart = el('#close-cart');
  if (cartButton) cartButton.addEventListener('click', () => { renderCart(); openModal('#cart-modal'); });
  if (closeCart) closeCart.addEventListener('click', () => closeModal('#cart-modal'));
  document.querySelectorAll('.modal__backdrop').forEach(b => b.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) closeModal(`#${modal.id}`);
  }));

  const checkoutBtn = el('#checkout-buy');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (CART.items.length === 0) { alert('Carrito vacío'); return; }
      const total = CART.total();
      try {
        await navigator.clipboard.writeText(`${total} CUP`);
        try { cartButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 }); } catch (err) {}
      } catch (err) {
        console.warn('Clipboard failed', err);
      }
      openModal('#payment-modal');
    });
  }

  const closePayment = el('#close-payment');
  if (closePayment) closePayment.addEventListener('click', () => closeModal('#payment-modal'));

  document.querySelectorAll('.btn-pay').forEach(btn => {
    btn.addEventListener('click', async () => {
      const method = btn.dataset.method;
      const total = CART.total();
      let shift = null;
      try {
        const resp = await fetch('/api/shift');
        if (resp.ok) shift = await resp.json();
      } catch (err) { /* ignore */ }
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

  const closeQr = el('#close-qr');
  if (closeQr) closeQr.addEventListener('click', () => closeModal('#qr-modal'));

  /* ---------- Section observer for active sidebar link ---------- */
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

  /* ---------- Fixed panel behavior (always visible on desktop) ---------- */
  const DESKTOP_BREAKPOINT = 900; // must match CSS media query
  const menuSectionsEl = el('#menu-sections');
  const mainLayout = el('#main-layout');
  const pageWrapper = document.querySelector('.page-wrapper');

  function enableFixedPanel() {
    if (!menuSectionsEl) return;
    if (!menuSectionsEl.classList.contains('fixed-panel')) {
      menuSectionsEl.classList.add('fixed-panel');
      menuSectionsEl.setAttribute('aria-hidden', 'false');
      if (mainLayout) mainLayout.classList.add('with-fixed-sections');
    }
  }

  function disableFixedPanel() {
    if (!menuSectionsEl) return;
    if (menuSectionsEl.classList.contains('fixed-panel')) {
      menuSectionsEl.classList.remove('fixed-panel');
      menuSectionsEl.removeAttribute('aria-hidden');
      if (mainLayout) mainLayout.classList.remove('with-fixed-sections');
      menuSectionsEl.style.right = '';
      menuSectionsEl.style.top = '';
    }
  }

  function updatePanelMode() {
    if (!menuSectionsEl) return;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (vw >= DESKTOP_BREAKPOINT) {
      enableFixedPanel();
      // dynamic right offset so panel sits outside .page-wrapper
      if (pageWrapper) {
        const wrapperRect = pageWrapper.getBoundingClientRect();
        const gap = 24; // separation between wrapper and panel
        // compute space to the right of wrapper
        const spaceRight = Math.max(0, window.innerWidth - (wrapperRect.left + wrapperRect.width));
        const rightOffset = Math.max(gap, spaceRight + gap);
        menuSectionsEl.style.right = `${rightOffset}px`;
      } else {
        menuSectionsEl.style.right = '28px';
      }
      // compute top offset to avoid header overlap
      const header = document.querySelector('.header');
      const headerHeight = header ? header.getBoundingClientRect().height : 80;
      const topGap = 12;
      menuSectionsEl.style.top = `${headerHeight + topGap}px`;
    } else {
      disableFixedPanel();
    }
  }

  // update on resize/orientation and on load
  window.addEventListener('resize', updatePanelMode, { passive: true });
  window.addEventListener('orientationchange', updatePanelMode);
  // ensure update runs after DOM ready and after any dynamic layout changes
  function scheduleUpdatePanelMode() {
    // small debounce to avoid layout thrash
    clearTimeout(scheduleUpdatePanelMode._t);
    scheduleUpdatePanelMode._t = setTimeout(updatePanelMode, 120);
  }

  /* ---------- Initialization ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(window.MENU_DATA || []);
    renderMenuSections(window.MENU_DATA || []);
    observeSections();
    el('#year').textContent = new Date().getFullYear();
    renderCartCount();
    scheduleUpdatePanelMode();
  });

  // also run once immediately in case script loads after DOMContentLoaded
  scheduleUpdatePanelMode();

  // expose CART for debugging / external use
  window.CART = CART;
})();
