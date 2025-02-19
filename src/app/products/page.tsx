import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
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
      price: 10.99,
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
    <div>
      {/* Título de la página */}
      <div className="Container flex flex-col gap-2 pl-10">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Productos
        </h2>
      </div>

      {/* Descripción y botón de crear producto */}
      <div className="flex items-center justify-between">
        <small className="text-sm font-medium leading-none pl-10 pt-4">
          Aquí podrás gestionar los productos.
        </small>
        <div className="pr-4 pt-4">
          <Dialog>
            <DialogTrigger className="bg-primary text-white flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/90 size-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-plus"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
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
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8">
        {data.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
            <CardHeader className="p-2">
              {/* Imagen del producto */}
              <div className="flex items-center justify-center">
                <Image
                  width={150}
                  height={100}
                  src={product.img}
                  alt={product.name}
                  className="rounded-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 flex flex-col gap-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="text-sm">
                {product.business}
              </CardDescription>
              <p className="text-md font-semibold">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm ${
                    product.status === "active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.status === "active" ? "Activo" : "Inactivo"}
                </p>
                <button className="text-primary hover:underline p-2">
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