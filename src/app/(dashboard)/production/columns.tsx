import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { Production } from "@/types/production";

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
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const production = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [name, setName] = useState(production.name);

      const handleEditProduction = async (e: React.FormEvent) => {
        console.log("Editando negocio:", production.id, production.name); // Log para verificar la edición
        e.preventDefault(); // Prevenir el envío automático del formulario

        if (!name.trim()) {
          toast.error("El nombre del negocio no puede estar vacío.");
          return;
        }

        try {
          const updatedProduction = { ...production, name };
          console.log("Actualizando negocio en la tabla:", updatedProduction); // Log para verificar la actualización
          await updateProductionInTable(updatedProduction);
          toast.success(`Negocio "${name}" actualizado exitosamente.`);
        } catch (error) {
          console.error("Error updating production:", error);
          toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
        }
      };

      const handleDeleteProduction = async (e: React.FormEvent) => {
        console.log("Eliminando negocio:", production.id, production.name); // Log para verificar la eliminación
        e.preventDefault(); // Prevenir el envío automático del formulario

        try {
          await deleteProductionFromTable(production.id);
          toast.success(`Negocio "${production.name}" eliminado exitosamente.`);
        } catch (error) {
          console.error("Error deleting production:", error);
          toast.error("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Edit Production Dialog */}
          <ReusableDialog
            title="Editar Negocio"
            description={
              <>
                Aquí podrás modificar los datos del negocio <strong>{production.name}</strong>.
              </>
            }
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
            onSubmit={handleEditProduction}
            submitButtonText="Guardar Cambios"
            onOpenChange={(open) => {
              if (!open) {
                console.log("Diálogo de edición cerrado"); // Log para verificar el cierre del diálogo
                setName(production.name); // Resetear el estado del nombre cuando el diálogo se cierra
              }
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  defaultValue={production.name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </ReusableDialog>

          {/* Delete Production Dialog */}
          <ReusableDialog
            title="Eliminar Negocio"
            description={
              <>
                ¿Estás seguro de eliminar el negocio <strong>{production.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteProduction}
            submitButtonText="Eliminar"
            // eslint-disable-next-line react/no-children-prop
            children={ null }
          />
        </div>
      );
    },
  },
];

export type { Production };