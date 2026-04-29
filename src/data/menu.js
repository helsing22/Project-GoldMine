// src/data/menu.js
const MENU_DATA = [
  {
    id: "aperitivos",
    name: "Aperitivos",
    items: [
      {
        id: "a1",
        name: "Papas Lokas",
        description: "Papas fritas con jamón, queso y salsa rosa.",
        price: 1400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/public/images/papas-lokas.webp"
      },
      {
        id: "a2",
        name: "Ensalada Fría de Pollo",
        description: "Pollo, lechuga, tomate y aderezo especial.",
        price: 550,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/public/images/ensalada-pollo.webp"
      }
    ]
  },
  {
    id: "cremas",
    name: "Cremas",
    items: [
      {
        id: "c1",
        name: "Crema Dos Quesos",
        description: "Salsa cremosa con gouda y queso azul.",
        price: 600,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/public/images/crema-dos-quesos.webp"
      }
    ]
  },
  {
    id: "pizzas",
    name: "Pizzas",
    items: [
      {
        id: "p1",
        name: "Pizza Margarita",
        description: "Tomate, mozzarella y albahaca.",
        price: 1200,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/public/images/pizza-margarita.webp"
      },
      {
        id: "p2",
        name: "Pizza Hawaiana",
        description: "Jamón, piña y queso.",
        price: 1450,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/public/images/pizza-hawaiana.webp"
      }
    ]
  }
];

window.MENU_DATA = MENU_DATA;
