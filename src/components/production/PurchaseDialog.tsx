import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PurchaseDialogProps {
  showPurchaseDialog: boolean;
  setShowPurchaseDialog: (show: boolean) => void;
  missingIngredients: {
    ingredient: {
      id: number;
      name: string;
      currentStock: number;
      unit: string;
    };
    missingAmount: number;
  }[];
}

export default function PurchaseDialog({
  showPurchaseDialog,
  setShowPurchaseDialog,
  missingIngredients,
}: PurchaseDialogProps) {
  return (
    <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Orden de Compra</DialogTitle>
          <DialogDescription>
            Se requieren los siguientes ingredientes:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h4 className="font-medium mb-2">Ingredientes faltantes:</h4>
          <ul className="space-y-2">
            {missingIngredients.map(({ ingredient, missingAmount }) => (
              <li key={ingredient.id} className="flex justify-between">
                <span>{ingredient.name}</span>
                <span className="font-medium">
                  {missingAmount.toFixed(2)} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowPurchaseDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              toast.success("Orden de compra generada");
              setShowPurchaseDialog(false);
            }}
          >
            Confirmar Orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}