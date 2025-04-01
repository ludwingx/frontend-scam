'use client'
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
import { CirclePlus, Utensils, Box, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Combobox } from "./ComboBox";

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  unit_measurement?: string;
  proveedor?: string;
  subtotal?: number;
  tipo?: "Comestible" | "No comestible";
}

// Datos de ejemplo
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

export function PurchasesActions() {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRemoveItem = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const calculateSubtotal = (item: Item) => {
    const cantidad = item.cantidad || 0;
    const precioUnitario = item.precioUnitario || 0;
    return cantidad * precioUnitario;
  };

  const calculateTotal = () => {
    return ingredients.reduce(
      (total, ing) => total + calculateSubtotal(ing),
      0
    );
  };

  const handleSubmit = () => {
    console.log("Datos de la compra:", JSON.stringify(ingredients, null, 2));
    setDialogOpen(false);
  };

  const getAvailableIngredients = (tipo: "Comestible" | "No comestible") => {
    const allIngredients = tipo === "Comestible" ? comestibles : noComestibles;
    return allIngredients.filter(
      (ing) => !ingredients.some((selectedIng) => selectedIng.id === ing.id)
    );
  };

  // Función modificada para agregar items sin cerrar el diálogo
  const addItem = (tipo: "Comestible" | "No comestible") => {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: "",
        tipo: tipo,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-4">
      <ReusableDialogWidth
        title="Crear Compra"
        description="Aquí podrás crear una compra."
        submitButtonText="Crear Compra"
        trigger={
          <Button 
            className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => setDialogOpen(true)}
          >
            <CirclePlus />
            <span>Crear Compra</span>
          </Button>
        }
        onSubmit={handleSubmit}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Fecha de la compra
            </Label>
            <Input id="name" type="date" />
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
                  <SelectItem value="radial19">Radial 19</SelectItem>
                  <SelectItem value="villa1ro">Villa 1ro de mayo</SelectItem>
                  <SelectItem value="radial26">Radial 26</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de ítems */}
          <div className="grid items-center gap-4">
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">N°</TableHead>
                    <TableHead className="w-[220px]">Ítem</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Cantidad
                    </TableHead>
                    <TableHead className="w-[120px] text-center">
                      Precio Unitario (Bs.)
                    </TableHead>
                    <TableHead className="w-[100px] text-right">
                      Subtotal
                    </TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={ing.id}>
                      <TableCell className="w-[40px] font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="w-[220px]">
                        {!ing.tipo ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                const updatedItems = [...ingredients];
                                updatedItems[index].tipo = "Comestible";
                                setIngredients(updatedItems);
                              }}
                            >
                              <Utensils className="w-4 h-4 mr-2" />
                              Comestible
                            </Button>
                            <Button
                              className="bg-red-600 text-white hover:bg-red-600/90"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                const updatedItems = [...ingredients];
                                updatedItems[index].tipo = "No comestible";
                                setIngredients(updatedItems);
                              }}
                            >
                              <Box className="w-4 h-4 mr-2" />
                              No comestible
                            </Button>
                          </div>
                        ) : (
                          <Combobox
                            value={
                              <div className="inline">
                                {ing.nombre}{" "}
                                <span className="text-sm text-gray-500">
                                  {ing.nombre === "" ? "Seleccionar un item" : ""}
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
                            onSelect={(item) => {
                              const updatedItems = [...ingredients];
                              updatedItems[index].nombre = item.nombre;
                              updatedItems[index].id = item.id;
                              updatedItems[index].unit_measurement =
                                item.unit_measurement;
                              setIngredients(updatedItems);
                            }}
                            options={getAvailableIngredients(ing.tipo)}
                            placeholder="Seleccionar ítem"
                            renderOption={(item) => (
                              <div className="flex justify-between w-full">
                                <span>{item.nombre}</span>
                                <span className="text-sm text-gray-500">
                                  {item.quantity} {item.unit_measurement}
                                </span>
                              </div>
                            )}
                          />
                        )}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.cantidad || ""}
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].cantidad = Number(
                              e.target.value
                            );
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="w-[120px] text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.precioUnitario || ""}
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].precioUnitario = Number(
                              e.target.value
                            );
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="w-[100px] text-right">
                        Bs.{" "}
                        {calculateSubtotal(ing).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="w-[40px]">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveItem(ing.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fila para agregar un nuevo ítem */}
                  <TableRow>
                    <TableCell className="w-[40px] font-medium">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell className="w-[220px]">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            addItem("Comestible");
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
                            addItem("No comestible");
                          }}
                        >
                          <Box className="w-4 h-4 mr-2" />
                          No comestible
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <Input type="number" disabled />
                    </TableCell>
                    <TableCell className="w-[100px] text-center">
                      <Input type="text" disabled />
                    </TableCell>
                    <TableCell className="w-[100px] text-right"></TableCell>
                    <TableCell className="w-[40px]"></TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-right font-bold bg-amber-100"
                    >
                      Total
                    </TableCell>
                    <TableCell className="w-[120px] text-right  bg-amber-100">
                      Bs. {calculateTotal().toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell className="w-[40px] bg-amber-100"></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </ReusableDialogWidth>
    </div>
  );
}