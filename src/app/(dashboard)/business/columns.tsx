"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { Business } from "@/types/business";
import { toast } from "sonner";
import { useState } from "react";
import { updateBusiness, deleteBusiness } from "@/services/fetchBusinessData"; // Importar las funciones de servicio

export const columns = (
  updateBusinessInTable: (updatedBusiness: Business) => Promise<void>, // Función para actualizar un negocio
  deleteBusinessFromTable: (businessId: number) => Promise<void> // Función para eliminar un negocio
): ColumnDef<Business>[] => [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const business = row.original;
      const [name, setName] = useState(business.name); // State for editing business name

      const handleEditBusiness = async () => {
        if (!name.trim()) {
          toast.error("El nombre del negocio no puede estar vacío.");
          return;
        }

        try {
          const updatedBusiness = { ...business, name }; // Crear el objeto actualizado
          await updateBusinessInTable(updatedBusiness); // Actualizar el negocio en la tabla
          toast.success(`Negocio "${name}" actualizado exitosamente.`);
        } catch (error) {
          console.error("Error updating business:", error);
          toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
        }
      };

      const handleDeleteBusiness = async () => {
        try {
          await deleteBusinessFromTable(business.id); // Eliminar el negocio de la tabla
          toast.success(`Negocio "${business.name}" eliminado exitosamente.`);
        } catch (error) {
          console.error("Error deleting business:", error);
          toast.error("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
        }
      };

      return (
        <div className="flex gap-2 justify-center">
          {/* Edit Business Dialog */}
          <ReusableDialog
            title="Editar Negocio"
            description={
              <>
                Aquí podrás modificar los datos del negocio <strong>{business.name}</strong>.
              </>
            }
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
            onSubmit={handleEditBusiness}
            submitButtonText="Guardar Cambios"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  defaultValue={business.name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </ReusableDialog>

          {/* Delete Business Dialog */}
          <ReusableDialog
            title="Eliminar Negocio"
            description={
              <>
                ¿Estás seguro de eliminar el negocio <strong>{business.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            onSubmit={handleDeleteBusiness}
            submitButtonText="Eliminar"
          />
        </div>
      );
    },
  },
];

export type { Business };