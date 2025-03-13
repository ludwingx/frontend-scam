"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductionActions } from "./ProductionActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Production } from "@/types/production";
import { toast } from "sonner";
import { fetchProductionData, updateProduction, deleteProduction } from "@/services/fetchProductionData";
import { DataTable } from "@/components/data-table";

export default function ProductionPage() {
  const [data, setData] = useState<Production[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProductiones = async () => {
    console.log("Cargando negocios..."); // Log para verificar la carga de datos
    try {
      const productiones = await fetchProductionData();
      if (productiones) {
        setData(productiones);
      } else {
        setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  useEffect(() => {
    loadProductiones();
  }, []);

  const updateProductionInTable = async (updatedProduction: Production) => {
    console.log("Actualizando negocio en la tabla:", updatedProduction.id, updatedProduction.name); // Log para verificar la actualización
    const previousData = [...data];
    setData((prevData) =>
      prevData.map((production) =>
        production.id === updatedProduction.id ? updatedProduction : production
      )
    );

    try {
      const response = await updateProduction(updatedProduction);
      if (!response) {
        throw new Error("No se pudo actualizar el negocio.");
      }
      toast.success(`Producción "${updatedProduction.name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating production:", error);
      toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData);
    }
  };

  const deleteProductionFromTable = async (productionId: number) => {
    console.log("Eliminando negocio de la tabla:", productionId); // Log para verificar la eliminación
    const previousData = [...data];
    setData((prevData) => prevData.filter((production) => production.id !== productionId));

    try {
      const isDeleted = await deleteProduction(productionId);
      if (!isDeleted) {
        throw new Error("No se pudo eliminar el negocio.");
      }
    } catch (error) {
      console.error("Error deleting production:", error);
      toast.error("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData);
    }
  };

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
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Organización
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Producción
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Producción</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las producciones.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <ProductionActions onRefresh={loadProductiones}   /> {/* Pasar loadProductiones como prop */}
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateProductionInTable, deleteProductionFromTable)}
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