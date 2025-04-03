import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ProductionCardProps } from "../types/production";

export default function ProductionCard({
  production,
  ingredients,
  onStartProduction,
  showIngredientsUsage,
  onToggleIngredientsUsage,
}: ProductionCardProps) {
  const cardColor = {
    pending: "bg-yellow-100",
    in_progress: "bg-blue-100",
    completed: "bg-green-100",
  }[production.status];

  return (
    <div className={`${cardColor} rounded-lg shadow p-4 transition-transform transform hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Producción #{production.id}
          </h3>
          <p className="text-sm text-gray-600">
            Estado:{" "}
            {production.status === "pending"
              ? "Pendiente"
              : production.status === "in_progress"
              ? "En Proceso"
              : "Completada"}
          </p>
          <p className="text-sm text-gray-600">
            Fecha: {new Date(production.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Fecha límite: {new Date(production.dueDate).toLocaleDateString()}
          </p>
        </div>

        {production.status === "pending" && (
          <Button size="sm" onClick={() => onStartProduction(production.id)}>
            Iniciar Producción
          </Button>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-medium text-gray-900">Productos:</h4>
        <ul className="list-disc pl-5">
          {production.products.map((product) => (
            <li key={product.id} className="text-sm text-gray-600">
              {product.name} - {product.quantity} unidades
            </li>
          ))}
        </ul>
      </div>

      {production.missingIngredients?.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded">
          <h4 className="font-medium text-sm text-red-700">
            Faltan ingredientes:
          </h4>
          <ul className="list-disc pl-5 text-xs text-red-700">
            {production.missingIngredients.map(
              ({ ingredient, missingAmount }) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {missingAmount.toFixed(2)}{" "}
                  {ingredient.unit}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleIngredientsUsage}
          className="text-blue-600 hover:text-blue-800"
        >
          {showIngredientsUsage
            ? "Ocultar ingredientes"
            : "Mostrar ingredientes a usar"}
        </Button>

        {showIngredientsUsage && production.ingredientsUsage && (
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <h4 className="font-medium text-sm text-blue-700">
              Ingredientes a utilizar:
            </h4>
            <ul className="list-disc pl-5 text-xs text-blue-700">
              {production.ingredientsUsage.map(({ ingredient, amountUsed }) => (
                <li key={ingredient.id}>
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