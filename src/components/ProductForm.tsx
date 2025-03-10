"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReusableSelect } from "@/components/ReusableSelect";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Ingredient } from "@/types/ingredients";
import { Combobox } from "@/app/(dashboard)/products/ComboBox";

interface ProductFormProps {
  initialData?: {
    name: string;
    business: string;
    price: number;
    ingredients: Ingredient[];
  };
  onSubmit: (data: {
    name: string;
    business: string;
    price: number;
    ingredients: Ingredient[];
  }) => void;
}

const comestibles = [
  {
    id: 1,
    nombre: "Harina",
    quantity: 1,
    unit_measurement: "kilo(s)",
    proveedor: "Proveedor A",
  },
  {
    id: 2,
    nombre: "Azúcar",
    quantity: 300,
    unit_measurement: "gramo(s)",
    proveedor: "Proveedor B",
  },
  {
    id: 3,
    nombre: "Huevo",
    quantity: 200,
    unit_measurement: "unidad(es)",
    proveedor: "Proveedor C",
  },
];

const noComestibles = [
  {
    id: 4,
    nombre: "Cajas de cartón",
    quantity: 100,
    unit_measurement: "unidad(es)",
  },
  { id: 5, nombre: "Lavandina", quantity: 100, unit_measurement: "litro(s)" },
  { id: 6, nombre: "Stickers", quantity: 100, unit_measurement: "unidad(es)" },
];

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [business, setBusiness] = useState(initialData?.business || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || []
  );

  const handleAddOrUpdateIngredient = (ingrediente: Ingredient, index?: number) => {
    if (index !== undefined) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        ...ingrediente,
      };
      setIngredients(updatedIngredients);
    } else {
      setIngredients([
        ...ingredients,
        {
          ...ingrediente,
          quantity: 1,
          unit_measurement: ingrediente.unit_measurement,
        },
      ]);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      business,
      price,
      ingredients,
    });
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 items-center gap-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nombre
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa el nombre del producto"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="negocio" className="text-right">
            Negocio
          </Label>
          <ReusableSelect
            name="Negocio"
            className="col-span-2"
            placeholder="Selecciona un negocio"
            label="Negocios:"
            options={[
              { value: "Mil Sabores", label: "Mil Sabores" },
              { value: "Tortas Express", label: "Tortas Express" },
            ]}
            disabled={false}
            value={business}
            
            onValueChange={(value) => setBusiness(value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="precio" className="text-right">
            Precio (Bs.)
          </Label>
          <Input
            id="precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Bs."
            className="col-span-1"
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
                <TableHead className="text-center w-[40px] text-gray-900">N°</TableHead>
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
                  <TableCell className="text-center font-medium ">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    <Combobox
                      value={ing.name}
                      onSelect={(ingrediente) =>
                        handleAddOrUpdateIngredient(
                          {
                            ...ingrediente,
                            unit_measurement:
                              ingrediente.unit_measurement?.toLowerCase() ||
                              "unidad",
                          },
                          index
                        )
                      }
                      options={comestibles.filter(
                        (item) => !ingredients.some((ing) => ing.id === item.id)
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="text-center w-full"
                      type="number"
                      value={ing.cantidad || 0}
                      onChange={(e) =>
                        handleAddOrUpdateIngredient(
                          { ...ing, cantidad: Number(e.target.value) },
                          index
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <ReusableSelect
                      className="w-full"
                      placeholder="Seleccionar unidad"
                      label="Unidades:"
                      options={[
                        { value: "unidad", label: "Unidad" },
                        { value: "gramos", label: "Gramos" },
                        { value: "mililitros", label: "Mililitros" },
                        { value: "piezas", label: "Piezas" },
                      ]}
                      name="unidad"
                      value={ing.selectedUnit}
                      onValueChange={(value) =>
                        handleAddOrUpdateIngredient(
                          { ...ing, selectedUnit: value },
                          index
                        )
                      }
                      disabled={false}
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
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <Button onClick={handleSubmit}>Guardar</Button>
    </div>
  );
}