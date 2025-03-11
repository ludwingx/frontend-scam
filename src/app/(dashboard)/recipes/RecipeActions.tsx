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

interface Item {
  id: number;
  name: string;
  cantidad: number; // Asegúrate de que no sea opcional
  unidad?: string;
  proveedor?: string;
  subtotal?: number;
  tipo?: "Comestible" | "No comestible";
  selectedUnit?: string;
}

export function RecipeActions() {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [name, setNombre] = useState("");
  const [ingredientsData, setIngredientsData] = useState<Item[]>([]);

  useEffect(() => {
    // Cargar los datos de los ingredientes al montar el componente
    const loadIngredients = async () => {
      const data = await fetchIngredientsData();
      setIngredientsData(data || []);
    };

    loadIngredients();
  }, []);

  const handleAddOrUpdateIngredient = (ingrediente: Item, index?: number) => {
    if (index !== undefined) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        ...ingrediente,
        selectedUnit: ingrediente.selectedUnit || undefined, // Asegúrate de que sea undefined si no se ha seleccionado
      };
      setIngredients(updatedIngredients);
    } else {
      setIngredients([
        ...ingredients,
        {
          ...ingrediente,
          cantidad: 1,
          selectedUnit: undefined, // Inicialmente no se ha seleccionado ninguna unidad
        },
      ]);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleSubmit = () => {
    const producto = {
      name,
      detalles: ingredients.map((ing) => ({
        ingredienteId: ing.id,
        cantidad: ing.cantidad,
        unidad: ing.selectedUnit || "unidad",
      })),
    };

    console.log("Datos del producto:", producto);
  };

  return (
    <div>
      <ReusableDialogWidth
        title="Crear Receta"
        description="Llena el formulario para crear un receta"
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus />
            <span>Crear Producto</span>
          </Button>
        }
        onSubmit={handleSubmit}
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
                                  ingrediente.unidad?.toLowerCase() || "unidad",
                              },
                              index
                            )
                          }
                          options={ingredientsData} // Pasa directamente ingredientsData
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center w-full"
                          type="number"
                          name="cantidad"
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
                        {ing.unidad}{" "}
                        {/* Mostrar la unidad del ingrediente seleccionado */}
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
                  {/* Fila para agregar un nuevo ingrediente */}
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
                        options={ingredientsData}
                        placeholder="Seleccionar ingrediente"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="text-center w-full"
                        type="number"
                        disabled
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {/* Mostrar la unidad del nuevo ingrediente seleccionado */}
                      {ingredientsData.find(
                        (ing) => ing.id === ingredients[ingredients.length]?.id
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
    </div>
  );
}
