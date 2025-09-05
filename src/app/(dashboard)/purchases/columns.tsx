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

export type PurchaseStatus = 'Pendiente' | 'Pagado' | 'Cancelado';

export interface PurchaseItem {
  id_insumo: number;
  nombre_insumo: string;
  cantidad: number;
  precio_unitario: number;
  unidad_medida: string;
  subtotal: number;
}

export interface Purchase {
  id_compra: number;
  fecha_compra: string;
  proveedor: string | null;
  estado: PurchaseStatus;
  fecha_pagado: string | null;
  metodo_pago: string | null;
  observaciones: string | null;
  monto_total: number;
  items: PurchaseItem[];
}

export const columns: ColumnDef<Purchase>[] = [
  {
    id: "rowNumber",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    size: 60,
  },
  {
    accessorKey: "id_compra",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => {
      const id = row.original.id_compra;
      return (
        <div className="text-center">{`C${String(id).padStart(5, "0")}`}</div>
      );
    },
    size: 90,
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
    id: "items",
    header: () => <div className="text-center">ITEMS</div>,
    cell: ({ row, table }) => {
      const purchase = row.original;
      const itemCount = purchase.items.length;
      const firstItem = purchase.items[0];
      
      return (
        <div className="flex flex-col items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // @ts-ignore - We'll add the onViewItems handler to the table options
              if (table.options.meta?.onViewItems) {
                // @ts-ignore
                table.options.meta.onViewItems(purchase);
              }
            }}
          >
            Ver {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Button>
          {itemCount > 0 && (
            <div className="mt-1 text-xs text-muted-foreground text-center">
              {firstItem.nombre_insumo} y {itemCount - 1} más
            </div>
          )}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "monto_total",
    header: () => <div className="text-center">TOTAL</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        Bs. {row.original.monto_total.toFixed(2)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "estado",
    header: () => <div className="text-center">ESTADO</div>,
    cell: ({ row }) => {
      const status = row.original.estado;
      const variant = status === 'Cancelado' ? 'destructive' :
                     status === 'Pagado' ? 'default' : 'secondary';
      return (
        <div className="flex justify-center">
          <Badge 
            variant={variant} 
            className={`whitespace-nowrap ${status === 'Pendiente' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
          >
            {status}
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
              {purchase.estado !== 'Cancelado' && (
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