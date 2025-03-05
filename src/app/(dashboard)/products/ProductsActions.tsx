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
import { CirclePlus, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Combobox } from "../purchases/ComboBox";

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
  tipo: "Comestible" | "No comestible";
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
  const [itemType, setItemType] = useState<"Comestible" | "No comestible" | null>(null);
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
      tipo: itemType!,
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

          {/* Selector de tipo de ítem */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemType" className="text-right">
              Tipo de ítem
            </Label>
            <Select onValueChange={(value) => setItemType(value as "Comestible" | "No comestible")}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipos:</SelectLabel>
                  <SelectItem value="Comestible">Comestible</SelectItem>
                  <SelectItem value="No comestible">No comestible</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Combobox para seleccionar el ítem (solo se muestra si se ha seleccionado un tipo) */}
          {itemType && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Seleccionar ítem
              </Label>
              <Combobox
                value={selectedItem?.nombre || ""}
                onSelect={(item) => setSelectedItem(item)}
                options={itemType === "Comestible" ? comestibles : noComestibles}
                placeholder="Seleccionar ítem"
              />
            </div>
          )}

          {/* Campos para cantidad y precio unitario (solo se muestran si se ha seleccionado un ítem) */}
          {selectedItem && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precioUnitario" className="text-right">
                  Precio Unitario (Bs.)
                </Label>
                <Input
                  id="precioUnitario"
                  type="number"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddItem}>Agregar ítem</Button>
              </div>
            </>
          )}

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
                      <TableCell>{ing.nombre}</TableCell>
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