"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BranchesActionsProps {
  onRefresh: () => void; // Prop para actualizar la tabla
}

export function BrancheActions({ }: BranchesActionsProps) {
  const [businessName, setBranchesName] = useState("");

  const handleCreateBranches = async () => {
  if (!businessName.trim()) {
    toast.error("El nombre del negocio no puede estar vacío.");
    return;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

    if (!apiUrl) {
      throw new Error("La URL de la API no está definida en las variables de entorno.");
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("No se encontró un token de autenticación.");
    }

    const response = await fetch(`${apiUrl}/api/business`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: businessName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Error al crear el negocio: ${response.status} ${response.statusText}. ${errorData?.message || ""}`
      );
    }

    const data = await response.json();
    toast.success(`Sucursal "${data.name}" creado exitosamente.`);
    setTimeout(() => {
          window.location.reload();
    }, 3000); // Adjust the delay as needed

  } catch (error) {
    console.error("Error creating business:", error);
    toast.error("Error al crear el negocio. Por favor, inténtalo de nuevo.");
  }
};

  return (
    <>
      <ReusableDialog
        title="Crear Sucursal"
        description="Aquí podrás crear un negocio."
        trigger={
         <Button className="text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
            <CirclePlus />
            <span>Crear Sucursal</span>
          </Button>
        }
        onSubmit={handleCreateBranches}
        submitButtonText="Crear Sucursal"
        
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del negocio"
              className="col-span-3"
              value={businessName}
              onChange={(e) => setBranchesName(e.target.value)}
            />
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}