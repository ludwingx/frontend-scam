"use server";

import { Recipe } from "@/types/recipes";
import { cookies } from "next/headers";

type ApiResponse = {
  success: boolean;
  data: Recipe[] | Recipe | null;
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

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Error al obtener los datos de las recetas");
    }

    return apiResponse.data; // Retorna el array o el objeto directamente
  } catch (error) {
    console.error("Error fetching Recipe data:", error);
    throw new Error("Error al obtener los datos de las recetas");
  }
};

export const updateRecipe = async (recipe: {
  id: number; // Este campo no se enviará al backend
  name: string;
  status: number;
  ingredientes: Array<{
    id: number;
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
    // Validar datos antes de enviar
    if (!recipe.name || !recipe.ingredientes) {
      throw new Error("Datos de la receta incompletos.");
    }

    // Validar que los ingredientes tengan los campos requeridos
    for (const ingrediente of recipe.ingredientes) {
      if (!ingrediente.ingredienteId || !ingrediente.cantidad || !ingrediente.unidad) {
        throw new Error("Datos de ingredientes incompletos.");
      }
    }

    // Construir el objeto que el backend espera
    const requestBody = {
      name: recipe.name,
      status: recipe.status,
      ingredientes: recipe.ingredientes.map((ing) => ({
        ingredienteId: ing.ingredienteId,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
      })),
    };

    const url = `${API_URL}/api/receta/${recipe.id}`; // El ID se usa en la URL, no en el cuerpo
    const method = "PUT";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Enviar solo los campos que el backend espera
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error(
        `Error al actualizar la receta: ${errorResponse.message || "Error desconocido"}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Error al actualizar la receta");
  }
};

