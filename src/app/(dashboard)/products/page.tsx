import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus, Pencil } from "lucide-react";
import Image from 'next/image'
// Definimos el tipo de datos de los productos
type Product = {
  id: string;
  name: string;
  price: number;
  business: string;
  status: string;
  img: string;
};

// Función para obtener los datos (simulada)
async function getData(): Promise<Product[]> {
  return [
    {
      id: "1",
      name: "Cuñape",
      price: 5.00,
      business: "Mil Sabores",
      status: "active",
      img: "/cuñape.png",
    },
    {
      id: "2",
      name: "Torta de Chocolate",
      price: 15.99,
      business: "Tortas Express",
      status: "inactive",
      img: "/torta.png",
    },
    {
      id: "3",
      name: "Empanada de Queso",
      price: 8.99,
      business: "Sabores Criollos",
      status: "active",
      img: "/empanada.png",
    },
    {
      id: "4",
      name: "Torta de Frutas",
      price: 12.99,
      business: "Tortas Express",
      status: "active",
      img: "/torta.png",
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
              <BreadcrumbLink href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Negocios
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">
          Productos
        </h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los productos.
        </small>
      </div>

      {/* Descripción y botón de crear producto */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">

        <Dialog>
          <DialogTrigger className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <CirclePlus/>
            <span>Crear Producto</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Producto</DialogTitle>
              <DialogDescription>
                Completa el formulario para agregar un nuevo producto.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
            <CardHeader className="p-4">
              {/* Imagen del producto */}
              <div className="flex items-center justify-center">
                <Image
                  width={150}
                  height={100}
                  src={product.img}
                  alt={product.name}
                  className="rounded-lg object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {product.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {product.business}
              </CardDescription>
              <p className="text-md font-semibold text-gray-900">
                Bs. {product.price.toFixed(2)}
              </p>
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-medium ${
                    product.status === "active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.status === "active" ? "Activo" : "Inactivo"}
                </p>
                <button className="text-blue-600 hover:text-blue-600/80 transition-colors p-1">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}