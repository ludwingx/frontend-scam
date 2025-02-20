"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BusinessActions() {
  const handleCreateBusiness = () => {
    console.log("Crear negocio");
    // Lógica para crear un negocio
  };


  return (
    <>
      {/* Diálogo para crear negocio */}
      <ReusableDialog 
        title="Crear Negocio"
        description="Aquí podrás crear un negocio."
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <span>Crear Negocio</span>
          </Button>
        }
        onSubmit={handleCreateBusiness}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" placeholder="Ingresa el nombre del negocio" className="col-span-3" />
          </div>
        </div>
      </ReusableDialog>

     
    </>
  );
}