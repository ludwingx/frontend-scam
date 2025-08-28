'use server';

import { cookies } from "next/headers";
import { Business } from "@/types/business";



type ApiResponse = {
  success: boolean;
  data: Business | null;
  message: string;
};

export const fetchBusinessData = async (): Promise<Business[] | null> => {
  try {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (token && API_URL) {
      const response = await fetch(`${API_URL}/api/business`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los negocios");
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.data as unknown as Business[];
    } else {
      // Modo demo: cargar mock desde /public
      const res = await fetch('/mock_business.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_business.json');
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching business data:", error);
    // fallback demo vacío
    return [];
  }
};

export const updateBusiness = async (business: Business): Promise<Business | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/business/${business.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(business),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Business;
  } catch (error) {
    console.error("Error updating business:", error);
    throw error;
  }
};

export const deleteBusiness = async (businessId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/business/${businessId}`, {
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
    console.error("Error deleting business:", error);
    throw error;
  }
};