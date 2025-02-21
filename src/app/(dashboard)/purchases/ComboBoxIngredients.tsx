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
  id: number;
  nombre: string;
}

interface ComboboxIngredientsProps {
  onSelect: (ingrediente: Ingrediente) => void;

}
const ingredientesData = [
  { id: 1, nombre: "Harina" },
  { id: 2, nombre: "Azúcar" },
  { id: 3, nombre: "Huevos" },
  { id: 4, nombre: "Leche" },
  { id: 5, nombre: "Mantequilla" },
];

export function ComboboxIngredients({ value, onSelect, disabledItems = [] }: ComboboxIngredientsProps & { disabledItems?: string[] }) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  // Sincronizar el estado interno con la prop `value`
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

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