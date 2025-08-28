'use server';

import { cookies } from "next/headers";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";

type ApiResponse = {
  success: boolean;
  data: User[] | User | null;
  message: string;
};

// Datos ficticios para desarrollo
const mockUser: User = {
  id: 1,
  full_name: "Usuario Demo",
  rol_name: "Invitado",
  password: "demo-password",
  ci: "0000000",
  rol_id: 1,
  status: 1
};

const getAuthToken = async (): Promise<string | null> => {
  const token = (await cookies())?.get('token')?.value;
  return token || null; // Devuelve null en lugar de lanzar error
};

const getApiUrl = (): string => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("No se encontró la API_URL en las variables de entorno. Usando modo desarrollo con datos ficticios.");
      return ''; // Devuelve string vacío para desarrollo
    }
    throw new Error("No se encontró la API_URL en las variables de entorno.");
  }
  return API_URL;
};

export const fetchUserData = async (): Promise<User[] | null> => {
  const token = await getAuthToken();
  const API_URL = getApiUrl();

  // Si no hay API_URL, usar mock local
  if (!API_URL) {
    try {
      const res = await fetch('/mock_users.json');
      if (!res.ok) throw new Error('No se pudo cargar mock_users.json');
      return await res.json();
    } catch (error) {
      console.error("Error fetching users from mock:", error);
      return [];
    }
  }

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
    return apiResponse.data as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const login = async (ci: string, password: string) => {
  const API_URL = getApiUrl();

  // En desarrollo, si no hay API_URL, devolvemos un mock
  if (!API_URL && process.env.NODE_ENV === 'development') {
    return {
      token: 'demo-token',
      user: mockUser
    };
  }

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

    return await response.json();
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

export const fetchProfileData = async (): Promise<User> => {
  const token = await getAuthToken();
  const user_id = (await cookies()).get('user_id')?.value;
  const API_URL = getApiUrl();

  // En desarrollo, si no hay token, devolvemos el mock
  if ((!token || !user_id) && process.env.NODE_ENV === 'development') {
    return mockUser;
  }

  if (!token) throw new Error("No autenticado");
  if (!user_id) throw new Error("No se encontró el user_id en las cookies.");

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
    const apiResponse = rawResponse as ApiResponse;

    if (!apiResponse.success || !apiResponse.data) {
      throw new Error('Respuesta del servidor no válida');
    }

    const userData = Array.isArray(apiResponse.data) ? apiResponse.data[0] : apiResponse.data;

    if (!userData) {
      throw new Error('No se encontraron datos del perfil');
    }

    return userData;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    if (process.env.NODE_ENV === 'development') {
      return mockUser;
    }
    throw error;
  }
};


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