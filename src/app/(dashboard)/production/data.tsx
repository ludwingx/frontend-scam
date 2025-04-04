// src/app/dashboard/production/data.ts
import { Ingredient, Product, Production} from "@/types/production";

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
  }
];

// ==================== PRODUCTOS ====================
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Empanada de arroz",
    description: "Empanada de arroz rellena (120g)",
    brand: "Mil Sabores",
    image: "/empanada-de-arroz.jpg",
    recipe: [
      { ingredientId: 13, quantity: 0.08 }, // Almidón de maíz
      { ingredientId: 11, quantity: 0.05 }, // Leche
      { ingredientId: 4, quantity: 0.03 },  // Mantequilla
      { ingredientId: 7, quantity: 0.04 },  // Queso rallado
      { ingredientId: 6, quantity: 0.002 }  // Sal
    ]
  },
  {
    id: "prod-2",
    name: "Sonso",
    description: "Pan de yuca y queso (150g)",
    brand: "Mil Sabores",
    image: "/sonso.jpg",
    recipe: [
      { ingredientId: 13, quantity: 0.1 },  // Almidón de maíz
      { ingredientId: 7, quantity: 0.06 },  // Queso rallado
      { ingredientId: 3, quantity: 0.4 },   // Huevos
      { ingredientId: 4, quantity: 0.03 },  // Mantequilla
      { ingredientId: 6, quantity: 0.003 }  // Sal
    ]
  },
  {
    id: "prod-3",
    name: "Cuñapé",
    description: "Pan de queso tradicional (100g)",
    brand: "Mil Sabores",
    image: "/cuñape.jpg",
    recipe: [
      { ingredientId: 13, quantity: 0.07 }, // Almidón de maíz
      { ingredientId: 7, quantity: 0.05 },  // Queso rallado
      { ingredientId: 3, quantity: 0.3 },   // Huevos
      { ingredientId: 11, quantity: 0.03 }, // Leche
      { ingredientId: 4, quantity: 0.02 },  // Mantequilla
      { ingredientId: 6, quantity: 0.002 }  // Sal
    ]
  },
  {
    id: "prod-4",
    name: "Torta de Chocolate",
    description: "Torta de 3 pisos (24cm) - 12 porciones",
    brand: "Repostería",
    image: "/torta-chocolate.jpg",
    recipe: [
      { ingredientId: 1, quantity: 0.8 },   // Harina
      { ingredientId: 2, quantity: 0.7 },   // Azúcar
      { ingredientId: 8, quantity: 0.3 },   // Cacao
      { ingredientId: 3, quantity: 12 },    // Huevos
      { ingredientId: 4, quantity: 0.5 },   // Mantequilla
      { ingredientId: 11, quantity: 0.4 },  // Leche
      { ingredientId: 16, quantity: 0.6 }, // Chocolate cobertura
      { ingredientId: 12, quantity: 0.3 }   // Crema de leche
    ]
  }
];

// ==================== PRODUCCIONES ====================
export const mockProductions: Production[] = [
  {
    id: 1,
    products: [
      { 
        ...mockProducts[0], 
        quantity: 100, 
        canProduce: true,
        missingIngredients: [] 
      },
      { 
        ...mockProducts[1], 
        quantity: 50, 
        canProduce: true,
        missingIngredients: [] 
      }
    ],
    status: "in_progress",
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    missingIngredients: [],
    ingredientsUsage: [
      { ingredient: mockIngredients[12], amountUsed: 8 },  // Almidón
      { ingredient: mockIngredients[6], amountUsed: 5 },    // Queso
      { ingredient: mockIngredients[2], amountUsed: 20 }    // Huevos
    ]
  },
  {
    id: 2,
    products: [
      { 
        ...mockProducts[3], 
        quantity: 5, 
        canProduce: true,
        missingIngredients: [] 
      }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[0], amountUsed: 4 },    // Harina
      { ingredient: mockIngredients[1], amountUsed: 3.5 },  // Azúcar
      { ingredient: mockIngredients[7], amountUsed: 1.5 }   // Cacao
    ]
  },
  {
    id: 3,
    products: [
      { 
        ...mockProducts[2], 
        quantity: 10, 
        canProduce: true,
        missingIngredients: [] 
      }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[0], amountUsed: 4 },    // Harina
      { ingredient: mockIngredients[1], amountUsed: 3.5 },  // Azúcar
      { ingredient: mockIngredients[7], amountUsed: 1.5 }   // Cacao
    ]
  },
  {
    id: 4,
    products: [
      { 
        ...mockProducts[1], 
        quantity: 10, 
        canProduce: true,
        missingIngredients: [] 
      }
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date().toISOString(),
    ingredientsUsage: [
      { ingredient: mockIngredients[0], amountUsed: 4 },    // Harina
      { ingredient: mockIngredients[1], amountUsed: 3.5 },  // Azúcar
      { ingredient: mockIngredients[7], amountUsed: 1.5 }   // Cacao
    ]
  }
];
