'use server';

import { cookies } from "next/headers";
import { Production } from "@/types/production";



type ApiResponse = {
  success: boolean;
  data: Production | null;
  message: string;
};

export const fetchProductionData = async (): Promise<Production[] | null> => {
  try {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (token && API_URL) {
      const response = await fetch(`${API_URL}/api/production`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los negocios");
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.data as unknown as Production[];
    } else {
      // Modo demo: cargar mock desde /public
      const res = await fetch('/mock_production.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_production.json');
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching production data:", error);
    // fallback demo vacío
    return [];
  }
};

export const updateProduction = async (production: Production): Promise<Production | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/production/${production.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(production),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Production;
  } catch (error) {
    console.error("Error updating production:", error);
    throw error;
  }
};

export const deleteProduction = async (productionId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/production/${productionId}`, {
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
    console.error("Error deleting production:", error);
    throw error;
  }
};