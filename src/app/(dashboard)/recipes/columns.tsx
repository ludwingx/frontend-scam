"use client";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  toggleRecipeStatus: (recipeId: number, newStatus: number) => Promise<void>
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
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            status === 1
              ? "bg-green-100 text-green-800" // Estilo para "ACTIVO"
              : "bg-red-100 text-red-800" // Estilo para "INACTIVO"
          }`}
        >
          {status === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      );
    },
  },
  {
    accessorKey: "detalleRecetas",
    header: "Detalle de Compra",
    cell: ({ row }) => {
      const detalles = row.original.detalleRecetas;

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
                    detalles.map((detalle, index) => (
                      <tr key={detalle.id} className="border-b">
                        <td className="text-center p-2">{index + 1}</td>
                        <td className="text-center p-2">
                          {detalle.nombre_ingrediente}
                        </td>
                        <td className="text-center p-2">{detalle.cantidad}</td>
                        <td className="text-center p-2">{detalle.unidad}</td>
                      </tr>
                    ))
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
      const recipe = row.original;
      const [name, setName] = useState(recipe.name);
      const [ingredientes, setIngredients] = useState<
        Array<{
          id: number;
          nombre_ingrediente: string;
          cantidad: number;
          unidad: string;
        }>
      >(recipe.detalleRecetas || []);
      const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);

      // Cargar los datos de los ingredientes
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
          toast.error("El nombre de la receta no puede estar vacío.");
          return;
        }

        try {
          // Transformar detalleRecetas a la estructura que el backend espera
          const ingredientesTransformados = ingredientes.map((ing) => ({
            ingredienteId: ing.id, // Asegúrate de que `id` sea el ID del ingrediente
            cantidad: ing.cantidad,
            unidad: ing.unidad,
          }));

          const updatedRecipe = {
            ...recipe,
            id: recipe.id,
            name: recipe.name,
            status: recipe.status,
            ingredientes: ingredientesTransformados,
          };

          await updateRecipeInTable(updatedRecipe );
          toast.success(`Receta "${name}" actualizada exitosamente.`);
        } catch (error) {
          console.error("Error updating recipe:", error);
          toast.error("Error al actualizar la receta. Por favor, inténtalo de nuevo.");
        }
      };

      const handleAddOrUpdateIngredient = (
        ingrediente: Ingredient,
        index?: number
      ) => {
        const updatedIngredients = [...ingredientes];

        const isIngredientAlreadyAdded = updatedIngredients.some(
          (ing) => ing.id === ingrediente.id
        );

        if (isIngredientAlreadyAdded) {
          toast.error(`"${ingrediente.name}" ya está en la lista.`);
          return;
        }

        if (index !== undefined) {
          updatedIngredients[index] = {
            id: ingrediente.id,
            nombre_ingrediente: ingrediente.name, // Asegúrate de asignar el nombre correctamente
            cantidad: updatedIngredients[index].cantidad,
            unidad: ingrediente.unidad || "unidad",
          };
        } else {
          updatedIngredients.push({
            id: ingrediente.id,
            nombre_ingrediente: ingrediente.name, // Asegúrate de asignar el nombre correctamente
            cantidad: 0,
            unidad: ingrediente.unidad || "unidad",
          });
        }

        setIngredients(updatedIngredients);
      };

      const handleRemoveIngredient = (id: number) => {
        const updatedIngredients = ingredientes.filter((ing) => ing.id !== id);
        setIngredients(updatedIngredients);
      };

      const handleToggleStatus = async () => {
        const newStatus = recipe.status === 1 ? 0 : 1;
        try {
          await toggleRecipeStatus(recipe.id, newStatus);
          toast.success(
            `Receta "${recipe.name}" ha sido ${
              newStatus === 1 ? "activada" : "inactivada"
            } exitosamente.`
          );
          // Actualizar el estado local
          recipe.status = newStatus;
        } catch (error) {
          console.log("datos de la receta: ", recipe);
          console.error("Error toggling recipe status:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al cambiar el estado de la receta. Por favor, inténtalo de nuevo."
          );
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Edit Recipe Dialog */}
          <ReusableDialogWidth
            title="Editar receta"
            description={"Ingresa los nuevos datos de la receta " + recipe.name}
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
                      {ingredientes.map((ing, index) => (
                        <TableRow key={ing.id}>
                          <TableCell className="text-center font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            <Combobox
                              value={ing.nombre_ingrediente || ""} // Usar el nombre del ingrediente directamente
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
                                  !ingredientes.some(
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
                                const updatedIngredients = [...ingredientes];
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
                          {ingredientes.length + 1}
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
                                !ingredientes.some(
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
                            disabled
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {ingredientsData.find(
                            (ing) => ing.id === ingredientes[ingredientes.length]?.id
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

          {/* Botón para cambiar el estado de la receta */}
          <Button
            className={recipe.status === 1 ? "bg-red-500 text-white hover:bg-red-500/90" : "bg-green-500 text-white hover:bg-green-500/90"}
            onClick={handleToggleStatus}
          >
            {recipe.status === 1 ? "Desactivar" : "Activar"}
          </Button>
        </div>
      );
    },
  },
];