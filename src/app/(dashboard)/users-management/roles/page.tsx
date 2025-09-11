"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../../components/data-table";
import { fetchRoleData, updateRole, toggleRoleStatus } from "@/services/fetchRoleData";
import { RolesActions } from "./RolesActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Role } from "@/types/role";
import { toast } from "sonner";

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showActiveRoles, setShowActiveRoles] = useState(true); // Estado para controlar qué roles se muestran

  // Función para cargar los roles
  const loadRoles = async () => {
    try {
      const roles = await fetchRoleData();
      if (roles) {
        setData(roles);
      } else {
        setErrorMessage("No se pudieron cargar los datos.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("No se pudieron cargar los datos.");
    }
  };

  // Cargar los roles al montar el componente
  useEffect(() => {
    loadRoles();
  }, []);

  // Función para actualizar un rol en la tabla
  const updateRoleInTable = async (updatedRole: Role) => {
    const previousData = [...data];

    setData((prevData) =>
      prevData.map((role) => (role.id_rol === updatedRole.id_rol ? updatedRole : role))
    );

    try {
      const response = await updateRole(updatedRole);

      if (!response) {
        throw new Error("No se pudo actualizar el rol.");
      }

      toast.success(`Rol "${updatedRole.nombre_rol}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar el rol. Por favor, inténtalo de nuevo.");
      setData(previousData);
    }
  };

  // Función para cambiar el estado de un rol
  const toggleRoleStatusInTable = async (roleId: number, newStatus: number) => {
    const previousData = [...data];
  
    // Buscar el rol en la lista de datos
    const roleToUpdate = data.find((role) => role.id_rol === roleId);
    if (!roleToUpdate) {
      toast.error("Rol no encontrado.");
      return;
    }
  
    // Actualizar la UI de inmediato (optimistic update)
    setData((prevData) =>
      prevData.map((role) =>
        role.id_rol === roleId ? { ...role, status: newStatus } : role
      )
    );
  
    try {
      // Hacer la petición al servidor para cambiar el estado del rol
      const response = await toggleRoleStatus(roleId, newStatus, roleToUpdate.nombre_rol);
  
      if (!response) {
        throw new Error("No se pudo cambiar el estado del rol.");
      }
  
      toast.success(
        `Rol "${roleToUpdate.nombre_rol}" ha sido ${
          newStatus === 1 ? "activado" : "desactivado"
        } exitosamente.`
      );
    } catch (error) {
      console.error("Error toggling role status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cambiar el estado del rol. Por favor, inténtalo de nuevo."
      );
      setData(previousData); // Revertir los cambios en la UI
    }
  };
  return (
    <div className="flex flex-col min-h-screen p-6 ">
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
        <RolesActions
          onRefresh={loadRoles}
          onToggleActiveRoles={(showActive) => setShowActiveRoles(showActive)} // Pasar la función para alternar entre roles activos e inactivos
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRoleInTable, toggleRoleStatusInTable)}
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