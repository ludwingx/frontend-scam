import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns, Storage } from "./base-products/columns";
import { DataTable } from "../../../components/data-table";

async function getData(): Promise<Storage[]> {
  return [
    {
      id: 1,
      name: "adaaw",
      unit_measurement: "gramos",
    },
  ];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Header */}
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
                Inventario
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Inventario</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los inventarios.
        </small>
      </div>
      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        storage
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-4 mb-6 md:mb-0 md:overflow-x-auto">
        <DataTable
          columns={columns}
          data={data}
          enableFilter // Habilitar el filtro
          filterPlaceholder="Filtrar por nombre..." // Personalizar el placeholder
          filterColumn="name" // Especificar la columna a filtrar
          enablePagination // Habilitar la paginación
          enableRowSelection // Habilitar la selección de filas
          enableColumnVisibility // Habilitar la visibilidad de columnas
        />
      </div>
    </div>
  );
}
