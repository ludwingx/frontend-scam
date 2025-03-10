import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Shield } from "lucide-react"; // Importa los iconos
import { Label } from "@/components/ui/label";

export default async function Page() {
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb y título */}
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
                Gestion de Usuarios
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">
          Gestion de Usuarios
        </h2>
      </div>

      {/* Botón de crear usuario */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6"></div>

      {/* Botones al centro */}
      <div className="flex flex-col md:flex-row justify-center items-center">
        {/* Botones cuadrados grandes */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Botón para redirigir a /user-management/users */}
          <Link href="/user-management/users" passHref>
            <Button
              variant={"outline"}
              className="transition-colors flex flex-col items-center justify-center w-32 h-32 p-4 gap-2"
            >
              <User className="!w-10 !h-10" /> {/* Icono de usuario */}
              <Label className="text-center font-bold text-xl">Usuarios</Label>
            </Button>
          </Link>

          {/* Botón para redirigir a /user-management/roles */}
          <Link href="/user-management/roles" passHref>
            <Button
              variant={"outline"}
              className="transition-colors flex flex-col items-center justify-center w-32 h-32 p-4 gap-2"
            >
              <Shield className="!w-10 !h-10" /> {/* Icono de roles */}
              <Label className="text-center font-bold text-xl">Roles</Label>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}