// services/fetchProfileData.ts
'use server'; // Marca esta función como una función de servidor

import { cookies } from "next/headers";

type User = {
    id: number;
    full_name: string;
    ci: string;
    rol_id: number;
    rol_name: string;
};

type ApiResponse = {
    success: boolean;
    data: User;
    message: string;
};

export const fetchProfileData = async (): Promise<User | null> => {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('user_id')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Verificar que el token, el user_id y la API_URL estén presentes
    if (!token || !userId || !API_URL) {
        console.error("Faltan el token, el user_id o la API_URL");
        return null;
    }

    try {
        // Hacer la solicitud al backend
        const response = await fetch(`${API_URL}/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        // Parsear la respuesta como JSON
        const apiResponse: ApiResponse = await response.json();

        // Verificar si la respuesta es válida
        if (!apiResponse.success || !apiResponse.data) {
            throw new Error('Respuesta del servidor no válida');
        }

        // Retornar los datos del usuario
        return apiResponse.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};