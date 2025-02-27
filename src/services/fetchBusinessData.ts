'use server'; // Marca esta función como una función de servidor

import { cookies } from "next/headers";

type Business = {
    id: number;
    name: string;
    // Agrega otras propiedades del negocio aquí según la respuesta de la API
};

type ApiResponse = {
    success: boolean;
    data: Business[];
    message: string;
};

export const fetchBusinessData = async (): Promise<Business[] | null> => {
    const token = (await cookies()).get('token')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Verificar que el token y la API_URL estén presentes
    if (!token || !API_URL) {
        console.error("Faltan el token o la API_URL");
        return null;
    }

    try {
        // Hacer la solicitud al backend para obtener los negocios
        const response = await fetch(`${API_URL}/api/business`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al obtener los datos de los negocios');
        }

        // Parsear la respuesta como JSON
        const apiResponse: ApiResponse = await response.json();

        // Verificar si la respuesta es válida
        if (!apiResponse.success || !apiResponse.data) {
            throw new Error('Respuesta del servidor no válida');
        }

        // Retornar los datos de los negocios
        return apiResponse.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};