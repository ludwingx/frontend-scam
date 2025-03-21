import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";

export interface Production {
  id: number;
  name: string;
  quantity: number;
  status: string;
  createdAt: string;
  dueDate: string;
  brand: string;
}

export const columns = (
  updateProductionInTable: (updatedProduction: Production) => Promise<void>,
  deleteProductionFromTable: (productionId: number) => Promise<void>
): ColumnDef<Production>[] => [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const production = row.original;
      const [name, setName] = useState(production.name);

      const handleEditProduction = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
          toast.error("El nombre de la producción no puede estar vacío.");
          return;
        }

        try {
          const updatedProduction = { ...production, name };
          await updateProductionInTable(updatedProduction);
          toast.success(`Producción "${name}" actualizada exitosamente.`);
        } catch (error) {
          console.error("Error updating production:", error);
          toast.error("Error al actualizar la producción. Por favor, inténtalo de nuevo.");
        }
      };

      const handleDeleteProduction = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
          await deleteProductionFromTable(production.id);
          toast.success(`Producción "${production.name}" eliminada exitosamente.`);
        } catch (error) {
          console.error("Error deleting production:", error);
          toast.error("Error al eliminar la producción. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Botón para editar */}
          <Button
            className="bg-blue-600 text-white hover:bg-blue-600/90"
            onClick={handleEditProduction}
          >
            Editar
          </Button>

          {/* Botón para eliminar */}
          <Button
            variant="destructive"
            onClick={handleDeleteProduction}
          >
            Eliminar
          </Button>
        </div>
      );
    },
  },
];