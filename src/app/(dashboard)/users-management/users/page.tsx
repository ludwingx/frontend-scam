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
import { fetchUserData } from "@/services/userService";
import { UsersActions } from "./UsersActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { User } from "@/types/user";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]); // Estado para almacenar todos los usuarios
  const [filteredData, setFilteredData] = useState<User[]>([]); // Estado para almacenar los usuarios filtrados
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar errores
  const [showActiveUsers, setShowActiveUsers] = useState(true); // Estado para controlar qué usuarios se muestran

  // Función para cargar los usuarios
  const loadUsers = async () => {
    try {
      const users = await fetchUserData();
      if (users) {
        // Ordenar los usuarios por id de mayor a menor
        const sortedUsers = users.sort((a, b) => b.id - a.id);
        setData(sortedUsers);
        // Filtrar los usuarios según el estado actual (activos o inactivos)
        filterUsers(sortedUsers, showActiveUsers);
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

  // Función para filtrar los usuarios según el estado (activos o inactivos)
  const filterUsers = (users: User[], showActive: boolean) => {
    const filtered = users.filter((user) =>
      showActive ? user.status === 1 : user.status === 0
    );
    setFilteredData(filtered);
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Actualizar los usuarios filtrados cuando cambie el estado `showActiveUsers`
  useEffect(() => {
    filterUsers(data, showActiveUsers);
  }, [showActiveUsers, data]);

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
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <UsersActions
          onRefresh={loadUsers}
          showActiveUsers={showActiveUsers}
          setShowActiveUsers={setShowActiveUsers}
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
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