"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  label,
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
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
