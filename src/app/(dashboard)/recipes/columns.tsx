import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { Recipe } from "@/types/recipes";
export const columns = (
  updateRecipeInTable: (updatedRecipe: Recipe) => Promise<void>,
  deleteRecipeFromTable: (RecipeId: number) => Promise<void>
): ColumnDef<Recipe>[] => [
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
    accessorKey: "detalle_compra",
    header: "Detalle de Compra",
    cell: ({ row }) => {
      const detalles = row.original.detalleRecetas;

      return (
        <Sheet >
          <SheetTrigger  asChild>
            <Button variant="outline" className="w-full bg-green-100 hover:bg-green-200" >Ver Detalle</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl ">
            <SheetHeader>
              <SheetTitle>Detalle de la Receta</SheetTitle>
              <SheetDescription className="pb-6">
                Aquí puedes ver el detalle de los ingredientes comprados.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-200px)] p-2">
              <table className="w-full text-sm pr-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-center  p-2">N°</th>
                    <th className="text-center p-2">Ingrediente</th>
                    <th className="text-center p-2">Cantidad</th>
                    <th className="text-center p-2">Unidad de Medida</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles?.map((detalle) => (
                    <tr key={detalle.id} className="border-b">
                      <td className="text-center p-2">{detalles.indexOf(detalle) + 1}</td>
                      <td className="text-center p-2">{detalle.nombre_ingrediente}</td>
                      <td className="text-center p-2">{detalle.cantidad}</td>
                      <td className="text-center p-2">{detalle.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
            <SheetFooter className="pt-8">
              <SheetClose asChild>
                <Button type="button">Cerrar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const Recipe = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [name, setName] = useState(Recipe.name);

      const handleEditRecipe = async (e: React.FormEvent) => {
        console.log("Editando receta:", Recipe.id, Recipe.name); // Log para verificar la edición
        e.preventDefault(); // Prevenir el envío automático del formulario

        if (!name.trim()) {
          toast.error("El nombre del receta no puede estar vacío.");
          return;
        }

        try {
          const updatedRecipe = { ...Recipe, name };
          console.log("Actualizando receta en la tabla:", updatedRecipe); // Log para verificar la actualización
          await updateRecipeInTable(updatedRecipe);
          toast.success(`receta "${name}" actualizado exitosamente.`);
        } catch (error) {
          console.error("Error updating Recipe:", error);
          toast.error("Error al actualizar el receta. Por favor, inténtalo de nuevo.");
        }
      };

      const handleDeleteRecipe = async (e: React.FormEvent) => {
        console.log("Eliminando receta:", Recipe.id, Recipe.name); // Log para verificar la eliminación
        e.preventDefault(); // Prevenir el envío automático del formulario

        try {
          await deleteRecipeFromTable(Recipe.id);
          toast.success(`receta "${Recipe.name}" eliminado exitosamente.`);
        } catch (error) {
          console.error("Error deleting Recipe:", error);
          toast.error("Error al eliminar el receta. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Edit Recipe Dialog */}
          <ReusableDialog
            title="Editar receta"
            description={
              <>
                Aquí podrás modificar los datos del receta <strong>{Recipe.name}</strong>.
              </>
            }
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
            onSubmit={handleEditRecipe}
            submitButtonText="Guardar Cambios"
            onOpenChange={(open) => {
              if (!open) {
                console.log("Diálogo de edición cerrado"); // Log para verificar el cierre del diálogo
                setName(Recipe.name); // Resetear el estado del nombre cuando el diálogo se cierra
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
                  defaultValue={Recipe.name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </ReusableDialog>

          {/* Delete Recipe Dialog */}
          <ReusableDialog
            title="Eliminar receta"
            description={
              <>
                ¿Estás seguro de eliminar el receta <strong>{Recipe.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteRecipe}
            submitButtonText="Eliminar"
            // eslint-disable-next-line react/no-children-prop
            children={ null }
          />
        </div>
      );
    },
  },
];
