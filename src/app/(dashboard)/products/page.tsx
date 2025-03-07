import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReusableDialog } from "@/components/ReusableDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReusableSelect } from "@/components/ReusableSelect";
import { ProductsActions } from "./ProductsActions";
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
      price: 5.0,
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
        {data.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
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
            <CardContent className="p-4 flex flex-col gap-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {product.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {product.business}
              </CardDescription>
              <p className="text-md font-semibold text-gray-900">
                Bs. {product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <ReusableDialog
                title="Eliminar Negocio"
                description={
                  <>
                    ¿Estás seguro de eliminar el producto <strong>{product.name}</strong>?
                  </>
                }
                trigger={<Trash2 cursor={"pointer"} className="w-4 h-4 text-red-600 hover:text-red-600/80" />}
                // eslint-disable-next-line react/no-children-prop
                submitButtonText="Eliminar" children={undefined}
                onSubmit={() => console.log("Producto eliminado")}
              ></ReusableDialog>
              <ReusableDialog
                title="Editar Producto"
                description="Aquí podrás editar un producto."
                trigger={
                  <Pencil
                    cursor={"pointer"}
                    type="button"
                    className="w-4 h-4 text-gray-600 hover:text-gray-900"
                  />
                }
                submitButtonText="Guardar Cambios"
                onSubmit={() => console.log("Formulario enviado")}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      defaultValue={product.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Negocio
                    </Label>
                    <ReusableSelect
                      name={"negocio"}
                      placeholder="Selecciona un negocio"
                      label="Negocios:"
                      options={[
                        { value: "Mil Sabores", label: "Mil Sabores" },
                        { value: "Tortas Express", label: "Tortas Express" }

                       ]}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Precio
                    </Label>
                    <Input
                      id="price"
                      defaultValue={product.price}
                      className="col-span-3"
                    />
                  </div>
                </div>
              </ReusableDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
