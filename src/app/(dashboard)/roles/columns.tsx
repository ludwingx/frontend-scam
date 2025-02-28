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
  deleteRoleFromTable: (roleId: number) => Promise<void> // Función para eliminar un rol
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
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const role = row.original;
      const [name, setName] = useState(role.name); // State for editing role name
      const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

      const handleEditRole = async () => {
        if (!name.trim()) {
          toast.error("El nombre del rol no puede estar vacío.");
          return;
        }

        await updateRoleInTable({ ...role, name }); // Actualizar el rol
        setIsDialogOpen(false); // Cerrar el diálogo
      };

      const handleDeleteRole = async () => {
        await deleteRoleFromTable(role.id); // Eliminar el rol
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
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
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

          {/* Diálogo para eliminar rol */}
          <ReusableDialog
            title="Eliminar Rol"
            description={
              <>
                ¿Estás seguro de eliminar el rol <strong>{role.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteRole}
            submitButtonText="Eliminar"
          />
        </div>
      );
    },
  },
];

export type { Role };