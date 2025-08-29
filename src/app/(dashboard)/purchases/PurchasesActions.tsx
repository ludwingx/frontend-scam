"use client";
import { useState, useEffect } from "react";
import { fetchActualIngredientsData } from "@/services/fetchActualIngredientsData";
import { registerPurchase } from "@/services/purchaseService";
import type { Ingredient } from "@/types/ingredients";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import { toast } from "sonner";
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
import { CirclePlus, Utensils, Box, Trash2, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
import { SelectInsumo } from "./SelectInsumo";

interface Option {
  id: number;
  nombre: string;
  unit_measurement?: string;
  stock?: number;
}

interface Item {
  id: number;
  nombre: string;
  cantidad?: number;
  precioUnitario?: number;
  unit_measurement?: string;
  proveedor?: string;
  subtotal?: number;
}

import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

// Helper to parse yyyy-MM-dd as a local date (no UTC conversion)
function parseLocalDate(str: string): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface PurchasesActionsProps {
  onSuccess?: () => Promise<void>;
}

export function PurchasesActions({ onSuccess }: PurchasesActionsProps) {
  // Fecha de compra: valor inicial hoy
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const [fechaCompra, setFechaCompra] = useState(`${yyyy}-${mm}-${dd}`);
  const [showCalendar, setShowCalendar] = useState(false);

  const [ingredients, setIngredients] = useState<Item[]>([
    {
      id: Date.now(),
      nombre: "",
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [insumos, setInsumos] = useState<Ingredient[]>([]);

  // Cargar insumos reales al abrir el modal
  useEffect(() => {
    if (dialogOpen) {
      fetchActualIngredientsData().then((data) => {
        console.log("Insumos desde API:", data);
        setInsumos(data);
      });
    }
  }, [dialogOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare purchase items
      const purchaseItems = ingredients
        .filter((item): item is Item & { id: number; cantidad: number; precioUnitario: number } => 
          !!item.id && typeof item.cantidad === 'number' && typeof item.precioUnitario === 'number'
        )
        .map(item => ({
          id_insumo: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precioUnitario,
          ...(item.proveedor && { proveedor: item.proveedor }),
          // Add any additional fields from your form
        }));

      if (purchaseItems.length === 0) {
        toast.error("Por favor, agregue al menos un insumo con cantidad y precio");
        return;
      }

      // Submit the purchase
      const result = await registerPurchase(purchaseItems);
      
      // Show success message
      toast.success("Compra registrada exitosamente");
      
      // Close the modal and reset the form
      setDialogOpen(false);
      setIngredients([{ id: undefined, nombre: "", cantidad: 0, precioUnitario: 0, subtotal: 0 }]);
      
      // Refresh the purchases list if onSuccess callback is provided
      if (onSuccess) {
        await onSuccess();
      }
      
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      toast.error("Error al registrar la compra. Por favor, intente nuevamente.");
    }
  };

  // Función modificada para agregar items sin cerrar el diálogo
  const addItem = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: "",
        // tipo removed, now always API-based insumo
      },
    ]);
  }; // End of addItem

  return (
    <div className="flex flex-col gap-4">
      <ReusableDialogWidth
        title="Crear Compra"
        description="Aquí podrás crear una compra."
        submitButtonText="Crear Compra"
        trigger={
          <Button
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => setDialogOpen(true)}
          >
            <CirclePlus className="w-4 h-4" />
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
            <div className="relative w-40">
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`w-48 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${!fechaCompra ? 'text-muted-foreground' : ''}`}
                    id="fecha-compra"
                  >
                    {fechaCompra ? fechaCompra : "Selecciona la fecha"}
                    <CalendarIcon className="inline-block h-6 w-6 pb-1 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0 bg-popover text-popover-foreground border-border dark:bg-neutral-900 dark:text-white dark:border-neutral-700" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaCompra ? parseLocalDate(fechaCompra) : undefined}
                    captionLayout="dropdown"
                    locale={es}
                    onSelect={(date: Date | undefined) => {
                      if (date) {
                        // Fix: always treat as local date (ignore timezone offset)
                        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        const yyyy = localDate.getFullYear();
                        const mm = String(localDate.getMonth() + 1).padStart(2, "0");
                        const dd = String(localDate.getDate()).padStart(2, "0");
                        setFechaCompra(`${yyyy}-${mm}-${dd}`);
                        setShowCalendar(false);
                      }
                    }}
                    className="rounded-lg border-none bg-transparent dark:bg-neutral-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid items-center gap-4">
            <ScrollArea className="h-[300px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">N°</TableHead>
                    <TableHead className="w-[220px] ">
                      Nombre de Insumo
                    </TableHead>
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
                    <TableRow
                      key={
                        ing.id !== undefined
                          ? ing.id
                          : `${index}-${ing.nombre ?? "row"}`
                      }
                    >
                      {/* Id */}
                      <TableCell className="w-[40px] font-medium">
                        {index + 1}
                      </TableCell>
                      {/* Nombre */}
                      <TableCell className="w-[220px]">
                        <SelectInsumo
                        value={ing.id ? String(ing.id) : ""}
                        onSelect={(value, item) => {
                          const updatedItems = [...ingredients];
                          updatedItems[index].nombre = item.nombre;
                          updatedItems[index].id = item.id;
                          updatedItems[index].unit_measurement = item.unit_measurement;
                          setIngredients(updatedItems);
                        }}
                        // Pass a Set of all selected ingredient IDs except the current one
                        selectedIds={new Set(
                          ingredients
                            .filter((_, i) => i !== index) // Exclude current row
                            .map(item => item.id)
                            .filter((id): id is number => id !== undefined)
                        )}
                        options={insumos.map((i) => ({
                          id: i.id_insumo,
                          nombre: i.nombre || "",
                          unit_measurement: i.unidad_medida || "",
                          stock:
                            typeof i.stock_actual === "string"
                              ? parseFloat(i.stock_actual)
                              : typeof i.stock_actual === "number"
                              ? i.stock_actual
                              : 0
                        }))}
                        className="w-full min-w-[250px]"
                        placeholder="Seleccionar insumo"
                      />
                      </TableCell>
                      {/* Cantidad */}
                      <TableCell className="w-[100px]">
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.cantidad || ""}
                          placeholder="0"
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].cantidad = Number(
                              e.target.value
                            );
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      {/* Precio Unitario */}
                      <TableCell className="w-[120px] text-center">
                        <Input
                          className="text-center"
                          type="number"
                          value={ing.precioUnitario || ""}
                          placeholder="0.00"
                          onChange={(e) => {
                            const updatedItems = [...ingredients];
                            updatedItems[index].precioUnitario = Number(
                              e.target.value
                            );
                            setIngredients(updatedItems);
                          }}
                        />
                      </TableCell>
                      {/* Subtotal */}
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
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-2">
                      <Button type="button" variant="outline" onClick={addItem}>
                        + Agregar Insumo
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-end mt-2">
              <div className="flex-1"></div>
              <div className="bg-secondary px-4 py-2 rounded-md font-bold flex items-center">
                Total:&nbsp; Bs. {calculateTotal().toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>
        </div>
      </ReusableDialogWidth>
    </div>
  );
}
