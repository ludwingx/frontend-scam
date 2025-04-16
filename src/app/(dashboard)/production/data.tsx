import { Ingredient, BaseProduct, Product, Production } from "@/types/production";

// ==================== INGREDIENTES ====================
export const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Harina de trigo",
    currentStock: 1000,
    unit: "kg",
    minStock: 200,
  },
  { 
    id: 2, 
    name: "Azúcar", 
    currentStock: 800,
    unit: "kg", 
    minStock: 100 
  },
  { 
    id: 3, 
    name: "Huevos", 
    currentStock: 2000, 
    unit: "unidades", 
    minStock: 1000 
  },
  { 
    id: 4, 
    name: "Mantequilla", 
    currentStock: 500,
    unit: "kg", 
    minStock: 50 
  },
  { 
    id: 5, 
    name: "Levadura química", 
    currentStock: 50,
    unit: "kg", 
    minStock: 10 
  },
  { 
    id: 6, 
    name: "Sal", 
    currentStock: 100,
    unit: "kg", 
    minStock: 20 
  },
  { 
    id: 7, 
    name: "Queso rallado", 
    currentStock: 300,
    unit: "kg", 
    minStock: 50 
  },
  { 
    id: 8, 
    name: "Cacao en polvo", 
    currentStock: 200,
    unit: "kg", 
    minStock: 20 
  },
  { 
    id: 9, 
    name: "Esencia de vainilla", 
    currentStock: 50,
    unit: "lt", 
    minStock: 5 
  },
  { 
    id: 10, 
    name: "Canela molida", 
    currentStock: 50,
    unit: "kg", 
    minStock: 5 
  },
  {
    id: 11,
    name: "Leche entera",
    currentStock: 500,
    unit: "lt",
    minStock: 100
  },
  {
    id: 12,
    name: "Crema de leche",
    currentStock: 300,
    unit: "lt",
    minStock: 50
  },
  {
    id: 13,
    name: "Almidón de maíz",
    currentStock: 400,
    unit: "kg",
    minStock: 50
  },
  {
    id: 14,
    name: "Chocolate cobertura",
    currentStock: 200,
    unit: "kg",
    minStock: 30
  }
];

// ==================== BASES DE PRODUCCIÓN ====================
export const mockBases: BaseProduct[] = [
  {
    id: 1,
    name: "Bizcochuelo de vainilla",
    currentStock: 50,
    unit: "unidades",
    minStock: 10
  },
  {
    id: 2,
    name: "Bizcochuelo de chocolate",
    currentStock: 30,
    unit: "unidades",
    minStock: 10
  },
  {
    id: 3,
    name: "Masa para empanadas",
    currentStock: 100,
    unit: "kg",
    minStock: 20
  },
  {
    id: 4,
    name: "Masa para tartas",
    currentStock: 40,
    unit: "kg",
    minStock: 10
  }
];

// ==================== PRODUCTOS ====================
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Empanada de arroz",
    description: "Empanada de arroz rellena (120g)",
    brand: "Mil Sabores",
    image: "/cuñape.png",
    recipe: [
      { ingredientId: 13, quantity: 0.08 },
      { ingredientId: 11, quantity: 0.05 },
      { ingredientId: 4, quantity: 0.03 },
      { ingredientId: 7, quantity: 0.04 },
      { ingredientId: 6, quantity: 0.002 }
    ]
  },
  {
    id: "prod-2",
    name: "Sonso",
    description: "Pan de yuca y queso (150g)",
    brand: "Mil Sabores",
    image: "/cuñape.png",
    recipe: [
      { ingredientId: 13, quantity: 0.1 },
      { ingredientId: 7, quantity: 0.06 },
      { ingredientId: 3, quantity: 0.4 },
      { ingredientId: 4, quantity: 0.03 },
      { ingredientId: 6, quantity: 0.003 }
    ]
  },
  {
    id: "prod-3",
    name: "Cuñapé",
    description: "Pan de queso tradicional (100g)",
    brand: "Mil Sabores",
    image: "/cuñape.png",
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
    id: "prod-4",
    name: "Torta de Chocolate",
    description: "Torta de 3 pisos (24cm) - 12 porciones",
    brand: "Torta Express",
    image: "/cuñape.png",
    recipe: [
      { ingredientId: 14, quantity: 0.6 },
      { ingredientId: 12, quantity: 0.3 },
      { ingredientId: 4, quantity: 0.2 },
      { ingredientId: 9, quantity: 0.01 }
    ],
    baseRequirements: [
      { baseId: 2, quantity: 1 }
    ]
  },
  {
    id: "prod-5",
    name: "Torta de Vainilla",
    description: "Torta de 2 pisos (20cm) - 8 porciones",
    brand: "Torta Express",
    image: "/cuñape.png",
    recipe: [
      { ingredientId: 12, quantity: 0.4 },
      { ingredientId: 2, quantity: 0.2 },
      { ingredientId: 9, quantity: 0.02 }
    ],
    baseRequirements: [
      { baseId: 1, quantity: 1 }
    ]
  }
];

// ==================== PRODUCCIONES ====================
export const mockProductions: Production[] = [
  {
    id: 1,
    name: "Producción #1",
    products: [
      { 
        ...mockProducts[0],
        quantity: 100,
        canProduce: true,
        missingIngredients: [],
        missingBases: []
      },
      { 
        ...mockProducts[1],
        quantity: 50,
        canProduce: true,
        missingIngredients: [],
        missingBases: []
      }
    ],
    status: "in_progress",
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[12], amountUsed: 8 },
      { ingredient: mockIngredients[6], amountUsed: 5 },
      { ingredient: mockIngredients[2], amountUsed: 20 }
    ]
  },
  {
    id: 2,
    name: "Producción #2",
    products: [
      { 
        ...mockProducts[3],
        quantity: 5,
        canProduce: true,
        missingIngredients: [],
        missingBases: []
      }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[13], amountUsed: 3 },
      { ingredient: mockIngredients[11], amountUsed: 1.5 }
    ],
    basesUsage: [
      { base: mockBases[1], amountUsed: 5 }
    ]
  },
  {
    id: 3,
    name: "Producción #3",
    products: [
      { 
        ...mockProducts[4],
        quantity: 3,
        canProduce: true,
        missingIngredients: [],
        missingBases: []
      }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[11], amountUsed: 1.2 },
      { ingredient: mockIngredients[1], amountUsed: 0.6 }
    ],
    basesUsage: [
      { base: mockBases[0], amountUsed: 3 }
    ]
  }
];