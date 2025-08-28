'use server';

import { Product } from "@/types/products";
import { cookies } from "next/headers";


type ApiResponse = {
  success: boolean;
  data: Product | null;
  message: string;
};

export const fetchProductData = async (): Promise<Product[]> => {
  try {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (token && API_URL) {
      const response = await fetch(`${API_URL}/api/product`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los products");
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.data as unknown as Product[];
    } else {
      // Modo demo: cargar mock desde /public
      const res = await fetch('/mock_products.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_products.json');
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching Product data:", error);
    // fallback demo vacío
    return [];
  }
};
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      // Obtener más detalles sobre el error
      const errorResponse = await response.json();
      console.error("Error response from server:", errorResponse);
      throw new Error(errorResponse.message || "Error al crear el producto");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};
export const updateProduct = async (Product: Product): Promise<Product | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/product/${Product.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Product),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el negocio");
    }

    const apiResponse: ApiResponse = await response.json();
    return apiResponse.data as Product;
  } catch (error) {
    console.error("Error updating Product:", error);
    throw error;
  }
};

