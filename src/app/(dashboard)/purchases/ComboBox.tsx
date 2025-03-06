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
  cantidad?: number;
  unit_measurement?: string;
}

interface ComboboxProps {
  //value es para mostrar un div con el nombre y la cantidad JSX.IntrinsicElements.div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  value: string | Element;
  onSelect: (item: Option) => void;
  options: Option[];
  placeholder?: string;
}

export function Combobox({ value, onSelect, options, placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || placeholder || "Seleccionar..." }
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.nombre} ${item.cantidad} ${item.unit_measurement}`} // Valor para búsqueda
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <div className="flex justify-between w-full">
                    <span>{item.nombre}</span>
                    <span className="text-sm text-gray-500">
                      {item.cantidad} {item.unit_measurement}
                    </span>
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