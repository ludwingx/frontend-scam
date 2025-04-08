import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  SelectedProduct,
  Ingredient,
  MissingIngredient,
} from "@/types/production";
import { CircleCheckBig, TriangleAlert } from "lucide-react";

interface ProductionSummaryProps {
  selectedProducts: SelectedProduct[];
  missingIngredients: MissingIngredient[];
  ingredients?: Ingredient[];
  onStartProduction: () => void;
  onCancel: () => void;
}

interface IngredientUsage {
  ingredient: Ingredient;
  totalRequired: number;
  isAvailable: boolean;
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
    const usageMap: Record<number, IngredientUsage> = {};
  
    // Verificar que tenemos ingredientes
    if (!ingredients || ingredients.length === 0) {
      console.error('No hay ingredientes disponibles');
      return [];
    }
  
    console.log('IDs de ingredientes disponibles:', ingredients.map(i => i.id));
    console.log('IDs en recetas:', 
      selectedProducts.flatMap(p => p.recipe?.map(r => r.ingredientId) || []).join(', '));
  
    selectedProducts.forEach((product) => {
      if (product.quantity && product.quantity > 0 && product.recipe) {
        product.recipe.forEach((recipeItem) => {
          // Asegurarnos de que el ingredientId es un número
          const ingredientId = Number(recipeItem.ingredientId);
          const ingredient = ingredients.find(i => Number(i.id) === ingredientId);
  
          if (!ingredient) {
            console.warn(`Ingrediente con ID ${ingredientId} no encontrado`);
            return;
          }
  
          const amountNeeded = recipeItem.quantity * product.quantity;
          const isAvailable = !missingIngredients.some(mi => 
            Number(mi.ingredientId) === ingredientId
          );
  
          if (!usageMap[ingredient.id]) {
            usageMap[ingredient.id] = {
              ingredient,
              totalRequired: 0,
              isAvailable
            };
          }
          
          usageMap[ingredient.id].totalRequired += amountNeeded;
        });
      }
    });
  
    const result = Object.values(usageMap);
    console.log('Resultado del cálculo:', result);
    return result;
  };

  const ingredientsUsage = calculateIngredientsUsage();
  console.log("Ingredientes usage final:", ingredientsUsage);

  // Resto del código se mantiene igual...
  const totalIngredients = ingredientsUsage.length;
  const availableIngredients = ingredientsUsage.filter(
    (i) => i.isAvailable
  ).length;
  const totalRequired = ingredientsUsage.reduce(
    (sum, { totalRequired }) => sum + totalRequired,
    0
  );
  const canProduce = missingIngredients.length === 0;

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
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Unidades totales
            </span>
            <p className="font-medium text-lg">{totalUnits}</p>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Ingredientes
            </span>
            <p className="font-medium text-lg">
              {availableIngredients}/{totalIngredients}
            </p>
          </div>

          <div className="space-y-1 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total requerido
            </span>
            <p className="font-medium text-lg">
              {totalRequired.toFixed(2)}{" "}
              {totalIngredients > 0
                ? ingredientsUsage[0].ingredient.unit
                : "kg"}
            </p>
          </div>
        </div>

        {/* Barra de disponibilidad */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Disponibilidad
            </span>
            <span className="text-sm font-medium">
              {totalIngredients > 0
                ? Math.round((availableIngredients / totalIngredients) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                canProduce ? "bg-green-500" : "bg-yellow-500"
              }`}
              style={{
                width: `${
                  totalIngredients > 0
                    ? Math.round(
                        (availableIngredients / totalIngredients) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Estado de producción */}
        <Alert
          className={
            canProduce
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
          }
        >
          {canProduce ? (
            <>
              <CircleCheckBig className="h-4 w-4 text-green-500" />
              <AlertTitle>Todo listo</AlertTitle>
              <AlertDescription>
                Todos los ingredientes están disponibles para iniciar la
                producción.
              </AlertDescription>
            </>
          ) : (
            <>
              <TriangleAlert className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Faltan ingredientes</AlertTitle>
              <AlertDescription>
                {missingIngredients.length} ingredientes no tienen suficiente
                stock.
              </AlertDescription>
            </>
          )}
        </Alert>

        {/* Lista detallada de ingredientes */}
        {ingredientsUsage.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Detalle de ingredientes:</h4>
            <div className="space-y-2">
              {ingredientsUsage.map(
                ({ ingredient, totalRequired, isAvailable }) => (
                  <div
                    key={ingredient.id}
                    className={`p-3 rounded border ${
                      !isAvailable
                        ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{ingredient.name}</span>
                      <span>
                        {totalRequired.toFixed(2)} {ingredient.unit}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>
                        Stock: {ingredient.currentStock?.toFixed(2) || "0.00"}{" "}
                        {ingredient.unit}
                      </span>
                      <span
                        className={
                          isAvailable
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {isAvailable ? "Disponible" : "Faltante"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {ingredients?.length === 0
              ? "No se encontraron ingredientes"
              : "No se calcularon ingredientes para la producción"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
