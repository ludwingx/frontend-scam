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
import { Combobox } from "../purchases/ComboBox";

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  unit_measurement?: string;
  proveedor?: string;
  subtotal?: number;
  tipo?: "Comestible" | "No comestible";
}

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

export function ProductsActions() {
  const [ingredients, setIngredients] = useState<Item[]>([]);

  const handleAddOrUpdateIngredient = (ingrediente: Item) => {
    const existingIngredientIndex = ingredients.findIndex(ing => ing.id === ingrediente.id);
    if (existingIngredientIndex !== -1) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[existingIngredientIndex] = {
        ...updatedIngredients[existingIngredientIndex],
        cantidad: (updatedIngredients[existingIngredientIndex].cantidad || 0) + 1,
      };
      setIngredients(updatedIngredients);
    } else {
      setIngredients([...ingredients, { ...ingrediente, cantidad: 1 }]);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
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
        <div className="grid gap-4">
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
                Sucursal
              </Label>
              <ReusableSelect
                name="Negocio"
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
      <Combobox
        value={
          <div className="inline">
            {ing.nombre}{" "}
            <span className="text-sm text-gray-500">
              -{" "}
              {
                (ing.tipo === "Comestible"
                  ? comestibles
                  : noComestibles
                ).find((item) => item.id === ing.id)
                  ?.quantity
              }{" "}
              {ing.unit_measurement}
            </span>
          </div>
        }
        onSelect={(ingrediente) =>
          handleAddOrUpdateIngredient(
            { ...ingrediente, unit_measurement: ingrediente.unit_measurement?.toLowerCase() || "unidad" }
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
                  <TableRow>
                    <TableCell className="font-medium">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell>
                      <Combobox
                        value=""
                        placeholder="Selecciona un ingrediente"
                        options={comestibles}
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