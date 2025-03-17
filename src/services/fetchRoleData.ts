'use server'; // Marca esta función como una función de servidor

import { Role } from "@/types/role";
import { cookies } from "next/headers";


type ApiResponse = {
    success: boolean;
    data: Role[] | Role | null;
    message: string;
};

// Función para obtener todos los roles
export const fetchRoleData = async (): Promise<Role[] | null> => {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Verificar que el token y la API_URL estén presentes
    if (!token || !API_URL) {
        console.error("Faltan el token o la API_URL");
        return null;
    }

    try {
        // Hacer la solicitud al backend para obtener los roles
        const response = await fetch(`${API_URL}/api/rol`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Error al obtener los datos de los roles");
        }

        // Parsear la respuesta como JSON
        const apiResponse: ApiResponse = await response.json();

        // Verificar si la respuesta es válida
        if (!apiResponse.success || !apiResponse.data) {
            throw new Error("Respuesta del servidor no válida");
        }

        // Retornar los datos de los roles
        return apiResponse.data as Role[];
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Función para crear un rol
export const createRole = async (role: Omit<Role, 'id'>): Promise<Role | null> => {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!token || !API_URL) {
        console.error("Faltan el token o la API_URL");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/api/rol`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(role),
        });

        if (!response.ok) {
            throw new Error("Error al crear el rol");
        }

        const apiResponse: ApiResponse = await response.json();

        if (!apiResponse.success || !apiResponse.data) {
            throw new Error("Respuesta del servidor no válida");
        }

        return apiResponse.data as Role;
    } catch (error) {
        console.error("Error creating role:", error);
        return null;
    }
};

// Función para actualizar un rol
export const updateRole = async (role: Role): Promise<Role | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/rol/${role.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el rol");
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error("Respuesta del servidor no válida");
    }

    return apiResponse.data as Role;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

// Función para cambiar el estado de un rol
export const toggleRoleStatus = async (
  roleId: number,
  newStatus: number,
  roleName?: string
): Promise<Role | null> => {
  const token = (await cookies()).get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!token || !API_URL) {
    throw new Error("Faltan el token o la API_URL");
  }

  try {
    const response = await fetch(`${API_URL}/api/rol/${roleId}`, {
      method: "PUT", // Asegúrate de que el método sea el correcto
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus, name: roleName }), // Incluir el nuevo estado y el nombre del rol
    });

    if (!response.ok) {
      const errorText = await response.text(); // Obtener el mensaje de error del servidor
      console.error("Error response from server:", errorText);
      throw new Error(`Error al cambiar el estado del rol: ${errorText}`);
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error("Respuesta del servidor no válida");
    }

    return apiResponse.data as Role;
  } catch (error) {
    console.error("Error toggling role status:", error);
    throw error;
  }
};