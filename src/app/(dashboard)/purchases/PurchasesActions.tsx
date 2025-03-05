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
  TableFooter,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, X, Utensils, Box } from "lucide-react";
import { Combobox } from "./Combobox"; // Importa el combobox reutilizable
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
  tipo?: "Comestible" | "No comestible"; // Tipo de ítem (opcional)
}

// Datos de ejemplo
const comestibles = [
  { id: 1, nombre: "Harina", unit_measurement: "gramos" },
  { id: 2, nombre: "Azúcar", unit_measurement: "gramos" },
  { id: 3, nombre: "Huevo", unit_measurement: "unidad" },
];

const noComestibles = [
  { id: 4, nombre: "Cajas de cartón", unit_measurement: "unidades" },
  { id: 5, nombre: "Lavandina", unit_measurement: "litros" },
  { id: 6, nombre: "Stickers", unit_measurement: "unidades" },
];

export function PurchasesActions() {
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: number; nombre: string; unit_measurement?: string } | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);

  // Función para agregar un ítem a la lista
  const handleAddItem = () => {
    if (!selectedItem || cantidad <= 0 || precioUnitario <= 0) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    const newItem: Item = {
      id: selectedItem.id,
      nombre: selectedItem.nombre,
      cantidad,
      precioUnitario,
    };

    setIngredients((prev) => [...prev, newItem]);
    setSelectedItem(null);
    setCantidad(0);
    setPrecioUnitario(0);
  };

  // Función para eliminar un ítem
  const handleRemoveItem = (id: number) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // Función para calcular el subtotal de un ítem
  const calculateSubtotal = (item: Item) => {
    const cantidad = item.cantidad || 0;
    const precioUnitario = item.precioUnitario || 0;
    return cantidad * precioUnitario;
  };

  // Función para calcular el total de la compra
  const calculateTotal = () => {
    return ingredients.reduce(
      (total, ing) => total + calculateSubtotal(ing),
      0
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <ReusableDialogWidth
        title="Crear Compra"
        description="Aquí podrás crear una compra."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus />
            <span>Crear Compra</span>
          </Button>
        }
        onSubmit={() => console.log("Crear Compra")}
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
                    <TableHead className="text-center w-[100px]">Cantidad</TableHead>
                    <TableHead className="text-center">Precio Unitario (Bs.)</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ing, index) => (
                    <TableRow key={ing.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {/* Botones para seleccionar el tipo de ítem */}
                        {!ing.tipo ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updatedItems = [...ingredients];
                                updatedItems[index].tipo = "Comestible";
                                setIngredients(updatedItems);
                              }}
                            >
                              <Utensils className="w-4 h-4 mr-2" />
                              Comestible
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
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
                            value={ing.nombre}
                            onSelect={(item) => {
                              const updatedItems = [...ingredients];
                              updatedItems[index].nombre = item.nombre;
                              updatedItems[index].id = item.id;
                              setIngredients(updatedItems);
                            }}
                            options={ing.tipo === "Comestible" ? comestibles : noComestibles}
                            placeholder="Seleccionar ítem"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.cantidad || ""}
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].cantidad = Number(e.target.value);
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          className="text-center w-[120px]"
                          type="number"
                          value={ing.precioUnitario || ""}
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].precioUnitario = Number(e.target.value);
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-right w-[100px]">
                        Bs. {calculateSubtotal(ing).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(ing.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fila para agregar un nuevo ítem */}
                  <TableRow>
                    <TableCell className="font-medium">
                      {ingredients.length + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIngredients((prev) => [
                              ...prev,
                              { id: Date.now(), nombre: "", tipo: "Comestible" },
                            ]);
                          }}
                        >
                          <Utensils className="w-4 h-4 mr-2" />
                          Comestible
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIngredients((prev) => [
                              ...prev,
                              { id: Date.now(), nombre: "", tipo: "No comestible" },
                            ]);
                          }}
                        >
                          <Box className="w-4 h-4 mr-2" />
                          No comestible
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input type="number" disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input className="w-[120px]" type="number" disabled />
                    </TableCell>
                    <TableCell className="text-right w-[100px]"></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      Bs. {calculateTotal().toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell></TableCell>
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