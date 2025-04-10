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
  ArrowRight,
  ArrowLeft,
  Check,
  X,
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
import { mockIngredients, mockProducts } from "./data";
import { ReusableDialog } from "@/components/ReusableDialog";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [productionName, setProductionName] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const mockProductions: Production[] = [
        {
          id: 1,
          products: [],
          status: "pending",
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          products: [],
          status: "in_progress",
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
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
    setCurrentStep(1);
    setProductionName("");
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

  const nextStep = () => {
    if (currentStep === 1 && !productionName) {
      toast.error("Por favor ingrese un nombre para la producción");
      return;
    }
    if (currentStep === 2 && selectedProducts.length === 0) {
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
    setShowTotalIngredients(false);
    setCurrentStep(1);
    setProductionName("");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="productionName">Nombre de la producción</Label>
              <Input
                id="productionName"
                value={productionName}
                onChange={(e) => setProductionName(e.target.value)}
                placeholder="Ej: Producción de mayo"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
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
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => selectProduct(product)}
                    >
                      <div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
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
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                      {selectedProducts.some((p) => p.id === product.id) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <div className="space-y-2">
                <Label>
                  Productos seleccionados ({selectedProducts.length})
                </Label>
                <div className="border rounded-lg p-2 space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium text-sm">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
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
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.canProduce
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.canProduce ? "Disponible" : "Faltantes"}
                      </div>
                    </div>
                  ))}
                </div>
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
                        <span className="text-gray-600">Nombre:</span>
                        <span className="font-medium">{productionName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha límite:</span>
                        <span className="font-medium">
                          {dueDate
                            ? new Date(dueDate).toLocaleDateString()
                            : "No especificada"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Productos:</span>
                        <span className="font-medium">
                          {selectedProducts.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unidades totales:</span>
                        <span className="font-medium">
                          {selectedProducts.reduce(
                            (sum, p) => sum + (p.quantity || 0),
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={
                    missingIngredients.length > 0
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-green-200 bg-green-50"
                  }
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>Estado</span>
                      {missingIngredients.length > 0 ? (
                        <Badge variant="outline" className="text-yellow-600">
                          Pendiente
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          Listo para iniciar
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Ingredientes necesarios:
                        </span>
                        <span className="font-medium">
                          {currentIngredientsUsage.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Ingredientes faltantes:
                        </span>
                        <span className="font-medium text-red-600">
                          {missingIngredients.length}
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
                      className={isMissing ? "border-red-200 bg-red-50" : ""}
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
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>
                            Stock actual: {ingredient.currentStock.toFixed(2)}
                          </span>
                          <span>
                            Stock después:{" "}
                            <span
                              className={
                                isLowStock ? "text-red-600 font-medium" : ""
                              }
                            >
                              {stockAfter.toFixed(2)}
                            </span>
                          </span>
                        </div>
                        <Progress
                          value={
                            (amountUsed /
                              (amountUsed + ingredient.currentStock)) *
                            100
                          }
                          className="h-2 mt-1"
                          color={
                            isMissing
                              ? "red"
                              : isLowStock
                              ? "yellow"
                              : "primary"
                          }
                          
                        />
                        {isMissing && (
                          <div className="text-xs text-red-600 mt-1 text-right">
                            Faltan:{" "}
                            {missingIngredients
                              .find((mi) => mi.ingredient.id === ingredient.id)
                              ?.missingAmount.toFixed(2)}{" "}
                            {ingredient.unit}
                          </div>
                        )}
                        {isLowStock && !isMissing && (
                          <div className="text-xs text-yellow-600 mt-1 text-right">
                            Stock bajo mínimo después de producción
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {missingIngredients.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Ingredientes faltantes
                </h3>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <ul className="space-y-2">
                      {missingIngredients.map(
                        ({ ingredient, missingAmount }) => (
                          <li
                            key={ingredient.id}
                            className="flex justify-between"
                          >
                            <span>{ingredient.name}</span>
                            <span className="font-medium">
                              {missingAmount.toFixed(2)} {ingredient.unit}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowPurchaseDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Comprar ingredientes faltantes
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
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
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
      <Dialog open={isModalOpen} onOpenChange={resetProductionCreation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky bg-background ">
            <DialogTitle>Crear producción</DialogTitle>
            <div className="flex flex-col pt-2">
              {/* Barra de progreso con iconos */}
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
                        ? "Información"
                        : step === 2
                        ? "Productos"
                        : "Revisión"}
                    </span>
                  </div>
                ))}
              </div>
              {/* Línea de progreso */}
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

          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <div className="flex justify-between w-full">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Atrás
                      </Button>
                    )}
                    <Button onClick={addProduction}>
                      {missingIngredients.length > 0
                        ? "Crear como pendiente"
                        : "Confirmar producción"}
                    </Button>
                  </>
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
        description="Se requieren los siguientes ingredientes:"
      >
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
      </ReusableDialog>
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
