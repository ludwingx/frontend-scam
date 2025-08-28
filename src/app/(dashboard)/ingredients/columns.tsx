import { ColumnDef } from "@tanstack/react-table";
import { Ingredient } from "@/types/ingredients";

export const columns = [
  {
    id: "rowNumber",
    header: "N°",
    cell: ({ row }: any) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }: any) => <div>{row.original.nombre}</div>,
  },
  {
    accessorKey: "unidad_medida",
    header: "Unidad",
    cell: ({ row }: any) => <div>{row.original.unidad_medida}</div>,
  },
  {
    accessorKey: "stock_actual",
    header: "Stock Actual",
    cell: ({ row }: any) => <div>{row.original.stock_actual}</div>,
  },
];
