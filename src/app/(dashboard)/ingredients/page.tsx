"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";
import { IngredientsActions } from "./IngredientsActions";
import { columns } from "./columns";
import { fetchIngredientsData, updateIngredients, deleteIngredients } from "@/services/fetchIngredientsData";
import { Ingredient } from "@/types/ingredients";

export default function IngredientsPage() {
  const [data, setData] = useState<Ingredient[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(true); // Estado para mostrar activos, inactivos o null

  // Función para cargar los ingredientes
  const loadIngredients = async () => {
    console.log("Cargando ingredientes...");
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

  // Función para actualizar un ingrediente en la tabla
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

  // Función para eliminar un ingrediente de la tabla
  const deleteIngredientsFromTable = async (ingredientsId: string) => {
    console.log("Eliminando ingrediente de la tabla:", ingredientsId);
    const previousData = [...data];
    setData((prevData) => prevData.filter((ingredient) => ingredient.id !== Number(ingredientsId)));

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

  // Filtrar los datos según el estado (activos, inactivos o null)
  const filteredData = data
    .sort((a, b) => b.id - a.id) // Ordenar de mayor a menor ID
    .filter((ingredient) => {
      if (showActive) {
        return ingredient.status === 1 || ingredient.status === null; // Mostrar activos y null
      } else {
        return ingredient.status === 0; // Mostrar inactivos
      }
    });

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
            {showActive ? (
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Ingredientes
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/ingredients" className="text-sm font-medium text-gray-900">
                    Ingredientes
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Ingredientes Deshabilitados
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Título dinámico */}
        <h2 className="text-3xl font-semibold text-gray-900">
          {showActive ? "Ingredientes" : "Ingredientes Deshabilitados"}
        </h2>
        <small className="text-sm font-medium text-gray-600 pl-1">
          {showActive
            ? "Aquí podrás gestionar los ingredientes habilitados y sin estado."
            : "Aquí podrás gestionar los ingredientes deshabilitados."}
        </small>
      </div>

      {/* Botones de acciones y filtrado */}
      <IngredientsActions
        onRefresh={loadIngredients}
        onToggleStatus={(isActive) => setShowActive(isActive)} // Pasar la función para alternar estado
      />

      {/* Tabla con todas las funcionalidades */}
      <div className="flex flex-col gap-6 pr-4 pl-4 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateIngredientsInTable, deleteIngredientsFromTable)}
            data={filteredData}
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