// Datos cargados desde src/data/menu.js (MENU_DATA)
(function () {
  // Formateo
  function formatPrice(value) { return `${value.toLocaleString("es-CU")} CUP`; }

  // Render menú y categorías
  function renderSidebar(categories) {
    const sidebar = document.getElementById('sidebar-categories');
    sidebar.innerHTML = categories.map(cat => `<button class="sidebar__link" data-target="${cat.id}">${cat.name}</button>`).join('');
    sidebar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-target]');
      if (!btn) return;
      const id = btn.dataset.target;
      const el = document.getElementById(`section-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderMenuSections(categories) {
    const container = document.getElementById('menu-sections');
    container.innerHTML = categories.map(cat => `
      <section class="menu-section" id="section-${cat.id}">
        <h2 class="menu-section__title">${cat.name}</h2>
        <div class="menu-grid">
          ${cat.items.map(item => `
            <article class="menu-card ${item.soldOut ? 'menu-card--soldout' : ''}">
              <div class="menu-card__header">
                <h3>${item.name}</h3>
                ${item.popular ? '<span class="tag tag--popular">Popular</span>' : ''}
                ${item.soldOut ? '<span class="tag tag--soldout">Agotado</span>' : ''}
              </div>
              ${item.description ? `<p class="menu-card__description">${item.description}</p>` : ''}
              <p class="menu-card__price">${formatPrice(item.price)}</p>
              <button class="btn-add" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}" ${item.soldOut ? 'disabled' : ''}>Agregar</button>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');
  }

  // Escape simple para atributos
  function escapeHtml(str) { return String(str).replace(/"/g, '&quot;'); }

  // Carrito en memoria
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
    total() { return this.items.reduce((s,i)=>s + i.price * i.qty, 0); }
  };

  // UI carrito
  function renderCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = CART.items.reduce((s,i)=>s+i.qty,0);
  }

  function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    if (CART.items.length === 0) {
      container.innerHTML = '<p>Tu carrito está vacío.</p>';
      document.getElementById('cart-total').textContent = formatPrice(0);
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
    document.getElementById('cart-total').textContent = formatPrice(CART.total());
  }

  // Eventos globales
  document.addEventListener('click', async (e) => {
    // Agregar al carrito
    const add = e.target.closest('.btn-add');
    if (add) {
      const id = add.dataset.id;
      const name = add.dataset.name;
      const price = Number(add.dataset.price);
      CART.add({ id, name, price, qty: 1 });
      return;
    }

    // Eliminar del carrito
    const rem = e.target.closest('.cart-remove');
    if (rem) {
      CART.remove(rem.dataset.id);
      return;
    }
  });

  // Modal carrito
  const cartButton = document.getElementById('cart-button');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  cartButton.addEventListener('click', () => { renderCart(); cartModal.classList.remove('hidden'); });
  closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));

  // Checkout efectivo
  document.getElementById('checkout-cash').addEventListener('click', async () => {
    if (CART.items.length === 0) { alert('Carrito vacío'); return; }
    const isDelivery = confirm('¿Deseas domicilio? Acepta para domicilio, cancelar para retiro en local.');
    const payload = { items: CART.items, total: CART.total(), paymentMethod: 'cash', delivery: isDelivery };
    try {
      const res = await fetch('/api/order', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Pedido recibido.');
        CART.clear();
        cartModal.classList.add('hidden');
      } else {
        alert(data.error || 'Error procesando pedido.');
      }
    } catch (err) {
      alert('Error de red');
    }
  });

  // Checkout online
  document.getElementById('checkout-online').addEventListener('click', async () => {
    if (CART.items.length === 0) { alert('Carrito vacío'); return; }
    const payload = { items: CART.items, total: CART.total(), paymentMethod: 'online', delivery: false };
    try {
      const res = await fetch('/api/order', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        document.getElementById('qr-image').src = data.qrUrl;
        document.getElementById('qr-note').textContent = `Paga ${formatPrice(payload.total)}. Turno: ${data.staff || 'turno'}.`;
        document.getElementById('qr-modal').classList.remove('hidden');
      } else {
        alert(data.error || 'Error obteniendo QR.');
      }
    } catch (err) {
      alert('Error de red');
    }
  });

  document.getElementById('close-qr').addEventListener('click', () => {
    document.getElementById('qr-modal').classList.add('hidden');
    CART.clear();
    cartModal.classList.add('hidden');
  });

  // Observador de secciones para activar categoría
  function observeSections() {
    const sections = document.querySelectorAll('.menu-section');
    const options = { root: null, threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.sidebar__link').forEach(b => b.classList.remove('active'));
          const btn = document.querySelector(`.sidebar__link[data-target="${entry.target.id.replace('section-','')}"]`);
          if (btn) btn.classList.add('active');
        }
      });
    }, options);
    sections.forEach(s => observer.observe(s));
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(MENU_DATA);
    renderMenuSections(MENU_DATA);
    observeSections();
    document.getElementById('year').textContent = new Date().getFullYear();
    renderCartCount();
  });

  // Exponer CART para depuración
  window.CART = CART;
})();
