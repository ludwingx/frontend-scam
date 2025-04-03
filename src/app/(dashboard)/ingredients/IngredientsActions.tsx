"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { ReusableSelect } from "@/components/ReusableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unitOptions } from "@/constants/unitOptions";
import { CirclePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IngredientsActionsProps {
  onRefresh: () => void; // Prop para actualizar la tabla
  onToggleStatus: (showActive: boolean) => void; // Prop para alternar entre activos e inactivos
}

export function IngredientsActions({ onRefresh, onToggleStatus }: IngredientsActionsProps) {
  const [name, setName] = useState("");
  const [cantidad, setQuantity] = useState("");
  const [unidad, setUnit] = useState("");
  const [showActive, setShowActive] = useState(true); // Estado para mostrar activos o inactivos
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar el diálogo

  // Función para crear un ingrediente
  const handleCreateIngredient = async () => {
    if (!name.trim() || !cantidad.trim() || !unidad.trim()) {
      toast.error("Todos los campos son obligatorios.");
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

      const response = await fetch(`${apiUrl}/api/ingrediente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          cantidad: parseFloat(cantidad),
          unidad,
          status: 1, // Estado activo por defecto
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Error al crear el ingrediente: ${response.status} ${response.statusText}. ${errorData?.message || ""}`
        );
      }

      const data = await response.json();
      toast.success(`Ingrediente "${data.name}" creado exitosamente.`);

      // Limpiar el formulario después de crear el ingrediente
      setName("");
      setQuantity("");
      setUnit("");

      // Cerrar el diálogo
      setIsDialogOpen(false);

      // Llamar a la función de actualización
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating ingredient:", error);
      toast.error("Error al crear el ingrediente. Por favor, inténtalo de nuevo.");
    }
  };

  // Función para alternar entre activos e inactivos
  const handleToggleView = () => {
    const newShowActive = !showActive;
    setShowActive(newShowActive);
    onToggleStatus(newShowActive); // Notificar al componente padre
  };

  return (
    <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
      {/* Botón para alternar entre activos e inactivos */}
      <Button
        onClick={handleToggleView}
        className={showActive ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-600 text-white hover:bg-blue-700"}
      >
        {showActive ? (
          <>
            <Trash2 />
            <span>Deshabilitados</span>
          </>
        ) : (
          "Ver Activos"
        )}
      </Button>

      {/* Mostrar el botón "Crear Ingrediente" solo si se están viendo los activos */}
      {showActive && (
        <ReusableDialog
          title="Crear Ingrediente"
          description="Aquí podrás crear un ingrediente."
          trigger={
           <Button className="text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
              <CirclePlus />
              <span>Crear Ingrediente</span>
            </Button>
          }
          onSubmit={handleCreateIngredient}
          submitButtonText="Crear Ingrediente"
          isOpen={isDialogOpen} // Pasar el estado de apertura
          onOpenChange={setIsDialogOpen} // Pasar la función para cambiar el estado
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                placeholder="Ingresa el nombre del ingrediente"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cantidad" className="text-right">
                Cantidad
              </Label>
              <Input
                id="cantidad"
                placeholder="Ingresa la cantidad"
                className="col-span-3"
                value={cantidad}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unidadMedida" className="text-right">
                Unidad de Medida
              </Label>
              <ReusableSelect
                name="unidad"
                placeholder={"Selecciona la unidad de medida"}
                label="Unidad"
                options={unitOptions}
                className="col-span-3"
                disabled={false}
                onValueChange={(value) => setUnit(value)}
                value={unidad}
              />
            </div>
          </div>
        </ReusableDialog>
      )}
    </div>
  );
}