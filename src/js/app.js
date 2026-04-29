/* src/js/app.js */
(function () {
  function formatPrice(value) { return `${Number(value).toLocaleString('es-CU')} CUP`; }
  function el(sel) { return document.querySelector(sel); }

  function renderSidebar(categories) {
    const sidebar = el('#sidebar-categories');
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
    container.innerHTML = categories.map(cat => `
      <section class="menu-section" id="section-${cat.id}" tabindex="-1">
        <h2 class="menu-section__title">${cat.name}</h2>
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

  function initLazyImages() {
    const imgs = document.querySelectorAll('img.menu-card__img');
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

  function openModal(selector) {
    el(selector).classList.remove('hidden');
    document.body.classList.add('no-scroll');
    const focusable = el(selector).querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }
  function closeModal(selector) {
    el(selector).classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  const cartButton = el('#cart-button');
  const closeCart = el('#close-cart');
  cartButton.addEventListener('click', () => { renderCart(); openModal('#cart-modal'); });
  closeCart.addEventListener('click', () => closeModal('#cart-modal'));
  document.querySelectorAll('.modal__backdrop').forEach(b => b.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) closeModal(`#${modal.id}`);
  }));

  el('#checkout-buy').addEventListener('click', async () => {
    if (CART.items.length === 0) { alert('Carrito vacío'); return; }
    const total = CART.total();
    try {
      await navigator.clipboard.writeText(`${total} CUP`);
      cartButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 300 });
    } catch (err) {
      console.warn('Clipboard failed', err);
    }
    openModal('#payment-modal');
  });

  el('#close-payment').addEventListener('click', () => closeModal('#payment-modal'));

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

  el('#close-qr').addEventListener('click', () => closeModal('#qr-modal'));

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

  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(window.MENU_DATA || []);
    renderMenuSections(window.MENU_DATA || []);
    observeSections();
    el('#year').textContent = new Date().getFullYear();
    renderCartCount();
  });

  window.CART = CART;
})();
