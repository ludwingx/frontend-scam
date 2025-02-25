import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IngredientsActions } from "./IngredientsActions";
import { DataTable } from "../../../components/data-table";
import { columns, Ingredients } from "./columns";

async function getData(): Promise<Ingredients[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      name: "Queso Criollo",
      unit_measurement: "Kg",
    },
    {
      id: "2",
      name: "Almidón",
      unit_measurement: "Kg",
    },
    {
      id: "3",
      name: "Mantequilla",
      unit_measurement: "Kg",
    },
    {
      id: "4",
      name: "Huevo",
      unit_measurement: "Unidad",
    },
    {
      id: "5",
      name: "Yuca",
      unit_measurement: "Kg",
    },
    {
      id: "6",
      name: "Leche",
      unit_measurement: "Ltr",
    },
    {
      id: "7",
      name: "Harina",
      unit_measurement: "Kg",
    },
    {
      id: "8",
      name: "Azucar",
      unit_measurement: "Kg",
    },
    {
      id: "9",
      name: "Sal",
      unit_measurement: "Kg",
    },
    {
      id: "10",
      name: "Aceite",
      unit_measurement: "Ltr",
    },
    {
      id: "11",
      name: "Cafe",
      unit_measurement: "Kg",
    },
    {
      id: "12",
      name: "Azucares",
      unit_measurement: "Kg",
    },
    {
      id: "13",
      name: "Queso",
      unit_measurement: "Kg",
    },
    {
      id: "14",
      name: "Mantequilla",
      unit_measurement: "Kg",
    },
    {
      id: "15",
      name: "Harina",
      unit_measurement: "Kg",
    },
    {
      id: "16",
      name: "Azucar",
      unit_measurement: "Kg",
    },
    {
      id: "17",
      name: "Sal",
      unit_measurement: "Kg",
    },
    {
      id: "18",
      name: "Aceite",
      unit_measurement: "Ltr",
    },
    {
      id: "19",
      name: "Cafe",
      unit_measurement: "Kg",
    },
    {
      id: "20",
      name: "Azucares",
      unit_measurement: "Kg",
    },
    {
      id: "21",
      name: "Queso",
      unit_measurement: "Kg",
    },
    {
      id: "22",
      name: "Mantequilla",
      unit_measurement: "Kg",
    },
    {
      id: "23",
      name: "Harina",
      unit_measurement: "Kg",
    },
    {
      id: "24",
      name: "Azucar",
      unit_measurement: "Kg",
    },
    {
      id: "25",
      name: "Sal",
      unit_measurement: "Kg",
    },
    {
      id: "26",
      name: "Aceite",
      unit_measurement: "Ltr",
    },
    {
      id: "27",
      name: "Cafe",
      unit_measurement: "Kg",
    },
    {
      id: "28",
      name: "Azucares",
      unit_measurement: "Kg",
    },
    {
      id: "29",
      name: "Queso",
      unit_measurement: "Kg",
    },
    {
      id: "30",
      name: "Mantequilla",
      unit_measurement: "Kg",
    },
    {
      id: "31",
      name: "Harina",
      unit_measurement: "Kg",
    }
    // ...
  ];
}

export default async function Page() {
  const data = await getData();

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
              Ingredientes
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">Ingredientes</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los ingredientes.
        </small>
      </div>

      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <IngredientsActions />
      </div>

      {/* Tabla con todas las funcionalidades */}
      <div className="flex flex-col gap-6 pr-4 pl-4 bg-white rounded-lg shadow">
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
