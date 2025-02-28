"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReusableSelect } from "@/components/ReusableSelect";

interface CreateUserFormProps {
  roles: { value: string; label: string }[];
}

export function CreateUserForm({ roles }: CreateUserFormProps) {

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="full_name" className="text-right">
          Nombre
        </Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="Ingresa el nombre completo"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ci" className="text-right">
          C.I.
        </Label>
        <Input
          id="ci"
          name="ci"
          placeholder="Ingresa el carnet de identidad"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Contraseña
        </Label>
        <div className="col-span-3 flex items-center gap-2">
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa la contraseña"
            className="flex-1"
          />
         
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="rol_id" className="text-right">
          Rol
        </Label>
        <ReusableSelect
          placeholder="Selecciona una opción"
          options={roles}
          className="col-span-3"
          name="rol_id"
        />
      </div>
    </div>
  );
}