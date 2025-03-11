"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import { IngredientsActions } from "./IngredientsActions";
import { columns } from "./columns";
import { fetchIngredientsData, updateIngredients, deleteIngredients } from "@/services/fetchIngredientsData"; // Importar funciones de servicio
import { Ingredient } from "@/types/ingredients"; // Asegúrate de que esta interfaz esté definida
import { PaginationState } from "@tanstack/react-table";

export default function IngredientsPage() {
  const [data, setData] = useState<Ingredient[]>([]); // Estado para almacenar los ingredientes
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar errores
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Página inicial
    pageSize: 10, // Tamaño de la página
  });
  const handlePaginationChange = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
    if (typeof updaterOrValue === "function") {
      // Si es una función de actualización, llámala con el estado actual
      setPagination(updaterOrValue(pagination));
    } else {
      // Si es un valor directo, úsalo directamente
      setPagination(updaterOrValue);
    }
  };
  // Función para cargar los ingredientes
  const loadIngredients = async () => {
    console.log("Cargando ingredientes..."); // Log para verificar la carga de datos
    try {
      const ingredients = await fetchIngredientsData();
      if (ingredients) {
        setData(ingredients);
        console.log("Ingredientes cargados:", ingredients);
      } else {
        setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
    
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const updateIngredientsInTable = async (updatedIngredients: Ingredient) => {
    console.log("Actualizando ingrediente en la tabla:", updatedIngredients.id, updatedIngredients.name);
    const previousData = [...data];
    setData((prevData) =>
      prevData.map((ingredient) =>
        ingredient.id === updatedIngredients.id ? updatedIngredients : ingredient
      )
    );
  
    try {
      const response = await updateIngredients(updatedIngredients);
      if (!response) {
        throw new Error("No se pudo actualizar el ingrediente.");
      }
    } catch (error) {
      console.error("Error updating ingredients:", error);
      toast.error("Error al actualizar el ingrediente. Por favor, inténtalo de nuevo.");
      setData(previousData); // Revertir los cambios en caso de error
    }
  };

  // Función para eliminar un ingrediente de la tabla (optimistic update)
  const deleteIngredientsFromTable = async (ingredientsId : string) => {
    console.log("Eliminando ingrediente de la tabla:", ingredientsId);
    const previousData = [...data];
    setData((prevData) => prevData.filter((ingredient) =>  ingredient.id !== Number(ingredientsId))); 
  
    try {
      const isDeleted = await deleteIngredients(Number(ingredientsId));
      if (!isDeleted) {
        throw new Error("No se pudo eliminar el ingrediente.");
      }
    } catch (error) {
      console.error("Error deleting ingredients:", error);
      toast.error("Error al eliminar el ingrediente. Por favor, inténtalo de nuevo.");
      setData(previousData); // Revertir los cambios en caso de error
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
                Ingredientes
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-semibold text-gray-900">Ingredientes</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los ingredientes.
        </small>
      </div>

      {/* Description and Action Button */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <IngredientsActions onRefresh={loadIngredients}  /> {/* Pasar loadIngredients como prop */}
      </div>

      {/* Tabla con todas las funcionalidades */}
      <div className="flex flex-col gap-6 pr-4 pl-4 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateIngredientsInTable, deleteIngredientsFromTable)} // Pasar funciones como parámetros
            data={data}
            enableFilter // Habilitar el filtro
            filterPlaceholder="Filtrar por nombre..." // Personalizar el placeholder
            filterColumn="name" // Especificar la columna a filtrar
            enablePagination // Habilitar la paginación
            enableRowSelection // Habilitar la selección de filas
            enableColumnVisibility // Habilitar la visibilidad de columnas
            onPaginationChange={handlePaginationChange}
            pagination={pagination} // Usa el estado de la paginación
          />
        )}
      </div>
    </div>
  );
}