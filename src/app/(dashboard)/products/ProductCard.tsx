"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReusableSelect } from "@/components/ReusableSelect";
import { Product } from "@/types/products";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Combobox } from "./ComboBox";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";

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

export function ProductCard({ product }: { product: Product }) {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    business: product.business,
    price: product.price,
    ingredients: product.ingredients,
  });

  const handleAddOrUpdateIngredient = (ingrediente: Item, index?: number) => {
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
          cantidad: 1,
          selectedUnit: ingrediente.unit_measurement,
        },
      ]);
    }
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleEditProduct = () => {
    console.log("Producto editado:", {
      ...editData,
      ingredients,
    });
    setIsDialogOpen(false); // Cierra el diálogo después de guardar
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col justify-between">
      <CardHeader className="p-4">
        {/* Imagen del producto */}
        <div className="flex items-center justify-center">
          <Image
            width={150}
            height={100}
            src={product.img}
            alt={product.name}
            className="rounded-lg object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-1">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {product.business}
        </CardDescription>
        <p className="text-md font-semibold text-gray-900">
          Bs. {product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="flex gap-2">
          <ReusableDialog
            title="Eliminar Negocio"
            description={
              "¿Estás seguro de eliminar el negocio " + product.name + "?"
            }
            trigger={
              <Trash2
                cursor={"pointer"}
                className="w-4 h-4 text-red-600 hover:text-red-600/80"
              />
            }
            submitButtonText="Eliminar"
            onSubmit={() => console.log("Producto eliminado")}
            // eslint-disable-next-line react/no-children-prop
            children={null}
          />
          <ReusableDialogWidth
            title="Editar Producto"
            description="Aquí podrás editar un producto."
            trigger={
              <Pencil
                cursor={"pointer"}
                type="button"
                className="w-4 h-4 text-blue-600 hover:text-blue-900"
              />
            }
            submitButtonText="Guardar Cambios"
            onSubmit={handleEditProduct}
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
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
                    onValueChange={(value) =>
                      setEditData({ ...editData, business: value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio (Bs.)
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        price: Number(e.target.value),
                      })
                    }
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
                          <TableCell className="text-center font-medium ">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            <Combobox
                              value={ing.nombre} // Pasa el nombre del ingrediente como valor
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
                                (item) =>
                                  !ingredients.some((ing) => ing.id === item.id)
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
            </div>
          </ReusableDialogWidth>
        </div>
        {/* Botón para ver detalles */}
        <ReusableDialog
          title="Detalles del Producto"
          description="Aquí podrás ver los detalles del producto"
          trigger={
            <Label className="text-primary-600 hover:text-primary-900 cursor-pointer bg-green-100 hover:bg-green-200 rounded-lg px-3 py-1">
              Ver Detalles
            </Label>
          }
          onSubmit={() => console.log("Detalles cerrados")}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          showSubmitButton={false}
        >
          <div className="grid gap-2 py-4">
            <h3 className="scroll-m-20 text-2xl text-center font-semibold tracking-tight ">
              {product.name}
            </h3>
            <div className="grid grid-cols-2 p-4">
              <div className="flex flex-col items-center justify-center ">
                <div className="flex items-center justify-center">
                  <Image
                    width={180}
                    height={180}
                    src={product.img}
                    alt={product.name}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 items-center gap-2">
                  <p className="col-span-3 pl-2 text-gray-600 font-semibold leading-7 [&:not(:first-child)]:mt-6">
                    {product.business}
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label className="col-span-3 pl-2 text-lg text-amber-600 font-semibold">
                    Bs. {product.price.toFixed(2)}
                  </Label>
                </div>
              </div>
            </div>

            {/* Lista de ingredientes en el diálogo de detalles */}
            <div className="flex flex-col">
              <Label
                htmlFor="ingredients"
                className="text-start font-bold col-span-1 pb-2"
              >
                Ingredientes:
              </Label>
                {/* Ajusta la altura según tus necesidades */}
                <ul className="text-sm text-gray-600 col-span-3 pl-2 list-disc list-inside mt-2">
                <ScrollArea className="h-48">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                      {ingredient.name} | {ingredient.cantidad}{" "}
                      {ingredient.unidad}
                    </li>
                  ))}
              </ScrollArea>
                </ul>
            </div>
          </div>
        </ReusableDialog>
      </CardFooter>
    </Card>
  );
}
