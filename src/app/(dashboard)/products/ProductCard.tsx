"use client"; // Marca este componente como un Client Component

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReusableSelect } from "@/components/ReusableSelect";
import { Product } from "@/types/products";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
              <>
                ¿Estás seguro de eliminar el producto{" "}
                <strong>{product.name}</strong>?
              </>
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
          ></ReusableDialog>
          <ReusableDialog
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
            onSubmit={() => console.log("Formulario enviado")}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre:
                </Label>
                <Input
                  id="name"
                  defaultValue={product.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Negocio:
                </Label>
                <ReusableSelect
                  name={"negocio"}
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
                <Label htmlFor="price" className="text-right">
                  Precio:
                </Label>
                <Input
                  id="price"
                  defaultValue={product.price}
                  className="col-span-3"
                />
              </div>
            </div>
          </ReusableDialog>
        </div>
        {/* Botón para ver detalles */}
        <ReusableDialog
          title="Detalles del Producto"
          description="Aquí podrás ver los detalles del producto."
          trigger={ <Label className="text-primary-600 hover:text-primary-900 cursor-pointer bg-green-100 hover:bg-green-200 rounded-lg px-3 py-1"  >Ver Detalles</Label>
          }
          submitButtonText="Cerrar"
          onSubmit={() => console.log("Detalles cerrados")}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2">
              <div className="flex flex-col  items-center justify-center">
                <div className="flex items-center justify-center">
                  <Image
                    width={150}
                    height={100}
                    src={product.img}
                    alt={product.name}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className=" grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right font-bold">
                    Nombre:
                  </Label>
                  <Label className="col-span-3  pl-2">{product.name}</Label>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="business" className="text-right font-bold ">
                    Negocio:
                  </Label>
                  <Label className="col-span-3 pl-2">{product.business}</Label>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right font-bold">
                    Precio:
                  </Label>
                  <Label className="col-span-3  pl-2">
                    Bs. {product.price.toFixed(2)}
                  </Label>
                </div>
              </div>
            </div>

            {/* Lista de ingredientes en el diálogo de detalles */}
            <div className="flex flex-col">
              <Label
                htmlFor="ingredients"
                className="text-start font-bold col-span-1"
              >
                Ingredientes:
              </Label>

              <ul className="text-sm
                text-gray-600 
                col-span-3 
                pl-2 
                list-disc 
                list-inside
                mt-2

                ">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} | {ingredient.quantity}{" "}
                    {ingredient.unit_measurement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ReusableDialog>
      </CardFooter>
    </Card>
  );
}
