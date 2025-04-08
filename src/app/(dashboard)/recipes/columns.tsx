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
import { X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RecipeData, IngredienteDetalleGet, SimpleRecipe } from "@/types/recipes";
import { Combobox } from "./ComboBox";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { Ingredient } from "@/types/ingredients";
import { ReusableSelect } from "@/components/ReusableSelect";
import { unitOptions } from "@/constants/unitOptions";

type CombinedRecipe = RecipeData & {
  type: 'simple' | 'compound';
  ingredientes?: IngredienteDetalleGet[];
  detalleRecetas?: (IngredienteDetalleGet & { recetaSimpleId?: number })[];
  recetasSimples?: SimpleRecipe[];
};

export const columns = (
  updateRecipeInTable: (updatedRecipe: CombinedRecipe) => Promise<void>,
  ingredientsData: Ingredient[],
  allSimpleRecipes: SimpleRecipe[]
): ColumnDef<CombinedRecipe>[] => [
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
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          type === 'simple' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {type === 'simple' ? 'Simple' : 'Compuesta'}
        </span>
      );
    },
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
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      );
    },
  },
  {
    id: "ingredients",
    header: "Ingredientes",
    cell: ({ row }) => {
      const recipe = row.original;
      const ingredients = recipe.type === 'simple' 
        ? recipe.detalleBases || []
        : recipe.detalleRecetas || [];

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-100 text-black hover:bg-green-200"
            >
              Ver {ingredients.length} ingrediente(s)
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>
                {recipe.type === 'simple' 
                  ? 'Ingredientes base' 
                  : 'Ingredientes compuestos'}
              </SheetTitle>
              <SheetDescription>
                {recipe.name}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-180px)] py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingrediente</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing) => (
                    <TableRow key={ing.id}>
                      <TableCell className="font-medium">
                        {ing.nombre_ingrediente}
                      </TableCell>
                      <TableCell>{ing.cantidad}</TableCell>
                      <TableCell>{ing.unidad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const recipe = row.original;
      const [name, setName] = useState(recipe.name);
      const [description, setDescription] = useState(recipe.description || '');
      const [ingredients, setIngredients] = useState<IngredienteDetalleGet[]>(
        recipe.type === 'simple' 
          ? recipe.detalleBases || []
          : recipe.detalleRecetas || []
      );
      const [isEditing, setIsEditing] = useState(false);

      const handleEditRecipe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(true);

        if (!name.trim()) {
          toast.error("El nombre de la receta no puede estar vacío.");
          setIsEditing(false);
          return;
        }

        try {
          const updatedRecipe: CombinedRecipe = {
            ...recipe,
            name,
            description,
            [recipe.type === 'simple' ? 'detalleBases' : 'detalleRecetas']: ingredients
          };

          await updateRecipeInTable(updatedRecipe);
          toast.success("Receta actualizada correctamente");
        } catch (error) {
          console.error("Error updating recipe:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al actualizar la receta. Por favor, inténtalo de nuevo."
          );
        } finally {
          setIsEditing(false);
        }
      };

      const handleAddOrUpdateIngredient = (
        ingrediente: Ingredient,
        index?: number
      ) => {
        const updatedIngredients = [...ingredients];
        const newIngredient: IngredienteDetalleGet = {
          id: index !== undefined ? updatedIngredients[index].id : Math.random(),
          ingredienteId: ingrediente.id,
          nombre_ingrediente: ingrediente.name,
          cantidad: index !== undefined ? updatedIngredients[index].cantidad : 0,
          unidad: index !== undefined ? updatedIngredients[index].unidad : "Seleccionar Unidad"
        };

        if (index !== undefined) {
          updatedIngredients[index] = newIngredient;
        } else {
          updatedIngredients.push(newIngredient);
        }

        setIngredients(updatedIngredients);
      };

      const handleRemoveIngredient = (id: number) => {
        setIngredients(ingredients.filter(ing => ing.id !== id));
      };

      const handleToggleStatus = async () => {
        try {
          const newStatus = recipe.status === 1 ? 0 : 1;
          const updatedRecipe = { ...recipe, status: newStatus };
          await updateRecipeInTable(updatedRecipe);
          toast.success(
            `Receta ${newStatus === 1 ? 'activada' : 'desactivada'} correctamente`
          );
        } catch (error) {
          console.error("Error toggling recipe status:", error);
          toast.error("Error al cambiar el estado de la receta");
        }
      };

      return (
        <div className="flex gap-2">
          <ReusableDialogWidth
            title={`Editar receta ${recipe.type === 'simple' ? 'simple' : 'compuesta'}`}
            description="Modifica los datos de la receta"
            trigger={
              <Button className="bg-blue-500" size="sm" >
                Editar
              </Button>
            }
            submitButtonText="Guardar cambios"
            onSubmit={handleEditRecipe}
            isSubmitting={isEditing}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>

              {recipe.type === 'simple' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Ingredientes</Label>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader >
                      <TableRow >
                        <TableHead>Ingrediente</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ingredients.map((ing, index) => (
                        <TableRow key={ing.id}>
                          <TableCell>
                            <Combobox
                              value={ing.nombre_ingrediente}
                              onSelect={(ingrediente) => 
                                handleAddOrUpdateIngredient(ingrediente, index)
                              }
                              options={ingredientsData}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={ing.cantidad}
                              onChange={(e) => {
                                const updated = [...ingredients];
                                updated[index].cantidad = Number(e.target.value);
                                setIngredients(updated);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <ReusableSelect
                              options={unitOptions}
                              value={ing.unidad}
                              onValueChange={(value) => {
                                const updated = [...ingredients];
                                updated[index].unidad = value;
                                setIngredients(updated);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveIngredient(ing.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Combobox
                            value=""
                            onSelect={(ingrediente) => 
                              handleAddOrUpdateIngredient(ingrediente)
                            }
                            options={ingredientsData.filter(
                              ing => !ingredients.some(i => i.ingredienteId === ing.id)
                            )}
                            placeholder="Agregar ingrediente"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ReusableDialogWidth>

          <Button
            size="sm"
            variant={recipe.status === 1 ? "destructive" : "default"}
            onClick={handleToggleStatus}
          >
            {recipe.status === 1 ? "Desactivar" : "Activar"}
          </Button>
        </div>
      );
    },
  },
];

const RecipeSimpleRow = ({ recipe }: { recipe: SimpleRecipe }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{recipe.name}</TableCell>
        <TableCell>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              recipe.status === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {recipe.status === 1 ? "ACTIVO" : "INACTIVO"}
          </span>
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            {showIngredients ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Ocultar
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Ver ({recipe.detalleBases?.length || 0})
              </>
            )}
          </Button>
        </TableCell>
      </TableRow>
      {showIngredients && (
        <TableRow >
          <TableCell colSpan={3}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Unidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipe.detalleBases?.map((ing, index) => (
                  <TableRow key={ing.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{ing.nombre_ingrediente}</TableCell>
                    <TableCell>{ing.cantidad}</TableCell>
                    <TableCell>{ing.unidad}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};