"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface Ingrediente {
  unit_measurement: string;
  id: number;
  nombre: string;
}

interface ComboboxIngredientsProps {
  value: string; // Add this line
  onSelect: (ingrediente: Ingrediente) => void;
}
const ingredientesData = [
  { id: 1, nombre: "Harina", unit_measurement: "gramos" },
  { id: 2, nombre: "Azúcar", unit_measurement: "gramos" },
  { id: 3, nombre: "Huevo", unit_measurement: "unidad" },
  { id: 4, nombre: "Leche", unit_measurement: "mililitros" },
  { id: 5, nombre: "Mantequilla", unit_measurement: "gramos" },
  { id: 6, nombre: "Queso", unit_measurement: "gramos" },
  { id: 7, nombre: "Sal", unit_measurement: "gramos" },
  { id: 8, nombre: "Aceite", unit_measurement: "mililitros" },
  { id: 9, nombre: "Azucares", unit_measurement: "gramos" },
  { id: 10, nombre: "Cafe", unit_measurement: "gramos" },
];

export function ComboboxIngredients( { onSelect, value, disabledItems = [] }: ComboboxIngredientsProps & { disabledItems?: string[] }) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  // Sincronizar el estado interno con la prop `value`
  React.useEffect(() => {
    setInternalValue(value);
  }, [value])
  // Filtrar los ingredientes disponibles
  const filteredIngredientesData = ingredientesData.filter(
    (ingrediente) => !disabledItems.includes(ingrediente.nombre)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {internalValue || "Seleccionar ingrediente..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar ingrediente..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron ingredientes.</CommandEmpty>
            <CommandGroup>
              {filteredIngredientesData.map((ingrediente) => (
                <CommandItem
                  key={ingrediente.id}
                  value={ingrediente.nombre}
                  onSelect={() => {
                    setInternalValue(""); // Resetear el valor interno
                    onSelect(ingrediente); // Notificar al componente padre
                    setOpen(false);
                  }}
                >
                  {ingrediente.nombre}
                  <Check
                    className={cn(
                      "ml-auto",
                      internalValue === ingrediente.nombre ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}