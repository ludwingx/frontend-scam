"use server";

import { cookies } from "next/headers";
import { Ingredient } from "@/types/ingredients";

export const fetchActualIngredientsData = async (): Promise<Ingredient[]> => {
  try {
    const token = (await cookies()).get("token")?.value;
    const API_URL = "https://torta-express-dbbackend.af9gwe.easypanel.host";
    const endpoint = "/api/insumos_actuales";

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      throw new Error("Error al obtener la lista de insumos actuales");
    }
    const data = await response.json();
    // Si el backend retorna { success, data }, devolver solo data
    return Array.isArray(data.data) ? data.data : data;
  } catch (error) {
    console.error("Error fetching actual ingredients:", error);
    return [];
  }
};
