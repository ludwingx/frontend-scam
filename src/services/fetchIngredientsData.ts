'use server';

import { cookies } from "next/headers";
import { Ingredient } from "@/types/ingredients";



type ApiResponse = {
  success: boolean;
  data: Ingredient | null;
  message: string;
};

export const fetchIngredientsData = async (): Promise<Ingredient[] | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/ingrediente`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos de los ingredientes");
    }

    const apiResponse: ApiResponse = await response.json();
    
    return apiResponse.data as unknown as Ingredient[];
  } catch (error) {
    console.error("Error fetching ingredients data:", error);
    throw error;
  }
};

export const updateIngredients = async (ingredients: Ingredient): Promise<Ingredient | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/ingredients/${ingredients.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredients),
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // Captura la respuesta de error
      throw new Error(`Error al actualizar el ingrediente: ${errorResponse.message || "Error desconocido"}`);
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Ingredient;
  } catch (error) {
    console.error("Error updating ingredients:", error);
    throw error;
  }
};

export const deleteIngredients = async (ingredientsId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/ingredients/${ingredientsId}`, {
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
    console.error("Error deleting ingredients:", error);
    throw error;
  }
};