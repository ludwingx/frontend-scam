"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter, Table } from "@/components/ui/table";
import { X } from "lucide-react";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { ReusableSelect } from "@/components/ReusableSelect";

// Tipo para definir la estructura de los datos de compras
export type Purchases = {
  id: number;
  fecha_compra: string;
  sucursal: string;
  detalle_compra: {
    id: number;
    nombre_ingrediente: string;
    cantidad: number;
    precio_unitario: number;
  }[];

  total_compra: number;
};

// Columnas de la tabla
export const columns: ColumnDef<Purchases>[] = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>; // Centrar el contenido
    },
  },
  {
    accessorKey: "fecha_compra",
    header: "Fecha de Compra",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.fecha_compra}</div>; // Centrar el contenido
    },
  },
  {
    accessorKey: "detalle_compra",
    header: "Detalle de Compra",
    cell: ({ row }) => {
      const detalles = row.original.detalle_compra;
      const totalCompra = row.original.total_compra;

      return (
        <Sheet >
          <SheetTrigger  asChild>
            <Button variant="outline" className="w-full bg-green-100 hover:bg-green-200" >Ver Detalle</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl ">
            <SheetHeader>
              <SheetTitle>Detalle de la Compra</SheetTitle>
              <SheetDescription className="pb-6">
                Aquí puedes ver el detalle de los ingredientes comprados.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-200px)] p-2">
              <table className="w-full text-sm pr-4">
                <thead>
                  <tr className="border-b">
                    <th className="text-center  p-2">N°</th>
                    <th className="text-center p-2">Ítem</th>
                    <th className="text-center p-2">Cantidad</th>
                    <th className="text-center p-2">Precio Unitario (Bs.)</th>
                    <th className="text-right p-2 ">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle) => (
                    <tr key={detalle.id} className="border-b">
                      <td className="text-center p-2">{detalles.indexOf(detalle) + 1}</td>
                      <td className="text-center p-2">{detalle.nombre_ingrediente}</td>
                      <td className="text-center p-2">{detalle.cantidad}</td>
                      <td className="text-center p-2">Bs. {detalle.precio_unitario.toFixed(2)}</td>
                      <td className="text-right  p-2 ">Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                  {/* Fila para el total */}
                  <tr className="bg-gray-100">
                    <td colSpan={4} className="text-right p-2 font-medium">Total:</td>
                    <td className="text-right p-2 font-medium">Bs. {totalCompra.toFixed(2)}</td>
                  </tr>
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
  {
    accessorKey: "total_compra",
    header: "Total de Compra",
    cell: ({ row }) => {
      return <div className="text-center">Bs. {row.original.total_compra.toFixed(2)}</div>; // Centrar el contenido
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>, // Centrar el header
    cell: ({ row }) => {
      const purchase = row.original;

      return (
        <div className="flex gap-2 justify-center">
          {/* Diálogo para editar */}
          <ReusableDialogWidth
            title="Editar Compra"
            description={"Aquí podrás editar los detalles de la compra N°" + purchase.id}
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
            submitButtonText="Guardar Cambios"
          >
            <div className="grid gap-4">
              {/* Fecha de la compra */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_compra" className="text-right">
                  Fecha de la compra
                </Label>
                <Input
                  id="fecha_compra"
                  type="date"
                  defaultValue={purchase.fecha_compra} // Mostrar la fecha de la compra
                />
              </div>

              {/* Sucursal */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sucursal" className="text-right">
                  Sucursal
                </Label>
                <ReusableSelect name="Negocios"
                                     placeholder="Selecciona un negocio"
                                     label="Negocios:"
                                     options={[
                                       
                        { value: "Radial 26", label: "Radial 26" },
                        { value: "Radial 19", label: "Radial 19" },
               
                                      ]}
                                   />
              </div>

              {/* Tabla de ingredientes */}
              <div className="grid items-center gap-4">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader className="text-center color-gray-900">
                      <TableRow >
                        <TableHead className="w-[40px] text-gray-900">N°</TableHead>
                        <TableHead className="w-[220px] text-gray-900">Ingrediente</TableHead>
                        <TableHead className="text-center w-[100px] text-gray-900">
                          Cantidad
                        </TableHead>
                        <TableHead className="text-center text-gray-900">Precio Unitario (Bs.)</TableHead>
                        <TableHead className="text-right text-gray-900">Subtotal</TableHead>
                        <TableHead className="w-[40px] text-gray-900"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchase.detalle_compra.map((ing, index) => (
                        <TableRow key={ing.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              className="text-center"
                              type="text" 
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              className="text-center"
                              type="number"
                              value={ing.cantidad || ""}
                              onChange={() => {
                                // Aquí puedes manejar el cambio de cantidad
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              className="text-center w-[120px]"
                              type="text"
                              value={ing.precio_unitario || ""}
                              onChange={() => {
                                // Aquí puedes manejar el cambio de precio
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right w-[100px]">
                            Bs. {(ing.cantidad * ing.precio_unitario).toFixed(2).replace(".", ",")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // Aquí puedes manejar la eliminación del ingrediente
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Fila para agregar un nuevo ingrediente */}
                      <TableRow>
                        <TableCell className="font-medium">
                          {purchase.detalle_compra.length + 1}
                        </TableCell>
                        <TableCell>
                        <Input
                              className="text-center"
                              type="text" 
                            />
                        </TableCell>
                        <TableCell>
                          <Input type="number" disabled />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input className="w-[120px]" type="text" disabled />
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
                          Bs. {purchase.total_compra.toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </ReusableDialogWidth>

          {/* Diálogo para eliminar */}
          <ReusableDialog
            title="Eliminar Compra"
            description={"¿Estás seguro de que deseas eliminar la compra N° " + purchase.id + "?"}
            trigger={<Button variant="destructive">Eliminar</Button>}
            submitButtonText="Eliminar"
          >
            <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
          </ReusableDialog>
        </div>
      );
    },
  },
];