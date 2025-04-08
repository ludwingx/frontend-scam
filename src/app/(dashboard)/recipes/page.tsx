"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RecipeActions } from "./RecipeActions";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { fetchRecipeData, updateRecipe } from "@/services/fetchRecipesData";
import { fetchSimpleRecipeData, updateSimpleRecipe } from "@/services/fetchSimpleRecipesData";
import { toast } from "sonner";
import { columns } from "./columns";
import { fetchIngredientsData } from "@/services/fetchIngredientsData";
import { Ingredient } from "@/types/ingredients";
import { RecipeData, IngredienteDetalleGet } from "@/types/recipes";

type CombinedRecipe = RecipeData & {
  type: 'simple' | 'compound';
  ingredientes?: IngredienteDetalleGet[];
  detalleRecetas?: (IngredienteDetalleGet & { recetaSimpleId?: number })[];
};

export default function RecipePage() {
  const [data, setData] = useState<CombinedRecipe[]>([]);
  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
  const [simpleRecipesData, setSimpleRecipesData] = useState<CombinedRecipe[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showActiveRecipes, setShowActiveRecipes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllRecipes = async () => {
    setIsLoading(true);
    try {
      const [compoundRecipes, simpleRecipes] = await Promise.all([
        fetchRecipeData(),
        fetchSimpleRecipeData()
      ]);

      // Procesar recetas compuestas
      const processedCompound = Array.isArray(compoundRecipes) 
        ? compoundRecipes.map(r => ({ 
            ...r, 
            type: 'compound' as const,
            detalleRecetas: r.detalleRecetas?.map(d => ({
              ...d,
              recetaSimpleId: d.recetaSimpleId
            }))
          }))
        : [{ 
            ...compoundRecipes, 
            type: 'compound' as const,
            detalleRecetas: compoundRecipes.detalleRecetas?.map(d => ({
              ...d,
              recetaSimpleId: d.recetaSimpleId
            }))
          }];

      // Procesar recetas simples
      const processedSimple = Array.isArray(simpleRecipes)
        ? simpleRecipes.map(r => ({
            ...r,
            type: 'simple' as const,
            detalleBases: r.detalleBases?.map(b => ({
              ...b,
              nombre_ingrediente: b.nombre_ingrediente || ingredientsData.find(i => i.id === b.ingredienteId)?.name || 'Desconocido'
            }))
          }))
        : [{
            ...simpleRecipes,
            type: 'simple' as const,
            detalleBases: simpleRecipes.detalleBases?.map(b => ({
              ...b,
              nombre_ingrediente: b.nombre_ingrediente || ingredientsData.find(i => i.id === b.ingredienteId)?.name || 'Desconocido'
            }))
          }];

      setData([...processedCompound, ...processedSimple]);
      setSimpleRecipesData(processedSimple);
    } catch (error) {
      console.error("Error loading recipes:", error);
      setErrorMessage("Error al cargar las recetas. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const data = await fetchIngredientsData();
      setIngredientsData(data || []);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      toast.error("Error al cargar los ingredientes. Por favor, inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    loadAllRecipes();
    loadIngredients();
  }, []);

  const updateRecipeInTable = async (updatedRecipe: CombinedRecipe) => {
    try {
      if (updatedRecipe.type === 'simple') {
        await updateSimpleRecipe({
          id: updatedRecipe.id,
          name: updatedRecipe.name,
          description: updatedRecipe.description || '',
          status: updatedRecipe.status,
          detalleBases: updatedRecipe.detalleBases?.map(i => ({
            ingredienteId: i.ingredienteId,
            cantidad: i.cantidad,
            unidad: i.unidad
          })) || []
        });
      } else {
        await updateRecipe({
          id: updatedRecipe.id,
          name: updatedRecipe.name,
          status: updatedRecipe.status,
          detalleRecetas: updatedRecipe.detalleRecetas?.map(i => ({
            ingredienteId: i.ingredienteId,
            recetaSimpleId: i.recetaSimpleId,
            cantidad: i.cantidad,
            unidad: i.unidad
          })) || []
        });
      }

      setData(prev => prev.map(r => 
        r.id === updatedRecipe.id ? updatedRecipe : r
      ));

      if (updatedRecipe.type === 'simple') {
        setSimpleRecipesData(prev => prev.map(r => 
          r.id === updatedRecipe.id ? updatedRecipe : r
        ));
      }

      toast.success(`Receta "${updatedRecipe.name}" actualizada correctamente`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Error al actualizar la receta. Por favor, inténtalo de nuevo.");
    }
  };

  const filteredData = data.filter(recipe => 
    showActiveRecipes ? recipe.status === 1 : recipe.status === 0
  );

  const handleToggleActiveRecipes = (showActive: boolean) => {
    setShowActiveRecipes(showActive);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background text-foreground">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="hover:text-primary">
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="hover:text-primary">
                Gestión de Items
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage>Recetas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-3xl font-semibold">Recetas</h2>
        <small className="text-sm text-muted-foreground">
          Aquí podrás gestionar las recetas simples y compuestas
        </small>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row justify-end items-end md:items-center pb-4">
        <RecipeActions
          onToggleActiveRecipes={handleToggleActiveRecipes}
          onRefresh={loadAllRecipes}
          showActive={showActiveRecipes}
        />
      </div>
      
      <div className="flex flex-col gap-6 p-6 bg-card rounded-lg border border-border shadow-sm">
        {errorMessage ? (
          <p className="text-destructive">{errorMessage}</p>
        ) : (
          <DataTable
            columns={columns(updateRecipeInTable, ingredientsData, simpleRecipesData)}
            data={filteredData}
            isLoading={isLoading}
            enableFilter
            filterPlaceholder="Filtrar por nombre o tipo..."
            filterColumn="name"
            enablePagination
            enableRowSelection
            enableColumnVisibility
            className="bg-card"
          />
        )}
      </div>
    </div>
  );
}