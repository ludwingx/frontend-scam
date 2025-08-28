"use server";

import { cookies } from "next/headers";
import { Ingredient } from "@/types/ingredients";

type ApiResponse = {
  success: boolean;
  data: Ingredient | null;
  message: string;
};

export const fetchIngredientsData = async (): Promise<Ingredient[] | undefined> => {
  try {
    const token = (await cookies()).get("token")?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (token && API_URL) {
      const response = await fetch(`${API_URL}/api/ingrediente`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los ingredientes");
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.data as unknown as Ingredient[];
    } else {
      // Modo demo: cargar mock desde /public
      const res = await fetch('/mock_ingredients.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_ingredients.json');
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching ingredients data:", error);
    // fallback demo vacío
    return [];
  }
};

export const updateRecipe = async (recipe: {
   id: number; // Este campo no se enviará al backend
  name: string;
  status: number;
  ingredientes: Array<{
    ingredienteId: number;
    cantidad: number;
    unidad: string;
  }>;
}) => {
  const token = (await cookies()).get("token")?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
      if (
        !ingrediente.ingredienteId ||
        !ingrediente.cantidad ||
        !ingrediente.unidad
      ) {
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
        `Error al actualizar la receta: ${
          errorResponse.message || "Error desconocido"
        }`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Error al actualizar la receta");
  }
};
