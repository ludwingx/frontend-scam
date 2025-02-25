"use client"; // Marcar como Client Component

import { ReusableDialog } from "@/components/ReusableDialog";
import { ReusableSelect } from "@/components/ReusableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            <CirclePlus />
            <span>Crear Producto</span>
          </Button>
        }
        onSubmit={handleCreateProducts}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              placeholder="Ingresa el nombre del producto"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Negocio
            </Label>
            <ReusableSelect
              placeholder="Selecciona un negocio"
              label="Negocios:"
              options={[
                { value: "Mil Sabores", label: "Mil Sabores" },
                { value: "Tortas Express", label: "Tortas Express" },
              ]}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unidadMedida" className="text-right">
              Unidad de Medida
            </Label>
            <Input
              id="unidadMedida"
              placeholder="Ingresa la unidad de medida"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precio" className="text-right">
              Precio
            </Label>
            <Input
              id="precio"
              type="number"
              placeholder="Ingresa el precio del producto"
              className="col-span-3"
            />
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}
