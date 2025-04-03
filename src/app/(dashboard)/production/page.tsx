"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import IngredientsSummary from "@/components/production/IngredientsSumary";
import ProductionHeader from "@/components/production/ProductionHeader";
import ProductionCard from "@/components/production/ProductionCard";
import PurchaseDialog from "@/components/production/PurchaseDialog";
import { Ingredient, Production, SelectedProduct} from "@/types/production";
import { mockIngredients, mockProductions, mockProducts } from "./data";
import ProductionDialog from "@/components/production/ProductionDialog";
import { toast } from "sonner";

export default function ProductionPage() {
  // Estados
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
  const [showIngredientsUsage, setShowIngredientsUsage] = useState<number | null>(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Efectos
  useEffect(() => {
    setTimeout(() => {
      setProductions(mockProductions);
    }, 1000);
  }, []);

  // Funciones de cálculo
  const calculateMissingIngredients = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    const missing: { ingredient: Ingredient; missingAmount: number }[] = [];

    products.forEach((product) => {
      if (product.quantity !== null) {
        product.recipe.forEach((item) => {
          const totalNeeded = item.quantity * product.quantity!;
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
    const ingredientsUsage: { ingredient: Ingredient; amountUsed: number }[] = [];

    products.forEach((product) => {
      if (product.quantity !== null) {
        product.recipe.forEach((item) => {
          const totalNeeded = item.quantity * product.quantity!;
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

  // Funciones de producción
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
              const totalNeeded = item.quantity * product.quantity!;
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
              const totalUsed = item.quantity * product.quantity!;
              updatedIngredients[ingredientIndex].currentStock -= totalUsed;

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
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      missingIngredients: missing.length > 0 ? missing : undefined,
      ingredientsUsage: ingredientsUsage.length > 0 ? ingredientsUsage : undefined,
    };

    setProductions((prev) => [...prev, productionWithId]);
    toast.success(
      `Producción ${missing.length > 0 ? "pendiente" : "iniciada"} creada`
    );

    setSelectedProducts([]);
    setIsModalOpen(false);
    setDueDate("");
  };

  // Filtrado y cálculos finales
  const filteredProductions = productions.filter((production) => {
    if (activeView === "pending") return production.status === "pending";
    if (activeView === "in_progress") return production.status === "in_progress";
    if (activeView === "completed") return production.status === "completed";
    return true;
  });

  const currentIngredientsUsage = calculateIngredientsUsage(selectedProducts);
  const totalIngredientsUsage = calculateTotalIngredientsUsage();

  // Renderizado
  return (
    <div className="flex flex-col min-h-screen p-6">
      <ProductionHeader 
        showAllIngredients={showAllIngredients}
        setShowAllIngredients={setShowAllIngredients}
      />

      {showAllIngredients && totalIngredientsUsage.length > 0 && (
        <IngredientsSummary 
          totalIngredientsUsage={totalIngredientsUsage}
        />
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

      <ProductionDialog
        isOpen={isModalOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsModalOpen(false);
            setSelectedProducts([]);
            setMissingIngredients([]);
            setDueDate("");
          }
        }}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        ingredients={ingredients}
        setIngredients={setIngredients}
        dueDate={dueDate}
        setDueDate={setDueDate}
        addProduction={addProduction}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredProducts={mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        missingIngredients={missingIngredients}
        currentIngredientsUsage={currentIngredientsUsage}
        showPurchaseDialog={showPurchaseDialog}
        setShowPurchaseDialog={setShowPurchaseDialog}
      />

      <PurchaseDialog
        showPurchaseDialog={showPurchaseDialog}
        setShowPurchaseDialog={setShowPurchaseDialog}
        missingIngredients={missingIngredients}
      />
    </div>
  );
}