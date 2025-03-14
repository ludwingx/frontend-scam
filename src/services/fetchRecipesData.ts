'use server';

import { Recipe } from "@/types/recipes";
import { cookies } from "next/headers";


type ApiResponse = {
  success: boolean;
  data: Recipe | null;
  message: string;
};

export const fetchRecipeData = async (recetaId?: number): Promise<Recipe[] | Recipe | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const url = recetaId ? `${API_URL}/api/receta/${recetaId}` : `${API_URL}/api/receta`;
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

export const updateRecipe = async (updatedRecipe: Recipe) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/receta/${updatedRecipe.id}`;
    console.log("URL:", url); // Depuración
    console.log("Datos enviados:", updatedRecipe); // Depuración

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Captura la respuesta como texto
      console.error("Error del servidor (HTML):", errorText); // Depuración
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};
export const deleteRecipe = async (RecipeId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/receta/${RecipeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el negocio");
    }

    return true;
  } catch (error) {
    console.error("Error deleting Recipe:", error);
    throw error;
  }
};