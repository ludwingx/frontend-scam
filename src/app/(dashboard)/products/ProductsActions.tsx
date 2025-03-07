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
import { Combobox } from "./ComboBox";

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  unit_measurement?: string;
  proveedor?: string;
  subtotal?: number;
  tipo?: "Comestible" | "No comestible";
  selectedUnit?: string;
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

  const handleAddOrUpdateIngredient = (ingrediente: Item, index?: number) => {
    if (index !== undefined) {
      // Si se proporciona un índice, actualiza el ingrediente en esa posición
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        ...ingrediente,
      };
      setIngredients(updatedIngredients);
    } else {
      // Si no se proporciona un índice, añade un nuevo ingrediente
      setIngredients([
        ...ingredients,
        {
          ...ingrediente,
          cantidad: 1,
          selectedUnit: ingrediente.unit_measurement,
        },
      ]);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio (Bs.)
              </Label>
              <Input
                id="precio"
                type="number"
                placeholder="Bs."
                className="col-span-1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <ReusableSelect
                name="Tipo"
                className="col-span-2"
                placeholder="Selecciona un tipo"
                label="Tipos:"
                options={[
                  { value: "Producto Final", label: "Producto Final" },
                  { value: "Producto Base", label: "Producto Base" },
                ]}
                disabled={false}
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
                          value={
                            <div className="inline">
                              {ing.nombre}{" "}
                            
                            </div>
                          }
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
                          options={
                            ing.tipo === "Comestible"
                              ? comestibles.filter(
                                  (item) =>
                                    !ingredients.some(
                                      (ing) => ing.id === item.id
                                    )
                                )
                              : noComestibles.filter(
                                  (item) =>
                                    !ingredients.some(
                                      (ing) => ing.id === item.id
                                    )
                                )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center w-full" // Ancho fijo
                          type="number"
                          name="cantidad"
                        />
                      </TableCell>
                      <TableCell>
                        <ReusableSelect
                          className="w-full" // Ancho fijo
                          placeholder="Seleccionar unidad"
                          label="Unidades:"
                          options={[
                            { value: "unidad", label: "Unidad" },
                            { value: "gramos", label: "Gramos" },
                            { value: "mililitros", label: "Mililitros" },
                            { value: "piezas", label: "Piezas" },
                          ]}
                          name="unidad"
                          onValueChange={(value) => {
                            const updatedIngredients = [...ingredients];
                            updatedIngredients[index].selectedUnit = value;
                            setIngredients(updatedIngredients);
                          }}
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
                  <TableRow>
                    <TableCell className="text-center font-medium ">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      <Combobox
                        value=""
                        placeholder="Seleccionar ingrediente"
                        options={comestibles.filter(
                          (item) =>
                            !ingredients.some((ing) => ing.id === item.id)
                        )}
                        onSelect={(ingrediente) =>
                          handleAddOrUpdateIngredient({
                            ...ingrediente,
                            unit_measurement:
                              ingrediente.unit_measurement?.toLowerCase() ||
                              "unidad",
                            tipo: "Comestible",
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="text-center w-full" // Ancho fijo
                        type="number"
                        disabled
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <ReusableSelect
                        className="w-full" // Ancho fijo
                        placeholder="Seleccionar unidad"
                        label="Unidades:"
                        options={[
                          { value: "unidad", label: "Unidad" },
                          { value: "gramos", label: "Gramos" },
                          { value: "mililitros", label: "Mililitros" },
                          { value: "piezas", label: "Piezas" },
                        ]}
                        name="unidad"
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                      >
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
