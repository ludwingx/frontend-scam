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
  value?: string;
  placeholder: string;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  name: string; // Asegúrate de agregar el atributo name
  onValueChange?: (value: string) => void; // Función para manejar cambios
  disabled: boolean
}

export function ReusableSelect({
  value,
  placeholder,
  label,
  options,
  className,
  name,
  onValueChange,
  disabled,
}: ReusableSelectProps) {
  return (
    <div className={className}>
      <Select disabled={disabled} name={name} onValueChange={onValueChange}  value={value}  >
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
