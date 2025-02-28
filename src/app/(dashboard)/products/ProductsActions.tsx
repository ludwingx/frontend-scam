"use client";

import { useState } from "react";
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
import { ReusableSelect } from "@/components/ReusableSelect";
import { ComboboxIngredients } from "../purchases/ComboBoxIngredients";

interface Ingrediente {
  id: number;
  nombre: string;
  cantidad?: number; // Cantidad en gramos
  unit_measurement?: string; // Unidad de medida (unidad, litro, kg, g)
}

export function ProductsActions() {
  const [ingredients, setIngredients] = useState<Ingrediente[]>([]);

  // Agregar o actualizar un ingrediente
  const handleAddOrUpdateIngredient = (
    ingrediente: Ingrediente,
    index?: number
  ) => {
    if (index !== undefined) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...ingrediente,
        cantidad: updatedIngredients[index].cantidad,
      };
      setIngredients(updatedIngredients);
    } else {
      const existe = ingredients.some((ing) => ing.id === ingrediente.id);
      if (!existe) {
        setIngredients((prev) => [
          ...prev,
          { ...ingrediente, cantidad: 0, unit_measurement: ingrediente.unit_measurement?.toLowerCase() || "unidad" },
        ]);
      }
    }
  };

  // Eliminar un ingrediente
  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };



  return (
    <div className="flex flex-col gap-4">
      {/* Botón para abrir el diálogo de creación de producto */}
      <ReusableDialogWidth
        title="Crear Producto"
        description="Llena el formulario para crear un producto"
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus />
            <span>Crear Producto</span>
          </Button>
        }
        onSubmit={() => console.log("Crear Producto")}
      >
        {/* Sección 2: Formulario de creación de producto */}
        <div className="grid gap-4">
          {/* Campos del producto */}
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre del producto"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sucursal" className="text-right">
                Negocio
              </Label>
              <ReusableSelect
                className="col-span-3"
                placeholder="Selecciona un negocio"
                label="Negocios:"
                options={[
                  { value: "Mil Sabores", label: "Mil Sabores" },
                  { value: "Tortas Express", label: "Tortas Express" },
                ]}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio
              </Label>
              <Input
                id="precio"
                type="number"
                placeholder="Bs."
                className="col-span-2"
              />
            </div>
          </div>
              
          {/* Tabla de ingredientes */}
          <div className="grid items-center gap-4 pt-4">
            <h5 className="text-l font-semibold text-gray-900">Lista de Ingredientes:</h5>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] text-gray-900">N°</TableHead>
                    <TableHead className="w-[220px] text-gray-900">
                      Ingrediente
                    </TableHead>
                    <TableHead className="text-center w-[100px] text-gray-900">
                      Cantidad
                    </TableHead>
                    <TableHead className="w-[40px] text-gray-900"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={ing.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <ComboboxIngredients
                          value={ing.nombre}
                          onSelect={(ingrediente) =>
                            handleAddOrUpdateIngredient(
                              { ...ingrediente, unit_measurement: ingrediente.unit_measurement?.toLowerCase() || "unidad" },
                              index
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center"
                          type="text"
                          placeholder={ing.unit_measurement}
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
                  {/* Fila para agregar un nuevo ingrediente */}
                  <TableRow>
                    <TableCell className="font-medium">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell>
                      <ComboboxIngredients
                        value=""
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient(
                            { ...ingrediente, unit_measurement: ingrediente.unit_measurement?.toLowerCase() || "unidad" }
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" disabled placeholder="0" />
                    </TableCell>
                    <TableCell></TableCell>
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