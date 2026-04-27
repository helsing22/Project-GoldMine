// Formatea precios
function formatPrice(value, currency = "CUP") {
  return `${value.toLocaleString("es-CU")} ${currency}`;
}

// Renderiza categorías en la barra superior
function renderSidebar(categories) {
  const sidebar = document.getElementById("sidebar-categories");
  sidebar.innerHTML = categories
    .map(
      (cat) => `
      <button class="sidebar__link" data-target="section-${cat.id}">
        ${cat.name}
      </button>
    `
    )
    .join("");

  sidebar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-target]");
    if (!btn) return;
    const targetId = btn.dataset.target;
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// Renderiza secciones del menú
function renderMenuSections(categories) {
  const container = document.getElementById("menu-sections");
  container.classList.add("menu-container");
  container.innerHTML = categories
    .map(
      (cat) => `
      <section class="menu-section" id="section-${cat.id}">
        <h2 class="menu-section__title">${cat.name}</h2>
        <div class="menu-grid">
          ${cat.items
            .map(
              (item) => `
            <article class="menu-card ${
              item.soldOut ? "menu-card--soldout" : ""
            }">
              <header class="menu-card__header">
                <h3>${item.name}</h3>
                ${
                  item.popular
                    ? '<span class="tag tag--popular">Popular</span>'
                    : ""
                }
                ${
                  item.soldOut
                    ? '<span class="tag tag--soldout">Agotado</span>'
                    : ""
                }
              </header>
              ${
                item.description
                  ? `<p class="menu-card__description">${item.description}</p>`
                  : ""
              }
              <p class="menu-card__price">${formatPrice(
                item.price,
                item.currency
              )}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `
    )
    .join("");
}

// Observa qué sección está visible y actualiza el selector
function observeSections() {
  const sections = document.querySelectorAll(".menu-section");
  const options = {
    root: null,
    threshold: 0.6,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document
          .querySelectorAll(".sidebar__link")
          .forEach((btn) => btn.classList.remove("active"));
        const activeBtn = document.querySelector(
          `.sidebar__link[data-target="${entry.target.id}"]`
        );
        if (activeBtn) activeBtn.classList.add("active");
      }
    });
  }, options);

  sections.forEach((section) => observer.observe(section));
}

// Inicializa todo
function init() {
  renderSidebar(MENU_DATA);
  renderMenuSections(MENU_DATA);
  observeSections();
  document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", init);
