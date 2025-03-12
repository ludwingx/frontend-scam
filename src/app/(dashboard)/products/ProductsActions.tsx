"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { ReusableSelect } from "@/components/ReusableSelect";
import { ReusableDialog } from "@/components/ReusableDialog";

const recipes = [
  { id: 1, nombre: "Receta 1", descripcion: "Descripción de la receta 1" },
  { id: 2, nombre: "Receta 2", descripcion: "Descripción de la receta 2" },
  { id: 3, nombre: "Receta 3", descripcion: "Descripción de la receta 3" },
];

export function ProductsActions() {
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState(""); 
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const handleSubmit = () => {
    const producto = {
      nombre,
      negocio,
      precio: parseFloat(precio),
      tipo,
      receta: selectedRecipe, 
    };

    // Imprimir los datos en la consola
    console.log("Datos del producto:", producto);
  };

  return (
    <div>
      <ReusableDialog
        title="Crear Producto"
        description="Llena el formulario para crear un producto"
        submitButtonText="Crear Producto"
        trigger={
          <Button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <CirclePlus />
            <span>Crear Producto</span>
          </Button>
        }
        onSubmit={handleSubmit} 
      >
        <div className="space-y-6 gap-2">
          {/* Sección: Información del Producto */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold ">Nombre del Producto</Label>
                <Input
                  id="name"
                  placeholder="Ingresa el nombre del producto"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo" className="font-semibold ">Tipo de Producto</Label>
                <ReusableSelect
                  name="Tipo"
                  placeholder="Selecciona un tipo"
                  options={[
                    { value: "Producto Final", label: "Producto Final" },
                    { value: "Producto Base", label: "Producto Base" },
                  ]}
                  value={tipo}
                  onValueChange={setTipo} label={"Tipo"} disabled={false}/>
              </div>
            </div>
          </div>
          {/* Sección: Negocio y Precio */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="negocio" className="font-semibold ">Negocio</Label>
                <ReusableSelect
                  name="Negocio"
                  placeholder="Selecciona un negocio"
                  options={[
                    { value: "Mil Sabores", label: "Mil Sabores" },
                    { value: "Tortas Express", label: "Tortas Express" },
                  ]}
                  value={negocio}
                  onValueChange={setNegocio} label={"Negocio"} disabled={false} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio" className="font-semibold ">Precio (Bs.)</Label>
                <Input
                  id="precio"
                  type="number"
                  placeholder="Bs."
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Sección: Selección de Receta */}
          <div className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label className="font-semibold " htmlFor="receta">Selecciona una Receta</Label>
              <ReusableSelect
                name="Receta"
                placeholder="Seleccionar receta"
                options={recipes.map((recipe) => ({
                  value: recipe.id.toString(),
                  label: recipe.nombre,
                }))}
                value={selectedRecipe}
                onValueChange={setSelectedRecipe} label={"Receta"} disabled={false}/>
            </div>
          </div>
        </div>
      </ReusableDialog>
    </div>
  );
}