import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductionHeaderProps {
  showAllIngredients: boolean;
  setShowAllIngredients: (show: boolean) => void;
}

export default function ProductionHeader({
  showAllIngredients,
  setShowAllIngredients,
}: ProductionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold">Producción</h2>
          <small className="text-sm text-muted-foreground">
            Aquí podrás gestionar las producciones.
          </small>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAllIngredients(!showAllIngredients)}
          className="flex items-center gap-2"
        >
          {showAllIngredients ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Ocultar ingredientes totales
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Mostrar ingredientes totales
            </>
          )}
        </Button>
      </div>
    </div>
  );
}