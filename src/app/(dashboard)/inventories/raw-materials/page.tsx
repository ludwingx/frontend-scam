import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns,  } from "./columns";
import { DataTable } from "../../../../components/data-table";
import { RawMaterials } from "@/types/rawMaterials";


async function getData(): Promise<RawMaterials[]> {
  return [
    {
      id: 1,
      name: "Harina",
      unit_measurement: "kilo(s)", 
      quantity: 1,
      stock: 3
      
    },
    {
      id: 2,
      name: "Azúcar",
      unit_measurement: "kilo(s)",
      quantity: 1,
      stock: 3

    },
    {
      id: 3,
      name: "Huevo",
      unit_measurement: "unidad(es)",
      quantity: 30,
      stock: 4
    },
    {
      id: 4,
      name: "Leche",
      unit_measurement: "litro(s)",
      quantity: 1,
      stock: 7
    },
    {
      id: 5,
      name: "Cafe",
      unit_measurement: "gramo(s)",
      quantity: 250,
      stock: 8
    }
  ]
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
              <BreadcrumbLink href="/dashboard/inventories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
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

        <h2 className="text-3xl font-semibold text-gray-900">Materias primas </h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las materias primas.
        </small>
      </div>
      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
      </div>

      {/* Content Container */}
  <div className="flex flex-col gap-4 mb-6 md:mb-0 md:overflow-x-auto">
    
        <DataTable  columns={columns}
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
