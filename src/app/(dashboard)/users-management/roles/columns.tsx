"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/types/role";
import { toast } from "sonner";
import { useState } from "react";

export const columns = (
  updateRoleInTable: (updatedRole: Role) => Promise<void>, // Función para actualizar un rol
  toggleRoleStatus: (roleId: number, newStatus: number) => Promise<void> // Función para cambiar el estado del rol
): ColumnDef<Role>[] => [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            status === 1
              ? "bg-green-100 text-green-800" // Estilo para "ACTIVO"
              : "bg-red-100 text-red-800" // Estilo para "INACTIVO"
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
      const role = row.original;
      const [name, setName] = useState(role.name);
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const handleEditRole = async () => {
        if (!name.trim()) {
          toast.error("El nombre del rol no puede estar vacío.");
          return;
        }

        await updateRoleInTable({ ...role, name });
        setIsDialogOpen(false);
      };

      const handleToggleStatus = async () => {
        const newStatus = role.status === 1 ? 0 : 1;
        await toggleRoleStatus(role.id, newStatus ); // Pasar el nombre del rol
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Diálogo para editar rol */}
          <ReusableDialog
            title="Editar Rol"
            description={
              <>
                Aquí podrás modificar los datos del rol <strong>{role.name}</strong>.
              </>
            }
            trigger={
              <Button className="bg-amber-400 text-white hover:bg-amber-400/90">
                Editar
              </Button>
            }
            onSubmit={handleEditRole}
            submitButtonText="Guardar Cambios"
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  defaultValue={role.name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </ReusableDialog>

          {/* Botón para cambiar el estado del rol */}
          <Button
            className={role.status === 1 ? "bg-red-500 text-white hover:bg-red-500/90 " : "bg-green-500 text-white hover:bg-green-500/90"}
            onClick={handleToggleStatus}
          >
            {role.status === 1 ? "Desactivar" : "Activar"}
          </Button>
        </div>
      );
    },
  },
];

export type { Role };