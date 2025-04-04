import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Ingredient, SelectedProduct, RecipeItem } from "@/types/production";
import { Dispatch, SetStateAction } from "react";

interface SelectedProductsListProps {
  selectedProducts: SelectedProduct[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedProduct[]>>;
  dueDate: string;
  setDueDate: (date: string) => void;
  ingredients: Ingredient[];
}

interface MissingIngredient {
  ingredientId: number;
  missing: number;
}

export default function SelectedProductsList({
  selectedProducts,
  setSelectedProducts,
  dueDate,
  setDueDate,
  ingredients,
}: SelectedProductsListProps) {
  // Función para verificar qué ingredientes faltan para un producto
  const getMissingIngredients = (product: SelectedProduct): MissingIngredient[] => {
    if (!product.quantity || product.quantity <= 0) return [];
    
    const missing: MissingIngredient[] = [];
    
    product.recipe.forEach((item: RecipeItem) => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      if (ingredient) {
        const requiredAmount = item.quantity * product.quantity;
        if (ingredient.currentStock < requiredAmount) {
          missing.push({
            ingredientId: ingredient.id,
            missing: requiredAmount - ingredient.currentStock
          });
        }
      }
    });
    
    return missing;
  };

  // Función para determinar si un producto puede producirse
  const canProduceProduct = (product: SelectedProduct) => {
    return getMissingIngredients(product).length === 0;
  };

  const updateQuantity = (id: string, quantity: number | null) => {
    setSelectedProducts(prev => {
      if (quantity === null || quantity <= 0) {
        return prev.filter((p) => p.id !== id);
      }
      
      return prev.map((p) => {
        if (p.id === id) {
          const missingIngredients = getMissingIngredients({...p, quantity});
          return {
            ...p,
            quantity,
            missingIngredients,
            canProduce: missingIngredients.length === 0
          };
        }
        return p;
      });
    });
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(prev => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-1/3 flex flex-col border-r overflow-hidden bg-gray-50 dark:bg-gray-800">
      <div className="p-4 bg-white dark:bg-gray-900 border-b">
        <Label className="text-sm font-medium">
          Productos seleccionados ({selectedProducts.length})
        </Label>
        <div className="mt-2">
          <Label className="text-sm font-medium">Fecha límite</Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-1 bg-white dark:bg-gray-800"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {selectedProducts.length === 0 ? (
          <div className="text-center p-4 text-gray-500 h-full flex items-center justify-center">
            No hay productos seleccionados
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProducts.map((product) => {
              const missingIngredients = getMissingIngredients(product);
              const canProduce = canProduceProduct(product);
              
              return (
                <div 
                  key={product.id} 
                  className="group border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm 
                    hover:shadow-lg transition-all duration-200 ease-in-out
                    hover:border-blue-300 dark:hover:border-blue-700
                    hover:scale-[1.005] transform-gpu"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {product.brand}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity ?? ""}
                        onChange={(e) =>
                          updateQuantity(
                            product.id,
                            e.target.value === "" ? null : parseInt(e.target.value)
                          )
                        }
                        className="w-20 h-8 bg-gray-50 dark:bg-gray-800 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors"
                        placeholder="Cant."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                          opacity-70 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        canProduce
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      } group-hover:shadow-sm transition-shadow`}
                    >
                      {canProduce
                        ? "Stock suficiente"
                        : "Faltan ingredientes"}
                    </div>

                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                        Total requerido:
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {product.recipe.map((item: RecipeItem) => {
                          const ingredient = ingredients.find(
                            (i) => i.id === item.ingredientId
                          );
                          const totalNeeded = item.quantity * (product.quantity || 0);
                          const isMissing = missingIngredients.some(mi => mi.ingredientId === item.ingredientId);
                          const currentStock = ingredient?.currentStock || 0;

                          return (
                            <li
                              key={item.ingredientId}
                              className={`text-xs ${
                                isMissing 
                                  ? "text-red-600 dark:text-red-400 font-semibold" 
                                  : "text-gray-600 dark:text-gray-400"
                              } group-hover:font-medium transition-all`}
                            >
                              <span className="inline-block min-w-[120px]">
                                {ingredient?.name || "Ingrediente desconocido"}:
                              </span>
                              <span className="ml-1">
                                {totalNeeded.toFixed(2)} {ingredient?.unit}
                                {isMissing && (
                                  <span className="ml-2">
                                    (Stock: {currentStock.toFixed(2)})
                                  </span>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}