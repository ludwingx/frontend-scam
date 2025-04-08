"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import IngredientsSummary from "@/components/production/IngredientsSumary";
import ProductionHeader from "@/components/production/ProductionHeader";
import ProductionCard from "@/components/production/ProductionCard";
import PurchaseDialog from "@/components/production/PurchaseDialog";
import { Ingredient, Production, SelectedProduct } from "@/types/production";
import ProductionDialog from "@/components/production/ProductionDialog";
import { toast } from "sonner";
import { mockIngredients, mockProductions, mockProducts } from "./data";

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

  useEffect(() => {
    setTimeout(() => {
      setProductions(mockProductions);
    }, 1000);
  }, []);

  const calculateMissingIngredients = (products: SelectedProduct[]) => {
    const requiredIngredients: Record<number, number> = {};
    const missing: { ingredient: Ingredient; missingAmount: number }[] = [];

    products.forEach((product) => {
      if (product.quantity && product.quantity > 0) {
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
      if (product.quantity && product.quantity > 0) {
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
          ingredientsUsage.push({
            ingredient,
            amountUsed: Math.min(amountNeeded, ingredient.currentStock),
          });
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

  const startProduction = (productionId: number) => {
    setProductions((prevProductions) =>
      prevProductions.map((production) => {
        if (production.id !== productionId) return production;

        // Verificar si ya está en progreso
        if (production.status === "in_progress") {
          toast.warning("Esta producción ya está en progreso");
          return production;
        }

        // Verificar stock antes de proceder
        const missing = calculateMissingIngredients(production.products);
        if (missing.length > 0) {
          toast.error("No hay suficiente stock para algunos ingredientes");
          return production;
        }

        // Calcular el uso de ingredientes
        const ingredientsUsage = calculateIngredientsUsage(production.products);

        // Actualizar el stock de ingredientes
        const updatedIngredients = [...ingredients];
        ingredientsUsage.forEach(({ ingredient, amountUsed }) => {
          const ingredientIndex = updatedIngredients.findIndex(
            (i) => i.id === ingredient.id
          );
          if (ingredientIndex !== -1) {
            updatedIngredients[ingredientIndex] = {
              ...updatedIngredients[ingredientIndex],
              currentStock: updatedIngredients[ingredientIndex].currentStock - amountUsed,
            };
          }
        });

        // Actualizar el estado de los ingredientes
        setIngredients(updatedIngredients);

        // Actualizar la producción
        return {
          ...production,
          status: "in_progress",
          ingredientsUsage,
          missingIngredients: undefined,
        };
      })
    );
  };

  const addProduction = () => {
    // Validaciones
    if (selectedProducts.length === 0) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    const hasInvalidQuantities = selectedProducts.some(
      (p) => p.quantity === null || p.quantity <= 0 || isNaN(p.quantity)
    );
    if (hasInvalidQuantities) {
      toast.error("Todos los productos deben tener una cantidad válida mayor a cero");
      return;
    }

    // Calcular ingredientes faltantes y uso
    const missing = calculateMissingIngredients(selectedProducts);
    const ingredientsUsage = calculateIngredientsUsage(selectedProducts);

    // Crear nueva producción
    const newProduction: Production = {
      id: Date.now(),
      products: selectedProducts.filter((p) => p.quantity && p.quantity > 0),
      status: missing.length > 0 ? "pending" : "in_progress",
      createdAt: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      missingIngredients: missing.length > 0 ? missing : undefined,
      ingredientsUsage: ingredientsUsage.length > 0 ? ingredientsUsage : undefined,
    };

    // Si no hay ingredientes faltantes, actualizar el stock
    if (missing.length === 0) {
      const updatedIngredients = [...ingredients];
      ingredientsUsage.forEach(({ ingredient, amountUsed }) => {
        const ingredientIndex = updatedIngredients.findIndex(
          (i) => i.id === ingredient.id
        );
        if (ingredientIndex !== -1) {
          updatedIngredients[ingredientIndex] = {
            ...updatedIngredients[ingredientIndex],
            currentStock: updatedIngredients[ingredientIndex].currentStock - amountUsed,
          };
        }
      });
      setIngredients(updatedIngredients);
    }

    // Agregar la producción
    setProductions((prev) => [...prev, newProduction]);
    toast.success(
      `Producción ${missing.length > 0 ? "pendiente" : "iniciada"} creada`
    );

    // Resetear estados
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