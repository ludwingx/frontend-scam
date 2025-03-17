"use server";

import { Recipe } from "@/types/recipes";
import { cookies } from "next/headers";

type ApiResponse = {
  success: boolean;
  data: Recipe | Recipe[] | null;
  message: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener datos de una receta o todas las recetas
export const fetchRecipeData = async (
  recetaId?: number
): Promise<Recipe[] | Recipe | null> => {
  const token = (await cookies()).get("token")?.value;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const url = recetaId
      ? `${API_URL}/api/receta/${recetaId}`
      : `${API_URL}/api/receta`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos de las recetas");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching Recipe data:", error);
    throw error;
  }
};

// Función para actualizar una receta
export const updateRecipe = async (recipe: {
  id?: number;
  name: string;
  status: number;
  detalleRecetas: Array<{
    ingredienteId: number;
    cantidad: number;
    unidad: string;
 
  }>;
}) => {
  const token = (await cookies()).get("token")?.value;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const url = recipe.id
      ? `${API_URL}/api/receta/${recipe.id}`
      : `${API_URL}/api/receta`;
    const method = recipe.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error("Error al actualizar la receta.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

// Función para activar o inactivar una receta
export const toggleRecipeStatus = async (
  recipeId: number,
  newStatus: number
): Promise<Recipe> => {
  const token = (await cookies()).get("token")?.value;
  

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    // Obtener la receta actual para asegurarnos de que los ingredientes estén presentes
    const recipeResponse = await fetch(`${API_URL}/api/receta/${recipeId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!recipeResponse.ok) {
      throw new Error("No se pudo obtener la receta.");
    }

    const recipeData: Recipe = await recipeResponse.json();

    // Construir el objeto de solicitud con los ingredientes
    const requestBody = {
      id: recipeId,
      name: recipeData.name,
      status: newStatus,
      ingredientes: recipeData.detalleRecetas.map((ing) => ({
        ingredienteId: ing.id,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      })),
    };

    // Enviar la solicitud para cambiar el estado
    const response = await fetch(`${API_URL}/api/receta/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Obtener el mensaje de error del servidor
      console.error("Error response from server:", errorText);
      throw new Error(`Error al cambiar el estado de la receta: ${errorText}`);
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Recipe;
  } catch (error) {
    console.error("Error toggling recipe status:", error);
    throw error;
  }
};