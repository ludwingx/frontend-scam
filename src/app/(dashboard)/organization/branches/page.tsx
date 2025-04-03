"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BrancheActions } from "./BrancheActions";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Branche } from "@/types/branche";
import { deleteBranche, fetchBrancheData, updateBranche } from "@/services/fetchBrancheData";

export default function BranchePage() {
  const [data, setData] = useState<Branche[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBranchees = async () => {
    console.log("Cargando negocios..."); // Log para verificar la carga de datos
    try {
      const branchees = await fetchBrancheData();
      if (branchees) {
        setData(branchees);
      } else {
        setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  useEffect(() => {
    loadBranchees();
  }, []);

  const updateBrancheInTable = async (updatedBranche: Branche) => {
    console.log("Actualizando negocio en la tabla:", updatedBranche.id, updatedBranche.name); // Log para verificar la actualización
    const previousData = [...data];
    setData((prevData) =>
      prevData.map((branche) =>
        branche.id === updatedBranche.id ? updatedBranche : branche
      )
    );

    try {
      const response = await updateBranche(updatedBranche);
      if (!response) {
        throw new Error("No se pudo actualizar el negocio.");
      }
      toast.success(`Sucursal "${updatedBranche.name}" actualizado exitosamente.`);
    } catch (error) {
      console.error("Error updating branche:", error);
      toast.error("Error al actualizar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData);
    }
  };

  const deleteBrancheFromTable = async (brancheId: number) => {
    console.log("Eliminando negocio de la tabla:", brancheId); // Log para verificar la eliminación
    const previousData = [...data];
    setData((prevData) => prevData.filter((branche) => branche.id !== brancheId));

    try {
      const isDeleted = await deleteBranche(brancheId);
      if (!isDeleted) {
        throw new Error("No se pudo eliminar el negocio.");
      }
    } catch (error) {
      console.error("Error deleting branche:", error);
      toast.error("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
      setData(previousData);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 ">
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
                Sucursales
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Sucursales</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las sucursales.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <BrancheActions onRefresh={loadBranchees}   /> {/* Pasar loadBranchees como prop */}
      </div>

      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateBrancheInTable, deleteBrancheFromTable)}
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