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
  fetchRecipeData,
  updateRecipe,
  toggleRecipeStatus,
} from "@/services/fetchRecipesData";
import { toast } from "sonner";
import { columns } from "./columns";

export default function RecipePage() {
  const [data, setData] = useState<Recipe[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showActiveRecipes, setShowActiveRecipes] = useState(true); // Estado para filtrar recetas activas/inactivas

  // Función para cargar las recetas
  const loadRecipe = async () => {
    console.log("Cargando recetas..."); // Log para verificar la carga de datos
    try {
      const recipes = await fetchRecipeData(); // Obtener todas las recetas
      if (recipes) {
        setData(Array.isArray(recipes) ? recipes : [recipes]); // Asegúrate de que sea un array
        console.log("Recetas cargadas:", recipes);
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

  // Cargar las recetas al montar el componente
  useEffect(() => {
    loadRecipe();
  }, []);

  // Función para actualizar una receta en la tabla
  const updateRecipeInTable = async (updatedRecipe: Recipe) => {
    try {
      // Transformar detalleRecetas a la estructura que el backend espera
      const ingredientes = updatedRecipe.detalleRecetas.map((ing) => ({
        ingredienteId: ing.id, // Asegúrate de que `id` sea el ID del ingrediente
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      }));

      const recipeToUpdate = {
        ...updatedRecipe,
        detalleRecetas: ingredientes,
        id: updatedRecipe.id,
        name: updatedRecipe.name,
        status: updatedRecipe.status,
      };

      const response = await updateRecipe(recipeToUpdate);
      if (!response) {
        throw new Error("No se pudo actualizar la receta.");
      }
      toast.success("Receta actualizada correctamente.");
      await loadRecipe(); // Recargar las recetas después de la actualización
      return response;
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Error al actualizar la receta. Por favor, inténtalo de nuevo.");
      throw error;
    }
  };

  // Función para cambiar el estado de una receta (activar/inactivar)
  const toggleRecipeStatusInTable = async (recipeId: number, newStatus: number) => {
    const previousData = [...data]; // Guardar los datos anteriores para revertir en caso de error

    // Buscar la receta en la lista de datos
    const recipeToUpdate = data.find((recipe) => recipe.id === recipeId);
    if (!recipeToUpdate) {
      toast.error("Receta no encontrada.");
      return;
    }

    // Actualizar la UI de inmediato (optimistic update)
    setData((prevData) =>
      prevData.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, status: newStatus } : recipe
      )
    );

    try {
      // Hacer la petición al servidor para cambiar el estado de la receta
      const response = await toggleRecipeStatus(recipeId, newStatus);

      if (!response) {
        throw new Error("No se pudo cambiar el estado de la receta.");
      }

      toast.success(
        `Receta "${recipeToUpdate.name}" ha sido ${
          newStatus === 1 ? "activada" : "inactivada"
        } exitosamente.`
      );
    } catch (error) {
      console.error("Error toggling recipe status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cambiar el estado de la receta. Por favor, inténtalo de nuevo."
      );
      setData(previousData); // Revertir los cambios en la UI
    }
  };

  // Filtrar recetas según el estado
  const filteredData = data.filter((recipe) =>
    showActiveRecipes ? recipe.status === 1 : recipe.status === 0
  );

  // Función para alternar entre recetas activas e inactivas
  const handleToggleActiveRecipes = (showActive: boolean) => {
    setShowActiveRecipes(showActive);
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
                Gestión de Items
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
        <small className="text-sm font-medium text-gray-600 pl-1">
          Aquí podrás gestionar las recetas.
        </small>
      </div>

      {/* Acciones y tabla de recetas */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <RecipeActions
          onToggleActiveRecipes={handleToggleActiveRecipes} // Pasar la función para alternar entre recetas activas e inactivas
          onRefresh={loadRecipe}
        />
      </div>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRecipeInTable, toggleRecipeStatusInTable)}
            data={filteredData} // Usar los datos filtrados
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