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
import { ReusableSelect } from "@/components/ReusableSelect"; // Importar ReusableSelect
import { unitOptions } from "@/constants/unitOptions"; // Importar las opciones de unidades

interface Item {
  id: number;
  name: string;
  cantidad: number;
  unidad?: string;
  status: number;
}

interface RecipeActionsProps {
  onRefresh: () => void; // Prop para actualizar la tabla
  onToggleActiveRecipes: (showActive: boolean) => void; // Prop para alternar entre recetas activas e inactivas
}

export function RecipeActions({ onRefresh, onToggleActiveRecipes }: RecipeActionsProps) {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [name, setNombre] = useState("");
  const [ingredientsData, setIngredientsData] = useState<Item[]>([]);
  const [showActiveRecipes, setShowActiveRecipes] = useState(true); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog open/close
  useEffect(() => {
    // Cargar los datos de los ingredientes al montar el componente
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
        unidad: updatedIngredients[index].unidad, // Mantener la unidad actual
        status: ingrediente.status,
      };
    } else {
      updatedIngredients.push({
        id: ingrediente.id,
        name: ingrediente.name,
        cantidad: 0,
        unidad: "", // Unidad por defecto
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
      status: 1, // Asegúrate de incluir el status si es requerido
      ingredientes: ingredients.map((ing) => ({
        ingredienteId: ing.id,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      })),
    };

    console.log("datos de la receta:", recipeData); // Para depuración

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

      if (!apiUrl) {
        throw new Error("La URL de la API no está definida en las variables de entorno.");
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

      // Limpiar el formulario después de crear la receta
      setNombre("");
      setIngredients([]);

      // Llamar a la función de actualización
      if (onRefresh) {
        onRefresh();
      }

      // Cerrar el diálogo
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Error al crear la receta. Por favor, inténtalo de nuevo.");
    }
  };

  const handleToggleActiveRecipes = () => {
    const newShowActiveRecipes = !showActiveRecipes;
    setShowActiveRecipes(newShowActiveRecipes);
    onToggleActiveRecipes(newShowActiveRecipes); // Notificar al componente padre
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón para alternar entre recetas activas e inactivas */}
      <Button
        onClick={handleToggleActiveRecipes}
        className={showActiveRecipes ? "bg-blue-500 text-white hover:bg-blue-500/90" : "bg-violet-500 text-white hover:bg-violet-500/90"}
      >
        {showActiveRecipes ? "Ver Inactivas" : "Ver Activas"}
      </Button>

      {/* Diálogo para crear recetas */}
      <ReusableDialogWidth
        title="Crear Receta"
        description="Llena el formulario para crear una receta"
        trigger={
          <Button className="text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
            <CirclePlus />
            <span>Crear Receta</span>
          </Button>
        }
        onSubmit={handleSubmit}
        submitButtonText="Crear Receta"
        onClose={() => setIsDialogOpen(false)} // Pass the close function
        isOpen={isDialogOpen} // Pass the isOpen state

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
                onChange={(e) => setNombre(e.target.value)}
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
                    <TableHead className="text-center w-[120px]  text-gray-900">
                      Ingrediente
                    </TableHead>
                    <TableHead className="text-center w-[100px] text-gray-900 ">
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
                          value={ing.name}
                          onSelect={(ingrediente) =>
                            handleAddOrUpdateIngredient(
                              {
                                ...ingrediente,
                                unidad:
                                  ingrediente.unidad?.toLowerCase() ,
                              },
                              index
                            )
                          }
                          options={ingredientsData}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center w-full"
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
                          } }
                          options={unitOptions}
                          value={ing.unidad || ""} 
                          placeholder="Seleccionar unidad"
                          label={"Unidad"}
                          disabled={false} name={"Unidad"}                          
                        />
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
                              ingrediente.unidad?.toLowerCase() || "unidad(es)",
                          })
                        }
                        options={ingredientsData}
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
                      <ReusableSelect
                        
                        onValueChange={(value) => {
                          const updatedIngredients = [...ingredients];
                          if (updatedIngredients[ingredients.length]) {
                            updatedIngredients[ingredients.length].unidad = value;
                            setIngredients(updatedIngredients);
                          }
                        } }
                        options={unitOptions}
                        placeholder="Seleccionar unidad" label={""} name={""} disabled={true}                      />
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
    </div>
  );
}