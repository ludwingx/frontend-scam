"use client";

import { useEffect, useState } from "react";
import { fetchProductData } from "@/services/fetchProductsData";
import { fetchRecipeData } from "@/services/fetchRecipesData";
import { ProductCard } from "./ProductCard";
import { ProductsActions } from "./ProductsActions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Product } from "@/types/products";

export default function Page() {
  const [productsWithRecipes, setProductsWithRecipes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtén los productos
        const products = await fetchProductData();

        // Obtén los detalles de la receta para cada producto
        const productsWithRecipes = await Promise.all(
          products.map(async (product) => {
            if (product.recetaId) {
              const recipe = await fetchRecipeData(product.recetaId); // Pasa el recetaId
              return { ...product, recipe };
            }
            return product;
          })
        );

        setProductsWithRecipes(productsWithRecipes);
        setLoading(false);
        console.log("Productos cargados:", productsWithRecipes);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("Error al obtener los productos");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Título de la página */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Productos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold text-gray-900">Productos</h2>
        <p className="leading-7 [&:not(:first-child)]">
          Aquí podrás gestionar los productos.
        </p>
      </div>

      {/* Descripción y botón de crear producto */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 mb-6">
        <ProductsActions />
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {productsWithRecipes.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}