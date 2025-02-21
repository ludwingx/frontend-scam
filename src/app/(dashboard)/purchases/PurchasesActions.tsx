"use client";

import { useState } from "react";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, X } from "lucide-react"; // Importar el ícono "X"
import { ComboboxIngredients } from "./ComboBoxIngredients";

interface Ingrediente {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
}

export function PurchasesActions() {
  const [ingredients, setIngredients] = useState<Ingrediente[]>([]);

  // Función para agregar o actualizar un ingrediente
  const handleAddOrUpdateIngredient = (
    ingrediente: Ingrediente,
    index?: number
  ) => {
    if (index !== undefined) {
      // Actualizar el ingrediente existente
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...ingrediente,
        cantidad: updatedIngredients[index].cantidad,
        precioUnitario: updatedIngredients[index].precioUnitario,
      };
      setIngredients(updatedIngredients);
    } else {
      // Agregar un nuevo ingrediente
      const existe = ingredients.some((ing) => ing.id === ingrediente.id);
      if (!existe) {
        setIngredients((prev) => [
          ...prev,
          { ...ingrediente, cantidad: 0, precioUnitario: 0 },
        ]);
      }
    }
  };

  // Función para eliminar un ingrediente
  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // Función para actualizar la cantidad de un ingrediente
  const handleCantidadChange = (id: number, value: string) => {
    const updatedIngredients = ingredients.map((ing) =>
      ing.id === id ? { ...ing, cantidad: Number(value) } : ing
    );
    setIngredients(updatedIngredients);
  };

  // Función para actualizar el precio unitario de un ingrediente
  const handlePrecioChange = (id: number, value: string) => {
    const formattedValue = value.replace(",", ".");
    if (/^[\d,.]*$/.test(value)) {
      const updatedIngredients = ingredients.map((ing) =>
        ing.id === id ? { ...ing, precioUnitario: Number(formattedValue) } : ing
      );
      setIngredients(updatedIngredients);
    }
  };

  // Calcular el subtotal de cada ingrediente
  const calculateSubtotal = (ingredient: Ingrediente) => {
    const cantidad = ingredient.cantidad || 0;
    const precioUnitario = ingredient.precioUnitario || 0;
    return cantidad * precioUnitario;
  };

  // Calcular el total de la compra
  const calculateTotal = () => {
    return ingredients.reduce(
      (total, ing) => total + calculateSubtotal(ing),
      0
    );
  };

  return (
    <div>
      <ReusableDialogWidth
        title="Crear Compra"
        description="Aquí podrás crear una compra."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus />
            <span>Crear Compra</span>
          </Button>
        }
        onSubmit={() => console.log("Crear Compra")}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Fecha de la compra
            </Label>
            <Input id="name" type="date" className="col-span-3" />
          </div>
          
          <div className="grid items-center gap-4">
            <Table>
              <TableCaption>
                Una lista de tus ingredientes recientes.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">N°</TableHead>
                  <TableHead className="w-[280px]">Ingrediente</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead className="text-center">Precio Unitario</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[40px]"></TableHead>{" "}
                  {/* Columna para el botón "X" */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mostrar los ingredientes seleccionados */}
                {ingredients.map((ing, index) => (
                  <TableRow key={ing.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <ComboboxIngredients
                        value={ing.nombre} // Pasar el nombre del ingrediente seleccionado
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient(ingrediente, index)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={ing.cantidad || ""}
                        onChange={(e) =>
                          handleCantidadChange(ing.id, e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        className="w-[60px]"
                        type="text"
                        value={
                          ing.precioUnitario === undefined ||
                          ing.precioUnitario === 0
                            ? ""
                            : ing.precioUnitario.toString().replace(".", ",")
                        }
                        onChange={(e) =>
                          handlePrecioChange(ing.id, e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right w-[100px]">
                      Bs. {calculateSubtotal(ing).toFixed(2).replace(".", ",")}
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

                {/* Mostrar una fila vacía para agregar un nuevo ingrediente */}
                <TableRow>
                  <TableCell className="font-medium">
                    {ingredients.length + 1}
                  </TableCell>
                  <TableCell>
                    <ComboboxIngredients
                      value="" // Valor vacío para la fila vacía
                      onSelect={(ingrediente) =>
                        handleAddOrUpdateIngredient(ingrediente)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" disabled />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input className="w-[60px]" type="text" disabled />
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    Bs. 0,00
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right">
                    Bs. {calculateTotal().toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </ReusableDialogWidth>
    </div>
  );
}
