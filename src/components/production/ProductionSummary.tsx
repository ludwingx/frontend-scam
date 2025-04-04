import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SelectedProduct, Ingredient, MissingIngredient } from "@/types/production";
import { CircleCheckBig, TriangleAlert } from "lucide-react";

interface ProductionSummaryProps {
  selectedProducts: SelectedProduct[];
  missingIngredients: MissingIngredient[];
  ingredients: Ingredient[];
  onStartProduction: () => void;
  onCancel: () => void;
}

interface IngredientUsage {
  ingredient: Ingredient;
  amountUsed: number;
}

export default function ProductionSummary({
  selectedProducts,
  missingIngredients,
  ingredients,
}: ProductionSummaryProps) {
  // Calcular unidades totales
  const totalUnits = selectedProducts.reduce(
    (sum, product) => sum + (product.quantity || 0),
    0
  );

  // Calcular ingredientes usados
  const calculateIngredientsUsage = (): IngredientUsage[] => {
    const usageMap: Record<number, { ingredient: Ingredient; amountUsed: number }> = {};

    selectedProducts.forEach((product) => {
      if (product.quantity && product.quantity > 0 && product.recipe) {
        product.recipe.forEach((item) => {
          const ingredient = ingredients?.find((i) => i.id === item.ingredientId);
          if (ingredient) {
            const amountNeeded = item.quantity * product.quantity;
            if (!usageMap[ingredient.id]) {
              usageMap[ingredient.id] = {
                ingredient,
                amountUsed: 0,
              };
            }
            usageMap[ingredient.id].amountUsed += amountNeeded;
          }
        });
      }
    });

    return Object.values(usageMap);
  };

  const currentIngredientsUsage = calculateIngredientsUsage();
  const totalIngredients = currentIngredientsUsage.length;

  // Calcular total de ingredientes requeridos
  const totalIngredientsRequired = currentIngredientsUsage.reduce(
    (sum, { amountUsed }) => sum + amountUsed,
    0
  );

  // Determinar estado de producción
  const productionReady = missingIngredients.length === 0;

  return (
    <Card className="bg-white shadow-sm dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Resumen de Producción
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Unidades totales</span>
            <p className="font-medium text-lg">{totalUnits.toLocaleString()}</p>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Ingredientes</span>
            <p className="font-medium text-lg">{totalIngredients}</p>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total requerido</span>
            <p className="font-medium text-lg">{totalIngredientsRequired.toFixed(2)} kg</p>
          </div>
        </div>

        {/* Barra de disponibilidad */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Disponibilidad</span>
            <span className="text-sm font-medium">
              {productionReady ? "100%" : `${Math.round((totalIngredients - missingIngredients.length) / totalIngredients * 100)}%`}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${productionReady ? "bg-green-500" : "bg-yellow-500"}`}
              style={{ width: productionReady ? "100%" : `${Math.round((totalIngredients - missingIngredients.length) / totalIngredients * 100)}%` }}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Estado de producción */}
        <div className="space-y-3">
          <Alert className={productionReady ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"}>
            {productionReady ? (
              <>
                <CircleCheckBig className="h-4 w-4 text-green-500" />
                <AlertTitle>Todo listo</AlertTitle>
                <AlertDescription>
                  Todos los ingredientes están disponibles para iniciar la producción.
                </AlertDescription>
              </>
            ) : (
              <>
                <TriangleAlert className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Faltan ingredientes</AlertTitle>
                <AlertDescription>
                  {missingIngredients.length} ingredientes no tienen suficiente stock.
                </AlertDescription>
              </>
            )}
          </Alert>
        </div>

        {/* Lista detallada de ingredientes faltantes */}
        {!productionReady && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Detalle de faltantes:</h4>
            <ul className="space-y-2 text-sm">
              {missingIngredients.map((item) => {
                const ingredient = item.ingredient;
                const currentStock = ingredient.currentStock || 0;
                const required = (item.missing + currentStock).toFixed(2);
                
                return (
                  <li key={ingredient.id} className="grid grid-cols-3 gap-2">
                    <span className="truncate">{ingredient.name}</span>
                    <span className="text-right font-medium">
                      {required} {ingredient.unit}
                    </span>
                    <span className="text-right text-red-600 dark:text-red-400">
                      (Stock: {currentStock.toFixed(2)})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}