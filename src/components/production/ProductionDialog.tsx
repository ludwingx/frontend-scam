import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import SelectedProductsList from "./SelectedProductsList";
import ProductList from "./ProductionList";
import ProductionSummary from "./ProductionSumary";

export default function ProductionDialog({
  isOpen,
  onOpenChange,
  selectedProducts,
  setSelectedProducts,
  ingredients,
  setIngredients,
  dueDate,
  setDueDate,
  addProduction,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  missingIngredients,
  currentIngredientsUsage,
  showPurchaseDialog,
  setShowPurchaseDialog,
}: ProductionDialogProps) {
  const [showTotalIngredients, setShowTotalIngredients] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <ProductList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProducts={filteredProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />

          <SelectedProductsList
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            dueDate={dueDate}
            setDueDate={setDueDate}
            ingredients={ingredients}
          />

          <div className="w-1/3 flex flex-col overflow-hidden border-l">
            <div className="p-4 space-y-4 h-full flex flex-col">
              <ProductionSummary
                selectedProducts={selectedProducts}
                currentIngredientsUsage={currentIngredientsUsage}
                missingIngredients={missingIngredients}
              />

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
                        onOpenChange(false);
                        setSelectedProducts([]);
                        setDueDate("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
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
  );
}