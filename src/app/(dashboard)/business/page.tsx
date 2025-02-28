"use client"; // Convertir en Client Component

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import { BusinessActions } from "./BusinessActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Business } from "@/types/business";
import { toast } from "sonner";
import { fetchBusinessData, updateBusiness, deleteBusiness } from "@/services/fetchBusinessData";

export default function BusinessPage() {
  const [data, setData] = useState<Business[]>([]); // Estado para almacenar los negocios
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar errores
  
  // Función para cargar los negocios
  const loadBusinesses = async () => {
    try {
      const businesses = await fetchBusinessData();
      if (businesses) {
        setData(businesses);
      } else {
        setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  // Cargar los negocios al montar el componente
  useEffect(() => {
    loadBusinesses();
  }, []);

  // Función para actualizar un negocio en la tabla (optimistic update)
  const updateBusinessInTable = async (updatedBusiness: Business) => {
    const previousData = [...data]; // Guardar el estado anterior
    setData((prevData) =>
      prevData.map((business) =>
        business.id === updatedBusiness.id ? updatedBusiness : business
      )
    );

    try {
      const response = await updateBusiness(updatedBusiness); // Actualizar el negocio en el servidor
      if (!response) {
        throw new Error("No se pudo actualizar el negocio.");
      }
      toast.success(`Negocio "${updatedBusiness.name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData); // Revertir cambios en caso de error
    }
  };

  // Función para eliminar un negocio de la tabla (optimistic update)
  const deleteBusinessFromTable = async (businessId: number) => {
    const previousData = [...data]; // Guardar el estado anterior
    setData((prevData) => prevData.filter((business) => business.id !== businessId));

    try {
      const isDeleted = await deleteBusiness(businessId); // Eliminar el negocio en el servidor
      if (!isDeleted) {
        throw new Error("No se pudo eliminar el negocio.");
      }
      toast.success(`Negocio eliminado exitosamente.`);
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData); // Revertir cambios en caso de error
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
                Negocios
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Negocios</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los negocios.
        </small>
      </div>

      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <BusinessActions onRefresh={loadBusinesses} /> {/* Pasar loadBusinesses como prop */}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateBusinessInTable, deleteBusinessFromTable)} 
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