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

interface Option {
  id: number;
  nombre: string;
  unit_measurement?: string;
  stock?: number;
}

interface ComboboxProps {
  value: React.ReactNode; // Cambiado a React.ReactNode para manejar JSX
  onSelect: (item: Option) => void;
  options?: Option[]; // `options` es opcional
  placeholder?: string;
  renderOption?: (item: Option) => React.ReactNode;
}

export function Combobox({ value, onSelect, options = [], placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[270px] justify-between"
        >
          {value || placeholder || "Seleccionar..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            value={searchValue}
            onValueChange={(value) => setSearchValue(value)}
          />
          <CommandList className="overflow-y-auto max-h-72" >
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((item, idx) => (
                <CommandItem
                  key={
                    (item.id !== undefined ? item.id : `idx${idx}`) +
                    '-' +
                    (item.unit_measurement ?? item.nombre ?? `idx${idx}`)
                  }
                  value={`${item.nombre} ${(typeof item.stock === 'number' ? item.stock : '')} ${item.unit_measurement || ''}`}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false); // Cierra el popover después de seleccionar
                    setSearchValue(""); // Reinicia el valor de búsqueda
                  }}
                >
                  <div className="w-full">
  <span className="text-black dark:text-white font-medium">{item.nombre}</span>
</div>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.nombre ? "opacity-100" : "opacity-0"
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