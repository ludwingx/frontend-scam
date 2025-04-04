import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import SelectedProductsList from "./SelectedProductsList";
import {
  Product,
  ProductionDialogProps,
  SelectedProduct,
} from "@/types/production";
import ProductList from "./ProductList";
import ProductionSummary from "./ProductionSummary";
import { Dispatch, SetStateAction } from "react";

export default function ProductionDialog({
  isOpen,
  onOpenChange,
  selectedProducts,
  setSelectedProducts,
  ingredients,
  dueDate,
  setDueDate,
  addProduction,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  missingIngredients = [],
  currentIngredientsUsage = [],
  setShowPurchaseDialog,
}: ProductionDialogProps) {

  const handleSetSelectedProducts: Dispatch<SetStateAction<Product[]>> = (
    products: Product[] | ((prev: Product[]) => Product[])
  ) => {
    const convertToSelected = (prods: Product[]): SelectedProduct[] => 
      prods.map(p => ({
        ...p,
        quantity: 0,
        canProduce: false,
        missingIngredients: []
      }));

    if (Array.isArray(products)) {
      setSelectedProducts(convertToSelected(products)); 
    } else {
      setSelectedProducts(prevSelected => {
        const currentProducts = prevSelected.map(({
          ...productBase 
        }) => productBase);
        
        const newProducts = products(currentProducts);
        return convertToSelected(newProducts);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-xl">Crear Nueva Producción</DialogTitle>
          <DialogDescription>Seleccione los productos a producir</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <ProductList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProducts={filteredProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={handleSetSelectedProducts}
          />

          <SelectedProductsList
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            dueDate={dueDate}
            setDueDate={setDueDate}
            ingredients={ingredients}
          />

          <div className="w-1/3 flex flex-col border-l">
            <ProductionSummary
              selectedProducts={selectedProducts}
              currentIngredientsUsage={currentIngredientsUsage}
              missingIngredients={missingIngredients}
            />

            <div className="p-4 border-t mt-auto">
              {missingIngredients.length > 0 && (
                <Button
                  variant="destructive"
                  className="w-full mb-3"
                  onClick={() => setShowPurchaseDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Comprar ingredientes faltantes
                </Button>
              )}

              <div className="flex gap-3">
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
                  disabled={selectedProducts.length === 0}
                >
                  {missingIngredients.length > 0 ? "Crear como pendiente" : "Iniciar producción"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}