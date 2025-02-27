"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { Business } from "@/types/business";
import { toast } from "sonner"; // For notifications
import { useState } from "react";

export const columns: ColumnDef<Business>[] = [
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
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [name, setName] = useState(business.name); // State for editing business name

      const handleEditBusiness = async () => {
        if (!name.trim()) {
          toast.error("El nombre del negocio no puede estar vacío.");
          return;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

          if (!apiUrl) {
            throw new Error("La URL de la API no está definida en las variables de entorno.");
          }

          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

          if (!token) {
            throw new Error("No se encontró un token de autenticación.");
          }

          const response = await fetch(`${apiUrl}/api/business/${business.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              `Error al actualizar el negocio: ${response.status} ${response.statusText}. ${errorData?.message || ""}`
            );
          }

          toast.success(`Negocio "${name}" actualizado exitosamente.`);         //despues de 3 segundos hacer reload de la pagina
          setTimeout(() => {
            window.location.reload(); // Refresh the page to reflect changes
          }, 2000);
        } catch (error) {
          console.error("Error updating business:", error);
          toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
        }
      };

      const handleDeleteBusiness = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

          if (!apiUrl) {
            throw new Error("La URL de la API no está definida en las variables de entorno.");
          }

          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

          if (!token) {
            throw new Error("No se encontró un token de autenticación.");
          }

          const response = await fetch(`${apiUrl}/api/business/${business.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              `Error al eliminar el negocio: ${response.status} ${response.statusText}. ${errorData?.message || ""}`
            );
          }

          toast.success(`Negocio "${business.name}" eliminado exitosamente.`);

         //despues de 3 segundos hacer reload de la pagina
          setTimeout(() => {
            window.location.reload(); // Refresh the page to reflect changes
          }, 2000);
         
          
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