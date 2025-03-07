import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductsActions } from "./ProductsActions";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/products";

// Definimos el tipo de datos de los productos


// Función para obtener los datos (simulada)
async function getData(): Promise<Product[]> {
  return [
    {
      id: 1,
      name: "Cuñape",
      price: 5.0,
      business: "Mil Sabores",
      status: "active",
      img: "/cuñape.png",
      ingredients: [
        { id: 1, name: "Harina", quantity: 500, unit_measurement: "gramo(s)" },
        { id: 3, name: "Leche", quantity: 200, unit_measurement: "gramo(s)" },
        { id: 5, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
      ]
    },
    {
      id: 2,
      name: "Torta de Chocolate",
      price: 15.99,
      business: "Tortas Express",
      status: "inactive",
      img: "/tortaChocolate.png",
      ingredients: [
        { id: 3, name: "Harina", quantity: 500, unit_measurement: "gramo(s)" },
        { id: 5, name: "Chocolate", quantity: 300, unit_measurement: "gramo(s)" },
        { id: 8, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
      ],
    },
    {
      id: 23,
      name: "Empanada de Queso",
      price: 8.99,
      business: "Mil Sabores",
      status: "active",
      img: "/empanadaQueso.png",
      ingredients: [
        { id: 8, name: "Harina", quantity: 500, unit_measurement: "gramo(s)" },
        { id: 4, name: "Queso", quantity: 200, unit_measurement: "gramo(s)" },
        { id: 3, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
        { id: 6, name: "Azúcar", quantity: 100, unit_measurement: "gramo(s)" },
        { id: 8, name: "Vainilla", quantity: 50, unit_measurement: "gramo(s)" },
      ],
    },
    {
      id: 4,
      name: "Torta de Vainilla",
      price: 12.99,
      business: "Tortas Express",
      status: "active",
      img: "/tortaVainilla.png",
      ingredients: [
        { id:3, name: "Harina", quantity: 500, unit_measurement: "gramo(s)" },
        { id: 9, name: "Frutas", quantity: 300, unit_measurement: "gramo(s)" },
        { id: 8, name: "Huevo", quantity: 3, unit_measurement: "unidad(es)" },
        { id: 4, name: "Azúcar", quantity: 100, unit_measurement: "gramo(s)" },
        { id: 6, name: "Vainilla", quantity: 50, unit_measurement: "gramo(s)" },
      ],
    },
  ];
}

export default async function Page() {
  const data = await getData(); // Obtenemos los datos

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Título de la página */}
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
                Productos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">Productos</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los productos.
        </small>
      </div>

      {/* Descripción y botón de crear producto */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <ProductsActions />
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((product ) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}