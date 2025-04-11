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
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockIngredients, mockBases, mockProducts } from "./data";
import { ReusableDialog } from "@/components/ReusableDialog";

interface Ingredient {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  minStock: number;
}

interface Base {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  minStock: number;
  recipe: {  // Hacer recipe obligatorio
    ingredientId: number;
    quantity: number;
  }[];
}

interface RecipeItem {
  ingredientId: number;
  quantity: number;
}

interface BaseRequirement {
  baseId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  image?: string;
  recipe: RecipeItem[];
  baseRequirements?: BaseRequirement[];
}

interface MissingItem {
  ingredientId?: number;
  baseId?: number;
  missing: number;
}

interface SelectedProduct extends Product {
  quantity: number;
  canProduce: boolean;
  missingItems: MissingItem[];
}

interface IngredientUsage {
  ingredient: Ingredient;
  amountUsed: number;
}

interface BaseUsage {
  base: Base;
  amountUsed: number;
}

interface MissingIngredient {
  ingredient: Ingredient;
  missingAmount: number;
}

interface MissingBase {
  base: Base;
  missingAmount: number;
}

interface Production {
  id: number;
  name: string;
  products: SelectedProduct[];
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  dueDate: string;
  missingIngredients?: MissingIngredient[];
  missingBases?: MissingBase[];
  ingredientsUsage?: IngredientUsage[];
  basesUsage?: BaseUsage[];
}

