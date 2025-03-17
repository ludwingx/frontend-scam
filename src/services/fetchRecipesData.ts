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
  id: number;
  name: string;
  status: number;
  ingredientes: Array<{
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
    // Asegúrate de que el id esté definido
    if (!recipe.id) {
      throw new Error("El ID de la receta es requerido para actualizar.");
    }

    const url = `${API_URL}/api/receta/${recipe.id}`; // Usar PUT para actualizar
    const method = "PUT"; // Siempre usar PUT para actualizar

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
    const url = `${API_URL}/api/receta/${recipeId}`; // Usar la URL completa
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }), // Envía el nuevo estado en el cuerpo
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error("Error al cambiar el estado de la receta.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling recipe status:", error);
    throw error;
  }
};