import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns } from "./columns";
import { DataTable } from "../../../../components/data-table";

import { fetchIngredientsData } from "@/services/fetchIngredientsData"; // Importar la función

export default async function Page() {
  const data = await fetchIngredientsData();
  const sortedData = data?.sort((a, b) => b.id - a.id);
  const tableData = sortedData ?? undefined;
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
              <BreadcrumbLink
                href="/dashboard/inventories"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Inventario
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Materias Primas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">
          Materias primas{" "}
        </h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las materias primas.
        </small>
      </div>
      {/* Content Container */}
      <div className="flex flex-col items-center w-max-md mx-auto">
        <div className="w-full md:scale-105">
          {/* Escalar la tabla en escritorio */}
          <DataTable
            columns={columns}
            data={tableData}
            enableFilter // Habilitar el filtro
            filterPlaceholder="Filtrar por nombre..." // Personalizar el placeholder
            filterColumn="name" // Especificar la columna a filtrar
            enablePagination // Habilitar la paginación
            enableRowSelection // Habilitar la selección de filas
            enableColumnVisibility // Habilitar la visibilidad de columnas
          />
        </div>
      </div>
    </div>
  );
}
