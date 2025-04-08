import { Dispatch, SetStateAction } from "react";

export interface Ingredient {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  minStock: number;
}

export interface RecipeItem {
  ingredientId: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  image?: string;
  recipe: RecipeItem[];
}
export interface ProductListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  selectedProducts: Product[];
  setSelectedProducts: SetProducts;
}

export interface SelectedProduct extends Product {
  quantity: number;
  canProduce: boolean;
  missingIngredients: {
    ingredientId: number;
    missing: number;
  }[];
}
export type SetSelectedProducts = Dispatch<SetStateAction<SelectedProduct[]>>;
export type SetProducts = Dispatch<SetStateAction<Product[]>>;
export type ProductionStatus = "pending" | "in_progress" | "completed";

export interface Production {
  id: number;
  products: SelectedProduct[];
  status: ProductionStatus;
  createdAt: string;
  dueDate: string;
  missingIngredients?: MissingIngredient[];
  ingredientsUsage?: IngredientUsage[];
}

export interface ProductionCardProps {
  production: Production;
  onStartProduction: (id: number) => void;
  showIngredientsUsage: boolean;
  onToggleIngredientsUsage: () => void;
}

export interface IngredientUsage {
  ingredient: Ingredient;
  amountUsed: number;
}

export interface MissingIngredient {
  ingredientId: number;
  missing: number;
  ingredient: Ingredient;
  missingAmount: number;
}

export interface ProductionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: SelectedProduct[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedProduct[]>>;
  ingredients: Ingredient[];
  dueDate: string;
  setDueDate: (date: string) => void;
  addProduction: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  missingIngredients: MissingIngredient[];
  currentIngredientsUsage: IngredientUsage[];
  showPurchaseDialog: boolean;
  setShowPurchaseDialog: (show: boolean) => void;
}

export interface ProductionSummaryProps {
  selectedProducts: SelectedProduct[];
  currentIngredientsUsage: IngredientUsage[];
  missingIngredients: MissingIngredient[];
}