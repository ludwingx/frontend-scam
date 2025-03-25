"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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
import { Trash2, AlertTriangle } from "lucide-react";

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
  quantity: number;
  canProduce: boolean;
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
}

const mockIngredients: Ingredient[] = [
  {
    id: 1,
    name: "Harina de trigo",
    currentStock: 150,
    unit: "kg",
    minStock: 20,
  },
  { id: 2, name: "Azúcar", currentStock: 80, unit: "kg", minStock: 10 },
  { id: 3, name: "Huevos", currentStock: 500, unit: "unidades", minStock: 50 },
  { id: 4, name: "Mantequilla", currentStock: 45, unit: "kg", minStock: 5 },
  { id: 5, name: "Levadura", currentStock: 15, unit: "kg", minStock: 2 },
  { id: 6, name: "Sal", currentStock: 30, unit: "kg", minStock: 1 },
  { id: 7, name: "Queso", currentStock: 60, unit: "kg", minStock: 10 },
  { id: 8, name: "Cacao", currentStock: 25, unit: "kg", minStock: 5 },
  { id: 9, name: "Vainilla", currentStock: 5, unit: "kg", minStock: 1 },
  { id: 10, name: "Canela", currentStock: 8, unit: "kg", minStock: 1 },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Cuñapes",
    description: "Pan de queso tradicional",
    brand: "Marca A",
    image: "/cuñape.png",
    recipe: [
      { ingredientId: 1, quantity: 0.01 },
      { ingredientId: 7, quantity: 0.024 },
      { ingredientId: 3, quantity: 0.2 },
      { ingredientId: 6, quantity: 0.002 },
    ],
  },
  {
    id: 2,
    name: "Empañadas de Queso",
    description: "Pan integral de trigo con semillas",
    brand: "Marca B",
    image: "/empanadaQueso.png",
    recipe: [
      { ingredientId: 1, quantity: 0.05 },
      { ingredientId: 2, quantity: 0.015 },
      { ingredientId: 3, quantity: 0.25 },
      { ingredientId: 4, quantity: 0.01 },
      { ingredientId: 5, quantity: 0.0025 },
      { ingredientId: 6, quantity: 0.0025 },
    ],
  },
  {
    id: 3,
    name: "Torta de Chocolate",
    description: "Galletas dulces con chispas de chocolate",
    brand: "Marca C",
    image: "/tortaChocolate.png",
    recipe: [
      { ingredientId: 1, quantity: 0.015 },
      { ingredientId: 2, quantity: 0.008 },
      { ingredientId: 3, quantity: 0.08 },
      { ingredientId: 4, quantity: 0.005 },
      { ingredientId: 8, quantity: 0.01 },
    ],
  },
  {
    id: 4,
    name: "Torta de Vainilla",
    description: "Torta esponjosa de vainilla",
    brand: "Marca A",
    image: "/tortaVainilla",
    recipe: [
      { ingredientId: 1, quantity: 0.2 },
      { ingredientId: 2, quantity: 0.15 },
      { ingredientId: 3, quantity: 2 },
      { ingredientId: 4, quantity: 0.1 },
      { ingredientId: 9, quantity: 0.005 },
    ],
  },
  {
    id: 5,
    name: "Empanadas de Queso",
    description: "Empanadas rellenas de queso derretido",
    brand: "Marca D",
    image: "/images/empanadas-queso.jpg",
    recipe: [
      { ingredientId: 1, quantity: 0.03 },
      { ingredientId: 7, quantity: 0.02 },
      { ingredientId: 3, quantity: 0.1 },
    ],
  },
  {
    id: 6,
    name: "Pan de Canela",
    description: "Pan dulce con canela y azúcar",
    brand: "Marca E",
    image: "/images/pan-canela.jpg",
    recipe: [
      { ingredientId: 1, quantity: 0.04 },
      { ingredientId: 2, quantity: 0.02 },
      { ingredientId: 3, quantity: 0.15 },
      { ingredientId: 4, quantity: 0.015 },
      { ingredientId: 10, quantity: 0.003 },
    ],
  },
  {
    id: 7,
    name: "Brownies",
    description: "Brownies de chocolate con nueces",
    brand: "Marca F",
    image: "/images/brownies.jpg",
    recipe: [
      { ingredientId: 1, quantity: 0.1 },
      { ingredientId: 2, quantity: 0.2 },
      { ingredientId: 3, quantity: 0.5 },
      { ingredientId: 4, quantity: 0.15 },
      { ingredientId: 8, quantity: 0.05 },
    ],
  },
  {
    id: 8,
    name: "Donas",
    description: "Donas glaseadas de varios sabores",
    brand: "Marca G",
    image: "/images/donas.jpg",
    recipe: [
      { ingredientId: 1, quantity: 0.07 },
      { ingredientId: 2, quantity: 0.03 },
      { ingredientId: 3, quantity: 0.3 },
      { ingredientId: 4, quantity: 0.02 },
      { ingredientId: 5, quantity: 0.005 },
    ],
  },
];

