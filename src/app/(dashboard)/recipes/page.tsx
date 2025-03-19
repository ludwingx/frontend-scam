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
import { fetchIngredientsData } from "@/services/fetchIngredientsData";
import { Ingredient } from "@/types/ingredients";

export default function RecipePage() {
  const [data, setData] = useState<Recipe[]>([]);
  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showActiveRecipes, setShowActiveRecipes] = useState(true);

  // Función para cargar las recetas
  const loadRecipe = async () => {
    console.log("Cargando recetas...");
    try {
      const recipes = await fetchRecipeData();
      if (recipes) {
        setData(Array.isArray(recipes) ? recipes : [recipes]);
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

  // Función para cargar los ingredientes
  const loadIngredients = async () => {
    try {
      const data = await fetchIngredientsData();
      console.log("Datos de ingredientes cargados:", data);
      setIngredientsData(data || []);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      toast.error("Error al cargar los ingredientes. Por favor, inténtalo de nuevo.");
    }
  };

  // Cargar las recetas y los ingredientes al montar el componente
  useEffect(() => {
    loadRecipe();
    loadIngredients();
  }, []);

  // Función para actualizar una receta en la tabla
  const updateRecipeInTable = async (updatedRecipe: Recipe) => {
    try {
      const ingredientes = updatedRecipe.ingredientes || [];
  
      // Asegúrate de incluir el ID de la receta y el ID de cada ingrediente
      const updatedRecipeWithId = {
        id: updatedRecipe.id,
        name: updatedRecipe.name,
        status: updatedRecipe.status,
        ingredientes: ingredientes.map((ing) => ({
          id: ing.ingredienteId, // <-- Añadir el campo `id` usando `ingredienteId`
          ingredienteId: ing.ingredienteId,
          cantidad: ing.cantidad,
          unidad: ing.unidad,
        })),
      };
  
      console.log("Datos a enviar al backend:", updatedRecipeWithId); // Verifica los datos
  
      const response = await updateRecipe(updatedRecipeWithId);
  
      if (response) {
        toast.success(`Receta "${updatedRecipe.name}" actualizada exitosamente.`);
        loadRecipe(); // Recargar las recetas después de la actualización
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      if (error instanceof Error) {
        toast.error(`Error al actualizar la receta: ${error.message}`);
      } else {
        toast.error("Error al actualizar la receta. Por favor, inténtalo de nuevo.");
      }
    }
  };

  // Función para cambiar el estado de una receta (activar/inactivar)
  const toggleRecipeStatusInTable = async (recipeId: number, newStatus: number) => {
    const previousData = [...data];
    const recipeToUpdate = data.find((recipe) => recipe.id === recipeId);
    if (!recipeToUpdate) {
      toast.error("Receta no encontrada.");
      return;
    }

    setData((prevData) =>
      prevData.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, status: newStatus } : recipe
      )
    );

    try {
      const response = await toggleRecipeStatus(recipeId, newStatus);

      if (response) {
        toast.success(
          `Receta "${recipeToUpdate.name}" ha sido ${
            newStatus === 1 ? "activada" : "inactivada"
          } exitosamente.`
        );
      }
    } catch (error) {
      console.error("Error toggling recipe status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cambiar el estado de la receta. Por favor, inténtalo de nuevo."
      );
      setData(previousData);
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
          onToggleActiveRecipes={handleToggleActiveRecipes}
          onRefresh={loadRecipe}
        />
      </div>
      <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRecipeInTable, toggleRecipeStatusInTable, ingredientsData)}
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