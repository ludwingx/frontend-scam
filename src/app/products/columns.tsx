"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define la estructura de los productos
export type Product = {
  id: string;
  name: string;
  price: number;
  business: string;
  status: "active" | "inactive";
};

// Define las columnas de la tabla
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name", // Accede al campo "name"
    header: "Nombre", // Cabecera de la columna
  },

  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => {
      // Formatea el precio como moneda
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB",
      }).format(price);

      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "business",
    header: "Negocio",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      // Personaliza la visualización del estado
      const status = row.getValue("status");
      return (
        <span
          className={
            status === "active" ? "text-green-500" : "text-red-500"
          }
        >
          {status === "active" ? "Activo" : "Inactivo"}
        </span>
      );
    },
  },
];