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
  TableFooter,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, X } from "lucide-react";
import { ComboboxIngredients } from "./ComboBoxIngredients";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Ingrediente {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
}

export function PurchasesActions() {
  const [ingredients, setIngredients] = useState<Ingrediente[]>([]);

  const handleAddOrUpdateIngredient = (
    ingrediente: Ingrediente,
    index?: number
  ) => {
    if (index !== undefined) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...ingrediente,
        cantidad: updatedIngredients[index].cantidad,
        precioUnitario: updatedIngredients[index].precioUnitario,
      };
      setIngredients(updatedIngredients);
    } else {
      const existe = ingredients.some((ing) => ing.id === ingrediente.id);
      if (!existe) {
        setIngredients((prev) => [
          ...prev,
          { ...ingrediente, cantidad: 0, precioUnitario: 0 },
        ]);
      }
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleCantidadChange = (id: number, value: string) => {
    const updatedIngredients = ingredients.map((ing) =>
      ing.id === id ? { ...ing, cantidad: Number(value) } : ing
    );
    setIngredients(updatedIngredients);
  };

  const handlePrecioChange = (id: number, value: string) => {
    const formattedValue = value.replace(",", ".");
    if (/^[\d,.]*$/.test(value)) {
      const updatedIngredients = ingredients.map((ing) =>
        ing.id === id ? { ...ing, precioUnitario: Number(formattedValue) } : ing
      );
      setIngredients(updatedIngredients);
    }
  };

  const calculateSubtotal = (ingredient: Ingrediente) => {
    const cantidad = ingredient.cantidad || 0;
    const precioUnitario = ingredient.precioUnitario || 0;
    return cantidad * precioUnitario;
  };

  const calculateTotal = () => {
    return ingredients.reduce(
      (total, ing) => total + calculateSubtotal(ing),
      0
    );
  };

  return (
    <div className="flex flex-col gap-4">
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
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Fecha de la compra
            </Label>
            <Input id="name" type="date"  />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Sucursal
            </Label>
            <Select>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sucursales:</SelectLabel>
                  <SelectItem value="apple">Radial 19</SelectItem>
                  <SelectItem value="banana">Villa 1ro de mayo</SelectItem>
                  <SelectItem value="blueberry">Radial 26</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid items-center gap-4"> <ScrollArea className="h-[300px]">
            <Table >
             
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]  text-gray-900">N°</TableHead>
                  <TableHead className="w-[220px]  text-gray-900">Ingrediente</TableHead>
                  <TableHead className="text-center w-[100px]  text-gray-900">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-center  text-gray-900">Precio Unitario (Bs.)</TableHead>
                  <TableHead className="text-right  text-gray-900">Subtotal</TableHead>
                  <TableHead className="w-[40px]  text-gray-900"></TableHead>
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
                            handleAddOrUpdateIngredient(ingrediente, index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.cantidad || ""}
                          onChange={(e) =>
                            handleCantidadChange(ing.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          className="text-center w-[120px]"
                          type="text"
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
                  <TableRow>
                    <TableCell className="font-medium">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell>
                      <ComboboxIngredients
                        value=""
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient(ingrediente)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="number" disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input className="w-[120px]" type="text" disabled />
                    </TableCell>
                    <TableCell className="text-right w-[100px]">
                      
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

            </Table>              </ScrollArea>
          </div>
        </div>
      </ReusableDialogWidth>
    </div>
  );
}
