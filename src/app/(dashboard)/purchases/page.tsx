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
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Compras
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Compras</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las compras de ingredientes y materiales.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <PurchasesActions />
      </div>

      <div className="flex flex-col gap-4 mb-6 md:mb-0 md:overflow-x-auto">
        <DataTable
          columns={columns}
          data={data}
          enableFilter
          filterPlaceholder="Filtrar por fecha..."
          filterColumn="fecha_compra" // Cambiado de "sucursal" a "fecha_compra"
          enablePagination
          enableRowSelection
          enableColumnVisibility
        />
      </div>
    </div>
  );
}