import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

  
  // Definimos el tipo de datos de los productos

  export default async function Page() {
  
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
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Gestion de Items
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-gray-900">
                  Recetas
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-3xl font-semibold text-gray-900">Recetas</h2>
          <small className="text-sm font-medium text-gray-600">
            Aquí podrás gestionar los recetas.
          </small>
        </div>

      
      </div>
    );
  }