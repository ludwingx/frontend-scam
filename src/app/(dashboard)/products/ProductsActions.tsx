"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { ReusableSelect } from "@/components/ReusableSelect";
import { fetchBusinessData } from "@/services/fetchBusinessData";
import { fetchRecipeData } from "@/services/fetchRecipesData";
import { fetchCategoryData } from "@/services/fetchCategoryData";
import { toast } from "sonner";
import { createProduct } from "@/services/fetchProductsData";
import { Product } from "@/types/products";
import { ReusableDialogWidth } from "@/components/ReusableDialogWidth";
import Image from 'next/image';
interface ProductsActionsProps {
  onRefresh: () => void; // Prop para actualizar la lista de productos
  onToggleActiveProducts: (showActive: boolean) => void; // Prop para alternar entre productos activos e inactivos
}

export function ProductsActions({ onRefresh, onToggleActiveProducts }: ProductsActionsProps) {
  const [nombre, setNombre] = useState("");
  const [negocio, setNegocio] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar la apertura/cierre del diálogo
  const [showActiveProducts, setShowActiveProducts] = useState(true); // Estado para controlar qué productos se muestran
  const [image, setImage] = useState<File | null>(null); // Estado para almacenar la imagen seleccionada
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Estado para la previsualización de la imagen

  // Estados para almacenar los datos del backend
  const [businesses, setBusinesses] = useState<{ id: number; name: string }[]>([]);
  const [category, setCategory] = useState<{ id: number; name: string }[]>([]);
  const [recipes, setRecipes] = useState<{ id: number; nombre: string }[]>([]);

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener negocios
        const businessesData = await fetchBusinessData();
        const filteredBusinesses = businessesData?.filter(business => business.status === 1);
        setBusinesses(filteredBusinesses || []);

        // Obtener categorías
        const categoryData = await fetchCategoryData();
        const filteredCategories = categoryData?.filter(category => category.status === 1);
        setCategory(filteredCategories || []);

        // Obtener recetas
        const recipesData = await fetchRecipeData();
        const filteredRecipes = Array.isArray(recipesData) ? recipesData.filter((recipe: { status: number }) => recipe.status === 1) : null;
        setRecipes(
          filteredRecipes
            ? filteredRecipes.map((recipe) => ({ id: recipe.id, nombre: recipe.name }))
            : Array.isArray(recipesData)
              ? recipesData.map((recipe: { id: number; name: string }) => ({ id: recipe.id, nombre: recipe.name }))
              : []
        );
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar los datos. Por favor, inténtalo de nuevo.");
      }
    };

    loadData();
  }, []);

  // Función para manejar la selección de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Crear una URL para la previsualización
      } else {
        toast.error("Por favor, selecciona un archivo de imagen válido.");
      }
    }
  };

  // Función para eliminar la imagen seleccionada
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Por favor, selecciona una imagen para el producto.");
      return;
    }

    const formData = new FormData();
    formData.append("name", nombre);
    formData.append("businessId", negocio);
    formData.append("price", precio);
    formData.append("categoryId", tipo);
    formData.append("recipeId", selectedRecipe);
    formData.append("status", "1"); // Por defecto, el producto se crea como activo
    formData.append("file", image); // Agregar la imagen al FormData

    try {
      const newProduct = await createProduct(formData as unknown as Product);
      if (newProduct) {
        toast.success(`Producto "${newProduct.name}" creado exitosamente.`);
        setIsDialogOpen(false); // Cerrar el diálogo
        onRefresh(); // Actualizar la lista de productos
      } else {
        throw new Error("No se pudo crear el producto.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error al crear el producto. Por favor, inténtalo de nuevo.");
    }
  };

  const handleToggleActiveProducts = () => {
    const newShowActiveProducts = !showActiveProducts;
    setShowActiveProducts(newShowActiveProducts);
    onToggleActiveProducts(newShowActiveProducts); // Notificar al componente padre
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón para alternar entre productos activos e inactivos */}
      <Button
        onClick={handleToggleActiveProducts}
        className={showActiveProducts ? "bg-blue-500 text-white hover:bg-blue-500/90" : "bg-violet-500 text-white hover:bg-violet-500/90"}
      >
        {showActiveProducts ? "Ver Inactivos" : "Ver Activos"}
      </Button>

      {/* Diálogo para crear un producto */}
      <ReusableDialogWidth
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
        onClose={() => setIsDialogOpen(false)}
        isOpen={isDialogOpen} // Pasar el estado actual del diálogo
      >
        {/* Formulario */}
        <div className="space-y-6 gap-2">
  {/* Sección: Información del Producto */}
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold">
          Nombre del Producto
        </Label>
        <Input
          id="name"
          placeholder="Ingresa el nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipo" className="font-semibold">
          Tipo de Producto
        </Label>
        <ReusableSelect
          name="Tipo"
          placeholder="Selecciona un tipo"
          options={category.map((category) => ({
            value: category.id.toString(),
            label: category.name,
          }))}
          value={tipo}
          onValueChange={setTipo}
          label={"Tipo"}
          disabled={false}
        />
      </div>
    </div>
  </div>

  {/* Sección: Negocio y Precio */}
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="negocio" className="font-semibold">
          Negocio
        </Label>
        <ReusableSelect
          name="Negocio"
          placeholder="Selecciona un negocio"
          options={businesses.map((business) => ({
            value: business.id.toString(),
            label: business.name,
          }))}
          value={negocio}
          onValueChange={setNegocio}
          label={"Negocio"}
          disabled={false}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="precio" className="font-semibold">
          Precio (Bs.)
        </Label>
        <Input
          id="precio"
          type="number"
          placeholder="Bs."
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  </div>

  {/* Sección: Selección de Receta */}
  <div className="space-y-4 pb-6">
    <div className="space-y-2">
      <Label className="font-semibold" htmlFor="receta">
        Selecciona una Receta
      </Label>
      <ReusableSelect
        name="Receta"
        placeholder="Seleccionar receta"
        options={recipes.map((recipe) => ({
          value: recipe.id.toString(),
          label: recipe.nombre,
        }))}
        value={selectedRecipe}
        onValueChange={setSelectedRecipe}
        label={"Receta"}
        disabled={false}
      />
    </div>
  </div>

  {/* Sección: Carga de imagen */}
  <div className="space-y-4 pb-6">
    <div className="space-y-2">
      <Label className="font-semibold" htmlFor="image">
        Imagen del Producto
      </Label>
      <div className="flex flex-col items-center gap-4">
        {imagePreview ? (
          <div className="relative">
            <Image 
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
        <label
          htmlFor="image"
          className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
        >
          Elegir archivo
        </label>
        <Input
          id="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  </div>
</div>
      </ReusableDialogWidth>
    </div>
  );
}