"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/data-table";

import { columns } from "./columns";
import { fetchActualIngredientsData } from "@/services/fetchActualIngredientsData";
import { Ingredient } from "@/types/ingredients";

export default function IngredientsPage() {
  const [data, setData] = useState<Ingredient[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para cargar los Insumos
  const loadIngredients = async () => {
    console.log("Cargando Insumos...");
    try {
      const ingredients = await fetchActualIngredientsData();
      if (ingredients) {
        setData(ingredients);
        console.log("Insumos cargados:", ingredients);
      } else {
        setErrorMessage(
          "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(
        "No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  // Ordenar los datos por ID descendente
  const sortedData = data.sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="hover:text-primary">
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium">
                Gestión de Insumos
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Título dinámico */}
        <h2 className="text-3xl font-semibold">Gestión de Insumos</h2>
        <small className="text-sm text-muted-foreground pl-1">
          Aquí podrás visualizar todos los insumos registrados en el sistema.
        </small>
      </div>

      {/* Tabla de insumos */}
      <div className="flex flex-col gap-6 p-6 bg-card rounded-lg border border-border shadow-sm">
        {errorMessage ? (
          <p className="text-destructive">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns}
            data={sortedData}
            enableFilter
            filterPlaceholder="Filtrar por nombre..."
            filterColumn="nombre"
            enablePagination
            enableRowSelection
            enableColumnVisibility
          />
        )}
      </div>
    </div>
  );
}
