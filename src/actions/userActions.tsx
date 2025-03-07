"use client";

import { useState, useEffect } from "react";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { fetchRoleData } from "@/services/fetchRoleData";
import { toast } from "sonner";
import { RefreshCcw, UserRoundPlus } from "lucide-react";
import { CreateUserForm } from "@/app/(dashboard)/user-management/users/createUserForm";
import { createUser } from "@/services/fetchUserData";
import { User } from "@/types/user";

export function UsersActions() {
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  // Obtener los roles desde la API
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await fetchRoleData();
        const mappedRoles = roles?.map((role) => ({
          value: role.id.toString(),
          label: role.name,
        }));
        setRoles(mappedRoles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Error al cargar los roles. Por favor, inténtalo de nuevo.");
      }
    };

    loadRoles();
  }, []);

  // Lógica para crear un usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      full_name: formData.get("full_name") as string,
      ci: formData.get("ci") as string,
      password: formData.get("password") as string,
      rol_id: formData.get("rol_id") as string, // Asegúrate de que este campo no sea null
    };

    console.log("Datos del formulario recibidos:", data);

    try {
      // Usar la función createUser de fetchUserData.ts
      const createdUser = await createUser(data as unknown as Omit<User, 'id'>);
      console.log("Usuario creado:", createdUser);

      toast.success("Usuario creado exitosamente");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      {/* Actualizar button */}
      <Button type="button" onClick={() => window.location.reload()}
        className="bg-amber text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber/90 transition-colors"
        >
        <RefreshCcw />
        <span>Actualizar</span>
      </Button>

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
        submitButtonText="Crear Usuario"
      >
        <CreateUserForm roles={roles} />
      </ReusableDialog>
    </>
  );
}