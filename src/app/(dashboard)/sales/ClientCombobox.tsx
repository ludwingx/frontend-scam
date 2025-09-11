"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ClientOption {
  id: number;
  name: string;
}
interface ClientComboboxProps {
  value: string;
  onSelect: (id: string) => void;
  options: ClientOption[];
  placeholder?: string;
}

// Resalta el texto buscado en el nombre
function highlightMatch(name: string, search: string) {
  if (!search) return name;
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  const parts = name.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <span key={i} className="font-semibold">{part}</span>
      : part
  );
}

export function ClientCombobox({ value, onSelect, options, placeholder }: ClientComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((client) => String(client.id) === value)?.name
            : (placeholder || "Selecciona un cliente")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 z-50">
        <Command>
          <CommandInput placeholder="Buscar cliente..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>
              No se encontraron clientes.
              {search.trim().length > 0 && (
                <div className="p-2 flex flex-col items-center">
                  <Button
                    className="w-full mt-2"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSelect(search.trim());
                      setOpen(false);
                    }}
                  >
                    + Agregar "{search.trim()}"
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => {
                    onSelect(String(client.id));
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-green-500 hover:text-white"
                >
                  {highlightMatch(client.name, search)}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === String(client.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              {search.trim().length > 0 && (
                <CommandItem
                  value={search.trim()}
                  onSelect={() => {
                    onSelect(search.trim());
                    setOpen(false);
                  }}
                  className="cursor-pointer font-semibold hover:bg-green-500 hover:text-white"
                >
                  <span>+ Agregar "{search.trim()}"</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
