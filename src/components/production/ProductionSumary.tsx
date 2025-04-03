import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";

interface IngredientUsage {
  ingredient: {
    id: number;
    name: string;
    currentStock: number;
    unit: string;
  };
  amountUsed: number;
}

interface MissingIngredient {
  ingredient: {
    id: number;
    name: string;
    currentStock: number;
    unit: string;
  };
  missingAmount: number;
}

interface SelectedProduct {
  quantity: number;
  recipe: {
    ingredientId: number;
    quantity: number;
  }[];
}

interface ProductionSummaryProps {
  selectedProducts: SelectedProduct[];
  currentIngredientsUsage: IngredientUsage[];
  missingIngredients: MissingIngredient[];
}

export default function ProductionSummary({
  selectedProducts,
  currentIngredientsUsage,
  missingIngredients,
}: ProductionSummaryProps) {
  const totalUnits = selectedProducts.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const productionStatus = missingIngredients.length > 0 ? "Pendiente" : "Lista para iniciar";
  const statusColor = missingIngredients.length > 0 ? "text-yellow-600" : "text-green-600";

  return (
    <Card className="bg-white shadow-sm dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Resumen de Producción
          <Badge variant="secondary" className="ml-2">
            {selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Unidades totales
            </span>
            <p className="font-medium text-lg">
              {totalUnits.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
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
          <span className={`text-sm font-medium ${statusColor}`}>
            {productionStatus}
          </span>
        </div>

        {missingIngredients.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Faltantes</span>
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              {missingIngredients.length} ingredientes
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}