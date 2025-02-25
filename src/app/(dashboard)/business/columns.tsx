"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Business = {
  id: string;
  name: string;
};

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

  //edit & delete opcion
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>, // Centrar el header
    cell: ({ row }) => {
      const business = row.original;

      return (
        <div className=" flex gap-2 justify-center">
          <ReusableDialog
            title="Editar Negocio"
            description={
              <>
                Aquí podras modificar los datos del negocio <strong>{business.name}</strong>
              </>
            } 
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-600/90">
                Editar
              </Button>
            }
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
                />
              </div>
            </div>
          </ReusableDialog>

          <ReusableDialog
            title="Eliminar Negocio"
            description={
              <>
                ¿Estás seguro de eliminar el ingrediente <strong>{business.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            // eslint-disable-next-line react/no-children-prop
            submitButtonText="Eliminar" children={undefined}          ></ReusableDialog>
        </div>
      );
    },
  },
];
