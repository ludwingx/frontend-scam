"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { fetchRoleData } from "@/services/fetchRoleData";
import { updateUser, deleteUser } from "@/services/fetchUserData"; // Importa las funciones necesarias

export const columns: ColumnDef<User>[] = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
  },
  {
    accessorKey: "ci",
    header: "CI",
  },
  {
    accessorKey: "rol_name",
    header: "Rol",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const user = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [name, setName] = useState(user.full_name);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [ci, setCi] = useState(user.ci);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [password, setPassword] = useState(user.password);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [rolId, setRolId] = useState(user.rol_id);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [showPassword] = useState(false);

      // Cargar roles al iniciar
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const loadRoles = async () => {
          try {
            const roles = await fetchRoleData();
            setRoles(roles || []);
          } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("Error al cargar los roles. Por favor, inténtalo de nuevo.");
          }
        };

        loadRoles();
      }, []);

      // Función para editar usuario
      const handleEditUser = async () => {
        if (!name.trim()) {
          toast.error("El nombre del usuario no puede estar vacío.");
          return;
        }

        try {
          const updatedUser = await updateUser({
            id: user.id,
            full_name: name,
            ci,
            password,
            rol_id: rolId,
            rol_name: roles.find((role) => role.id === rolId)?.name || "",
          });

          toast.success(`Usuario "${updatedUser.full_name}" actualizado exitosamente.`);
          setTimeout(() => window.location.reload(), 2000); // Recargar la página para reflejar cambios
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Error al actualizar el usuario. Por favor, inténtalo de nuevo.");
        }
      };

      // Función para eliminar usuario
      const handleDeleteUser = async () => {
        try {
          await deleteUser(user.id as unknown as string);
          toast.success(`Usuario "${user.full_name}" eliminado exitosamente.`);
          setTimeout(() => window.location.reload(), 2000); // Recargar la página para reflejar cambios
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Error al eliminar el usuario. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Diálogo para editar usuario */}
          <ReusableDialog
            title="Editar Usuario"
            description={`Aquí podrás modificar los datos del usuario ${user.full_name}.`}
            trigger={<Button className="bg-blue-600 text-white hover:bg-blue-600/90">Editar</Button>}
            onSubmit={handleEditUser}
            submitButtonText="Guardar Cambios"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  defaultValue={name}
                  placeholder="Ingresa el nombre del usuario"
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ci" className="text-right">CI</Label>
                <Input
                  id="ci"
                  placeholder="Ingresa la CI del usuario"
                  defaultValue={ci}
                  className="col-span-3"
                  onChange={(e) => setCi(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Ingresa una nueva contraseña"
                    className="flex-1"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rol" className="text-right">Rol</Label>
                <select
                  id="rol"
                  defaultValue={rolId}
                  className="col-span-3 p-2 border rounded"
                  onChange={(e) => setRolId(Number(e.target.value))}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </ReusableDialog>

          {/* Diálogo para eliminar usuario */}
          <ReusableDialog
            title="Eliminar Usuario"
            description={`¿Estás seguro de eliminar el usuario ${user.full_name}?`}
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteUser}
            // eslint-disable-next-line react/no-children-prop
            submitButtonText="Eliminar" children={null}
          />
        </div>
      );
    },
  },
];

export type { User };