"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReusableSelectProps {
  placeholder: string;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  name: string; // Asegúrate de agregar el atributo name
  onValueChange?: (value: string) => void; // Función para manejar cambios
}

export function ReusableSelect({
  placeholder,
  options,
  className,
  name,
  onValueChange,
}: ReusableSelectProps) {
  return (
    <div className={className}>
      <Select name={name} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}