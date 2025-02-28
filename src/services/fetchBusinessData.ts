'use server';

import { cookies } from "next/headers";

type Business = {
  id: number;
  name: string;
  // Otras propiedades del negocio
};

type ApiResponse = {
  success: boolean;
  data: Business | null;
  message: string;
};

export const fetchBusinessData = async (): Promise<Business[] | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
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
    
    return apiResponse.data as Business[];
  } catch (error) {
    console.error("Error fetching business data:", error);
    throw error;
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