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
import { Ingredient } from "@/types/ingredients";

interface ComboboxProps {
  value: React.ReactNode;
  onSelect: (item: Ingredient) => void;
  options?: Ingredient[];
  placeholder?: string;
}

export function Combobox({ value, onSelect, options = [], placeholder }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const commandListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Deshabilita el desplazamiento en el body
    } else {
      document.body.style.overflow = "auto"; // Restaura el desplazamiento
    }

    return () => {
      document.body.style.overflow = "auto"; // Limpia el efecto
    };
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || placeholder || "Seleccionar..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 max-h-[300px] overflow-y-auto z-[1000]">
        <Command>
          <CommandInput
            placeholder="Buscar..."
            value={searchValue}
            onValueChange={(value) => setSearchValue(value)}
          />
          <CommandList
            ref={commandListRef}
            className="max-h-[200px] overflow-y-auto"
            tabIndex={-1}
            onWheel={(e) => {
              e.stopPropagation(); // Evita que el evento se propague al Dialog
              if (commandListRef.current) {
                commandListRef.current.scrollBy({
                  top: e.deltaY,
                  behavior: "smooth",
                });
              }
            }}
          >
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.name} ${item.cantidad} ${item.unidad}`}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="h-10 flex items-center" // Asegúrate de que los items tengan un alto definido
                >
                  <div className="flex justify-between w-full">
                    <span>{item.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.name ? "opacity-100" : "opacity-0"
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