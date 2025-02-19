"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Business = {
  id: string
  name: string
}

export const columns: ColumnDef<Business>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  //edit & delete opcion
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>, // Centrar el header
      cell: ({  }) => {
        // const business = row.original;

        function handleDelete( ): void {
          throw new Error("Function not implemented.")
        }

        function handleEdit(): void {
          throw new Error("Function not implemented.")
        }

        return (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit()} className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            >
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete()}
            >
              Eliminar
            </Button>
          </div>
        );
      },

  }

]
