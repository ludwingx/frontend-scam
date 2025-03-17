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
import { FinalsProducts } from "@/types/FinalsProducts";

async function getData(): Promise<FinalsProducts[]> {
  return [
    {
      id: 1,
      name: "Cuñape",
      stock: 350,
      cantidad: 1000,
      unidad: "gramo(s)",
      ingredients: [
        { id: 1, name: "Harina", cantidad: 20, unidad: "gramo(s)" },
        { id: 3, name: "Leche", cantidad: 200, unidad: "gramo(s)" },
        { id: 5, name: "Huevo", cantidad: 3, unidad: "unidad(es)" },
      ]
    },    
    {
      id: 2,
      name: "Torta de chocolate",
      cantidad: 750,
      stock: 5,
      unidad: "gramo(s)",
      ingredients: [
        { id: 3, name: "Harina", cantidad: 500, unidad: "gramo(s)" },
        { id: 5, name: "Chocolate", cantidad: 300, unidad: "gramo(s)" },
        { id: 8, name: "Huevo", cantidad: 3, unidad: "unidad(es)" },
      ] 
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
                Productos Finales
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Productos Finales</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los productos finales.
        </small>
      </div>
      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">

      </div>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-full lg:w-3/4 xl:w-2/3">
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
    </div>
  );
}
