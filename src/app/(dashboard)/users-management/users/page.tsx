import { DataTable } from "@/components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { columns, User } from "./columns";
import { fetchUserData } from "@/services/fetchUserData";
import { UsersActions } from "@/actions/userActions";

export default async function Page() {
  let data: User[] = [];
  let errorMessage: string | null = null;

  try {
    // Fetch business data using the server action
    const users = await fetchUserData();

    if (users) {
      data = users;
    } else {
      errorMessage = "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    errorMessage = "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.";
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb y título */}
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
                Usuarios
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Usuarios</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los usuarios.
        </small>
      </div>

      {/* Botón de crear usuario */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        
        <UsersActions   />
      </div>

      {/* Tabla de usuarios */}
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            enableFilter
            filterPlaceholder="Filtrar por nombre..."
            filterColumn="full_name"
            enablePagination
            enableRowSelection
            enableColumnVisibility
          />
        )}
      </div>
    </div>
  );
}