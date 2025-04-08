"use client";

import { useState, useEffect } from "react";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchIngredientsData } from "@/services/fetchIngredientsData";
import { Combobox } from "./ComboBox";
import { toast } from "sonner";
import { ReusableSelect } from "@/components/ReusableSelect";
import { unitOptions } from "@/constants/unitOptions";
import { ReusableDialog } from "@/components/ReusableDialog";

interface Item {
  id: number;
  name: string;
  cantidad: number;
  unidad?: string;
  status: number;
}

interface RecipeActionsProps {
  onRefresh: () => void;
  onToggleActiveRecipes: (showActive: boolean) => void;
}

export function RecipeActions({ onRefresh, onToggleActiveRecipes }: RecipeActionsProps) {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [name, setNombre] = useState("");
  const [ingredientsData, setIngredientsData] = useState<Item[]>([]);
  const [showActiveRecipes, setShowActiveRecipes] = useState(true); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadIngredients = async () => {
      const data = await fetchIngredientsData();
      setIngredientsData(data || []);
    };

    loadIngredients();
  }, []);

  const handleAddOrUpdateIngredient = (ingrediente: Item, index?: number) => {
    const updatedIngredients = [...ingredients];

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
        name: ingrediente.name,
        cantidad: updatedIngredients[index].cantidad,
        unidad: updatedIngredients[index].unidad,
        status: ingrediente.status,
      };
    } else {
      updatedIngredients.push({
        id: ingrediente.id,
        name: ingrediente.name,
        cantidad: 0,
        unidad: "",
        status: ingrediente.status,
      });
    }

    setIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("El nombre de la receta no puede estar vacío.");
      return;
    }

    if (ingredients.length === 0) {
      toast.error("Debes agregar al menos un ingrediente.");
      return;
    }

    const recipeData = {
      name,
      status: 1,
      ingredientes: ingredients.map((ing) => ({
        ingredienteId: ing.id,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      })),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
      if (!apiUrl) {
        throw new Error("La URL de la API no está definida.");
      }

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró un token de autenticación.");
      }

      const response = await fetch(`${apiUrl}/api/receta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Error al crear la receta: ${response.status} ${response.statusText}. ${errorData?.message || ""}`
        );
      }

      const data = await response.json();
      toast.success(`Receta "${data.name}" creada exitosamente.`);
      setNombre("");
      setIngredients([]);
      onRefresh();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Error al crear la receta. Por favor, inténtalo de nuevo.");
    }
  };

  const handleToggleActiveRecipes = () => {
    const newShowActiveRecipes = !showActiveRecipes;
    setShowActiveRecipes(newShowActiveRecipes);
    onToggleActiveRecipes(newShowActiveRecipes);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón para alternar entre recetas activas e inactivas */}
      <Button
        onClick={handleToggleActiveRecipes}
        variant="outline"
        className={`${
          showActiveRecipes 
            ? "bg-green-600 hover:bg-green-600/90 text-white dark:bg-green-800 dark:hover:bg-green-800/90" 
            : "bg-amber-600 hover:bg-amber-600/90 text-white dark:bg-amber-800 dark:hover:bg-amber-800/90"
        }`}
      >
        {showActiveRecipes ? "Ver Inactivas" : "Ver Activas"}
      </Button>

      {/* Diálogo para crear recetas simples */}
      <ReusableDialogWidth
        title="Crear Receta Simple"
        description="Llena el formulario para crear una receta simple"
        trigger={
          <Button className="bg-blue-600 hover:bg-blue-600/90 text-white dark:bg-blue-800 dark:hover:bg-blue-800/90">
            <CirclePlus className="mr-2 h-4 w-4" />
            Crear Receta Simple
          </Button>
        }
        onSubmit={handleSubmit}
        submitButtonText="Crear Receta"
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="grid grid-cols-4 items-center gap-4 pt-4">
              <Label htmlFor="name" className="text-right dark:text-gray-300">
                Nombre
              </Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre de la receta"
                className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="grid items-center gap-4 pt-4">
            <h5 className="text-lg font-semibold dark:text-gray-300">
              Lista de Ingredientes:
            </h5>
            <ScrollArea className="h-[300px] w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                  <TableRow>
                    <TableHead className="text-center w-[40px] dark:text-gray-300">
                      N°
                    </TableHead>
                    <TableHead className="text-center w-[120px] dark:text-gray-300">
                      Ingrediente
                    </TableHead>
                    <TableHead className="text-center w-[100px] dark:text-gray-300">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-center w-[120px] dark:text-gray-300">
                      Unidad
                    </TableHead>
                    <TableHead className="w-[40px] dark:text-gray-300"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={ing.id} className="dark:border-gray-700">
                      <TableCell className="text-center font-medium dark:text-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        <Combobox
                          value={ing.name}
                          onSelect={(ingrediente) =>
                            handleAddOrUpdateIngredient(
                              {
                                ...ingrediente,
                                unidad: ingrediente.unidad?.toLowerCase(),
                              },
                              index
                            )
                          }
                          options={ingredientsData}
                          className="dark:bg-gray-800 dark:text-white"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          type="number"
                          name="cantidad"
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
                        <ReusableSelect
                          onValueChange={(value) => {
                            const updatedIngredients = [...ingredients];
                            updatedIngredients[index].unidad = value;
                            setIngredients(updatedIngredients);
                          }}
                          options={unitOptions}
                          value={ing.unidad || ""}
                          placeholder="Seleccionar unidad"
                          label="Unidad"
                          disabled={false}
                          name="Unidad"
                          className="dark:bg-gray-800 dark:text-white"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="dark:hover:bg-gray-700"
                        >
                          <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="dark:border-gray-700">
                    <TableCell className="text-center font-medium dark:text-gray-300">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <Combobox
                        value=""
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient({
                            ...ingrediente,
                            unidad: ingrediente.unidad?.toLowerCase() || "unidad(es)",
                          })
                        }
                        options={ingredientsData}
                        placeholder="Seleccionar ingrediente"
                        className="dark:bg-gray-800 dark:text-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="text-center w-full dark:bg-gray-800 dark:border-gray-700"
                        type="number"
                        placeholder="0"
                        disabled
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <ReusableSelect
                        onValueChange={(value) => {
                          const updatedIngredients = [...ingredients];
                          if (updatedIngredients[ingredients.length]) {
                            updatedIngredients[ingredients.length].unidad = value;
                            setIngredients(updatedIngredients);
                          }
                        }}
                        options={unitOptions}
                        placeholder="Seleccionar unidad"
                        label=""
                        name=""
                        disabled={true}
                        className="dark:bg-gray-800"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" disabled className="dark:hover:bg-gray-700">
                        <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </ReusableDialogWidth>

      {/* Diálogo para crear recetas compuestas */}
      <ReusableDialog
        onOpenChange={setIsDialogOpen}
        title="Crear Receta Compuesta"
        description="Ingrese los datos de la receta compuesta"
        trigger={
          <Button className="bg-purple-600 hover:bg-purple-600/90 text-white dark:bg-purple-800 dark:hover:bg-purple-800/90">
            <CirclePlus className="mr-2 h-4 w-4" />
            Crear Receta Compuesta
          </Button>
        }
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols">
            <div className="grid items-center grid-cols-4 gap-4 pt-4">
              <Label htmlFor="name" className="dark:text-gray-300">
                Nombre
              </Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre de la receta compuesta"
                className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="grid items-center gap-4 pt-4">
            <h5 className="text-lg font-semibold dark:text-gray-300">
              Lista de Recetas Simples:
            </h5>
            <ScrollArea className="h-[300px] w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="text-center w-[40px] dark:text-gray-300">
                      N°
                    </TableHead>
                    <TableHead className="text-center w-[120px] dark:text-gray-300">
                      Recetas Simples
                    </TableHead>
                    <TableHead className="w-[40px] dark:text-gray-300"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={ing.id} className="dark:border-gray-700">
                      <TableCell className="text-center font-medium dark:text-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        <Combobox
                          value={ing.name}
                          onSelect={(ingrediente) =>
                            handleAddOrUpdateIngredient(
                              {
                                ...ingrediente,
                                unidad: ingrediente.unidad?.toLowerCase(),
                              },
                              index
                            )
                          }
                          options={ingredientsData}
                          className="dark:bg-gray-800 dark:text-white"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="dark:hover:bg-gray-700"
                        >
                          <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="dark:border-gray-700">
                    <TableCell className="text-center font-medium dark:text-gray-300">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <Combobox
                        value=""
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient({
                            ...ingrediente,
                            unidad: ingrediente.unidad?.toLowerCase() || "unidad(es)",
                          })
                        }
                        options={ingredientsData}
                        placeholder="Seleccionar ingrediente"
                        className="dark:bg-gray-800 dark:text-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" disabled className="dark:hover:bg-gray-700">
                        <X className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </ReusableDialog>
    </div>
  );
}