export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [activeView, setActiveView] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [bases, setBases] = useState<Base[]>(mockBases);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<MissingIngredient[]>([]);
  const [missingBases, setMissingBases] = useState<MissingBase[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [showIngredientsUsage, setShowIngredientsUsage] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      const mockProductions: Production[] = [
        {
          id: 1,
          name: "Producción #1",
          products: [],
          status: "pending",
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          name: "Producción #2",
          products: [],
          status: "in_progress",
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          name: "Producción #3",
          products: [],
          status: "completed",
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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

  const calculateMissingItems = (products: SelectedProduct[]) => {
    // Calcular ingredientes faltantes
    const requiredIngredients: Record<number, number> = {};
    const missingIngs: MissingIngredient[] = [];

    // Calcular bases faltantes
    const requiredBases: Record<number, number> = {};
    const missingBs: MissingBase[] = [];

    products.forEach((product) => {
      // Sumar ingredientes directos
      product.recipe.forEach((item) => {
        const totalNeeded = item.quantity * product.quantity;
        requiredIngredients[item.ingredientId] =
          (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
      });

      // Sumar bases requeridas
      product.baseRequirements?.forEach((baseReq) => {
        const totalNeeded = baseReq.quantity * product.quantity;
        requiredBases[baseReq.baseId] =
          (requiredBases[baseReq.baseId] || 0) + totalNeeded;
      });
    });

    // Verificar ingredientes
    Object.entries(requiredIngredients).forEach(([ingredientId, amountNeeded]) => {
      const ingredient = ingredients.find((i) => i.id === parseInt(ingredientId));
      if (ingredient && ingredient.currentStock < amountNeeded) {
        missingIngs.push({
          ingredient,
          missingAmount: amountNeeded - ingredient.currentStock,
        });
      }
    });

    // Verificar bases
    Object.entries(requiredBases).forEach(([baseId, amountNeeded]) => {
      const base = bases.find((b) => b.id === parseInt(baseId));
      if (base && base.currentStock < amountNeeded) {
        missingBs.push({
          base,
          missingAmount: amountNeeded - base.currentStock,
        });
      }
    });

    setMissingIngredients(missingIngs);
    setMissingBases(missingBs);
    return { missingIngredients: missingIngs, missingBases: missingBs };
  };

  const calculateIngredientsUsage = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    const ingredientsUsage: IngredientUsage[] = [];

    products.forEach((product) => {
      // Sumar ingredientes directos
      product.recipe.forEach((item) => {
        const totalNeeded = item.quantity * product.quantity;
        requiredIngredients[item.ingredientId] =
          (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
      });

      // Sumar ingredientes de las bases requeridas
      product.baseRequirements?.forEach((baseReq) => {
        const base = bases.find(b => b.id === baseReq.baseId);
        if (base && base.recipe) { // <- Agregamos esta validación
          base.recipe.forEach(item => {
            const totalNeeded = item.quantity * baseReq.quantity * product.quantity;
            requiredIngredients[item.ingredientId] =
              (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
          });
        }
      });
    });

    Object.entries(requiredIngredients).forEach(([ingredientId, amountNeeded]) => {
      const ingredient = ingredients.find((i) => i.id === parseInt(ingredientId));
      if (ingredient) {
        const amountToUse = Math.min(amountNeeded, ingredient.currentStock);
        if (amountToUse > 0) {
          ingredientsUsage.push({
            ingredient,
            amountUsed: amountToUse,
          });
        }
      }
    });

    return ingredientsUsage;
  };

  const calculateBasesUsage = (products: SelectedProduct[]) => {
    const requiredBases: Record<number, number> = {};
    const basesUsage: BaseUsage[] = [];

    products.forEach((product) => {
      product.baseRequirements?.forEach((baseReq) => {
        const totalNeeded = baseReq.quantity * product.quantity;
        requiredBases[baseReq.baseId] =
          (requiredBases[baseReq.baseId] || 0) + totalNeeded;
      });
    });

    Object.entries(requiredBases).forEach(([baseId, amountNeeded]) => {
      const base = bases.find((b) => b.id === parseInt(baseId));
      if (base) {
        const amountToUse = Math.min(amountNeeded, base.currentStock);
        if (amountToUse > 0) {
          basesUsage.push({
            base,
            amountUsed: amountToUse,
          });
        }
      }
    });

    return basesUsage;
  };

  const updateProductionStatus = (products: SelectedProduct[]) => {
    return products.map((product) => {
      const missingItems: MissingItem[] = [];

      // Verificar ingredientes directos
      product.recipe.forEach((item) => {
        const ingredient = ingredients.find((i) => i.id === item.ingredientId);
        if (ingredient) {
          const totalNeeded = item.quantity * product.quantity;
          if (ingredient.currentStock < totalNeeded) {
            missingItems.push({
              ingredientId: item.ingredientId,
              missing: totalNeeded - ingredient.currentStock,
            });
          }
        }
      });

      // Verificar bases requeridas
      product.baseRequirements?.forEach((baseReq) => {
        const base = bases.find(b => b.id === baseReq.baseId);
        if (base) {
          const totalNeeded = baseReq.quantity * product.quantity;
          if (base.currentStock < totalNeeded) {
            missingItems.push({
              baseId: baseReq.baseId,
              missing: totalNeeded - base.currentStock,
            });
          }
        }
      });

      return {
        ...product,
        canProduce: missingItems.length === 0,
        missingItems: missingItems.length > 0 ? missingItems : [],
      };
    });
  };

  const selectProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        return prev;
      } else {
        const newProduct = {
          ...product,
          quantity: 1,
          canProduce: false,
          missingItems: [],
        };
        const updated = [...prev, newProduct];
        const withStatus = updateProductionStatus(updated);
        calculateMissingItems(withStatus);
        return withStatus;
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setSelectedProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, quantity } : p));
      const withStatus = updateProductionStatus(updated);
      calculateMissingItems(withStatus);
      return withStatus;
    });
  };

  const removeProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      const withStatus = updateProductionStatus(updated);
      calculateMissingItems(withStatus);
      return withStatus;
    });
  };

  const addProduction = () => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const { missingIngredients: missingIngs, missingBases: missingBs } = calculateMissingItems(selectedProducts);
    const ingredientsUsage = calculateIngredientsUsage(selectedProducts);
    const basesUsage = calculateBasesUsage(selectedProducts);
    const nextId = productions.length > 0 ? Math.max(...productions.map((p) => p.id)) + 1 : 1;

    const productionWithId: Production = {
      id: nextId,
      name: `Producción #${nextId}`,
      products: selectedProducts,
      status: missingIngs.length > 0 || missingBs.length > 0 ? "pending" : "in_progress",
      createdAt: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      missingIngredients: missingIngs.length > 0 ? missingIngs : undefined,
      missingBases: missingBs.length > 0 ? missingBs : undefined,
      ingredientsUsage: ingredientsUsage.length > 0 ? ingredientsUsage : undefined,
      basesUsage: basesUsage.length > 0 ? basesUsage : undefined,
    };

    setProductions((prev) => [...prev, productionWithId]);
    toast.success(
      `Producción ${missingIngs.length > 0 || missingBs.length > 0 ? "pendiente" : "iniciada"} creada`
    );

    setSelectedProducts([]);
    setIsModalOpen(false);
    setDueDate("");
    setCurrentStep(1);
  };

  const startProduction = (productionId: number) => {
    setProductions((prev) =>
      prev.map((production) => {
        if (production.id !== productionId) return production;

        const updatedIngredients = [...ingredients];
        const updatedBases = [...bases];
        let canProduce = true;

        // Verificar si podemos producir
        production.products.forEach((product) => {
          // Verificar ingredientes directos
          product.recipe.forEach((item) => {
            const ingredient = updatedIngredients.find((i) => i.id === item.ingredientId);
            if (ingredient && ingredient.currentStock < item.quantity * product.quantity) {
              canProduce = false;
            }
          });

          // Verificar bases requeridas
          product.baseRequirements?.forEach((baseReq) => {
            const base = updatedBases.find(b => b.id === baseReq.baseId);
            if (base && base.currentStock < baseReq.quantity * product.quantity) {
              canProduce = false;
            }
          });
        });

        if (!canProduce) {
          toast.error("No hay suficiente stock de ingredientes o bases");
          return production;
        }

        const ingredientsUsage: IngredientUsage[] = [];
        const basesUsage: BaseUsage[] = [];

        // Consumir ingredientes directos
        production.products.forEach((product) => {
          product.recipe.forEach((item) => {
            const ingredientIndex = updatedIngredients.findIndex((i) => i.id === item.ingredientId);
            if (ingredientIndex !== -1) {
              const totalUsed = item.quantity * product.quantity;
              updatedIngredients[ingredientIndex].currentStock = parseFloat(
                (updatedIngredients[ingredientIndex].currentStock - totalUsed).toFixed(4)
              );

              const existingUsage = ingredientsUsage.find((i) => i.ingredient.id === item.ingredientId);
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

          // Consumir bases
          product.baseRequirements?.forEach((baseReq) => {
            const baseIndex = updatedBases.findIndex(b => b.id === baseReq.baseId);
            if (baseIndex !== -1) {
              const totalUsed = baseReq.quantity * product.quantity;
              updatedBases[baseIndex].currentStock = parseFloat(
                (updatedBases[baseIndex].currentStock - totalUsed).toFixed(4)
              );

              const existingUsage = basesUsage.find((b) => b.base.id === baseReq.baseId);
              if (existingUsage) {
                existingUsage.amountUsed += totalUsed;
              } else {
                basesUsage.push({
                  base: updatedBases[baseIndex],
                  amountUsed: totalUsed,
                });
              }

              // Consumir ingredientes de las bases
              const base = updatedBases[baseIndex];
              base.recipe.forEach(item => {
                const ingredientIndex = updatedIngredients.findIndex(i => i.id === item.ingredientId);
                if (ingredientIndex !== -1) {
                  const totalIngredientUsed = item.quantity * totalUsed;
                  updatedIngredients[ingredientIndex].currentStock = parseFloat(
                    (updatedIngredients[ingredientIndex].currentStock - totalIngredientUsed).toFixed(4)
                  );

                  const existingIngUsage = ingredientsUsage.find(i => i.ingredient.id === item.ingredientId);
                  if (existingIngUsage) {
                    existingIngUsage.amountUsed += totalIngredientUsed;
                  } else {
                    ingredientsUsage.push({
                      ingredient: updatedIngredients[ingredientIndex],
                      amountUsed: totalIngredientUsed,
                    });
                  }
                }
              });
            }
          });
        });

        setIngredients(updatedIngredients);
        setBases(updatedBases);
        return {
          ...production,
          status: "in_progress",
          missingIngredients: undefined,
          missingBases: undefined,
          ingredientsUsage,
          basesUsage,
        };
      })
    );
  };

  const filteredProductions = productions.filter((production) => {
    if (activeView === "pending") return production.status === "pending";
    if (activeView === "in_progress") return production.status === "in_progress";
    if (activeView === "completed") return production.status === "completed";
    return true;
  });

  const currentIngredientsUsage = calculateIngredientsUsage(selectedProducts);
  const currentBasesUsage = calculateBasesUsage(selectedProducts);

  const nextStep = () => {
    if (currentStep === 1 && selectedProducts.length === 0) {
      toast.error("Por favor seleccione al menos un producto");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const resetProductionCreation = () => {
    setSelectedProducts([]);
    setIsModalOpen(false);
    setDueDate("");
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    const productionName = `Producción #${
      productions.length > 0 ? Math.max(...productions.map((p) => p.id)) + 1 : 1
    }`;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{productionName}</h1>
            </div>
            <div className="space-y-2">
              <Label>Buscar productos</Label>
              <Input
                placeholder="Nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto border rounded-lg p-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  No se encontraron productos
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                        selectedProducts.some((p) => p.id === product.id)
                          ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                      }`}
                      onClick={() => selectProduct(product)}
                    >
                      <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            Sin imagen
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.brand}
                        </p>
                      </div>
                      {selectedProducts.some((p) => p.id === product.id) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <h3 className="font-medium">Productos seleccionados</h3>
            {selectedProducts.length === 0 ? (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                No hay productos seleccionados
              </div>
            ) : (
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              Sin imagen
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Label htmlFor={`quantity-${product.id}`}>
                        Cantidad:
                      </Label>
                      <Input
                        id={`quantity-${product.id}`}
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            product.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                      />
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.canProduce
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {product.canProduce ? "Disponible" : "Faltantes"}
                      </div>
                    </div>
                    {product.missingItems.length > 0 && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                        Faltan:{" "}
                        {product.missingItems.map((item, idx) => (
                          <span key={idx}>
                            {item.ingredientId 
                              ? `${ingredients.find(i => i.id === item.ingredientId)?.name}: ${item.missing.toFixed(2)} ${ingredients.find(i => i.id === item.ingredientId)?.unit}`
                              : item.baseId 
                                ? `${bases.find(b => b.id === item.baseId)?.name}: ${item.missing.toFixed(2)} ${bases.find(b => b.id === item.baseId)?.unit}`
                                : ""}
                            {idx < product.missingItems.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Resumen de producción</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Detalles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Nombre:
                        </span>
                        <span className="font-medium">{productionName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Fecha límite:
                        </span>
                        <span className="font-medium">
                          {dueDate
                            ? new Date(dueDate).toLocaleDateString()
                            : "No especificada"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Productos:
                        </span>
                        <span className="font-medium">
                          {selectedProducts.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Unidades totales:
                        </span>
                        <span className="font-medium">
                          {selectedProducts.reduce(
                            (sum, p) => sum + p.quantity,
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={
                    missingIngredients.length > 0 || missingBases.length > 0
                      ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30"
                      : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30"
                  }
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Estado</span>
                      {missingIngredients.length > 0 || missingBases.length > 0 ? (
                        <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
                          Pendiente
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400">
                          Listo para iniciar
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Ingredientes necesarios:
                        </span>
                        <span className="font-medium">
                          {currentIngredientsUsage.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Bases necesarias:
                        </span>
                        <span className="font-medium">
                          {currentBasesUsage.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Faltantes totales:
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {missingIngredients.length + missingBases.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Ingredientes requeridos</h3>
              <div className="space-y-2">
                {currentIngredientsUsage.map(({ ingredient, amountUsed }) => {
                  const isMissing = missingIngredients.some(
                    (mi) => mi.ingredient.id === ingredient.id
                  );
                  const stockAfter = ingredient.currentStock - amountUsed;
                  const isLowStock = stockAfter < ingredient.minStock;

                  return (
                    <Card
                      key={ingredient.id}
                      className={isMissing ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30" : ""}
                    >
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="text-sm font-mono">
                            {amountUsed.toFixed(2)} {ingredient.unit}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>
                            Stock actual: {ingredient.currentStock.toFixed(2)}
                          </span>
                          <span>
                            Stock después:{" "}
                            <span
                              className={
                                isLowStock ? "text-red-600 dark:text-red-400 font-medium" : ""
                              }
                            >
                              {stockAfter.toFixed(2)}
                            </span>
                          </span>
                        </div>
                       
                        {isMissing && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1 text-right">
                            Faltan:{" "}
                            {missingIngredients
                              .find((mi) => mi.ingredient.id === ingredient.id)
                              ?.missingAmount.toFixed(2)}{" "}
                            {ingredient.unit}
                          </div>
                        )}
                        {isLowStock && !isMissing && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 text-right">
                            Stock bajo mínimo después de producción
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Bases requeridas</h3>
              <div className="space-y-2">
                {currentBasesUsage.map(({ base, amountUsed }) => {
                  const isMissing = missingBases.some(
                    (mb) => mb.base.id === base.id
                  );
                  const stockAfter = base.currentStock - amountUsed;
                  const isLowStock = stockAfter < base.minStock;

                  return (
                    <Card
                      key={base.id}
                      className={isMissing ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30" : ""}
                    >
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{base.name}</span>
                          <span className="text-sm font-mono">
                            {amountUsed.toFixed(2)} {base.unit}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>
                            Stock actual: {base.currentStock.toFixed(2)}
                          </span>
                          <span>
                            Stock después:{" "}
                            <span
                              className={
                                isLowStock ? "text-red-600 dark:text-red-400 font-medium" : ""
                              }
                            >
                              {stockAfter.toFixed(2)}
                            </span>
                          </span>
                        </div>
                       
                        {isMissing && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1 text-right">
                            Faltan:{" "}
                            {missingBases
                              .find((mb) => mb.base.id === base.id)
                              ?.missingAmount.toFixed(2)}{" "}
                            {base.unit}
                          </div>
                        )}
                        {isLowStock && !isMissing && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 text-right">
                            Stock bajo mínimo después de producción
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {(missingIngredients.length > 0 || missingBases.length > 0) && (
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Faltantes para la producción
                </h3>
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Ingredientes faltantes:</h4>
                    {missingIngredients.length > 0 ? (
                      <ul className="space-y-2 mb-4">
                        {missingIngredients.map(({ ingredient, missingAmount }) => (
                          <li key={ingredient.id} className="flex justify-between">
                            <span>{ingredient.name}</span>
                            <span className="font-medium">
                              {missingAmount.toFixed(2)} {ingredient.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No hay ingredientes faltantes</p>
                    )}
                    
                    <h4 className="font-medium mb-2">Bases faltantes:</h4>
                    {missingBases.length > 0 ? (
                      <ul className="space-y-2">
                        {missingBases.map(({ base, missingAmount }) => (
                          <li key={base.id} className="flex justify-between">
                            <span>{base.name}</span>
                            <span className="font-medium">
                              {missingAmount.toFixed(2)} {base.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No hay bases faltantes</p>
                    )}
                  </CardContent>
                </Card>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowPurchaseDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Comprar ingredientes/bases faltantes
                </Button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-sm font-medium text-muted-foreground hover:text-foreground" href="/dashboard">Panel de Control</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-sm font-medium text-foreground">
              Producción
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Producción</h2>
            <small className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Aquí podrás gestionar las producciones.
            </small>
          </div>
        </div>
      </div>

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
            bases={bases}
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
      <Dialog open={isModalOpen} onOpenChange={resetProductionCreation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky bg-background dark:bg-gray-900">
            <DialogTitle>Crear producción</DialogTitle>
            <div className="flex flex-col pt-2">
              <div className="flex items-center justify-between px-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        currentStep === step
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step === 1
                        ? "Selección"
                        : step === 2
                        ? "Cantidades"
                        : "Revisión"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
                  style={{
                    width: `${((currentStep - 1) / 2) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">{renderStepContent()}</div>

          <DialogFooter className="sticky bottom-0 bg-background dark:bg-gray-900 pt-4 border-t">
            <div className="flex justify-between w-full">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
              )}
              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={addProduction}>
                    {missingIngredients.length > 0 || missingBases.length > 0
                      ? "Crear como pendiente"
                      : "Confirmar producción"}
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReusableDialog
        isOpen={showPurchaseDialog}
        onClose={() => setShowPurchaseDialog(false)}
        title="Generar Orden de Compra"
        description="Se requieren los siguientes items:"
      >
        <div className="py-4">
          <h4 className="font-medium mb-2">Ingredientes faltantes:</h4>
          {missingIngredients.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {missingIngredients.map(({ ingredient, missingAmount }) => (
                <li key={ingredient.id} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span className="font-medium">
                    {missingAmount.toFixed(2)} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No hay ingredientes faltantes</p>
          )}
          
          <h4 className="font-medium mb-2">Bases faltantes:</h4>
          {missingBases.length > 0 ? (
            <ul className="space-y-2">
              {missingBases.map(({ base, missingAmount }) => (
                <li key={base.id} className="flex justify-between">
                  <span>{base.name}</span>
                  <span className="font-medium">
                    {missingAmount.toFixed(2)} {base.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay bases faltantes</p>
          )}
        </div>
      </ReusableDialog>
    </div>
  );
}

function ProductionCard({
  production,
  ingredients,
  bases,
  onStartProduction,
  showIngredientsUsage,
  onToggleIngredientsUsage,
}: {
  production: Production;
  ingredients: Ingredient[];
  bases: Base[];
  onStartProduction: (id: number) => void;
  showIngredientsUsage: boolean;
  onToggleIngredientsUsage: () => void;
}) {
  const cardColor = {
    pending: "bg-yellow-100 dark:bg-yellow-900/30",
    in_progress: "bg-blue-100 dark:bg-blue-900/30",
    completed: "bg-green-100 dark:bg-green-900/30",
  }[production.status];

  return (
    <div
      className={`${cardColor} rounded-lg shadow p-4 transition-transform transform hover:scale-105`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{production.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estado:{" "}
            {production.status === "pending"
              ? "Pendiente"
              : production.status === "in_progress"
              ? "En Proceso"
              : "Completada"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fecha: {new Date(production.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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

      {(production.missingIngredients && production.missingIngredients.length > 0) ||
      (production.missingBases && production.missingBases.length > 0) ? (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/30 rounded">
          <h4 className="font-medium text-sm text-red-700 dark:text-red-400">
            Faltan items:
          </h4>
          <ul className="list-disc pl-5 text-xs text-red-700 dark:text-red-400">
            {production.missingIngredients?.map(({ ingredient, missingAmount }) => (
              <li key={`ing-${ingredient.id}`}>
                {ingredient.name} - {missingAmount.toFixed(2)} {ingredient.unit}
              </li>
            ))}
            {production.missingBases?.map(({ base, missingAmount }) => (
              <li key={`base-${base.id}`}>
                {base.name} - {missingAmount.toFixed(2)} {base.unit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleIngredientsUsage}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {showIngredientsUsage
            ? "Ocultar detalles"
            : "Mostrar detalles de producción"}
        </Button>

        {showIngredientsUsage && (
          <div className="mt-2 space-y-2">
            {production.ingredientsUsage && production.ingredientsUsage.length > 0 && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  Ingredientes utilizados:
                </h4>
                <ul className="list-disc pl-5 text-xs text-blue-700 dark:text-blue-400">
                  {production.ingredientsUsage.map(({ ingredient, amountUsed }) => (
                    <li key={`ing-use-${ingredient.id}`}>
                      {ingredient.name} - {amountUsed.toFixed(2)} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {production.basesUsage && production.basesUsage.length > 0 && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  Bases utilizadas:
                </h4>
                <ul className="list-disc pl-5 text-xs text-blue-700 dark:text-blue-400">
                  {production.basesUsage.map(({ base, amountUsed }) => (
                    <li key={`base-use-${base.id}`}>
                      {base.name} - {amountUsed.toFixed(2)} {base.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}