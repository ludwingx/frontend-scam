"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
  id: number;
  nombre: string;
  unit_measurement?: string;
  stock?: number;
}

interface SelectInsumoProps {
  value: string;
  onSelect: (value: string, item: Option) => void;
  options: Option[];
  selectedIds?: Set<string | number>;
  placeholder?: string;
  className?: string;
}

export function SelectInsumo({
  value,
  onSelect,
  options = [],
  selectedIds = new Set(),
  placeholder = "Seleccionar insumo",
  className = "w-full",
}: SelectInsumoProps) {
  const findOption = React.useCallback((value: string) => {
    return options.find((opt) => String(opt.id) === value);
  }, [options]);

  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return findOption(value);
  }, [value, findOption]);

  // Filter and sort options
  const filteredAndSortedOptions = React.useMemo(() => {
    return [...options]
      // Filter out already selected options (except the current value)
      .filter(option => !selectedIds.has(option.id) || String(option.id) === value)
      // Sort by stock in ascending order (least to most)
      .sort((a, b) => {
        const stockA = a.stock ?? Infinity;
        const stockB = b.stock ?? Infinity;
        return stockA - stockB;
      });
  }, [options, selectedIds, value]);

  // Ensure we have a valid selected option
  const displayValue = React.useMemo(() => {
    if (!value) return '';
    const option = findOption(value);
    return option ? `${option.nombre}${option.unit_measurement ? ` (${option.unit_measurement})` : ''}` : '';
  }, [value, findOption]);

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        const option = findOption(value);
        if (option) {
          onSelect(value, option);
        }
      }}
    >
  <SelectTrigger className={className}>
    <SelectValue >
      {displayValue || placeholder}
    </SelectValue>
  </SelectTrigger>
      <SelectContent className="max-h-[300px] w-[400px] overflow-y-auto bg-white dark:bg-neutral-900 dark:text-white">
        {filteredAndSortedOptions.length === 0 ? (
          <div className="py-2 px-3 text-sm text-muted-foreground">
            No hay más insumos disponibles
          </div>
        ) : (
          filteredAndSortedOptions.map((item) => (
          <SelectItem 
            key={item.id} 
            value={String(item.id)}
            className="flex items-center py-2"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium flex-1 min-w-0 truncate">
                {item.nombre}
              </span>
              {item.unit_measurement && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  ({item.unit_measurement})
                </span>
              )}
              <div className="flex items-center gap-1 ml-auto pl-2">
                {typeof item.stock === 'number' && (
                  <span >
                    {item.stock} en stock
                  </span>
                )}
              </div>
            </div>
          </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
