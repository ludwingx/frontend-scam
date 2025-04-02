"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Table,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Separator } from "@radix-ui/react-separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Ingredient {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  minStock: number;
}

interface RecipeItem {
  ingredientId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  image?: string;
  recipe: RecipeItem[];
}

interface SelectedProduct extends Product {
  quantity: number | null;
  canProduce: boolean;
  missingIngredients?: {
    ingredientId: number;
    missing: number;
  }[];
}

interface Production {
  id: number;
  products: SelectedProduct[];
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  dueDate: string;
  missingIngredients?: {
    ingredient: Ingredient;
    missingAmount: number;
  }[];
  ingredientsUsage?: {
    ingredient: Ingredient;
    amountUsed: number;
  }[];
}

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Harina de trigo",
    currentStock: 70, // kg (stock inicial para pequeña producción)
    unit: "kg",
    minStock: 200, // 200kg como mínimo para no quedarse sin stock
  },
  { 
    id: 2, 
    name: "Azúcar", 
    currentStock: 28, // kg
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
    currentStock: 40, // kg (30 bloques de 10kg)
    unit: "kg", 
    minStock: 50 
  },
  { 
    id: 5, 
    name: "Levadura química", 
    currentStock: 1, // kg
    unit: "kg", 
    minStock: 10 
  },
  { 
    id: 6, 
    name: "Sal", 
    currentStock: 30, // kg
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
    currentStock: 100, // kg
    unit: "kg", 
    minStock: 20 
  },
  { 
    id: 9, 
    name: "Esencia de vainilla", 
    currentStock: 20, // litros
    unit: "lt", 
    minStock: 5 
  },
  { 
    id: 10, 
    name: "Canela molida", 
    currentStock: 20, // kg
    unit: "kg", 
    minStock: 5 
  },
  {
    id: 11,
    name: "Leche entera",
    currentStock: 300, // litros (3-4 días de producción)
    unit: "lt",
    minStock: 100
  },
  {
    id: 12,
    name: "Crema de leche",
    currentStock: 150, // litros
    unit: "lt",
    minStock: 50
  },
  {
    id: 13,
    name: "Almidón de maíz",
    currentStock: 200, // kg (para cuñapés)
    unit: "kg",
    minStock: 50
  },
  {
    id: 14,
    name: "Mermelada de durazno",
    currentStock: 100, // kg
    unit: "kg",
    minStock: 20
  },
  {
    id: 15,
    name: "Dulce de leche",
    currentStock: 200, // kg (2 tambores de 100kg)
    unit: "kg",
    minStock: 50
  },
  {
    id: 16,
    name: "Chocolate para cobertura",
    currentStock: 150, // kg
    unit: "kg",
    minStock: 30
  },
  {
    id: 17,
    name: "Fruta confitada",
    currentStock: 50, // kg
    unit: "kg",
    minStock: 10
  },
  {
    id: 18,
    name: "Almendras fileteadas",
    currentStock: 50, // kg
    unit: "kg",
    minStock: 10
  },
  {
    id: 19,
    name: "Colorante alimentario",
    currentStock: 10, // litros
    unit: "lt",
    minStock: 2
  },
  {
    id: 20,
    name: "Gelatina sin sabor",
    currentStock: 20, // kg
    unit: "kg",
    minStock: 5
  },
  {
    id: 21,
    name: "Harina de maíz",
    currentStock: 200, // kg
    unit: "kg",
    minStock: 50
  },
  {
    id: 22,
    name: "Manteca vegetal",
    currentStock: 200, // kg
    unit: "kg",
    minStock: 50
  },
  {
    id: 23,
    name: "Huevos de codorniz",
    currentStock: 1000, // unidades
    unit: "unidades",
    minStock:
     200
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

const mockProducts: Product[] = [
  // Productos de Mil Sabores (unidades individuales)
  {
    id: 1,
    name: "Empanada de arroz",
    description: "Empanada de arroz rellena (120g)",
    brand: "Mil Sabores",
    image: "/empanada-de-arroz.jpg",
    recipe: [
      { ingredientId: 21, quantity: 0.08 },   // 80g harina de arroz
      { ingredientId: 11, quantity: 0.05 },    // 50ml leche
      { ingredientId: 4, quantity: 0.03 },     // 30g mantequilla
      { ingredientId: 7, quantity: 0.04 },     // 40g queso (relleno)
      { ingredientId: 6, quantity: 0.002 }     // 2g sal
    ]
  },
  {
    id: 2,
    name: "Sonso",
    description: "Pan de yuca y queso (150g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 13, quantity: 0.1 },     // 100g almidón de yuca
      { ingredientId: 7, quantity: 0.06 },      // 60g queso
      { ingredientId: 3, quantity: 0.4 },       // 0.4 huevo (2 huevos por 5 unidades)
      { ingredientId: 4, quantity: 0.03 },      // 30g mantequilla
      { ingredientId: 6, quantity: 0.003 }      // 3g sal
    ]
  },
  {
    id: 3,
    name: "Tamal",
    description: "Tamal tradicional (250g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 21, quantity: 0.15 },    // 150g harina de maíz
      { ingredientId: 4, quantity: 0.05 },      // 50g manteca
      { ingredientId: 7, quantity: 0.08 },      // 80g queso
      { ingredientId: 24, quantity: 0.1 },      // 100g carne (nuevo ingrediente)
      { ingredientId: 25, quantity: 0.02 },     // 20g ají (nuevo ingrediente)
      { ingredientId: 6, quantity: 0.005 }      // 5g sal
    ]
  },
  {
    id: 4,
    name: "Cuñapé",
    description: "Pan de queso tradicional (100g)",
    brand: "Mil Sabores",
    recipe: [
      { ingredientId: 13, quantity: 0.07 },     // 70g almidón de yuca
      { ingredientId: 7, quantity: 0.05 },      // 50g queso
      { ingredientId: 3, quantity: 0.3 },       // 0.3 huevo
      { ingredientId: 11, quantity: 0.03 },     // 30ml leche
      { ingredientId: 4, quantity: 0.02 },      // 20g mantequilla
      { ingredientId: 6, quantity: 0.002 }      // 2g sal
    ]
  },

  // Tortas enteras (unidades completas)
  {
    id: 5,
    name: "Torta de Chocolate",
    description: "Torta de 3 pisos (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.8 },      // 800g harina
      { ingredientId: 2, quantity: 0.7 },       // 700g azúcar
      { ingredientId: 8, quantity: 0.3 },       // 300g cacao
      { ingredientId: 3, quantity: 12 },        // 12 huevos
      { ingredientId: 4, quantity: 0.5 },       // 500g mantequilla
      { ingredientId: 11, quantity: 0.4 },      // 400ml leche
      { ingredientId: 16, quantity: 0.6 },      // 600g chocolate (cobertura)
      { ingredientId: 12, quantity: 0.3 }       // 300ml crema (relleno)
    ]
  },
  {
    id: 6,
    name: "Torta Tres Leches",
    description: "Torta clásica (22cm) - 10 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.5 },      // 500g harina
      { ingredientId: 2, quantity: 0.4 },       // 400g azúcar
      { ingredientId: 3, quantity: 8 },         // 8 huevos
      { ingredientId: 11, quantity: 0.5 },      // 500ml leche evaporada
      { ingredientId: 26, quantity: 0.3 },      // 300ml leche condensada (nuevo ingrediente)
      { ingredientId: 12, quantity: 0.4 },      // 400ml crema
      { ingredientId: 9, quantity: 0.01 }       // 10ml vainilla
    ]
  },
  {
    id: 7,
    name: "Torta Oreo",
    description: "Torta de galletas Oreo (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },      // 600g harina
      { ingredientId: 2, quantity: 0.5 },       // 500g azúcar
      { ingredientId: 3, quantity: 10 },        // 10 huevos
      { ingredientId: 4, quantity: 0.4 },       // 400g mantequilla
      { ingredientId: 27, quantity: 0.3 },      // 300g galletas Oreo (nuevo ingrediente)
      { ingredientId: 12, quantity: 0.5 },      // 500ml crema
      { ingredientId: 16, quantity: 0.2 }       // 200g chocolate blanco
    ]
  },
  {
    id: 8,
    name: "Torta de Vainilla",
    description: "Torta clásica (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.7 },      // 700g harina
      { ingredientId: 2, quantity: 0.6 },       // 600g azúcar
      { ingredientId: 3, quantity: 10 },        // 10 huevos
      { ingredientId: 4, quantity: 0.5 },       // 500g mantequilla
      { ingredientId: 9, quantity: 0.02 },      // 20ml vainilla
      { ingredientId: 11, quantity: 0.3 },      // 300ml leche
      { ingredientId: 12, quantity: 0.4 }       // 400ml crema (relleno)
    ]
  },
  {
    id: 9,
    name: "Torta Red Velvet",
    description: "Torta aterciopelada (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },      // 600g harina
      { ingredientId: 2, quantity: 0.5 },       // 500g azúcar
      { ingredientId: 3, quantity: 8 },         // 8 huevos
      { ingredientId: 4, quantity: 0.4 },       // 400g mantequilla
      { ingredientId: 8, quantity: 0.05 },      // 50g cacao
      { ingredientId: 19, quantity: 0.01 },     // 10ml colorante rojo
      { ingredientId: 11, quantity: 0.3 },      // 300ml suero de leche
      { ingredientId: 28, quantity: 0.4 }       // 400g queso crema (frosting)
    ]
  },
  {
    id: 10,
    name: "Torta de Durazno",
    description: "Torta con relleno de durazno (22cm) - 10 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.6 },      // 600g harina
      { ingredientId: 2, quantity: 0.5 },       // 500g azúcar
      { ingredientId: 3, quantity: 8 },         // 8 huevos
      { ingredientId: 4, quantity: 0.4 },       // 400g mantequilla
      { ingredientId: 14, quantity: 0.5 },      // 500g mermelada de durazno
      { ingredientId: 12, quantity: 0.4 },      // 400ml crema
      { ingredientId: 29, quantity: 0.3 }       // 300g duraznos frescos
    ]
  },
  {
    id: 11,
    name: "Soufflé de Chantilly",
    description: "Torta esponjosa (20cm) - 8 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 3, quantity: 12 },        // 12 huevos (claras)
      { ingredientId: 2, quantity: 0.3 },       // 300g azúcar
      { ingredientId: 12, quantity: 0.6 },      // 600ml crema chantilly
      { ingredientId: 30, quantity: 0.02 },     // 20g gelatina sin sabor
      { ingredientId: 9, quantity: 0.01 }       // 10ml vainilla
    ]
  },
  {
    id: 12,
    name: "Torta Moka",
    description: "Torta de café (24cm) - 12 porciones",
    brand: "Repostería",
    recipe: [
      { ingredientId: 1, quantity: 0.7 },      // 700g harina
      { ingredientId: 2, quantity: 0.6 },       // 600g azúcar
      { ingredientId: 3, quantity: 10 },        // 10 huevos
      { ingredientId: 4, quantity: 0.5 },       // 500g mantequilla
      { ingredientId: 31, quantity: 0.05 },     // 50g café instantáneo
      { ingredientId: 16, quantity: 0.4 },      // 400g chocolate
      { ingredientId: 12, quantity: 0.5 }       // 500ml crema
    ]
  }
];

