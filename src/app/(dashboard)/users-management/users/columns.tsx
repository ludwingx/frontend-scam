import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { fetchRoleData } from "@/services/fetchRoleData";
import { updateUser, deactivateUser } from "@/services/userService";

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
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === null || status === undefined) {
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-semibold">
            DESCONOCIDO
          </span>
        );
      }

      return (
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const user = row.original;
      const [name, setName] = useState(user.full_name);
      const [ci, setCi] = useState(user.ci);
      const [password, setPassword] = useState(user.password);
      const [rolId, setRolId] = useState(user.rol_id);
      const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

      // Reinicializar el estado cuando el usuario cambia
      useEffect(() => {
        setName(user.full_name);
        setCi(user.ci);
        setPassword(user.password);
        setRolId(user.rol_id);
      }, [user]);

      // Cargar roles al iniciar
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

      const handleEditUser = async () => {
        if (!name.trim()) {
          toast.error("El nombre del usuario no puede estar vacío.");
          return;
        }

        try {
          await updateUser({
            id: user.id,
            full_name: name,
            ci,
            password,
            rol_id: rolId,
            rol_name: roles.find((role) => role.id === rolId)?.name || "",
            status: user.status,
          });

          toast.success(`Usuario "${user.full_name}" actualizado exitosamente.`);
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Error al actualizar el usuario. Por favor, inténtalo de nuevo.");
        }
      };

      const handleToggleStatus = async () => {
        try {
          const newStatus = user.status === 1 ? 0 : 1;
          await deactivateUser(user, newStatus);
          toast.success(`Usuario "${user.full_name}" ${newStatus === 1 ? "activado" : "desactivado"} exitosamente.`);
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          console.error("Error al cambiar el estado del usuario:", error);
          toast.error("Error al cambiar el estado del usuario. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          <ReusableDialog
            title="Editar Usuario"
            description={`Aquí podrás modificar los datos del usuario ${user.full_name}.`}
            trigger={
              <Button className="bg-amber-400 text-white hover:bg-amber-400/80">
                Editar
              </Button>
            }
            onSubmit={handleEditUser}
            submitButtonText="Guardar Cambios"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={name}
                  placeholder="Ingresa el nombre del usuario"
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ci" className="text-right">
                  CI
                </Label>
                <Input
                  id="ci"
                  value={ci}
                  placeholder="Ingresa la CI del usuario"
                  className="col-span-3"
                  onChange={(e) => setCi(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  type="password"
                  id="password"
                  
                  placeholder="Ingresa una nueva contraseña"
                  className="col-span-3"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rol" className="text-right">
                  Rol
                </Label>
                <select
                  id="rol"
                  value={rolId}
                  className="col-span-3 p-2 border rounded"
                  onChange={(e) => setRolId(Number(e.target.value))}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ReusableDialog>

          <ReusableDialog
            title={user.status === 1 ? "Desactivar Usuario" : "Activar Usuario"}
            description={`¿Estás seguro de que deseas ${
              user.status === 1 ? "desactivar" : "activar"
            } al usuario "${user.full_name}"?`}
            trigger={
              <Button
                className={user.status === 1 ? "bg-red-500 text-white hover:bg-red-500/80" : "bg-green-500 text-white hover:bg-green-500/80"}
                onClick={() => setIsConfirmDialogOpen(true)}
              >
                {user.status === 1 ? "Desactivar" : "Activar"}
              </Button>
            }
            onSubmit={handleToggleStatus}
            submitButtonText={user.status === 1 ? "Desactivar" : "Activar"}
            onOpenChange={setIsConfirmDialogOpen}
            isOpen={isConfirmDialogOpen}
            // eslint-disable-next-line react/no-children-prop
            children={null}
          />
        </div>
      );
    },
  },
];

export type { User };