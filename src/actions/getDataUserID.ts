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

export const fetchProfileData = async (): Promise<User | null> => {
    const token = (await cookies()).get('token')?.value;
    const userId = (await cookies()).get('user_id')?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch( API_URL + '/api/user/' + userId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const userData: User = await response.json();
        return userData;
    } catch (error) {
        console.error(error);
        return null;
    }
};