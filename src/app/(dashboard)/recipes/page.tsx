"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RecipeActions } from "./RecipeActions";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipes";
import {
  deleteRecipe,
  fetchRecipeData,
  updateRecipe,
} from "@/services/fetchRecipesData";
import { toast } from "sonner";
import { columns } from "./columns";

// Definimos el tipo de datos de los productos

export default function RecipePage() {
  const [data, setData] = useState<Recipe[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadRecipe = async () => {
    console.log("Cargando recetas..."); // Log para verificar la carga de datos
    try {
      const businesses = await fetchRecipeData();
      if (businesses) {
        setData(businesses);
        console.log("Recetas cargadas:", businesses);
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

  useEffect(() => {
    loadRecipe();
  }, []);

  const updateRecipeInTable = async (updatedRecipe: Recipe) => {
    console.log(
      "Actualizando negocio en la tabla:",
      updatedRecipe.id,
      updatedRecipe.name
    ); // Log para verificar la actualización
    const previousData = [...data];
    setData((prevData) =>
      prevData.map((business) =>
        business.id === updatedRecipe.id ? updatedRecipe : business
      )
    );

    try {
      const response = await updateRecipe(updatedRecipe);
      if (!response) {
        throw new Error("No se pudo actualizar el negocio.");
      }
      toast.success(
        `Negocio "${updatedRecipe.name}" actualizado exitosamente.`
      );
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error(
        "Error al actualizar el negocio. Por favor, inténtalo de nuevo."
      );
      setData(previousData);
    }
  };

  const deleteRecipeFromTable = async (businessId: number) => {
    console.log("Eliminando negocio de la tabla:", businessId); // Log para verificar la eliminación
    const previousData = [...data];
    setData((prevData) =>
      prevData.filter((business) => business.id !== businessId)
    );

    try {
      const isDeleted = await deleteRecipe(businessId);
      if (!isDeleted) {
        throw new Error("No se pudo eliminar el negocio.");
      }
    } catch (error) {
      console.error("Error deleting business:", error);
      toast.error(
        "Error al eliminar el negocio. Por favor, inténtalo de nuevo."
      );
      setData(previousData);
    }
  };
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Título de la página */}
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
                Gestion de Items
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Recetas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">Recetas</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar los recetas.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <RecipeActions /> {/* Pasar loadRecipees como prop */}
      </div>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRecipeInTable, deleteRecipeFromTable)}
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
