import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SelectedProductsListProps {
  selectedProducts: any[];
  setSelectedProducts: (products: any[]) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  ingredients: any[];
}

export default function SelectedProductsList({
  selectedProducts,
  setSelectedProducts,
  dueDate,
  setDueDate,
  ingredients,
}: SelectedProductsListProps) {
  const updateQuantity = (id: number, quantity: number | null) => {
    if (quantity === null || quantity <= 0) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const removeProduct = (id: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-1/3 flex flex-col border-r overflow-hidden">
      <div className="p-4">
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
                    <p className="text-xs text-gray-500">{product.brand}</p>
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
                      {product.recipe.map((item: any) => {
                        const ingredient = ingredients.find(
                          (i) => i.id === item.ingredientId
                        );
                        const totalNeeded =
                          item.quantity * (product.quantity || 0);
                        const isMissing = product.missingIngredients?.some(
                          (m: any) => m.ingredientId === item.ingredientId
                        );

                        return (
                          <li
                            key={item.ingredientId}
                            className={
                              isMissing ? "text-red-600 font-semibold" : ""
                            }
                          >
                            {ingredient?.name || "Ingrediente desconocido"}:
                            <span className="font-medium">
                              {" "}
                              {totalNeeded.toFixed(2)} {ingredient?.unit}
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
  );
}