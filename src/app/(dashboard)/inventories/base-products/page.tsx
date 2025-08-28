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
        { id: 1, name: "Harina", cantidad: 250, unidad: "gramo(s)" },
        { id: 3, name: "Leche", cantidad: 120, unidad: "gramo(s)" },
        { id: 5, name: "Huevo", cantidad: 3, unidad: "unidad(es)" },
      ],
    },
    {
      id: 2,
      name: "Base sabor vainilla",
      unit_measurement: "gramo(s)", 
      quantity: 300,
      stock: 3,
      ingredients: [
        { id: 1, name: "Harina", cantidad: 250, unidad: "gramo(s)" },
        { id: 3, name: "Leche", cantidad: 120, unidad: "gramo(s)" },
        { id: 5, name: "Huevo", cantidad: 3, unidad: "unidad(es)" },
        { id: 6, name: "Vainilla", cantidad: 10, unidad: "mililitro(s)" },
      ],
    },
  ];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="flex flex-col min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="hover:text-primary"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/inventories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Inventario
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="">
                Productos bases
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold">Productos Bases</h2>
        <small className="text-sm text-muted-foreground">
          Aquí podrás gestionar los productos bases.
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
