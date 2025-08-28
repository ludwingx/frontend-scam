"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import { columns } from "./columns";
import { PurchasesActions } from "./PurchasesActions";
import { dataFicticia } from "./data";

export default function Page() {
  const data = dataFicticia.compras;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-background">
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">
                Gestión de Compras
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Gestión de Compras</h2>
        <small className="text-sm font-medium text-muted-foreground">
          Aquí podrás visualizar, registrar, editar y eliminar las compras de ingredientes y materiales.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <PurchasesActions />
      </div>

      <div className="flex flex-col gap-4 mb-6 md:mb-0 overflow-x-auto">
        <DataTable
          columns={columns}
          data={data}
          enableFilter
          filterPlaceholder="Filtrar por fecha de compra..."
          filterColumn="fecha_compra"
          enablePagination
          enableRowSelection
          enableColumnVisibility
        />
      </div>
    </div>
  );
}