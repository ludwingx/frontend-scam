"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { ReusableSelect } from "@/components/ReusableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UsersActions() {
  const handleCreateUser = () => {
    console.log("Crear negocio");
    // Lógica para crear un negocio
  };

  return (
    <>
      {/* Diálogo para crear negocio */}
      <ReusableDialog
        title="Crear Producto"
        description="Aquí podrás crear un producto."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <span>Crear Usuario</span>
          </Button>
        }
        onSubmit={handleCreateUser}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del usuario"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ci" className="text-right">
              C.I.
            </Label>
            <Input
              id="ci"
              placeholder="Ingresa el carnet de identidad"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="email" className="text-right">
              Rol de Usuario
            </Label>
            <ReusableSelect
                                                                placeholder="Selecciona un rol"
                                                                label="Roles:"
                                                                options={[
                                                                  
                                                   { value: "Administrador", label: "Administrador" },
                                                   { value: "Encargado de Almacen", label: "Radial 19" },
                                          
                                                                 ]}
                                                              />
            {/* //select roll */}
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}
