"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";

export function ProductsActions() {
  const handleCreateProducts = () => {
    console.log("Crear Producto");
    // Lógica para crear un negocio
  };


  return (
    <>
      {/* Diálogo para crear negocio */}
      <ReusableDialog 
        title="Crear Producto"
        description="Aquí podrás crear un producto."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus/><span>Crear Producto</span>
          </Button>
        }
        onSubmit={handleCreateProducts}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" placeholder="Ingresa el nombre del producto" className="col-span-3" />
          </div>
          <div  className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unidadMedida" className="text-right">
              Unidad de Medida
            </Label>
            <Input id="unidadMedida" placeholder="Ingresa la unidad de medida" className="col-span-3" />
          </div>
        </div>
      </ReusableDialog>

     
    </>
  );
}