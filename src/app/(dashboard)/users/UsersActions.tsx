"use client"; // Marcar como Client Component

import { useState, useEffect } from "react"; // Importar useState y useEffect
import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchRoleData } from "@/services/fetchRoleData"; // Importar la función para obtener roles
import { ReusableSelect } from "@/components/ReusableSelect";
import { toast } from "sonner"; // Para notificaciones
import { UserRoundPlus } from "lucide-react";

export function UsersActions() {
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]); // Estado para almacenar los roles

  // Obtener los roles desde la API
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await fetchRoleData(); // Obtener los roles desde la API
        // Mapear los roles al formato esperado por ReusableSelect
        const mappedRoles = roles.map((role) => ({
          value: role.id.toString(), // Asegúrate de que el valor sea un string
          label: role.name, // Usar el nombre del rol como etiqueta
        }));
        setRoles(mappedRoles); // Actualizar el estado con los roles mapeados
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error al cargar los roles. Por favor, inténtalo de nuevo.");
      }
    };

    loadRoles(); // Llamar a la función para cargar los roles
  }, []);

  const handleCreateUser = () => {
    console.log("Usuario creado");

    // Lógica para crear un usuario

  };

  return (
    <>
      {/* Diálogo para crear usuario */}
      <ReusableDialog
        title="Crear usuario"
        description="Aquí podrás crear un usuario."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <UserRoundPlus />
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
                type={showPassword ? "text" : "password"} // Cambiar el tipo de input según el estado
                id="password"
                placeholder="Ingresa la contraseña"
                className="flex-1"
              />
            
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rol" className="text-right">
              Rol
            </Label>
            <ReusableSelect
              placeholder="Selecciona una opción"
              label="Selecciona un rol"
              options={roles} // Pasar los roles mapeados como opciones
              className="col-span-3"
            />
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}