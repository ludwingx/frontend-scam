"use client";

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { RawMaterials } from "@/types/rawMaterials";

export const columns: ColumnDef<RawMaterials>[] = [
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
    cell: ({ row }) => {
      const ingredients = row.original;
      return (
        <div>
          {ingredients.name}{" - "}
          <span className="text-sm text-gray-500">
            {ingredients.quantity} {ingredients.unit_measurement}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  // Edit & delete opción
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>, // Centrar el header
    cell: ({ row }) => {
      const ingredients = row.original;

      return (
        <div className="flex gap-2 justify-center">
          <ReusableDialog
            title="Editar Ingrediente"
            description={
              <>
                Aquí podrás modificar los datos del ingrediente{" "}
                <strong>{ingredients.name}</strong>
              </>
            }
            trigger={
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Editar
              </Button>
            }
            submitButtonText="Guardar Cambios"
            onSubmit={() => console.log("Formulario enviado")}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  defaultValue={ingredients.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unidadMedida" className="text-right">
                  Unidad de Medida
                </Label>
                <Input
                  id="unidadMedida"
                  defaultValue={ingredients.unit_measurement}
                  placeholder="Ingresa la unidad de medida"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cantidad" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="cantidad"
                  defaultValue={ingredients.quantity}
                  placeholder="Ingresa la cantidad"
                  className="col-span-3"
                />
              </div>
            </div>
          </ReusableDialog>

          <ReusableDialog
            title="Eliminar Negocio"
            description={
              <>
                ¿Estás seguro de eliminar el ingrediente{" "}
                <strong>{ingredients.name}</strong>?
              </>
            }
            trigger={<Button variant="destructive">Eliminar</Button>}
            submitButtonText="Eliminar"
            onSubmit={() => console.log("Negocio eliminado")}
            // eslint-disable-next-line react/no-children-prop
            children={null}
          ></ReusableDialog>
        </div>
      );
    },
  },
];