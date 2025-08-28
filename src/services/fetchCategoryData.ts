'use server';

import { cookies } from "next/headers";

type Category = {
  id: number;
  name: string;
  status: number;
};



type ApiResponse = {
  success: boolean;
  data: Category | null;
  message: string;
};

export const fetchCategoryData = async (): Promise<Category[] | null> => {
  try {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (token && API_URL) {
      const response = await fetch(`${API_URL}/api/category`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los negocios");
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.data as unknown as Category[];
    } else {
      // Modo demo: cargar mock desde /public
      const res = await fetch('/mock_category.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_category.json');
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching Category data:", error);
    // fallback demo vacío
    return [];
  }
};

export const updateCategory = async (Category: Category): Promise<Category | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/category/${Category.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Category),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Category;
  } catch (error) {
    console.error("Error updating Category:", error);
    throw error;
  }
};

export const deleteCategory = async (CategoryId: number): Promise<boolean> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/category/${CategoryId}`, {
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
    console.error("Error deleting Category:", error);
    throw error;
  }
};