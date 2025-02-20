import { DataTable } from "@/components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UsersActions } from "./UsersActions";
import { columns, Users } from "./columns";

async function getData(): Promise<Users[]> {
  // Fetch data from your API here.
  return [
    {
      full_name: "Ludwing",
      ci: "12345678",
      rol_name: "Administrador",
    }
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
      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <UsersActions />
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        <DataTable  columns={columns} data={data} />
      </div>
    </div>
  );
}
