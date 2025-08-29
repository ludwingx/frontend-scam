"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type PurchaseStatus = 'Pagado' | 'Registrado' | 'Anulado';

export type Purchase = {
  id_compra: number;
  id_insumo: number;
  fecha_compra: string;
  proveedor: string | null;
  estado: PurchaseStatus;
  fecha_pagado: string | null;
  metodo_pago: string | null;
  observaciones: string | null;
  cantidad: string;
  precio_unitario: string;
  monto_total: string;
  nombre_insumo?: string;
  unidad_medida?: string;
};

export const columns: ColumnDef<Purchase>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 60,
  },
  {
    accessorKey: "fecha_compra",
    header: () => <div className="text-center">FECHA</div>,
    cell: ({ row }) => {
      const date = new Date(row.original.fecha_compra);
      return (
        <div className="text-center">
          {format(date, 'dd/MM/yyyy', { locale: es })}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "proveedor",
    header: () => <div className="text-left">PROVEEDOR</div>,
    cell: ({ row }) => (
      <div className="font-medium text-left">
        {row.original.proveedor || 'No especificado'}
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "nombre_insumo",
    header: () => <div className="text-left">INSUMO</div>,
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{purchase.nombre_insumo || `Insumo ${purchase.id_insumo}`}</span>
            {purchase.unidad_medida && (
              <span className="text-muted-foreground">
                ({purchase.unidad_medida})
              </span>
            )}
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: "cantidad",
    header: () => <div className="text-center">CANTIDAD</div>,
    cell: ({ row }) => {
      const cantidad = parseFloat(row.original.cantidad);
      return (
        <div className="text-center">
          {!isNaN(cantidad) ? cantidad.toFixed(3) : row.original.cantidad}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "precio_unitario",
    header: () => <div className="text-center">PRECIO UNIT.</div>,
    cell: ({ row }) => {
      const precio = parseFloat(row.original.precio_unitario);
      return (
        <div className="text-center">
          {!isNaN(precio) ? `$${precio.toFixed(2)}` : row.original.precio_unitario}
        </div>
      );
    },
    size: 130,
  },
  {
    accessorKey: "monto_total",
    header: () => <div className="text-center">TOTAL</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.original.monto_total);
      return (
        <div className="text-center font-medium">
          {!isNaN(total) ? `$${total.toFixed(2)}` : row.original.monto_total}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "estado",
    header: () => <div className="text-center">ESTADO</div>,
    cell: ({ row }) => {
      const estado = row.original.estado;
      const variant = estado === 'Pagado' ? 'default' : estado === 'Anulado' ? 'destructive' : 'secondary';
      return (
        <div className="flex justify-center">
          <Badge variant={variant} className="whitespace-nowrap">
            {estado}
          </Badge>
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "metodo_pago",
    header: () => <div className="text-left">MÉTODO DE PAGO</div>,
    cell: ({ row }) => (
      <div className="capitalize text-left">
        {row.original.metodo_pago || 'No especificado'}
      </div>
    ),
    size: 180,
  },
  {
    id: "actions",
    header: () => <div className="text-center">ACCIONES</div>,
    cell: ({ row }) => {
      const purchase = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(purchase.id_compra.toString())}
                className="cursor-pointer"
              >
                Copiar ID de compra
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Editar compra
              </DropdownMenuItem>
              {purchase.estado !== 'Anulado' && (
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive-foreground">
                  Anular compra
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 100,
  },
];