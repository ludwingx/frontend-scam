import { ColumnDef } from "@tanstack/react-table";
import { Ingredient } from "@/types/ingredients";
import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { ReusableSelect } from "@/components/ReusableSelect";
import { unitOptions } from "@/constants/unitOptions";

// Componente para las acciones de edición, activar/desactivar y eliminar
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
  const [quantity, setQuantity] = useState(ingredients.cantidad);
  const [unit, setUnit] = useState(ingredients.unidad);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "delete">(
    ingredients.status === 1 ? "deactivate" : "activate"
  );

  // Función para editar ingrediente
  const handleEditIngredients = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre del ingrediente no puede estar vacío.");
      return;
    }

    try {
      const updatedIngredients = { ...ingredients, name, cantidad: quantity, unidad: unit };
      await updateIngredientsInTable(updatedIngredients);
      toast.success(`Ingrediente "${name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating ingredients:", error);
      toast.error("Error al actualizar el ingrediente. Por favor, inténtalo de nuevo.");
    }
  };

  // Función para manejar la acción (activar/desactivar o eliminar)
  const handleAction = async () => {
    try {
      if (actionType === "delete") {
        await deleteIngredientsFromTable(ingredients.id.toString());
        toast.success(`Ingrediente "${ingredients.name}" eliminado exitosamente.`);
      } else {
        const newStatus = actionType === "activate" ? 1 : 0;
        const updatedIngredients = { ...ingredients, status: newStatus };
        await updateIngredientsInTable(updatedIngredients);
        toast.success(
          `Ingrediente "${ingredients.name}" ${
            newStatus === 1 ? "activado" : "desactivado"
          } exitosamente.`
        );
        // Cambiar el tipo de acción después de activar/desactivar
        setActionType(newStatus === 1 ? "deactivate" : "activate");
      }
      setIsConfirmDialogOpen(false); // Cerrar el diálogo después de la acción
    } catch (error) {
      console.error("Error al realizar la acción:", error);
      toast.error("Error al realizar la acción. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {/* Diálogo para editar ingrediente */}
      <ReusableDialog
        title="Editar Ingrediente"
        description={
          <>
            Aquí podrás modificar los datos del ingrediente <strong>{ingredients.name}</strong>.
          </>
        }
        trigger={
          <Button className="bg-amber-400 text-white hover:bg-amber-400/80">
            Editar
          </Button>
        }
        onSubmit={handleEditIngredients}
        submitButtonText="Guardar Cambios"
        onOpenChange={(open) => {
          if (!open) {
            setName(ingredients.name);
            setQuantity(ingredients.cantidad);
            setUnit(ingredients.unidad);
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
              name="cantidad"
              defaultValue={ingredients.cantidad}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
              placeholder={"Selecciona una unidad"}
              value={unit}
              label="Unidad"
              options={unitOptions}
              onValueChange={setUnit}
              className="col-span-3"
              disabled={false}
            />
          </div>
        </div>
      </ReusableDialog>

      {/* Diálogo para activar/desactivar o eliminar */}
      <ReusableDialog
        title={
          actionType === "delete"
            ? "Eliminar Ingrediente"
            : actionType === "activate"
            ? "Habilitar Ingrediente"
            : "Deshabilitar Ingrediente"
        }
        description={
          actionType === "delete"
            ? `¿Estás seguro de eliminar el ingrediente "${ingredients.name}"?`
            : `¿Estás seguro de que deseas ${
                actionType === "activate" ? "activar" : "desactivar"
              } el ingrediente "${ingredients.name}"?`
        }
        trigger={
          <Button
            className={
              actionType === "delete" || actionType === "activate"
                ? "bg-green-600 hover:bg-green-600/80"
                : "bg-red-500 hover:bg-red-500/80"
            }
            onClick={() => setIsConfirmDialogOpen(true)}
          >
            {actionType === "delete"
              ? "Eliminar"
              : actionType === "activate"
              ? "Habilitar"
              : "Deshabilitar"}
          </Button>
        }
        onSubmit={handleAction}
        submitButtonText={
          actionType === "delete"
            ? "Eliminar"
            : actionType === "activate"
            ? "Habilitar"
            : "Deshabilitar"
        }
        onOpenChange={setIsConfirmDialogOpen}
        isOpen={isConfirmDialogOpen}
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
    },
  },
  {
    accessorKey: "unit_measurement",
    header: "Unidad",
    cell: ({ row }) => {
      return <div>{row.original.unidad}</div>;
    },
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