"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  full_name: string;
  ci: string;
  rol_name: string;
};

export const columns: ColumnDef<Users>[] = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
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

  //edit & delete opcion
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>, // Centrar el header
    cell: ({ row }) => {
      const users = row.original;

      return (
        <div className="flex gap-2 justify-center">
          <ReusableDialog
            title="Editar Negocio"
            description="Aquí podrás editar un negocio."
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
                  defaultValue={users.full_name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ci" className="text-right">
                  ci
                </Label>
                <Input
                  id="ci" defaultValue={users.ci}
                  placeholder="Ingresa el carnet de identidad"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="email" className="text-right">
                  Rol de Usuario
                </Label>
                <Select>
                  <SelectTrigger className="w-[275px]">
                    <SelectValue placeholder={users.rol_name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                    <SelectItem value="Encargado de almacen">
                      Encargado de almacen
                    </SelectItem>
                  </SelectContent>
                </Select>
                {/* //select roll */}
              </div>
            </div>
          </ReusableDialog>

          <ReusableDialog
            title="Eliminar Negocio"
            description="Que deseas eliminar el negocio?"
            trigger={<Button variant="destructive">Eliminar</Button>}
            // eslint-disable-next-line react/no-children-prop
            submitButtonText="Eliminar" children={undefined}
          ></ReusableDialog>
        </div>
      );
    },
  },
];
