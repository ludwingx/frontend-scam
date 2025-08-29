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

export function Combobox({ value, onSelect, options = [], placeholder, renderOption }: ComboboxProps) {
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
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 overflow-hidden">
        <Command className="flex flex-col max-h-[300px]">
          <CommandInput
            placeholder="Buscar..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-b rounded-t-md"
          />
          <CommandList className="flex-1 overflow-auto">
            <CommandEmpty className="py-4 text-center text-gray-500">
              No se encontraron resultados.
            </CommandEmpty>
            <CommandGroup className="p-1 max-h-[280px] overflow-y-auto">
              <div className="pr-1">
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
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className="px-3 py-2 text-sm cursor-pointer rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                  >
                    {renderOption ? (
                      renderOption(item)
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.nombre}
                          </div>
                          {item.unit_measurement && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.unit_measurement}
                            </div>
                          )}
                        </div>
                        {typeof item.stock === 'number' && (
                          <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {item.stock} en stock
                          </div>
                        )}
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4 flex-shrink-0",
                            value === item.nombre ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </>
                    )}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}