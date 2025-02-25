import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import { columns, Purchases } from "./columns";
import { PurchasesActions } from "./PurchasesActions";

// Función para obtener datos de ejemplo (simula una llamada API)
async function getData(): Promise<Purchases[]> {
  // Aquí puedes reemplazar esto con una llamada real a tu API
  return [
    {
      id: 1,
      fecha_compra: "2023-10-01",
      sucursal: "Radial 19",
      detalle_compra: [
        {
          id: 101,
          nombre_ingrediente: "Producto X",
          cantidad: 5,
          precio_unitario: 20.0,
        },
        {
          id: 102,
          nombre_ingrediente: "Producto Y",
          cantidad: 3,
          precio_unitario: 30.0,
        },
        {
          id: 103,
          nombre_ingrediente: "Producto Z",
          cantidad: 2,
          precio_unitario: 15.0,
        },
        {
          id: 104,
          nombre_ingrediente: "Producto A",
          cantidad: 4,
          precio_unitario: 25.0,
        },
        {
          id: 105,
          nombre_ingrediente: "Producto B",
          cantidad: 1,
          precio_unitario: 12.0,
        },
        {
          id: 106,
          nombre_ingrediente: "Producto C",
          cantidad: 6,
          precio_unitario: 18.0,
        },
        {
          id: 107,
          nombre_ingrediente: "Producto D",
          cantidad: 2,
          precio_unitario: 10.0,
        },
        {
          id: 108,
          nombre_ingrediente: "Producto E",
          cantidad: 1,
          precio_unitario: 8.0,
        },
        {
          id: 109,
          nombre_ingrediente: "Producto F",
          cantidad: 3,
          precio_unitario: 15.0,
        },
        {
          id: 110,
          nombre_ingrediente: "Producto G",
          cantidad: 2,
          precio_unitario: 12.0,
        },
        {
          id: 111,
          nombre_ingrediente: "Producto H",
          cantidad: 1,
          precio_unitario: 20.0,
        },
        {
          id: 112,
          nombre_ingrediente: "Producto I",
          cantidad: 4,
          precio_unitario: 25.0,
        },
        {
          id: 113,
          nombre_ingrediente: "Producto J",
          cantidad: 2,
          precio_unitario: 15.0,
        },
        {
          id: 114,
          nombre_ingrediente: "Producto K",
          cantidad: 1,
          precio_unitario: 10.0,
        }
      ],
      total_compra: 1500.00
    },
    {
      id: 2,
      fecha_compra: "2023-10-02",
      sucursal: "Radial 26",
      detalle_compra: [
        {
          id: 103,
          nombre_ingrediente: "Producto Z",
          cantidad: 10,
          precio_unitario: 15.0,
        },
        {
          id: 104,
          nombre_ingrediente: "Producto A",
          cantidad: 5,
          precio_unitario: 25.0,
        },
        {
          id: 105,
          nombre_ingrediente: "Producto B",
          cantidad: 3,
          precio_unitario: 12.0,
        }
      ],
      total_compra: 150.0,
    },
    {
      id: 3,
      fecha_compra: "2023-10-03",
      sucursal: "Villa 1ro de mayo",
      detalle_compra: [
        {
          id: 104,
          nombre_ingrediente: "Producto A",
          cantidad: 8,
          precio_unitario: 25.0,
        },
        {
          id: 105,
          nombre_ingrediente: "Producto B",
          cantidad: 2,
          precio_unitario: 12.0,
        },
      ],
      total_compra: 180.0,
    }
  ];
}

// Página principal de Compras
export default async function Page() {
  const data = await getData();

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
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

        {/* Título y descripción */}
        <h2 className="text-3xl font-semibold text-gray-900">Compras</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las compras.
        </small>
      </div>

      {/* Botón de acción (ej: Crear nueva compra) */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <PurchasesActions />
      </div>

      {/* Tabla de compras */}
      <div className="flex flex-col gap-4 mb-6 md:mb-0 md:overflow-x-auto">
    
        <DataTable columns={columns} data={data} />

      </div>
    </div>
  );
}