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
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [productsWithRecipes, setProductsWithRecipes] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActiveProducts, setShowActiveProducts] = useState(true); // Estado para controlar qué productos se muestran

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtén los productos
        const products = await fetchProductData();
        if (!products) {
          throw new Error("No se pudieron cargar los productos.");
        }

        // Obtén los detalles de la receta para cada producto
        const productsWithRecipes = await Promise.all(
          products.map(async (product) => {
            if (product.recetaId) {
              const recipe = await fetchRecipeData(product.recetaId);
              return { ...product, recipe };
            }
            return product;
          })
        );

        setProductsWithRecipes(productsWithRecipes);
        console.log("Productos cargados:", productsWithRecipes);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar productos según el estado
  const filteredProducts = productsWithRecipes.filter((product) =>
    showActiveProducts ? product.status === 1 : product.status === 0
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-6 ">
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
                Gestión de Items
              </BreadcrumbPage>
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
        <ProductsActions
          onToggleActiveProducts={(showActive) => setShowActiveProducts(showActive)} // Pasar la función para alternar entre productos activos e inactivos
          onRefresh={() => {
            // Función para actualizar los productos
            setLoading(true);
            setError(null);
            fetchProductData().then((products) => {
              if (products) {
                setProductsWithRecipes(products);
                setLoading(false);
              } else {
                setError("No se pudieron cargar los productos.");
              }
            });

          }}
        />
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {loading ? (
          // Muestra skeletons mientras se cargan los datos
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-[200px] w-full rounded-lg" />
          ))
        ) : (
          // Muestra las tarjetas de productos cuando los datos están cargados
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}