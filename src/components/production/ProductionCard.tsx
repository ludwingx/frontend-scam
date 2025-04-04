import { Button } from "@/components/ui/button";
import { ProductionCardProps } from "@/types/production";
import { AlertTriangle } from "lucide-react";

export default function ProductionCard({
  production,
  onStartProduction,
  showIngredientsUsage,
  onToggleIngredientsUsage,
}: ProductionCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 border-yellow-300",
    in_progress: "bg-blue-100 border-blue-300",
    completed: "bg-green-100 border-green-300",
  };

  const statusLabels = {
    pending: "Pendiente",
    in_progress: "En Proceso",
    completed: "Completada",
  };

  return (
    <div className={`${statusColors[production.status]} rounded-lg border p-4 shadow transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Producción #{production.id}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-sm text-gray-600">
              Estado: <span className="font-medium">{statusLabels[production.status]}</span>
            </span>
            <span className="text-sm text-gray-600">
              Fecha: {new Date(production.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Fecha límite: {new Date(production.dueDate).toLocaleDateString()}
          </p>
        </div>

        {production.status === "pending" && (
          <Button size="sm" onClick={() => onStartProduction(production.id)}>
            Iniciar Producción
          </Button>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2 text-gray-800">Productos:</h4>
        <ul className="space-y-1">
          {production.products.map((product) => (
            <li key={product.id} className="text-sm text-gray-600">
              {product.name} - {product.quantity} unidades
            </li>
          ))}
        </ul>
      </div>

      {(production.missingIngredients ?? []).length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded border border-red-100">
          <div className="flex items-center gap-1 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-medium text-sm text-red-700">Ingredientes faltantes:</h4>
          </div>
          <ul className="mt-1 space-y-1 text-xs">
            {(production.missingIngredients ?? []).map(({ ingredient, missingAmount }) => (
              <li className="text-red-600" key={ingredient.id}>
                {ingredient.name} - Faltan {missingAmount.toFixed(2)} {ingredient.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleIngredientsUsage}
          className="text-blue-600 hover:text-blue-800 px-0"
        >
          {showIngredientsUsage ? "Ocultar ingredientes" : "Mostrar ingredientes usados"}
        </Button>

        {showIngredientsUsage && (production.ingredientsUsage ?? []).length > 0 && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
            <h4 className="font-medium text-sm text-blue-700">Ingredientes utilizados:</h4>
            <ul className="mt-1 space-y-1 text-xs">
              {(production.ingredientsUsage ?? []).map(({ ingredient, amountUsed }) => (
                <li className="text-blue-600" key={ingredient.id}>
                  {ingredient.name} - {amountUsed.toFixed(2)} {ingredient.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}