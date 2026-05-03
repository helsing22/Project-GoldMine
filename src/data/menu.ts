import { MenuCategory } from '@/lib/types';

export const MENU_DATA: MenuCategory[] = [
  {
    id: "Pastas",
    name: "Pastas",
    emoji: "🍝",
    items: [
      {
        id: "pa1",
        name: "Spaguetis con Jamón y Queso",
        description: "Clásicos spaguetis con jamón y queso fundido",
        price: 650,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/crema-dos-quesos.webp"
      }
    ]
  },
  {
    id: "pizzas",
    name: "Pizzas",
    emoji: "🍕",
    items: [
      {
        id: "p1",
        name: "Pizza de Queso",
        description: "Queso derretido sobre nuestra masa artesanal",
        price: 360,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-margarita.webp"
      },
      {
        id: "p2",
        name: "Pizza de Jamón y Queso",
        description: "Jamón premium con queso derretido",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-margarita.webp"
      },
      {
        id: "p3",
        name: "Pizza de Doble Queso",
        description: "Doble porción de queso para los amantes del queso",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: true,
        imageUrl: "/images/crema-dos-quesos.webp"
      },
      {
        id: "p4",
        name: "Pizza de Queso y Cebolla",
        description: "Queso con cebolla caramelizada",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-margarita.webp"
      },
      {
        id: "p5",
        name: "Pizza de Queso y Salchicha",
        description: "Salchicha con queso derretido",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      },
      {
        id: "p6",
        name: "Pizza de Queso y Chorizo",
        description: "Chorizo ahumado con queso fundido",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      },
      {
        id: "p7",
        name: "Pizza Mixta",
        description: "Jamón, chorizo y queso, la combinación perfecta",
        price: 500,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      },
      {
        id: "p8",
        name: "Pizza de Atún",
        description: "Atún con queso y aceitunas",
        price: 500,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      }
    ]
  },
  {
    id: "Bebidas",
    name: "Bebidas",
    emoji: "🥤",
    items: [
      {
        id: "b1",
        name: "Refrescos de Lata",
        description: "Cola, Limón o Naranja",
        price: 350,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b2",
        name: "Refresco de Piña",
        description: "Refresco natural de piña",
        price: 350,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b3",
        name: "Malta Floridita",
        description: "Malta fría bien helada",
        price: 390,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b4",
        name: "Malta Bucanero",
        description: "La malta favorita de Cuba",
        price: 480,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b5",
        name: "Cerveza Holandia",
        description: "Cerveza Holandia bien fría",
        price: 350,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b6",
        name: "Cerveza La Fría",
        description: "Cerveza La Fría refrescante",
        price: 350,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b7",
        name: "Cerveza Cristal Verde",
        description: "Cerveza Cristal, la de siempre",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      },
      {
        id: "b8",
        name: "Cerveza Windmil",
        description: "Cerveza Windmil bien fría",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      }
    ]
  },
  {
    id: "Postres",
    name: "Postres",
    emoji: "🍮",
    items: [
      {
        id: "po1",
        name: "Flan",
        description: "Flan casero con caramelo",
        price: 200,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: ""
      }
    ]
  },
  {
    id: "Special",
    name: "Ofertas Especiales",
    emoji: "⭐",
    items: [
      {
        id: "sp1",
        name: "Super Pizza de Queso Gouda",
        description: "Pizza grande con queso Gouda premium",
        price: 1850,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-margarita.webp"
      },
      {
        id: "sp2",
        name: "Super Pizza de Jamón y Queso Gouda",
        description: "Jamón y queso Gouda premium",
        price: 1950,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      },
      {
        id: "sp3",
        name: "Super Pizza Mixta",
        description: "La especialidad de la casa en formato grande",
        price: 2100,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      },
      {
        id: "sp4",
        name: "Super Pizza de Atún y Queso Gouda",
        description: "Atún premium con queso Gouda",
        price: 2250,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/pizza-hawaiana.webp"
      }
    ]
  },
  {
    id: "Hamb",
    name: "Hamburguesas",
    emoji: "🍔",
    items: [
      {
        id: "H1",
        name: "Hamburguesa de Jamón y Queso",
        description: "Jamón y Queso Gouda, Ketchup-Mostaza, Pepinillo, Tomate, Lechuga y Mayonesa. Incluye Papas Fritas",
        price: 850,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl: "/images/ensalada-pollo.webp"
      },
      {
        id: "H2",
        name: "Hamburguesa Encebollada",
        description: "Queso Gouda, Ketchup-Mostaza, Pepinillo y Mayonesa. Incluye Papas Fritas",
        price: 950,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/ensalada-pollo.webp"
      },
      {
        id: "H3",
        name: "La Super Hamburguesa",
        description: "Especialidad de la Casa: Doble hamburguesa, doble queso Gouda, jamón, ketchup, mostaza, mayonesa, pepinillo y doble ración de Papas Fritas",
        price: 1300,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl: "/images/papas-lokas.webp"
      }
    ]
  }
];
