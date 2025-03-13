'use server';

import { Branche } from "@/types/branche";
import { cookies } from "next/headers";



type ApiResponse = {
  success: boolean;
  data: Branche | null;
  message: string;
};

export const fetchBrancheData = async (): Promise<Branche[] | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/branche`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos de los negocios");
    }

    const apiResponse: ApiResponse = await response.json();
    
    return apiResponse.data as unknown as Branche[];
  } catch (error) {
    console.error("Error fetching branche data:", error);
    throw error;
  }
};

export const updateBranche = async (branche: Branche): Promise<Branche | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/branche/${branche.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(branche),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Branche;
  } catch (error) {
    console.error("Error updating branche:", error);
    throw error;
  }
};

export const deleteBranche = async (brancheId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/branche/${brancheId}`, {
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
    console.error("Error deleting branche:", error);
    throw error;
  }
};