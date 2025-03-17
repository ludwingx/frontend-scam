"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FinalsProducts } from "@/types/FinalsProducts";

export const columns: ColumnDef<FinalsProducts>[] = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => {
      const ingredients = row.original;
      return (
        <div>
          {ingredients.name}{" - "}
          <span className="text-sm text-gray-500">
            {ingredients.cantidad} {ingredients.unidad}
          </span>
        </div>
      );
    },
  },
  
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "detalle_compra",
    header: "Detalle del Producto Base",
    cell: ({ row }) => {
      const detalles = row.original.ingredients;

      return (
        <Sheet  >
          <SheetTrigger  asChild>
            <Button variant="outline" className="w-full bg-green-100 hover:bg-green-200" >Ver Ingredientes</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl ">
            <SheetHeader>
              <SheetTitle>Ingredientes del Producto Base</SheetTitle>
              <SheetDescription className="pb-6">
                Aquí puedes ver el detalle de los ingredientes del producto base
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-200px)] p-2">
              <table className="w-full text-sm pr-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-center  p-2">N°</th>
                    <th className="text-center p-2">Ítem</th>
                    <th className="text-center p-2">Cantidad</th>
                    <th className="text-center p-2">Unidad de Medida</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle) => (
                    <tr key={detalle.id} className="border-b">
                      <td className="text-center p-2">{detalles.indexOf(detalle) + 1}</td>
                      <td className="text-center p-2">{detalle.name}</td>
                      <td className="text-center p-2">{detalle.cantidad}</td>
                      <td className="text-center p-2">{detalle.unidad}</td>
                    </tr>
                  ))}
                  {/* Fila para el total */}
                </tbody>
              </table>
            </ScrollArea>
            <SheetFooter className="pt-8">
              <SheetClose asChild>
                <Button type="button">Cerrar</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
    },
  },
  // Edit & delete opción

];