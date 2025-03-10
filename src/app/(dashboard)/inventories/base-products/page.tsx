import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns} from "./columns";
import { DataTable } from "../../../../components/data-table";
import { ProductsBase } from "@/types/productsBases";

async function getData(): Promise<ProductsBase[]> {
  return [
    {
      id: 1,
      name: "Base sabor chocolate",
      unit_measurement: "gramo(s)", 
      quantity: 300,
      stock: 3,
      ingredients: [
        { id: 1, name: "Harina", quantity: 250, unit_measurement: "gramo(s)" },
        { id: 3, name: "Leche", quantity: 120, unit_measurement: "gramo(s)" },
        { id: 5, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
      ],
    },
    {
      id: 2,
      name: "Base sabor vainilla",
      unit_measurement: "gramo(s)", 
      quantity: 300,
      stock: 3,
      ingredients: [
        { id: 1, name: "Harina", quantity: 250, unit_measurement: "gramo(s)" },
        { id: 3, name: "Leche", quantity: 120, unit_measurement: "gramo(s)" },
        { id: 5, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
        { id: 6, name: "Vainilla", quantity: 10, unit_measurement: "mililitro(s)" },
      ],
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
              <BreadcrumbLink href="/dashboard/inventories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Inventario
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Productos bases
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Productos Bases</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los productos bases.
        </small>
      </div>
      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">

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
