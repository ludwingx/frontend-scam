import { ColumnDef } from "@tanstack/react-table";
import { Ingredient } from "@/types/ingredients";
import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { ReusableSelect } from "@/components/ReusableSelect"; // Importa el componente ReusableSelect

// Opciones para el select de unidades de medida
const unitOptions = [
  { value: "gramos", label: "Gramos" },
  { value: "kilogramos", label: "Kilogramos" },
  { value: "litros", label: "Litros" },
  { value: "mililitros", label: "Mililitros" },
  { value: "unidades", label: "Unidades" },
];

// Componente para las acciones de edición y eliminación
const ActionsCell = ({
  ingredients,
  updateIngredientsInTable,
  deleteIngredientsFromTable,
}: {
  ingredients: Ingredient;
  updateIngredientsInTable: (updatedIngredients: Ingredient) => Promise<void>;
  deleteIngredientsFromTable: (ingredientsId: string) => Promise<void>;
}) => {
  const [name, setName] = useState(ingredients.name);
  const [unit, setUnit] = useState(ingredients.unidad); // Estado para la unidad de medida

  const handleEditIngredients = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre del ingrediente no puede estar vacío.");
      return;
    }

    try {
      const updatedIngredients = { ...ingredients, name, unit_measurement: unit };
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
      await deleteIngredientsFromTable(ingredients.id.toString());
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
            setUnit(ingredients.unidad); // Resetear el estado de la unidad
          }
        }}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
            placeholder="Ingresa el nombre del ingrediente"
              id="name"
              defaultValue={ingredients.name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="cantidad"
                  defaultValue={ingredients.cantidad}
                  placeholder="Ingresa la cantidad"
                  className="col-span-3"
                />
              </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unidad
            </Label>
            <ReusableSelect
              name="unit"
              placeholder={ingredients.unidad}
              label="Unidad"
              options={unitOptions}
              onValueChange={setUnit}
              className="col-span-3"
              disabled={false}
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
        // eslint-disable-next-line react/no-children-prop
        children={null}
      />
    </div>
  );
};

// Función para generar las columnas
export const columns = (
  updateIngredientsInTable: (updatedIngredients: Ingredient) => Promise<void>,
  deleteIngredientsFromTable: (ingredientsId: string) => Promise<void>
): ColumnDef<Ingredient>[] => [
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
    cell: ({ row }) => {
      return <div>{row.original.cantidad}</div>;
    }
  },
  {
    accessorKey: "unit_measurement",
    header: "Unidad",
    cell: ({ row }) => {
      return <div>{row.original.unidad}</div>;
    }
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