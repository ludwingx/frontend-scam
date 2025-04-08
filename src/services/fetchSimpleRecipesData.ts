"use server";

import { SimpleRecipe } from "@/types/recipes";
import { cookies } from "next/headers";

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
};

type SimpleRecipeResponse = ApiResponse<SimpleRecipe | SimpleRecipe[]>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener datos de recetas simples
export const fetchSimpleRecipeData = async (
  recetaId?: number
): Promise<SimpleRecipe[] | SimpleRecipe | null> => {
  const token = (await cookies()).get("token")?.value;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const url = recetaId 
      ? `${API_URL}/api/base/${recetaId}`
      : `${API_URL}/api/base`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const apiResponse: SimpleRecipeResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Datos no recibidos");
    }

    // Asegurar que siempre devolvamos un array si no hay ID
    if (!recetaId && !Array.isArray(apiResponse.data)) {
      return [apiResponse.data];
    }

    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching simple recipes:", error);
    throw new Error("Error al obtener las recetas simples");
  }
};

export const updateSimpleRecipe = async (recipeData: {
  id: number;
  name: string;
  status: number;
  ingredientes: Array<{
    id?: number;
    ingredienteId: number;
    cantidad: number;
    unidad: string;
  }>;
}): Promise<SimpleRecipe> => {
  const token = (await cookies()).get("token")?.value;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  // Validaciones
  if (!recipeData.name?.trim()) {
    throw new Error("El nombre de la receta es requerido");
  }

  if (!recipeData.ingredientes || recipeData.ingredientes.length === 0) {
    throw new Error("Debe incluir al menos un ingrediente");
  }

  for (const ing of recipeData.ingredientes) {
    if (!ing.ingredienteId || isNaN(ing.cantidad) || !ing.unidad) {
      throw new Error("Datos de ingrediente incompletos");
    }
  }

  try {
    const requestBody = {
      name: recipeData.name,
      status: recipeData.status,
      ingredientes: recipeData.ingredientes.map(ing => ({
        ingredienteId: ing.ingredienteId,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
        ...(ing.id && { id: ing.id }) // Solo incluir ID si existe
      }))
    };

    const response = await fetch(`${API_URL}/api/base/${recipeData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar");
    }

    const result: ApiResponse<SimpleRecipe> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.message || "Actualización fallida");
    }

    return result.data;
  } catch (error) {
    console.error("Error updating simple recipe:", error);
    throw error instanceof Error 
      ? error 
      : new Error("Error desconocido al actualizar");
  }
};