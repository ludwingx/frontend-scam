"use client";
import { Ingredient } from "@/types/ingredients";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Ingredient>[] = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
    size: 40, // Ancho fijo para la columna de número
    minSize: 50, // Ancho mínimo
    maxSize: 50, // Ancho máximo
  },
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => {
      const ingredients = row.original;
      return (
        <div>
          {ingredients.name}{" - "}
          <span className="text-sm text-gray-500">
            {ingredients.cantidad} {ingredients.unidad}
          </span>
        </div>
      );
    },
    size: 100, // Ancho fijo para la columna de ítem
    minSize: 150, // Ancho mínimo
    maxSize: 300, // Ancho máximo
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const ingredients = row.original;
      return <div>{ingredients.stock}</div>;
    },

    size: 50, // Ancho fijo para la columna de stock
    minSize: 80, // Ancho mínimo
    maxSize: 120, // Ancho máximo
  },
];