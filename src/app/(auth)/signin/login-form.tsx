'use client';

import React, { useState} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import Image from 'next/image';
import logoSCA from '../../../../public/SCZ-Alimentos-Logo.svg';
import { login } from '@/services/userService';
import { getCookie, setCookie } from 'cookies-next';

const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const nombre_usuario = formData.get('nombre_usuario') as string;
        const contrasena = formData.get('contrasena') as string;

        if (!nombre_usuario || !contrasena) {
            setError('Por favor, completa todos los campos.');
            setIsLoading(false);
            return;
        }

        try {
            const userData = await login(nombre_usuario, contrasena);
            console.log("✅ Respuesta del backend:", userData); // Verificar estructura
            console.log("")
        
            // Acceder correctamente al token dentro de `data`
            const token = userData?.data?.token;
            const userId = userData?.data?.user_id;
        
            if (!token) {
                throw new Error("⚠️ No se recibió un token en la respuesta del backend.");
            }
        
            // Guardar en cookies
            setCookie('token', token, { maxAge: 60 * 60 * 24 });
            setCookie('user_id', userId?.toString(), { maxAge: 60 * 60 * 24 });
        
            console.log("🔍 Token guardado en cookie:", getCookie('token'));
        
            router.push('/dashboard');
        } catch (error) {
            console.error("❌ Error en autenticación:", error);
            setError(error instanceof Error ? error.message : 'Error en la autenticación.');
        } finally {
            setIsLoading(false);
        }
    }
        

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {/* Campos del formulario */}
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">Usuario</label>
                            <input
                                name="nombre_usuario"
                                type="text"
                                placeholder="Ingresa tu usuario"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">Contraseña</label>
                            <input
                                name="contrasena"
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                        </Button>
                    </form>
                    <div className="hidden h-full w-full items-center justify-center md:flex">
                        <Image src={logoSCA} alt="Logo" width={250} height={250} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

};


export default LoginForm;

