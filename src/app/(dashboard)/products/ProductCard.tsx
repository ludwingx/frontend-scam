"use client";

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
import { Product } from "@/types/products";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { Recipe } from "@/types/recipes";

export function ProductCard({
  product,
}: {
  product: Product & { recipe?: Recipe };
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name || "", // Valor predeterminado: cadena vacía
    business: product.business_name || "", // Valor predeterminado: cadena vacía
    price: product.price || 0, // Valor predeterminado: 0
    category: product.categoryId || 0, // Valor predeterminado: 0
    image_url: product.image_url || "", // Valor predeterminado: cadena vacía
    recipe: product.recipe || {}, // Valor predeterminado: objeto vacío
  });

  const handleEditProduct = async () => {
    try {
      // Aquí puedes hacer una solicitud a la API para actualizar el producto
      const updatedProduct = {
        ...product,
        ...editData,
      };

      console.log("Producto actualizado:", updatedProduct);
      setIsDialogOpen(false); // Cierra el diálogo después de guardar
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col justify-between">
      {/* Contenedor de la imagen con tamaño fijo */}
      <CardHeader className="flex items-center justify-center h-[140px]">
        <div className="w-[110px] h-[110px] relative">
          <Image
            src={product.image_url || "/cuñape.png"}
            alt={product.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </CardHeader>

      {/* Contenido de la tarjeta */}
      <CardContent className="flex flex-col gap-1 p-4">
        <CardTitle className="text-sm font-semibold text-gray-900">
          {product.name}
        </CardTitle>
        <CardDescription className="text-xs text-gray-600">
          {product.business_name}
        </CardDescription>
        <p className="text-md font-semibold text-orange-600">
          Bs. {product.price.toFixed(2)}
        </p>
      </CardContent>

      {/* Pie de la tarjeta con acciones */}
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
              {/* Nombre del producto */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Nombre del producto"
                  className="col-span-3"
                />
              </div>

              {/* Negocio */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="business" className="text-right">
                  Negocio
                </Label>
                <Input
                  id="business"
                  value={editData.business}
                  onChange={(e) =>
                    setEditData({ ...editData, business: e.target.value })
                  }
                  placeholder="Negocio"
                  className="col-span-3"
                />
              </div>

              {/* Precio */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Precio (Bs.)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: Number(e.target.value) })
                  }
                  placeholder="Precio"
                  className="col-span-3"
                />
              </div>

              {/* Categoría */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <Input
                  id="category"
                  type="number"
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      category: Number(e.target.value),
                    })
                  }
                  placeholder="Categoría"
                  className="col-span-3"
                />
              </div>

              {/* Imagen */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">
                  Imagen
                </Label>
                <Input
                  id="image_url"
                  value={editData.image_url}
                  onChange={(e) =>
                    setEditData({ ...editData, image_url: e.target.value })
                  }
                  placeholder="URL de la imagen"
                  className="col-span-3"
                />
              </div>
            </div>
          </ReusableDialogWidth>
        </div>
        {/* Botón para ver detalles */}
        <ReusableDialog
          title="Detalles del Producto"
          description="Aquí podrás ver los detalles del producto"
          trigger={
            <span className="text-white text-xs cursor-pointer bg-primary hover:bg-primary/90 rounded-lg px-3 p-1">
              Ver Detalles
            </span>
          }
          onSubmit={() => console.log("Detalles cerrados")}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          showSubmitButton={false}
        >
          <div className="grid">
            <h3 className="scroll-m-20 text-2xl text-center font-semibold tracking-tight">
              {product.name}
            </h3>
            <div className="grid grid-cols-2 p-4">
              {/* Imagen del producto */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <Image
                    width={180}
                    height={180}
                    src={product.image_url || "/cuñape.png"}
                    alt={product.name}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Negocio y precio */}
              <div className="flex flex-col justify-center gap-4 pl-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-sm text-gray-500 font-medium">
                    Negocio:
                  </Label>
                  <p className="text-lg font-semibold text-primary-900">
                    {product.business_name}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-sm text-gray-500 font-medium">
                    Precio:
                  </Label>
                  <p className="text-2xl font-bold text-amber-600">
                    Bs. {product.price.toFixed(2)}
                  </p>
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
              <ul className="text-sm text-gray-600 col-span-3 pl-2 list-disc list-inside mt-2">
                <ScrollArea className="h-48">
                  {product.recipe?.detalleRecetas?.length ? (
                    product.recipe.detalleRecetas.map((ingrediente) => (
                      <li key={ingrediente.id}>
                        {ingrediente.nombre_ingrediente} -{" "}
                        {ingrediente.cantidad} {ingrediente.unidad}
                      </li>
                    ))
                  ) : (
                    <li>No hay ingredientes disponibles.</li>
                  )}
                </ScrollArea>
              </ul>
            </div>
          </div>
        </ReusableDialog>
      </CardFooter>
    </Card>
  );
}