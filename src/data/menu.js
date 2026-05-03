// src/data/menu.js
const MENU_DATA = [
  {
    id: "Pastas",
    name: "Pastas",
    items: [
      {
        id: "pa1",
        name: "Spaguetis con Jamon y Queso",
        description: "Spaguetis con Jamon y Queso.",
        price: 650,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      }
    ]
  },
  {
    id: "pizzas",
    name: "Pizzas",
    items: [
      {
      id: "p1",
        name: "Pizza de Queso",
        description: "",
        price: 360,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p2",
        name: "Pizza de Jamon y Queso",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p3",
        name: "Pizza de Doble Queso",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: true,
        imageUrl:""
      },
      {
      id: "p4",
        name: "Pizza de Queso y Cebolla",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p5",
        name: "Pizza de Queso y Salchicha",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p6",
        name: "Pizza de Queso y Chorizo",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p7",
        name: "Pizza Mixta",
        description: "",
        price: 500,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
      id: "p8",
        name: "Pizza de Atún",
        description: "",
        price: 500,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
    ]
  },
  {
    id: "Bebidas",
    name: "Bebidas",
    items: [
      {
       id: "b1",
        name: "Refrescos de Lata",
        description: "Cola, Limon, Naranja",
        price: 350,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b2",
        name: "Refresco de Piña",
        description: "",
        price: 350,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b3",
        name: "Malta Floridita",
        description: "",
        price: 390,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b4",
        name: "Malta Bucanero",
        description: "",
        price: 480,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b5",
        name: "Cerveza Holandia",
        description: "",
        price: 350,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b6",
        name: "Cerveza La Fria",
        description: "",
        price: 350,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b7",
        name: "Cerveza Cristal Verde",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "b7",
        name: "Cerveza Windmil",
        description: "",
        price: 400,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
    ]
  },
  {
    id: "Postres",
    name: "Postres",
    items: [
      {
       id: "po1",
        name: "Flan",
        description: "",
        price: 200,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
    ]
  },
  {
    id: "Special",
    name: "Ofertas Especiales",
    items: [
      {
       id: "sp1",
        name: "Super Pizza de Queso Gouda",
        description: "",
        price: 1850,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "sp1",
        name: "Super Pizza de Jamón y Queso Gouda",
        description: "",
        price: 1950,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "sp1",
        name: "Super Pizza Mixta",
        description: "",
        price: 2100,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "sp1",
        name: "Super Pizza De Atún y Queso Gouda",
        description: "",
        price: 2250,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
    ]
  },
  {
    id: "Hamb",
    name: "Hamburguesas",
    items: [
      {
       id: "H1",
        name: "Hamburguesa de jaom y Queso",
        description: "Jamon y Queso Gouda, Kechup-Mostaza, Pepinillo, Tomate, Lechuga y Mayonesa incluye Papas Fritas",
        price: 850,
        currency: "CUP",
        popular: true,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "H2",
        name: "Hamburguesa Encebollada",
        description: "Queso Gouda, Kechup-Mostaza, Pepinillo y Mayonesa incluye Papas Fritas",
        price: 950,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
      {
       id: "H3",
        name: "La Super Hamburguesa",
        description: "Especialidad de la Casa, Contiene Doble: Hamburguesa, Queso gouda, Jamón, Kechup, Mostaza, Mayonesa, Pepinillo y doble ración de Papas Fritas",
        price: 1300,
        currency: "CUP",
        popular: false,
        soldOut: false,
        imageUrl:""
      },
    ]
  }
];

window.MENU_DATA = MENU_DATA;