export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [activeView, setActiveView] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<
    { ingredient: Ingredient; missingAmount: number }[]
  >([]);
  const [dueDate, setDueDate] = useState("");

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
    const missing: { ingredient: Ingredient; missingAmount: number }[] = [];
    const requiredIngredients: Record<number, number> = {};

    products.forEach((product) => {
      product.recipe.forEach((item) => {
        const totalNeeded = item.quantity * product.quantity;
        requiredIngredients[item.ingredientId] =
          (requiredIngredients[item.ingredientId] || 0) + totalNeeded;
      });
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

  const updateProductionStatus = (products: SelectedProduct[]) => {
    return products.map((product) => {
      const canProduce = product.recipe.every((item) => {
        const ingredient = ingredients.find((i) => i.id === item.ingredientId);
        return (
          ingredient &&
          ingredient.currentStock >= item.quantity * product.quantity
        );
      });
      return { ...product, canProduce };
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
        const newProduct = { ...product, quantity: 1, canProduce: false };
        const updated = [...prev, newProduct];
        const withStatus = updateProductionStatus(updated);
        calculateMissingIngredients(withStatus);
        return withStatus;
      }
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
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

  const addProduction = (
    newProduction: Omit<Production, "id" | "products">
  ) => {
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const missing = calculateMissingIngredients(selectedProducts);

    const productionWithId: Production = {
      ...newProduction,
      id: Date.now(),
      products: selectedProducts,
      status: missing.length > 0 ? "pending" : "in_progress",
      missingIngredients: missing.length > 0 ? missing : undefined,
    };

    setProductions((prev) => [...prev, productionWithId]);
    toast.success(
      `Producción ${missing.length > 0 ? "pendiente" : "iniciada"} creada`
    );

    setSelectedProducts([]);
    setIsModalOpen(false);
    setDueDate("");
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
            }
          });
        });

        setIngredients(updatedIngredients);
        return {
          ...production,
          status: "in_progress",
          missingIngredients: undefined,
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
        <h2 className="text-3xl font-semibold text-gray-900">Producción</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las producciones.
        </small>
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
            onStartProduction={startProduction}
          />
        ))}
      </div>

      {/* New Production Button */}
      <Button 
        className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-xl">+</span>
      </Button>
    

      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsModalOpen(false);
          setSelectedProducts([]);
          setMissingIngredients([]);
          setDueDate("");
        }
      }}>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto"> {/* Reducido a max-w-2xl */}
          <DialogHeader>
            <DialogTitle>Crear Nueva Producción</DialogTitle>
            <DialogDescription>
              Seleccione los productos a producir
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4"> {/* Reducido espacio vertical */}
            {/* Search Section */}
            <div className="space-y-2"> {/* Menor espacio */}
              <Label className="text-sm">Buscar productos</Label> {/* Texto más pequeño */}
              <Input
                placeholder="Nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              <div className="relative px-6"> {/* Padding reducido */}
                <Carousel
                  opts={{
                    align: "start",
                    slidesToScroll: 3,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-1">
                    {filteredProducts.map((product) => (
                      <CarouselItem key={product.id} className="pl-1 basis-1/4 min-w-[140px]"> {/* Cambiado a 1/4 y min-w más pequeño */}
                        <div className="p-1 h-full">
                          <ProductCard
                            product={product}
                            onSelect={selectProduct}
                            isSelected={selectedProducts.some(
                              (p) => p.id === product.id
                            )}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8" /> {/* Flechas más pequeñas */}
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8" /> {/* Flechas más pequeñas */}
                </Carousel>
              </div>
            </div>

            {/* Production Section */}
            <div className="space-y-3">
              <div>
                <Label>Fecha límite</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Productos seleccionados ({selectedProducts.length})
                </Label>
                {selectedProducts.length === 0 ? (
                  <div className="text-center p-3 bg-gray-50 rounded text-sm text-gray-500">
                    No hay productos seleccionados
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedProducts.map((product) => (
                      <SelectedProductItem
                        key={product.id}
                        product={product}
                        onUpdate={updateQuantity}
                        onRemove={removeProduct}
                        ingredients={ingredients}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Missing Ingredients Alert */}
            {missingIngredients.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-red-800">
                      Ingredientes insuficientes
                    </h4>
                    <ul className="text-xs text-red-700 space-y-1">
                      {missingIngredients.map(
                        ({ ingredient, missingAmount }) => (
                          <li
                            key={ingredient.id}
                            className="flex items-baseline"
                          >
                            <span className="font-medium min-w-[120px]">
                              {ingredient.name}:
                            </span>
                            <span>
                              Faltan {missingAmount.toFixed(2)}{" "}
                              {ingredient.unit}
                            </span>
                            <span className="text-red-600 ml-2">
                              (Stock: {ingredient.currentStock})
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs h-8 text-red-700 border-red-300 hover:bg-red-100"
                      onClick={() => setShowPurchaseDialog(true)}
                    >
                      Generar Orden de Compra
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
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
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addProduction({
                  status: missingIngredients.length > 0 ? "pending" : "in_progress",
                  dueDate:
                    dueDate ||
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  createdAt: new Date().toISOString(),
                });
              }}
            >
              {missingIngredients.length > 0
                ? "Crear Producción Pendiente"
                : "Iniciar Producción"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Order Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Orden de Compra</DialogTitle>
            <DialogDescription>
              Se requieren los siguientes ingredientes:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">Ingredientes faltantes:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {missingIngredients.map(({ ingredient, missingAmount }) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {missingAmount.toFixed(2)} {ingredient.unit}
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
                toast.success("Orden de compra generada (simulación)");
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

function ProductCard({
  product,
  onSelect,
  isSelected,
}: {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected: boolean;
}) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow h-full ${
        isSelected ? "border-2 border-blue-500" : "border"
      }`}
      onClick={() => onSelect(product)}
    >
      <CardContent className="p-2 flex flex-col h-full">
        <div className="h-20 bg-gray-100 mb-1 rounded flex items-center justify-center"> {/* Altura reducida y fondo más claro */}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <span className="text-gray-500 text-xs">Sin imagen</span>
          )}
        </div>
        <div className="flex-grow space-y-1"> {/* Espacio reducido */}
          <h3 className="font-medium text-xs line-clamp-2">{product.name}</h3> {/* 2 líneas máximo */}
          <p className="text-xs text-gray-500 line-clamp-1">{product.brand}</p>
        </div>
      </CardContent>
    </Card>
  );
}


function SelectedProductItem({
  product,
  onUpdate,
  onRemove,
  ingredients,
}: {
  product: SelectedProduct;
  onUpdate: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  ingredients: Ingredient[];
}) {
  const [inputValue, setInputValue] = useState(product.quantity.toString());

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    onUpdate(product.id, numValue);
  };

  const requiredIngredients = product.recipe.map((item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);
    const requiredAmount = item.quantity * product.quantity;
    const hasEnough = ingredient
      ? ingredient.currentStock >= requiredAmount
      : false;

    return {
      ingredient,
      requiredAmount,
      hasEnough,
      amountPerUnit: item.quantity,
    };
  });

  return (
    <div
      className={`border p-3 rounded ${
        product.canProduce ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <p className="text-sm text-gray-600">{product.brand}</p>
          {product.canProduce ? (
            <span className="text-xs text-green-600">Stock suficiente</span>
          ) : (
            <span className="text-xs text-red-600">Faltan ingredientes</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={inputValue}
            onChange={handleQuantityChange}
            className="w-24"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-600">
        <p className="font-medium">Requisitos por unidad:</p>
        <ul className="list-disc pl-4 space-y-1">
          {requiredIngredients.map(
            ({ ingredient, amountPerUnit, requiredAmount, hasEnough }, idx) => (
              <li key={idx} className={hasEnough ? "" : "text-red-600"}>
                {ingredient?.name || "Ingrediente desconocido"}:
                <span className="font-medium">
                  {" "}
                  {amountPerUnit.toFixed(4)} {ingredient?.unit}
                </span>{" "}
                (necesario: {requiredAmount.toFixed(2)})
                {ingredient && (
                  <span>
                    {" "}
                    | Stock: {ingredient.currentStock} {ingredient.unit}
                  </span>
                )}
                {!hasEnough && ingredient && (
                  <span className="font-semibold">
                    {" "}
                    | Faltan:{" "}
                    {(requiredAmount - ingredient.currentStock).toFixed(2)}
                  </span>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

function ProductionCard({
  production,
  ingredients,
  onStartProduction,
}: {
  production: Production;
  ingredients: Ingredient[];
  onStartProduction: (id: number) => void;
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
        <h4 className="font-medium">Ingredientes necesarios:</h4>
        <ul className="list-disc pl-5 text-xs">
          {Array.from(
            new Set(
              production.products.flatMap((p) =>
                p.recipe.map((r) => r.ingredientId)
              )
            )
          ).map((ingredientId) => {
            const ingredient = ingredients.find((i) => i.id === ingredientId);
            if (!ingredient) return null;

            const totalUsed = production.products.reduce((sum, product) => {
              const recipeItem = product.recipe.find(
                (r) => r.ingredientId === ingredientId
              );
              if (!recipeItem) return sum;
              return sum + recipeItem.quantity * product.quantity;
            }, 0);

            return (
              <li key={ingredientId}>
                {ingredient.name}: {totalUsed.toFixed(2)} {ingredient.unit}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}