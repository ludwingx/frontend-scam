import { ColumnDef } from "@tanstack/react-table";
import { Ingredients } from "@/types/ingredients";
import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

// Componente para las acciones de edición y eliminación
const ActionsCell = ({
  ingredients,
  updateIngredientsInTable,
  deleteIngredientsFromTable,
}: {
  ingredients: Ingredients;
  updateIngredientsInTable: (updatedIngredients: Ingredients) => Promise<void>;
  deleteIngredientsFromTable: (ingredientsId: string) => Promise<void>;
}) => {
  const [name, setName] = useState(ingredients.name);

  const handleEditIngredients = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre del ingrediente no puede estar vacío.");
      return;
    }

    try {
      const updatedIngredients = { ...ingredients, name };
      await updateIngredientsInTable(updatedIngredients);
      toast.success(`Ingrediente "${name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating ingredients:", error);
      toast.error("Error al actualizar el ingrediente. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteIngredients = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await deleteIngredientsFromTable(ingredients.id);
      toast.success(`Ingrediente "${ingredients.name}" eliminado exitosamente.`);
    } catch (error) {
      console.error("Error deleting ingredients:", error);
      toast.error("Error al eliminar el ingrediente. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {/* Edit Ingredients Dialog */}
      <ReusableDialog
        title="Editar Ingrediente"
        description={
          <>
            Aquí podrás modificar los datos del ingrediente <strong>{ingredients.name}</strong>.
          </>
        }
        trigger={
          <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
            Editar
          </Button>
        }
        onSubmit={handleEditIngredients}
        submitButtonText="Guardar Cambios"
        onOpenChange={(open) => {
          if (!open) {
            setName(ingredients.name); // Resetear el estado del nombre cuando el diálogo se cierra
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
              defaultValue={ingredients.name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </ReusableDialog>

      {/* Delete Ingredients Dialog */}
      <ReusableDialog
        title="Eliminar Ingrediente"
        description={
          <>
            ¿Estás seguro de eliminar el ingrediente <strong>{ingredients.name}</strong>?
          </>
        }
        trigger={<Button variant="destructive">Eliminar</Button>}
        onSubmit={handleDeleteIngredients}
        submitButtonText="Eliminar"
      />
    </div>
  );
};

// Función para generar las columnas
export const columns = (
  updateIngredientsInTable: (updatedIngredients: Ingredients) => Promise<void>,
  deleteIngredientsFromTable: (ingredientsId: string) => Promise<void>
): ColumnDef<Ingredients>[] => [
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
    cell: ({ row }) => (
      <ActionsCell
        ingredients={row.original}
        updateIngredientsInTable={updateIngredientsInTable}
        deleteIngredientsFromTable={deleteIngredientsFromTable}
      />
    ),
  },
];