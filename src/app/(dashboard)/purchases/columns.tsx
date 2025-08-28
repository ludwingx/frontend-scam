"use client";

import { useState } from "react";
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
import { Plus, X, Utensils, Box, Trash2 } from "lucide-react";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "./ComboBox";
import { dataFicticia } from "./data";

export type Purchases = typeof dataFicticia.compras[0];

export const columns: ColumnDef<Purchases>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-center">N°</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "fecha_compra",
    header: () => <div className="text-center">Fecha de Compra</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.fecha_compra}</div>;
    },
  },
  {
    accessorKey: "detalle_compra",
    header: () => <div className="text-center">Detalle de Compra</div>,
    cell: ({ row }) => {
      const detalles = row.original.detalle_compra;
      const totalCompra = row.original.total_compra;

      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800">
              Ver Detalle
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>Detalle de la Compra</SheetTitle>
              <SheetDescription className="pb-6">
                Aquí puedes ver el detalle de los ingredientes comprados.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-200px)] p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-12">N°</TableHead>
                    <TableHead className="text-center">Ítem</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-center">Precio Unitario (Bs.)</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.map((detalle, index) => (
                    <TableRow key={detalle.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {detalle.nombre_ingrediente}
                        {detalle.unit_measurement && (
                          <span className="text-sm text-muted-foreground ml-1">({detalle.unit_measurement})</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{detalle.cantidad}</TableCell>
                      <TableCell className="text-center">Bs. {detalle.precio_unitario.toFixed(2)}</TableCell>
                      <TableCell className="text-right">Bs. {(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted">
                    <TableCell colSpan={4} className="text-right font-medium">Total:</TableCell>
                    <TableCell className="text-right font-medium">Bs. {totalCompra.toFixed(2)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
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
    header: () => <div className="text-center">Total de Compra</div>,
    cell: ({ row }) => {
      return <div className="text-center">Bs. {row.original.total_compra.toFixed(2)}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const purchase = row.original;
      const [detalles, setDetalles] = useState([...purchase.detalle_compra]);
      const [nuevoIngrediente, setNuevoIngrediente] = useState({
        nombre_ingrediente: "",
        cantidad: 0,
        precio_unitario: 0,
        unit_measurement: "",
        tipo: undefined as "Comestible" | "No comestible" | undefined
      });

      const getAvailableIngredients = (tipo: "Comestible" | "No comestible") => {
        return tipo === "Comestible" ? dataFicticia.comestibles : dataFicticia.noComestibles;
      };

      const handleAgregarIngrediente = () => {
        if (nuevoIngrediente.nombre_ingrediente && nuevoIngrediente.cantidad > 0 && nuevoIngrediente.precio_unitario >= 0) {
          const nuevoId = detalles.length > 0 ? Math.max(...detalles.map(d => d.id)) + 1 : 1;
          const selectedItem = nuevoIngrediente.tipo === "Comestible" 
            ? dataFicticia.comestibles.find(item => item.nombre === nuevoIngrediente.nombre_ingrediente)
            : dataFicticia.noComestibles.find(item => item.nombre === nuevoIngrediente.nombre_ingrediente);
          
          setDetalles([...detalles, {
            id: nuevoId,
            nombre_ingrediente: nuevoIngrediente.nombre_ingrediente,
            cantidad: nuevoIngrediente.cantidad,
            precio_unitario: nuevoIngrediente.precio_unitario,
            unit_measurement: selectedItem?.unit_measurement || "",
            tipo: nuevoIngrediente.tipo
          }]);
          
          setNuevoIngrediente({
            nombre_ingrediente: "",
            cantidad: 0,
            precio_unitario: 0,
            unit_measurement: "",
            tipo: undefined
          });
        }
      };

      const handleEliminarIngrediente = (id: number) => {
        setDetalles(detalles.filter(d => d.id !== id));
      };

      const handleChangeIngrediente = (id: number, field: string, value: string | number) => {
        setDetalles(detalles.map(d => 
          d.id === id ? { ...d, [field]: value } : d
        ));
      };

      const handleChangeProducto = (id: number, newProductName: string, tipo: "Comestible" | "No comestible") => {
        const selectedItem = tipo === "Comestible" 
          ? dataFicticia.comestibles.find(item => item.nombre === newProductName)
          : dataFicticia.noComestibles.find(item => item.nombre === newProductName);
        
        setDetalles(detalles.map(d => 
          d.id === id ? { 
            ...d, 
            nombre_ingrediente: newProductName,
            unit_measurement: selectedItem?.unit_measurement || ""
          } : d
        ));
      };

      const calcularTotal = () => {
        return detalles.reduce((total, detalle) => 
          total + (detalle.cantidad * detalle.precio_unitario), 0);
      };

      return (
        <div className="flex gap-2 justify-center">
          <ReusableDialogWidth
            title="Editar Compra"
            description={`Aquí podrás editar los detalles de la compra N°${purchase.id}`}
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Editar
              </Button>
            }
            submitButtonText="Guardar Cambios"
            onSubmit={() => {
              console.log("Compra editada", {
                ...purchase,
                detalle_compra: detalles,
                total_compra: calcularTotal()
              });
            }}
          >
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha_compra" className="md:text-right">
                  Fecha de la compra
                </Label>
                <Input
                  id="fecha_compra"
                  type="date"
                  defaultValue={purchase.fecha_compra}
                  className="md:col-span-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="sucursal" className="md:text-right">
                  Sucursal
                </Label>
                <Select defaultValue={purchase.sucursal} className="md:col-span-3">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sucursales:</SelectLabel>
                      {dataFicticia.sucursales.map(sucursal => (
                        <SelectItem key={sucursal.id} value={sucursal.nombre}>
                          <div className="flex items-center gap-2">
                            {sucursal.logo && (
                              <sucursal.logo className="h-4 w-4" />
                            )}
                            <span>{sucursal.nombre}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <Table className="min-w-full">
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="w-12 text-center">N°</TableHead>
                        <TableHead className="min-w-[200px]">
                          <div className="flex justify-between">
                            <span>Ítem</span>
                            <span className="text-muted-foreground font-normal">Presentación</span>
                          </div>
                        </TableHead>
                        <TableHead className="w-24 text-center">Cantidad</TableHead>
                        <TableHead className="w-32 text-center">Precio Unitario</TableHead>
                        <TableHead className="w-24 text-right">Subtotal</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalles.map((ing, index) => {
                        const producto = ing.tipo 
                          ? (ing.tipo === "Comestible" 
                              ? dataFicticia.comestibles 
                              : dataFicticia.noComestibles)
                            .find(p => p.nombre === ing.nombre_ingrediente)
                          : null;

                        return (
                          <TableRow key={ing.id}>
                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Combobox
                                  value={ing.nombre_ingrediente}
                                  onSelect={(item) => {
                                    if (ing.tipo) {
                                      handleChangeProducto(ing.id, item, ing.tipo);
                                    }
                                  }}
                                  options={ing.tipo ? getAvailableIngredients(ing.tipo).map(item => item.nombre) : []}
                                  placeholder="Seleccionar ítem"
                                  renderOption={(item) => {
                                    const fullItem = (ing.tipo === "Comestible" 
                                      ? dataFicticia.comestibles 
                                      : dataFicticia.noComestibles)
                                      .find(i => i.nombre === item);
                                    return (
                                      <div className="flex justify-between w-full">
                                        <span>{item}</span>
                                        {fullItem && (
                                          <span className="text-muted-foreground">
                                            {fullItem.quantity} {fullItem.unit_measurement}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                                {producto && (
                                  <div className="text-sm text-muted-foreground">
                                    {producto.quantity} {producto.unit_measurement}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                className="text-center"
                                type="number"
                                value={ing.cantidad}
                                min="0"
                                step="0.01"
                                onChange={(e) => handleChangeIngrediente(ing.id, 'cantidad', parseFloat(e.target.value))}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                className="text-center"
                                type="number"
                                value={ing.precio_unitario}
                                min="0"
                                step="0.01"
                                onChange={(e) => handleChangeIngrediente(ing.id, 'precio_unitario', parseFloat(e.target.value))}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              Bs. {(ing.cantidad * ing.precio_unitario).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEliminarIngrediente(ing.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell className="text-center font-medium">
                          {detalles.length + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {!nuevoIngrediente.tipo ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setNuevoIngrediente({...nuevoIngrediente, tipo: "Comestible"});
                                  }}
                                >
                                  <Utensils className="w-4 h-4 mr-2" />
                                  Comestible
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setNuevoIngrediente({...nuevoIngrediente, tipo: "No comestible"});
                                  }}
                                >
                                  <Box className="w-4 h-4 mr-2" />
                                  No comestible
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Combobox
                                  value={nuevoIngrediente.nombre_ingrediente || "Seleccionar ítem"}
                                  onSelect={(item) => {
                                    const selectedItem = (nuevoIngrediente.tipo === "Comestible" 
                                      ? dataFicticia.comestibles 
                                      : dataFicticia.noComestibles)
                                      .find(i => i.nombre === item);
                                    setNuevoIngrediente({
                                      ...nuevoIngrediente,
                                      nombre_ingrediente: item,
                                      unit_measurement: selectedItem?.unit_measurement || ""
                                    });
                                  }}
                                  options={getAvailableIngredients(nuevoIngrediente.tipo).map(item => item.nombre)}
                                  placeholder="Seleccionar ítem"
                                  renderOption={(item) => {
                                    const fullItem = (nuevoIngrediente.tipo === "Comestible" 
                                      ? dataFicticia.comestibles 
                                      : dataFicticia.noComestibles)
                                      .find(i => i.nombre === item);
                                    return (
                                      <div className="flex justify-between w-full">
                                        <span>{item}</span>
                                        {fullItem && (
                                          <span className="text-muted-foreground">
                                            {fullItem.quantity} {fullItem.unit_measurement}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }}
                                />
                                {nuevoIngrediente.nombre_ingrediente && (
                                  <div className="text-sm text-muted-foreground">
                                    {(() => {
                                      const producto = (nuevoIngrediente.tipo === "Comestible" 
                                        ? dataFicticia.comestibles 
                                        : dataFicticia.noComestibles)
                                        .find(p => p.nombre === nuevoIngrediente.nombre_ingrediente);
                                      return producto ? (
                                        <span>
                                          {producto.quantity} {producto.unit_measurement}
                                        </span>
                                      ) : null;
                                    })()}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            className="text-center"
                            type="number"
                            value={nuevoIngrediente.cantidad || ""}
                            min="0"
                            step="0.01"
                            onChange={(e) => setNuevoIngrediente({
                              ...nuevoIngrediente,
                              cantidad: parseFloat(e.target.value)
                            })}
                            placeholder="Cantidad"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="text-center"
                            type="number"
                            value={nuevoIngrediente.precio_unitario || ""}
                            min="0"
                            step="0.01"
                            onChange={(e) => setNuevoIngrediente({
                              ...nuevoIngrediente,
                              precio_unitario: parseFloat(e.target.value)
                            })}
                            placeholder="Precio"
                          />
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {nuevoIngrediente.cantidad > 0 && nuevoIngrediente.precio_unitario > 0 ? 
                            `Bs. ${(nuevoIngrediente.cantidad * nuevoIngrediente.precio_unitario).toFixed(2)}` : ''}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAgregarIngrediente}
                            disabled={!nuevoIngrediente.nombre_ingrediente || nuevoIngrediente.cantidad <= 0 || nuevoIngrediente.precio_unitario < 0}
                          >
                            <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-amber-100 dark:bg-amber-900">
                        <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          Bs. {calcularTotal().toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </ReusableDialogWidth>

          <ReusableDialog
            title="Eliminar Compra"
            description={`¿Estás seguro de que deseas eliminar la compra N°${purchase.id}?`}
            trigger={<Button variant="destructive">Eliminar</Button>}
            submitButtonText="Eliminar"
            onSubmit={() => console.log("Compra eliminada")}
          />
        </div>
      );
    },
  },
];