export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [activeView, setActiveView] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<
    { ingredient: Ingredient; missingAmount: number }[]
  >([]);
  const [dueDate, setDueDate] = useState("");
  const [showIngredientsUsage, setShowIngredientsUsage] = useState<
    number | null
  >(null);
  const [showTotalIngredients, setShowTotalIngredients] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockProductions: Production[] = [
        {
          id: 1,
          products: [
            { ...mockProducts[0], quantity: 500, canProduce: false },
            { ...mockProducts[1], quantity: 200, canProduce: false },
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
            { ...mockProducts[2], quantity: 300, canProduce: false },
            { ...mockProducts[4], quantity: 150, canProduce: false },
          ],
          status: "pending",
          createdAt: "2023-10-02",
          dueDate: "2023-10-12",
          missingIngredients: [
            { ingredient: mockIngredients[2], missingAmount: 30 },
            { ingredient: mockIngredients[5], missingAmount: 0.5 },
          ],
          ingredientsUsage: [
            { ingredient: mockIngredients[0], amountUsed: 7.5 },
            { ingredient: mockIngredients[1], amountUsed: 3.9 },
            { ingredient: mockIngredients[3], amountUsed: 2.25 },
          ],
        },
        {
          id: 3,
          products: [
            { ...mockProducts[3], quantity: 50, canProduce: false },
            { ...mockProducts[5], quantity: 100, canProduce: false },
          ],
          status: "pending",
          createdAt: "2023-10-03",
          dueDate: "2023-10-15",
          missingIngredients: [
            { ingredient: mockIngredients[0], missingAmount: 5 },
            { ingredient: mockIngredients[4], missingAmount: 0.3 },
          ],
          ingredientsUsage: [
            { ingredient: mockIngredients[0], amountUsed: 14 },
            { ingredient: mockIngredients[2], amountUsed: 250 },
            { ingredient: mockIngredients[4], amountUsed: 0.5 },
          ],
        },
        {
          id: 4,
          products: [
            { ...mockProducts[6], quantity: 200, canProduce: false },
            { ...mockProducts[7], quantity: 120, canProduce: false },
          ],
          status: "pending",
          createdAt: "2023-10-04",
          dueDate: "2023-10-18",
          missingIngredients: [
            { ingredient: mockIngredients[7], missingAmount: 2 },
            { ingredient: mockIngredients[9], missingAmount: 0.1 },
          ],
          ingredientsUsage: [
            { ingredient: mockIngredients[0], amountUsed: 28.4 },
            { ingredient: mockIngredients[2], amountUsed: 160 },
            { ingredient: mockIngredients[4], amountUsed: 0.6 },
          ],
        },
      ];
      setProductions(mockProductions);
    }, 1000);
  }, []);

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateMissingIngredients = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    const missing: { ingredient: Ingredient; missingAmount: number }[] = [];

    products.forEach((product) => {
      if (product.quantity !== null) {
        product.recipe.forEach((item) => {
          const totalNeeded = item.quantity * product.quantity;
          requiredIngredients[item.ingredientId] =
            (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
        });
      }
    });

    Object.entries(requiredIngredients).forEach(
      ([ingredientId, amountNeeded]) => {
        const ingredient = ingredients.find(
          (i) => i.id === parseInt(ingredientId)
        );
        if (ingredient && ingredient.currentStock < amountNeeded) {
          missing.push({
            ingredient,
            missingAmount: amountNeeded - ingredient.currentStock,
          });
        }
      }
    );

    setMissingIngredients(missing);
    return missing;
  };

  const calculateIngredientsUsage = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    const ingredientsUsage: { ingredient: Ingredient; amountUsed: number }[] =
      [];

    products.forEach((product) => {
      if (product.quantity !== null) {
        product.recipe.forEach((item) => {
          const totalNeeded = item.quantity * product.quantity;
          requiredIngredients[item.ingredientId] =
            (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
        });
      }
    });

    Object.entries(requiredIngredients).forEach(
      ([ingredientId, amountNeeded]) => {
        const ingredient = ingredients.find(
          (i) => i.id === parseInt(ingredientId)
        );
        if (ingredient) {
          const amountToUse = Math.min(amountNeeded, ingredient.currentStock);
          if (amountToUse > 0) {
            ingredientsUsage.push({
              ingredient,
              amountUsed: amountToUse,
            });
          }
        }
      }
    );

    return ingredientsUsage;
  };

  const calculateTotalIngredientsUsage = () => {
    const totalUsage: Record<
      number,
      { ingredient: Ingredient; total: number }
    > = {};

    productions.forEach((production) => {
      if (production.ingredientsUsage) {
        production.ingredientsUsage.forEach(({ ingredient, amountUsed }) => {
          if (!totalUsage[ingredient.id]) {
            totalUsage[ingredient.id] = {
              ingredient,
              total: 0,
            };
          }
          totalUsage[ingredient.id].total += amountUsed;
        });
      }
    });

    return Object.values(totalUsage);
  };

  const updateProductionStatus = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    products.forEach((product) => {
      if (product.quantity !== null) {
        product.recipe.forEach((item) => {
          const totalNeeded = item.quantity * product.quantity;
          requiredIngredients[item.ingredientId] =
            (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
        });
      }
    });

    return products.map((product) => {
      if (product.quantity === null) {
        return { ...product, canProduce: false, missingIngredients: [] };
      }

      const missingForProduct: { ingredientId: number; missing: number }[] = [];

      product.recipe.forEach((item) => {
        const ingredient = ingredients.find((i) => i.id === item.ingredientId);
        if (ingredient) {
          const totalNeeded = requiredIngredients[item.ingredientId] || 0;
          if (ingredient.currentStock < totalNeeded) {
            const missingAmount = totalNeeded - ingredient.currentStock;
            missingForProduct.push({
              ingredientId: item.ingredientId,
              missing: missingAmount,
            });
          }
        }
      });

      return {
        ...product,
        canProduce: missingForProduct.length === 0,
        missingIngredients:
          missingForProduct.length > 0 ? missingForProduct : undefined,
      };
    });
  };

  const selectProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        const updated = prev.filter((p) => p.id !== product.id);
        const withStatus = updateProductionStatus(updated);
        calculateMissingIngredients(withStatus);
        return withStatus;
      } else {
        const newProduct = {
          ...product,
          quantity: null,
          canProduce: false,
          missingIngredients: [],
        };
        const updated = [...prev, newProduct];
        const withStatus = updateProductionStatus(updated);
        calculateMissingIngredients(withStatus);
        return withStatus;
      }
    });
  };

  const updateQuantity = (id: number, quantity: number | null) => {
    if (quantity === null || quantity <= 0) {
      setSelectedProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        const withStatus = updateProductionStatus(updated);
        calculateMissingIngredients(withStatus);
        return withStatus;
      });
      return;
    }

    setSelectedProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, quantity } : p));
      const withStatus = updateProductionStatus(updated);
      calculateMissingIngredients(withStatus);
      return withStatus;
    });
  };

  const removeProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      const withStatus = updateProductionStatus(updated);
      calculateMissingIngredients(withStatus);
      return withStatus;
    });
  };

  const addProduction = () => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const hasEmptyQuantities = selectedProducts.some(
      (p) => p.quantity === null
    );
    if (hasEmptyQuantities) {
      toast.error("Todos los productos deben tener una cantidad asignada");
      return;
    }

    const missing = calculateMissingIngredients(selectedProducts);
    const ingredientsUsage = calculateIngredientsUsage(selectedProducts);

    const productionWithId: Production = {
      id: Date.now(),
      products: selectedProducts.filter(
        (p) => p.quantity !== null
      ) as SelectedProduct[],
      status: missing.length > 0 ? "pending" : "in_progress",
      createdAt: new Date().toISOString(),
      dueDate:
        dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      missingIngredients: missing.length > 0 ? missing : undefined,
      ingredientsUsage:
        ingredientsUsage.length > 0 ? ingredientsUsage : undefined,
    };

    setProductions((prev) => [...prev, productionWithId]);
    toast.success(
      `Producción ${missing.length > 0 ? "pendiente" : "iniciada"} creada`
    );

    setSelectedProducts([]);
    setIsModalOpen(false);
    setDueDate("");
    setShowTotalIngredients(false);
  };

  const startProduction = (productionId: number) => {
    setProductions((prev) =>
      prev.map((production) => {
        if (production.id !== productionId) return production;

        const updatedIngredients = [...ingredients];
        let canProduce = true;

        production.products.forEach((product) => {
          product.recipe.forEach((item) => {
            const ingredientIndex = updatedIngredients.findIndex(
              (i) => i.id === item.ingredientId
            );
            if (ingredientIndex !== -1) {
              const totalNeeded = item.quantity * product.quantity;
              if (
                updatedIngredients[ingredientIndex].currentStock < totalNeeded
              ) {
                canProduce = false;
              }
            }
          });
        });

        if (!canProduce) {
          toast.error("No hay suficiente stock");
          return production;
        }

        const ingredientsUsage: {
          ingredient: Ingredient;
          amountUsed: number;
        }[] = [];

        production.products.forEach((product) => {
          product.recipe.forEach((item) => {
            const ingredientIndex = updatedIngredients.findIndex(
              (i) => i.id === item.ingredientId
            );
            if (ingredientIndex !== -1) {
              const totalUsed = item.quantity * product.quantity;
              updatedIngredients[ingredientIndex].currentStock = parseFloat(
                (
                  updatedIngredients[ingredientIndex].currentStock - totalUsed
                ).toFixed(4)
              );

              const existingUsage = ingredientsUsage.find(
                (i) => i.ingredient.id === item.ingredientId
              );
              if (existingUsage) {
                existingUsage.amountUsed += totalUsed;
              } else {
                ingredientsUsage.push({
                  ingredient: updatedIngredients[ingredientIndex],
                  amountUsed: totalUsed,
                });
              }
            }
          });
        });

        setIngredients(updatedIngredients);
        return {
          ...production,
          status: "in_progress",
          missingIngredients: undefined,
          ingredientsUsage,
        };
      })
    );
  };

  const filteredProductions = productions.filter((production) => {
    if (activeView === "pending") return production.status === "pending";
    if (activeView === "in_progress")
      return production.status === "in_progress";
    if (activeView === "completed") return production.status === "completed";
    return true;
  });

  const currentIngredientsUsage = calculateIngredientsUsage(selectedProducts);
  const totalIngredientsUsage = calculateTotalIngredientsUsage();

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50 ">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/production">
              Producción
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Producción</h2>
            <small className="text-sm font-medium text-gray-600">
              Aquí podrás gestionar las producciones.
            </small>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAllIngredients(!showAllIngredients)}
            className="flex items-center gap-2"
          >
            {showAllIngredients ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Ocultar ingredientes totales
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mostrar ingredientes totales
              </>
            )}
          </Button>
        </div>
      </div>

      {showAllIngredients && totalIngredientsUsage.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <span>Ingredientes utilizados en todas las producciones</span>
              <Badge variant="outline">
                {totalIngredientsUsage.length} ingredientes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {totalIngredientsUsage.map(({ ingredient, total }) => (
                <div key={ingredient.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-sm text-gray-600">
                      {total.toFixed(2)} {ingredient.unit}
                    </span>
                  </div>
                  <Progress
                    value={(total / ingredient.currentStock) * 100}
                    className="h-2 mt-2"
                    indicatorClassName="bg-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 {ingredient.unit}</span>
                    <span>
                      {ingredient.currentStock.toFixed(2)} {ingredient.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 mb-4">
        <Button
          variant={activeView === "all" ? "default" : "outline"}
          onClick={() => setActiveView("all")}
        >
          Todas
        </Button>
        <Button
          variant={activeView === "pending" ? "default" : "outline"}
          onClick={() => setActiveView("pending")}
        >
          Pendientes
        </Button>
        <Button
          variant={activeView === "in_progress" ? "default" : "outline"}
          onClick={() => setActiveView("in_progress")}
        >
          En Proceso
        </Button>
        <Button
          variant={activeView === "completed" ? "default" : "outline"}
          onClick={() => setActiveView("completed")}
        >
          Completadas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProductions.map((production) => (
          <ProductionCard
            key={production.id}
            production={production}
            ingredients={ingredients}
            onStartProduction={startProduction}
            showIngredientsUsage={showIngredientsUsage === production.id}
            onToggleIngredientsUsage={() =>
              setShowIngredientsUsage(
                showIngredientsUsage === production.id ? null : production.id
              )
            }
          />
        ))}
      </div>

      <Button
        className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-xl">+</span>
      </Button>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setSelectedProducts([]);
            setMissingIngredients([]);
            setDueDate("");
            setShowTotalIngredients(false);
          }
        }}
      >
        <DialogContent className="w-[98vw] max-w-6xl h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-4">
            <DialogTitle className="text-xl">
              Crear Nueva Producción
            </DialogTitle>
            <DialogDescription>
              Seleccione los productos a producir
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden gap-0 h-full">
            {/* Columna izquierda - Búsqueda y productos */}
            <div className="w-1/3 flex flex-col border-r overflow-hidden">
              <div className="p-4 space-y-2 bg-gray-50">
                <Label className="text-sm font-medium">Buscar productos</Label>
                <Input
                  placeholder="Nombre o marca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center p-4 text-gray-500 h-full flex items-center justify-center">
                    No se encontraron productos
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedProducts.some((p) => p.id === product.id)
                            ? "bg-blue-50 border border-blue-300"
                            : "hover:bg-gray-50 border border-gray-200"
                        }`}
                        onClick={() => selectProduct(product)}
                      >
                        <div className="h-12 w-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">
                              Sin imagen
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna central - Productos seleccionados */}
            <div className="w-1/3 flex flex-col border-r overflow-hidden">
              <div className="p-4 bg-gray-50">
                <Label className="text-sm font-medium">
                  Productos seleccionados ({selectedProducts.length})
                </Label>
                <div className="mt-2">
                  <Label className="text-sm font-medium">Fecha límite</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedProducts.length === 0 ? (
                  <div className="text-center p-4 text-gray-500 h-full flex items-center justify-center">
                    No hay productos seleccionados
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-xs text-gray-500">
                              {product.brand}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity ?? ""}
                              onChange={(e) =>
                                updateQuantity(
                                  product.id,
                                  e.target.value === ""
                                    ? null
                                    : parseInt(e.target.value)
                                )
                              }
                              className="w-20 h-8"
                              placeholder="Cantidad"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 text-red-500"
                              onClick={() => removeProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 text-sm">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              product.canProduce
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.canProduce
                              ? "Stock suficiente"
                              : "Faltan ingredientes"}
                          </div>

                          <div className="mt-2 text-xs text-gray-600">
                            <p className="font-medium">Total requerido:</p>
                            <ul className="mt-1 space-y-1">
                              {product.recipe.map((item) => {
                                const ingredient = ingredients.find(
                                  (i) => i.id === item.ingredientId
                                );
                                const totalNeeded =
                                  item.quantity * (product.quantity || 0);
                                const isMissing =
                                  product.missingIngredients?.some(
                                    (m) => m.ingredientId === item.ingredientId
                                  );

                                return (
                                  <li
                                    key={item.ingredientId}
                                    className={
                                      isMissing
                                        ? "text-red-600 font-semibold"
                                        : ""
                                    }
                                  >
                                    {ingredient?.name ||
                                      "Ingrediente desconocido"}
                                    :
                                    <span className="font-medium">
                                      {" "}
                                      {totalNeeded.toFixed(2)}{" "}
                                      {ingredient?.unit}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Resumen e ingredientes */}
            <div className="w-1/3 flex flex-col overflow-hidden bg-gray-50 border-l">
              <div className="p-4 space-y-4 h-full flex flex-col">
                {/* Resumen de Producción */}
                <Card className="bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between">
                      Resumen de Producción
                      <Badge variant="secondary" className="ml-2">
                        {selectedProducts.length} productos
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">
                          Unidades totales
                        </span>
                        <p className="font-medium text-lg">
                          {selectedProducts
                            .reduce((sum, p) => sum + (p.quantity || 0), 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-gray-500">
                          Ingredientes
                        </span>
                        <p className="font-medium text-lg">
                          {currentIngredientsUsage.length}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estado de producción</span>
                      <span
                        className={`text-sm font-medium ${
                          missingIngredients.length > 0
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {missingIngredients.length > 0
                          ? "Pendiente"
                          : "Lista para iniciar"}
                      </span>
                    </div>

                    {missingIngredients.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Faltantes</span>
                        <span className="text-sm font-medium text-red-600">
                          {missingIngredients.length} ingredientes
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sección de Ingredientes */}
                <div className="flex-1 overflow-y-auto space-y-4">
                  {/* Consumo de Ingredientes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        <span>Consumo de Ingredientes</span>
                        <span className="text-xs text-gray-500">
                          {currentIngredientsUsage.length} ingredientes
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentIngredientsUsage.map(
                        ({ ingredient, amountUsed }) => {
                          const stock = ingredient.currentStock;
                          const exceeds = amountUsed > stock;
                          const missing = exceeds ? amountUsed - stock : 0;
                          const percentage = Math.min(
                            150,
                            (amountUsed / stock) * 100
                          );

                          return (
                            <div key={ingredient.id} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  {ingredient.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-xs ${
                                      exceeds
                                        ? "text-red-600 font-bold"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {amountUsed.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    /
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {stock.toFixed(2)} {ingredient.unit}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Progress
                                  value={percentage > 100 ? 100 : percentage}
                                  className="h-2 flex-1"
                                  indicatorClassName={
                                    exceeds
                                      ? "bg-red-500"
                                      : percentage > 70
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }
                                />
                                <span
                                  className={`text-xs ${
                                    exceeds ? "text-red-600" : "text-gray-500"
                                  }`}
                                >
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>

                              {exceeds && (
                                <div className="text-xs text-red-600 text-right">
                                  Faltan: {missing.toFixed(2)} {ingredient.unit}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </CardContent>
                  </Card>

                  {/* Ingredientes Faltantes - Solo si hay */}
                  {missingIngredients.length > 0 && (
                    <Card className="border-red-100 bg-red-50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Ingredientes Faltantes
                          </CardTitle>
                          <Badge variant="destructive" className="text-xs">
                            {missingIngredients.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-2">
                        {missingIngredients.map(
                          ({ ingredient, missingAmount }) => (
                            <div
                              key={ingredient.id}
                              className="flex justify-between items-center"
                            >
                              <span className="text-sm font-medium">
                                {ingredient.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-red-600">
                                  {missingAmount.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {ingredient.unit}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Resumen de Stock después de producción */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Stock después de producción
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentIngredientsUsage.map(
                        ({ ingredient, amountUsed }) => {
                          const newStock = ingredient.currentStock - amountUsed;
                          const isLow = newStock < ingredient.minStock;
                          const percentage =
                            (newStock / ingredient.minStock) * 100;

                          return (
                            <div key={ingredient.id} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                  {ingredient.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-xs ${
                                      isLow
                                        ? "text-red-600 font-bold"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {newStock.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    /
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {ingredient.minStock.toFixed(2)} min
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Progress
                                  value={percentage > 100 ? 100 : percentage}
                                  className="h-2 flex-1"
                                  indicatorClassName={
                                    isLow ? "bg-red-500" : "bg-green-500"
                                  }
                                />
                                <span
                                  className={`text-xs ${
                                    isLow ? "text-red-600" : "text-gray-500"
                                  }`}
                                >
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>

                              {isLow && (
                                <div className="text-xs text-red-600 text-right">
                                  Stock bajo mínimo
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Botones de acción */}
                <div className="pt-4 border-t">
                  <div className="flex flex-col gap-2">
                    {missingIngredients.length > 0 && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setShowPurchaseDialog(true)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Comprar ingredientes faltantes
                      </Button>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedProducts([]);
                          setMissingIngredients([]);
                          setDueDate("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant={
                          missingIngredients.length > 0 ? "default" : "default"
                        }
                        className="flex-1"
                        onClick={addProduction}
                      >
                        {missingIngredients.length > 0
                          ? "Crear como pendiente"
                          : "Iniciar producción"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generar Orden de Compra</DialogTitle>
            <DialogDescription>
              Se requieren los siguientes ingredientes:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="font-medium mb-2">Ingredientes faltantes:</h4>
            <ul className="space-y-2">
              {missingIngredients.map(({ ingredient, missingAmount }) => (
                <li key={ingredient.id} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="font-medium">
                    {missingAmount.toFixed(2)} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPurchaseDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast.success("Orden de compra generada");
                setShowPurchaseDialog(false);
              }}
            >
              Confirmar Orden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductionCard({
  production,
  ingredients,
  onStartProduction,
  showIngredientsUsage,
  onToggleIngredientsUsage,
}: {
  production: Production;
  ingredients: Ingredient[];
  onStartProduction: (id: number) => void;
  showIngredientsUsage: boolean;
  onToggleIngredientsUsage: () => void;
}) {
  const cardColor = {
    pending: "bg-yellow-100",
    in_progress: "bg-blue-100",
    completed: "bg-green-100",
  }[production.status];

  return (
    <div
      className={`${cardColor} rounded-lg shadow p-4 transition-transform transform hover:scale-105`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Producción #{production.id}
          </h3>
          <p className="text-sm text-gray-600">
            Estado:{" "}
            {production.status === "pending"
              ? "Pendiente"
              : production.status === "in_progress"
              ? "En Proceso"
              : "Completada"}
          </p>
          <p className="text-sm text-gray-600">
            Fecha: {new Date(production.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Fecha límite: {new Date(production.dueDate).toLocaleDateString()}
          </p>
        </div>

        {production.status === "pending" && (
          <Button size="sm" onClick={() => onStartProduction(production.id)}>
            Iniciar Producción
          </Button>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Productos:</h4>
        <ul className="list-disc pl-5">
          {production.products.map((product) => (
            <li key={product.id} className="text-sm">
              {product.name} - {product.quantity} unidades
            </li>
          ))}
        </ul>
      </div>

      {production.missingIngredients &&
        production.missingIngredients.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 rounded">
            <h4 className="font-medium text-sm text-red-700">
              Faltan ingredientes:
            </h4>
            <ul className="list-disc pl-5 text-xs text-red-700">
              {production.missingIngredients.map(
                ({ ingredient, missingAmount }) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {missingAmount.toFixed(2)}{" "}
                    {ingredient.unit}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleIngredientsUsage}
          className="text-blue-600 hover:text-blue-800"
        >
          {showIngredientsUsage
            ? "Ocultar ingredientes"
            : "Mostrar ingredientes a usar"}
        </Button>

        {showIngredientsUsage && production.ingredientsUsage && (
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <h4 className="font-medium text-sm text-blue-700">
              Ingredientes a utilizar:
            </h4>
            <ul className="list-disc pl-5 text-xs text-blue-700">
              {production.ingredientsUsage.map(({ ingredient, amountUsed }) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {amountUsed.toFixed(2)} {ingredient.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
