// src/app/dashboard/production/data.ts

import { Ingredient, Product, Production } from "@/types/production";


export const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Harina de trigo",
    currentStock: 70,
    unit: "kg",
    minStock: 200,
  },
  { 
    id: 2, 
    name: "Azúcar", 
    currentStock: 28,
    unit: "kg", 
    minStock: 100 
  },
  { 
    id: 3, 
    name: "Huevos", 
    currentStock: 150, 
    unit: "unidades", 
    minStock: 1000 
  },
  { 
    id: 4, 
    name: "Mantequilla", 
    currentStock: 40,
    unit: "kg", 
    minStock: 50 
  },
  { 
    id: 5, 
    name: "Levadura química", 
    currentStock: 1,
    unit: "kg", 
    minStock: 10 
  },
  { 
    id: 6, 
    name: "Sal", 
    currentStock: 30,
    unit: "kg", 
    minStock: 20 
  },
  { 
    id: 7, 
    name: "Queso rallado", 
    currentStock: 20,
    unit: "kg", 
    minStock: 50 
  },
  { 
    id: 8, 
    name: "Cacao en polvo", 
    currentStock: 100,
    unit: "kg", 
    minStock: 20 
  },
  { 
    id: 9, 
    name: "Esencia de vainilla", 
    currentStock: 20,
    unit: "lt", 
    minStock: 5 
  },
  { 
    id: 10, 
    name: "Canela molida", 
    currentStock: 20,
    unit: "kg", 
    minStock: 5 
  },
  {
    id: 11,
    name: "Leche entera",
    currentStock: 300,
    unit: "lt",
    minStock: 100
  },
  {
    id: 12,
    name: "Crema de leche",
    currentStock: 150,
    unit: "lt",
    minStock: 50
  },
  {
    id: 13,
    name: "Almidón de maíz",
    currentStock: 200,
    unit: "kg",
    minStock: 50
  },
  {
    id: 14,
    name: "Mermelada de durazno",
    currentStock: 100,
    unit: "kg",
    minStock: 20
  },
  {
    id: 15,
    name: "Dulce de leche",
    currentStock: 200,
    unit: "kg",
    minStock: 50
  },
  {
    id: 16,
    name: "Chocolate para cobertura",
    currentStock: 150,
    unit: "kg",
    minStock: 30
  },
  {
    id: 17,
    name: "Fruta confitada",
    currentStock: 50,
    unit: "kg",
    minStock: 10
  },
  {
    id: 18,
    name: "Almendras fileteadas",
    currentStock: 50,
    unit: "kg",
    minStock: 10
  },
  {
    id: 19,
    name: "Colorante alimentario",
    currentStock: 10,
    unit: "lt",
    minStock: 2
  },
  {
    id: 20,
    name: "Gelatina sin sabor",
    currentStock: 20,
    unit: "kg",
    minStock: 5
  },
  {
    id: 21,
    name: "Harina de maíz",
    currentStock: 200,
    unit: "kg",
    minStock: 50
  },
  {
    id: 22,
    name: "Manteca vegetal",
    currentStock: 200,
    unit: "kg",
    minStock: 50
  },
  {
    id: 23,
    name: "Huevos de codorniz",
    currentStock: 1000,
    unit: "unidades",
    minStock: 200
  },
  {
    id: 24,
    name: "Carne molida",
    currentStock: 50,
    unit: "kg",
    minStock: 10
  },
  {
    id: 25,
    name: "Ají molido",
    currentStock: 5,
    unit: "kg",
    minStock: 1
  },
  {
    id: 26,
    name: "Leche condensada",
    currentStock: 30,
    unit: "lt",
    minStock: 5
  },
  {
    id: 27,
    name: "Galletas Oreo",
    currentStock: 20,
    unit: "kg",
    minStock: 3
  },
  {
    id: 28,
    name: "Queso crema",
    currentStock: 25,
    unit: "kg",
    minStock: 5
  },
  {
    id: 29,
    name: "Duraznos frescos",
    currentStock: 15,
    unit: "kg",
    minStock: 3
  },
  {
    id: 30,
    name: "Gelatina sin sabor",
    currentStock: 5,
    unit: "kg",
    minStock: 1
  },
  {
    id: 31,
    name: "Café instantáneo",
    currentStock: 10,
    unit: "kg",
    minStock: 2
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Empanada de arroz",
    description: "Empanada de arroz rellena (120g)",
    brand: "Mil Sabores",
    image: "/empanada-de-arroz.jpg",
    recipe: [
      { ingredientId: 21, quantity: 0.08 },
      { ingredientId: 11, quantity: 0.05 },
      { ingredientId: 4, quantity: 0.03 },
      { ingredientId: 7, quantity: 0.04 },
      { ingredientId: 6, quantity: 0.002 }
    ]
  },
  {
    id: 2,
    name: "Sonso",
    description: "Pan de yuca y queso (150g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 13, quantity: 0.1 },
      { ingredientId: 7, quantity: 0.06 },
      { ingredientId: 3, quantity: 0.4 },
      { ingredientId: 4, quantity: 0.03 },
      { ingredientId: 6, quantity: 0.003 }
    ]
  },
  {
    id: 3,
    name: "Tamal",
    description: "Tamal tradicional (250g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 21, quantity: 0.15 },
      { ingredientId: 4, quantity: 0.05 },
      { ingredientId: 7, quantity: 0.08 },
      { ingredientId: 24, quantity: 0.1 },
      { ingredientId: 25, quantity: 0.02 },
      { ingredientId: 6, quantity: 0.005 }
    ]
  },
  {
    id: 4,
    name: "Cuñapé",
    description: "Pan de queso tradicional (100g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 13, quantity: 0.07 },
      { ingredientId: 7, quantity: 0.05 },
      { ingredientId: 3, quantity: 0.3 },
      { ingredientId: 11, quantity: 0.03 },
      { ingredientId: 4, quantity: 0.02 },
      { ingredientId: 6, quantity: 0.002 }
    ]
  },
  {
    id: 5,
    name: "Torta de Chocolate",
    description: "Torta de 3 pisos (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.8 },
      { ingredientId: 2, quantity: 0.7 },
      { ingredientId: 8, quantity: 0.3 },
      { ingredientId: 3, quantity: 12 },
      { ingredientId: 4, quantity: 0.5 },
      { ingredientId: 11, quantity: 0.4 },
      { ingredientId: 16, quantity: 0.6 },
      { ingredientId: 12, quantity: 0.3 }
    ]
  },
  {
    id: 6,
    name: "Torta Tres Leches",
    description: "Torta clásica (22cm) - 10 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.5 },
      { ingredientId: 2, quantity: 0.4 },
      { ingredientId: 3, quantity: 8 },
      { ingredientId: 11, quantity: 0.5 },
      { ingredientId: 26, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.4 },
      { ingredientId: 9, quantity: 0.01 }
    ]
  },
  {
    id: 7,
    name: "Torta Oreo",
    description: "Torta de galletas Oreo (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 10 },
      { ingredientId: 4, quantity: 0.4 },
      { ingredientId: 27, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.5 },
      { ingredientId: 16, quantity: 0.2 }
    ]
  },
  {
    id: 8,
    name: "Torta de Vainilla",
    description: "Torta clásica (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.7 },
      { ingredientId: 2, quantity: 0.6 },
      { ingredientId: 3, quantity: 10 },
      { ingredientId: 4, quantity: 0.5 },
      { ingredientId: 9, quantity: 0.02 },
      { ingredientId: 11, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.4 }
    ]
  },
  {
    id: 9,
    name: "Torta Red Velvet",
    description: "Torta aterciopelada (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 8 },
      { ingredientId: 4, quantity: 0.4 },
      { ingredientId: 8, quantity: 0.05 },
      { ingredientId: 19, quantity: 0.01 },
      { ingredientId: 11, quantity: 0.3 },
      { ingredientId: 28, quantity: 0.4 }
    ]
  },
  {
    id: 10,
    name: "Torta de Durazno",
    description: "Torta con relleno de durazno (22cm) - 10 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },
      { ingredientId: 2, quantity: 0.5 },
      { ingredientId: 3, quantity: 8 },
      { ingredientId: 4, quantity: 0.4 },
      { ingredientId: 14, quantity: 0.5 },
      { ingredientId: 12, quantity: 0.4 },
      { ingredientId: 29, quantity: 0.3 }
    ]
  },
  {
    id: 11,
    name: "Soufflé de Chantilly",
    description: "Torta esponjosa (20cm) - 8 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 3, quantity: 12 },
      { ingredientId: 2, quantity: 0.3 },
      { ingredientId: 12, quantity: 0.6 },
      { ingredientId: 30, quantity: 0.02 },
      { ingredientId: 9, quantity: 0.01 }
    ]
  },
  {
    id: 12,
    name: "Torta Moka",
    description: "Torta de café (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.7 },
      { ingredientId: 2, quantity: 0.6 },
      { ingredientId: 3, quantity: 10 },
      { ingredientId: 4, quantity: 0.5 },
      { ingredientId: 31, quantity: 0.05 },
      { ingredientId: 16, quantity: 0.4 },
      { ingredientId: 12, quantity: 0.5 }
    ]
  }
  
];

