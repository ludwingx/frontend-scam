"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import {
  fetchRoleData,
  updateRole,
  deleteRole,
} from "@/services/fetchRoleData"; // Importar updateRole y deleteRole
import { RolesActions } from "./RolesActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { toast } from "sonner";

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]); // Estado para almacenar los roles
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar errores

  // Función para cargar los roles
  const loadRoles = async () => {
    try {
      const roles = await fetchRoleData();
      if (roles) {
        setData(roles);
      } else {
        setErrorMessage(
          "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(
        "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  // Cargar los roles al montar el componente
  useEffect(() => {
    loadRoles();
  }, []);

  // Función para actualizar un rol en la tabla (optimistic update)
  const updateRoleInTable = async (updatedRole: Role) => {
    // Guardar el estado anterior para poder revertir en caso de error
    const previousData = [...data];

    // Actualizar la UI de inmediato (optimistic update)
    setData((prevData) =>
      prevData.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );

    try {
      // Hacer la petición al servidor para actualizar el rol
      const response = await updateRole(updatedRole); // Usar updateRole importada

      if (!response) {
        throw new Error("No se pudo actualizar el rol.");
      }

      toast.success(`Rol "${updatedRole.name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar el rol. Por favor, inténtalo de nuevo.");

      // Revertir los cambios en la UI si la petición falla
      setData(previousData);
    }
  };
  // Función para eliminar un rol de la tabla (optimistic update)
  const deleteRoleFromTable = async (roleId: number) => {
    // Buscar el rol que se va a eliminar para obtener su nombre
    const roleToDelete = data.find((role) => role.id === roleId);

    // Guardar el estado anterior para poder revertir en caso de error
    const previousData = [...data];

    // Actualizar la UI de inmediato (optimistic update)
    setData((prevData) => prevData.filter((role) => role.id !== roleId));

    try {
      // Hacer la petición al servidor para eliminar el rol
      const isDeleted = await deleteRole(roleId); // Usar deleteRole importada

      if (!isDeleted) {
        throw new Error("No se pudo eliminar el rol.");
      }

      // Mostrar el toast con el nombre del rol eliminado
      if (roleToDelete) {
        toast.success(`Rol "${roleToDelete.name}" eliminado exitosamente.`);
      } else {
        toast.success("Rol eliminado exitosamente.");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error al eliminar el rol. Por favor, inténtalo de nuevo.");

      // Revertir los cambios en la UI si la petición falla
      setData(previousData);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Header */}
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
                Roles
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Roles</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los roles de los usuarios.
        </small>
      </div>

      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <RolesActions onRefresh={loadRoles} /> {/* Pasar loadRoles como prop */}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRoleInTable, deleteRoleFromTable)}
            data={data}
            enableFilter
            filterPlaceholder="Filtrar por nombre..."
            filterColumn="name"
            enablePagination
            enableRowSelection
            enableColumnVisibility
          />
        )}
      </div>
    </div>
  );
}
