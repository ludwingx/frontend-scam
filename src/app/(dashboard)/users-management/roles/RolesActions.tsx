"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createRole } from "@/services/fetchRoleData";

interface RolesActionsProps {
  onRefresh: () => void; // Prop para actualizar la tabla
  onToggleActiveRoles: (showActive: boolean) => void;
}

export function RolesActions({ onRefresh, onToggleActiveRoles }: RolesActionsProps) {
  const [showActiveRoles, setShowActiveRoles] = useState(true);
  const [roleName, setRoleName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar la apertura/cierre del diálogo

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.error("El nombre del rol no puede estar vacío.");
      return;
    }

    try {
      const newRole = await createRole({ nombre_rol: roleName});

      if (newRole) {
        toast.success(`Rol "${newRole.nombre_rol}" creado exitosamente.`);
        onRefresh(); // Actualizar la tabla
        setIsDialogOpen(false); // Cerrar el diálogo después de crear el rol
        setRoleName(""); // Limpiar el campo del nombre del rol
      } else {
        throw new Error("No se pudo crear el rol.");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Error al crear el rol. Por favor, inténtalo de nuevo.");
    }
  };
  const handleToggleActiveRoles = () => {
    const newShowActiveRoles = !showActiveRoles;
    setShowActiveRoles(newShowActiveRoles);
    onToggleActiveRoles(newShowActiveRoles); // Notificar al componente padre
  };
  return (
    <>
      <div className="flex items-center gap-2">
      <Button
        onClick={handleToggleActiveRoles}
        className={showActiveRoles ? "bg-blue-500 text-white hover:bg-blue-500/90" : "bg-violet-500 text-white hover:bg-violet-500/90"}
      >
        {showActiveRoles ? "Ver Inactivos" : "Ver Activos"}
      </Button>
      <ReusableDialog
        title="Crear Rol"
        description="Aquí podrás crear un rol."
        trigger={
         <Button className="text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
            <CirclePlus />
            <span>Crear Rol</span>
          </Button>
        }
        onSubmit={handleCreateRole}
        submitButtonText="Crear Rol"
        onOpenChange={setIsDialogOpen} // Pasar la función para manejar el estado del diálogo
        isOpen={isDialogOpen} // Pasar el estado actual del diálogo
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del rol"
              className="col-span-3"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
        </div>
      </ReusableDialog>
      </div>
     
    </>
  );
}