export const mockProductions: Production[] = [
    {
      id: 1,
      products: [
        { 
          ...mockProducts[0], 
          quantity: 500, 
          canProduce: false,
          missingIngredients: [
            { ingredientId: 1, missing: 2.4 },
            { ingredientId: 3, missing: 1.5 }
          ]
        },
        { 
          ...mockProducts[1], 
          quantity: 200, 
          canProduce: false,
          missingIngredients: [
            { ingredientId: 2, missing: 3.2 }
          ]
        },
      ],
      status: "pending",
      createdAt: "2023-10-01",
      dueDate: "2023-10-10",
      missingIngredients: [
        { ingredient: mockIngredients[1], missingAmount: 2.4 },
        { ingredient: mockIngredients[3], missingAmount: 1.5 },
      ],
      ingredientsUsage: [
        { ingredient: mockIngredients[0], amountUsed: 15 },
        { ingredient: mockIngredients[2], amountUsed: 150 },
        { ingredient: mockIngredients[6], amountUsed: 12 },
      ],
    },
    {
      id: 2,
      products: [
        { 
          ...mockProducts[2], 
          quantity: 300, 
          canProduce: true 
        },
        { 
          ...mockProducts[4], 
          quantity: 150, 
          canProduce: true 
        },
      ],
      status: "in_progress",
      createdAt: "2023-10-02",
      dueDate: "2023-10-12",
      ingredientsUsage: [
        { ingredient: mockIngredients[0], amountUsed: 7.5 },
        { ingredient: mockIngredients[1], amountUsed: 3.9 },
        { ingredient: mockIngredients[3], amountUsed: 2.25 },
      ],
    },
    {
      id: 3,
      products: [
        { 
          ...mockProducts[3], 
          quantity: 400, 
          canProduce: true 
        },
        { 
          ...mockProducts[5], 
          quantity: 200, 
          canProduce: true 
        },
      ],
      status: "completed",
      createdAt: "2023-10-03",
      dueDate: "2023-10-13",
      ingredientsUsage: [
        { ingredient: mockIngredients[0], amountUsed: 10 },
        { ingredient: mockIngredients[1], amountUsed: 5 },
        { ingredient: mockIngredients[3], amountUsed: 3 },
      ],
    },
    {
      id: 4,
      products: [
        { 
          ...mockProducts[6], 
          quantity: 600, 
          canProduce: true 
        },
        { 
          ...mockProducts[7], 
          quantity: 300, 
          canProduce: true 
        },
      ],
      status: "completed",
      createdAt: "2023-10-04",
      dueDate: "2023-10-14",
      ingredientsUsage: [
        { ingredient: mockIngredients[0], amountUsed: 15 },
        { ingredient: mockIngredients[1], amountUsed: 8 },
        { ingredient: mockIngredients[3], amountUsed: 5 },
      ],
    },
  ];