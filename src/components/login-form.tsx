'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';
import logoSCA from "../../public/SCZ-Alimentos-Logo.svg";
const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        // Obtener los valores del formulario
        const formData = new FormData(event.currentTarget);
        const ci = formData.get('ci') as string;
        const password = formData.get('password') as string;
        console.log("Ci:" + ci);
        console.log("Password:" + password);
        try {
            // Hacer la solicitud al backend
            const response = await fetch('https://3612-189-28-75-151.ngrok-free.app/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },    
                body: JSON.stringify({ ci, password }),
            }); 

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            // Obtener los datos de la respuesta
            const data = await response.json();
            console.log('Respuesta del backend:', data);

            // // Guardar el token en localstorage y en las cookies
            // localStorage.setItem('token', data.token);

            // Guardar el token en una cookie
            setCookie('token', data.token, { maxAge: 60 * 60 * 24 }); // Expira en 1 día

            // //guardar el user_id en localstorage:
            // localStorage.setItem('user_id', data.user_id);
            
            
            // Guardar el user_id en una cookie
            setCookie('user_id', data.user_id, { maxAge: 60 * 60 * 24 }); // Expira en 1 día
            // Redirigir al usuario a la página principal
            router.push('/dashboard');
            
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setError('Error en la autenticación. Verifica tus credenciales.');
        }
    };

    return (
    <div className="flex flex-col gap-6 ">  
        <Card className="overflow-hidden ">
          <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  {/* Campo de C.I. */}
                  <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                          C.I.
                      </label>
                      <div className="relative">
                          <input
                              name="ci"
                              type="number"
                              placeholder="Ingresar número de cédula"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              required
                          />
                          <span className="absolute right-4 top-4">
                              <svg
                                  className="fill-current"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                  <g opacity="0.5">
                                      <path
                                          d="M14 13h5v-2h-5zm0-3h5V8h-5zm-9 6h8v-.55q0-1.125-1.1-1.787T9 13t-2.9.663T5 15.45zm4-4q.825 0 1.413-.587T11 10t-.587-1.412T9 8t-1.412.588T7 10t.588 1.413T9 12m-5 8q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6z"
                                          fill=""
                                      />
                                  </g>
                              </svg>
                          </span>
                      </div>
                  </div>
  
                  {/* Campo de Contraseña */}
                  <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Contraseña
                      </label>
                      <div className="relative">
                          <input
                              name="password"
                              type="password"
                              placeholder="Ingresa tu contraseña"
                              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              required
                          />
                          <span className="absolute right-4 top-4">
                              <svg
                                  className="fill-current"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                  <g opacity="0.5">
                                      <path
                                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                          fill=""
                                      />
                                      <path
                                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                          fill=""
                                      />
                                  </g>
                              </svg>
                          </span>
                      </div>
                  </div>
  
                  {/* Botón de Iniciar Sesión */}
                  <div className="mb-5">
                      <Button type="submit" >Iniciar Sesión</Button>
                  </div>
  
                  {/* Mostrar errores */}
                  {error && (
                      <p className="text-red-500 text-center mt-4">{error}</p>
                  )}
              </form>
  
            <div className="hidden md:flex items-center justify-center bg-gray-100">
              <Image
                src={logoSCA}// Ruta de la imagen (puede ser local o remota)
                alt="Logo de Santa Cruz Alimentos"
                width={240}
                height={180}
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
};

export default LoginForm;