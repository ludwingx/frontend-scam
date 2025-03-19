'use server';

import { cookies } from "next/headers";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";

type ApiResponse = {
  success: boolean;
  data: User[] | null;
  message: string;
};

const getAuthToken = async (): Promise<string> => {
  const token = (await cookies())?.get('token')?.value;
  if (!token) throw new Error("No se encontró el token de autenticación.");
  return token;
};

const getApiUrl = (): string => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) throw new Error("No se encontró la API_URL en las variables de entorno.");
  return API_URL;
};
export const login = async (ci: string, password: string) => {
  const API_URL = getApiUrl();

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ci, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la autenticación');
    }

    const data = await response.json();
    console.log("Respuesta del backend:", data); // Depuración
    return data;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};
export const fetchUserData = async (): Promise<User[] | null> => {
  const token = await getAuthToken();
  const API_URL = getApiUrl();

  try {
    const response = await fetch(`${API_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users: ${errorText}`);
    }

    const apiResponse: ApiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error('Respuesta del servidor no válida');
    }

    console.log("Fetched users:", apiResponse.data);
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export async function fetchProfileData(): Promise<User> {
  const token = await getAuthToken();
  const user_id = (await cookies()).get('user_id')?.value;
  const API_URL = getApiUrl();

  if (!user_id) {
    throw new Error("No se encontró el user_id en las cookies.");
  }

  try {
    const response = await fetch(`${API_URL}/api/user/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el perfil: ${errorText}`);
    }

    const rawResponse = await response.json();
    console.log("Raw API Response:", rawResponse);

    const apiResponse: ApiResponse = rawResponse;

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error('Respuesta del servidor no válida');
    }

    // Handle both array and single object responses
    const userData = Array.isArray(apiResponse.data) ? apiResponse.data[0] : apiResponse.data;

    if (!userData) {
      throw new Error('No se encontraron datos del perfil');
    }

    console.log("Perfil obtenido:", userData);
    return userData;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw new Error(`Error al obtener el perfil: ${error instanceof Error ? error.message : "Error desconocido"}`);
  }
}


export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const token = await getAuthToken();
  const API_URL = getApiUrl();

  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user: ${errorText}`);
    }

    const createdUser: User = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function createUserAction(formData: FormData): Promise<User> {
  const user = {
    full_name: formData.get("full_name") as string,
    ci: formData.get("ci") as string,
    password: formData.get("password") as string,
    rol_id: formData.get("rol_id") as string,
  };

  try {
    const createdUser = await createUser(user as unknown as Omit<User, 'id'>);
    console.log("Usuario creado:", createdUser);
    revalidatePath("/users-management");
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(user: User): Promise<User> {
  const token = await getAuthToken();
  const API_URL = getApiUrl();

  try {
    const response = await fetch(`${API_URL}/api/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${errorText}`);
    }

    const updatedUser: User = await response.json();
    revalidatePath("/users-management");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deactivateUser(user: User, newStatus: number): Promise<User> {
  const token = await getAuthToken();
  const API_URL = getApiUrl();

  try {
    // Crear un nuevo objeto con el estado actualizado
    const updatedUser = {
      ...user,
      status: newStatus,
    };

    const response = await fetch(`${API_URL}/api/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser), // Enviar el objeto completo del usuario
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to deactivate user: ${errorText}`);
    }

    const responseData: User = await response.json();
    revalidatePath("/users-management/users");
    return responseData;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
}