import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Mi Perfil
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda: Avatar */}
        <div className="flex flex-col items-center lg:items-start lg:w-1/3">
          <Avatar className="size-40 border-4 border-white shadow-lg mb-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carlos Navarro</h1>
          <p className="text-sm text-gray-600">Administrador</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-600/90 transition-colors duration-200">
            Cambiar Foto
          </button>
        </div>

        {/* Columna derecha: Información del usuario */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <p className="mt-1 text-sm text-gray-900">Carlos Navarro</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <p className="mt-1 text-sm text-gray-900">carlos.navarro@example.com</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="mt-1 text-sm text-gray-900">+1 234 567 890</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <p className="mt-1 text-sm text-gray-900">Ciudad de México, México</p>
            </div>
          </div>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-600/90 transition-colors duration-200">
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}