"use client";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Recipe } from "@/types/recipes";
import { Combobox } from "./ComboBox";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { fetchIngredientsData } from "@/services/fetchIngredientsData";
import { Ingredient } from "@/types/ingredients";

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
      const detalles = row.original.detalleRecetas; // Cambiado a detalleRecetas
      console.log("Detalles recibidos:", detalles); // Depuración

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-green-100 hover:bg-green-200"
            >
              Ver Detalle
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl">
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
                    <th className="text-center p-2">N°</th>
                    <th className="text-center p-2">Ingrediente</th>
                    <th className="text-center p-2">Cantidad</th>
                    <th className="text-center p-2">Unidad de Medida</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles && detalles.length > 0 ? (
                    detalles.map((detalle, index) => {
                      console.log("Detalle del ingrediente:", detalle); // Depuración
                      return (
                        <tr key={detalle.id} className="border-b">
                          <td className="text-center p-2">{index + 1}</td>
                          <td className="text-center p-2">{detalle.nombre_ingrediente}</td>
                          <td className="text-center p-2">{detalle.cantidad}</td>
                          <td className="text-center p-2">{detalle.unidad}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-2">
                        No hay ingredientes para mostrar.
                      </td>
                    </tr>
                  )}
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
      const [name, setName] = useState(Recipe.name);
      const [ingredients, setIngredients] = useState<
        Array<{
          id: number;
          nombre_ingrediente: string;
          cantidad: number;
          unidad: string;
        }>
      >([]);
      const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);

      // Cargar los ingredientes de la receta al abrir el diálogo
      useEffect(() => {
        if (Recipe.detalleRecetas) {
          console.log("Ingredientes de la receta:", Recipe.detalleRecetas); // Depuración
          const initialIngredients = Recipe.detalleRecetas.map((detalle) => ({
            id: detalle.id,
            nombre_ingrediente: detalle.nombre_ingrediente,
            cantidad: detalle.cantidad,
            unidad: detalle.unidad,
          }));
          console.log("Ingredientes mapeados:", initialIngredients); // Depuración
          setIngredients(initialIngredients);
        }
      }, [Recipe.detalleRecetas]);

      // Carga de ingredientsData desde fetchIngredientData.ts donde esta el crud
      useEffect(() => {
        const loadIngredients = async () => {
          const data = await fetchIngredientsData();
          setIngredientsData(data || []);
        };
        loadIngredients();
      }, []);

      const handleEditRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
      
        if (!name.trim()) {
          toast.error("El nombre del receta no puede estar vacío.");
          return;
        }
      
        try {
          const { ...rest } = Recipe; // Elimina las propiedades duplicadas
          const updatedRecipe = {
            ...rest, // Copia el resto de las propiedades
            name: name,
            detalleRecetas: ingredients.map((ing) => ({
              id: ing.id,
              nombre_ingrediente: ing.nombre_ingrediente,
              cantidad: ing.cantidad,
              unidad: ing.unidad,
            })),
          };
      
          console.log("Objeto actualizado:", updatedRecipe); // Depuración
      
          await updateRecipeInTable(updatedRecipe as Recipe);
          toast.success(`Receta "${name}" actualizada exitosamente.`);
        } catch (error) {
          console.error("Error updating Recipe:", error);
          toast.error(
            "Error al actualizar el receta. Por favor, inténtalo de nuevo."
          );
        }
      };

      const handleDeleteRecipe = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
          await deleteRecipeFromTable(Recipe.id);
          toast.success(`Receta "${Recipe.name}" eliminada exitosamente.`);
        } catch (error) {
          console.error("Error deleting Recipe:", error);
          toast.error(
            "Error al eliminar el receta. Por favor, inténtalo de nuevo."
          );
        }
      };

      const handleAddOrUpdateIngredient = (
        ingrediente: Ingredient,
        index?: number
      ) => {
        const updatedIngredients = [...ingredients];
        console.log("Ingrediente seleccionado:", ingrediente); // Depuración
      
        const isIngredientAlreadyAdded = updatedIngredients.some(
          (ing) =>
            ing.id === ingrediente.id ||
            ing.nombre_ingrediente.toLowerCase() === ingrediente.name.toLowerCase()
        );
      
        if (isIngredientAlreadyAdded) {
          toast.error(`"${ingrediente.name}" ya está en la lista.`);
          return;
        }
      
        if (index !== undefined) {
          // Si se está actualizando un ingrediente existente, mantener la cantidad actual
          updatedIngredients[index] = {
            id: ingrediente.id,
            nombre_ingrediente: ingrediente.name,
            cantidad: updatedIngredients[index].cantidad, // Mantener la cantidad actual
            unidad: ingrediente.unidad || "unidad",
          };
        } else {
          // Si se está añadiendo un nuevo ingrediente, establecer la cantidad en 0
          updatedIngredients.push({
            id: ingrediente.id,
            nombre_ingrediente: ingrediente.name,
            cantidad: 0, // Inicializar la cantidad en 0
            unidad: ingrediente.unidad || "unidad",
          });
        }
      
        console.log("Ingredientes actualizados:", updatedIngredients); // Depuración
        setIngredients(updatedIngredients);
      };

      const handleRemoveIngredient = (id: number) => {
        const updatedIngredients = ingredients.filter((ing) => ing.id !== id);
        setIngredients(updatedIngredients);
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Edit Recipe Dialog */}
          <ReusableDialogWidth
            title="Editar receta"
            description={"Ingresa los nuevos datos de la receta " + Recipe.name}
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
            submitButtonText="Guardar Cambios"
            onSubmit={handleEditRecipe as unknown as () => Promise<void>}
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <div className="grid grid-cols-4 items-center gap-4 pt-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ingresa el nombre de la receta"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid items-center gap-4 pt-4">
                <h5 className="text-l font-semibold text-gray-900">
                  Lista de Ingredientes:
                </h5>
                <ScrollArea className="h-[300px] w-full overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead className="text-center w-[40px] text-gray-900">
                          N°
                        </TableHead>
                        <TableHead className="text-center w-[120px] text-gray-900">
                          Ingrediente
                        </TableHead>
                        <TableHead className="text-center w-[100px] text-gray-900">
                          Cantidad
                        </TableHead>
                        <TableHead className="text-center w-[120px] text-gray-900">
                          Unidad
                        </TableHead>
                        <TableHead className="w-[40px] text-gray-900"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ingredients.map((ing, index) => (
                        <TableRow key={ing.id}>
                          <TableCell className="text-center font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            <Combobox
                              value={ing.nombre_ingrediente} // Mostrar el nombre del ingrediente actual
                              onSelect={(ingrediente) =>
                                handleAddOrUpdateIngredient(
                                  {
                                    ...ingrediente,
                                    unidad:
                                      ingrediente.unidad?.toLowerCase() ||
                                      "unidad",
                                  },
                                  index
                                )
                              }
                              options={ingredientsData.filter(
                                (ingOption) =>
                                  !ingredients.some(
                                    (existingIng) =>
                                      existingIng.id === ingOption.id
                                  )
                              )}
                              placeholder="Seleccionar ingrediente"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="text-center w-full"
                              type="number"
                              value={ing.cantidad}
                              onChange={(e) => {
                                const updatedIngredients = [...ingredients];
                                updatedIngredients[index].cantidad = parseFloat(
                                  e.target.value
                                );
                                setIngredients(updatedIngredients);
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {ing.unidad}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveIngredient(ing.id)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell className="text-center font-medium">
                          {ingredients.length + 1}
                        </TableCell>
                        <TableCell className="text-center">
                          <Combobox
                            value=""
                            onSelect={(ingrediente) =>
                              handleAddOrUpdateIngredient({
                                ...ingrediente,
                                unidad:
                                  ingrediente.unidad?.toLowerCase() || "unidad",
                              })
                            }
                            options={ingredientsData.filter(
                              (ingOption) =>
                                !ingredients.some(
                                  (existingIng) =>
                                    existingIng.id === ingOption.id
                                )
                            )}
                            placeholder="Seleccionar ingrediente"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="text-center w-full"
                            type="number"
                            placeholder="0"
                            value={
                              ingredients[ingredients.length]?.cantidad || ""
                            }
                            onChange={(e) => {
                              const updatedIngredients = [...ingredients];
                              updatedIngredients[ingredients.length].cantidad =
                                parseFloat(e.target.value);
                              setIngredients(updatedIngredients);
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {ingredientsData.find(
                            (ing) =>
                              ing.id === ingredients[ingredients.length]?.id
                          )?.unidad || ""}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" disabled>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </ReusableDialogWidth>

          {/* Delete Recipe Dialog */}
          <ReusableDialog
            title="Eliminar receta"
            description={
              <>
                ¿Estás seguro de eliminar el receta{" "}
                <strong>{Recipe.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteRecipe}
            submitButtonText="Eliminar"
            // eslint-disable-next-line react/no-children-prop
            children={null}
          />
        </div>
      );
    },
  },
];