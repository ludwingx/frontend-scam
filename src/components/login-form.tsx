"use client"; // Agrega esta línea para convertir el componente en un Client Component

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí puedes manejar la lógica de envío del formulario
    const formData = new FormData(event.currentTarget);
    const ci = formData.get("ci");
    const password = formData.get("password");
    console.log("Cédula:", ci);
    console.log("Contraseña:", password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-1xl font-bold text-muted-foreground">
                  Bienvenido a
                </h2>
                <h1 className="text-2xl font-bold">
                  Santa Cruz Alimentos Manager
                </h1>
              </div>
              <div className="grid gap-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  <Label htmlFor="ci">Cédula de Identidad</Label>
                </h3>
                <Input
                  id="ci"
                  name="ci"
                  type="text"
                  placeholder="Ingrese su Cédula de Identidad"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  placeholder="Ingrese su Contraseña"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" aria-label="Iniciar Sesión">
                Iniciar Sesión
              </Button>
            </div>
          </form>
          <div className="hidden md:flex items-center justify-center bg-gray-100">
            <Image
              src="/SCZ-Alimentos-Logo.svg" // Ruta de la imagen (puede ser local o remota)
              alt="Logo de Santa Cruz Alimentos"
              width={240}
              height={180}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}