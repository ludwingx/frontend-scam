import { Dispatch, SetStateAction } from "react";

export interface Ingredient {
  id: number;
  name: string;
  currentStock: number;
  unit: string;
  minStock: number;
}

export interface BaseProduct {
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

export interface BaseRequirement {
  baseId: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  image?: string;
  recipe: RecipeItem[];
  baseRequirements?: BaseRequirement[];
}

export interface MissingItem {
  id: number;
  missing: number;
}

export interface SelectedProduct extends Product {
  quantity: number;
  canProduce: boolean;
  missingIngredients: MissingItem[];
  missingBases: MissingItem[];
}

export type ProductionStatus = "pending" | "in_progress" | "completed";

export interface IngredientUsage {
  ingredient: Ingredient;
  amountUsed: number;
}

export interface BaseUsage {
  base: BaseProduct;
  amountUsed: number;
}

export interface MissingIngredient {
  ingredient: Ingredient;
  missingAmount: number;
}

export interface MissingBase {
  base: BaseProduct;
  missingAmount: number;
}

export interface Production {
  id: number;
  name: string;
  products: SelectedProduct[];
  status: ProductionStatus;
  createdAt: string;
  dueDate: string;
  missingIngredients?: MissingIngredient[];
  missingBases?: MissingBase[];
  ingredientsUsage?: IngredientUsage[];
  basesUsage?: BaseUsage[];
}

// Props interfaces
export interface ProductListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  selectedProducts: SelectedProduct[];
  setSelectedProducts: SetSelectedProducts;
}

export interface ProductionCardProps {
  production: Production;
  ingredients: Ingredient[];
  bases: BaseProduct[];
  onStartProduction: (id: number) => void;
  showIngredientsUsage: boolean;
  onToggleIngredientsUsage: () => void;
}

export interface ProductionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProducts: SelectedProduct[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedProduct[]>>;
  ingredients: Ingredient[];
  bases: BaseProduct[];
  dueDate: string;
  setDueDate: (date: string) => void;
  addProduction: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  missingIngredients: MissingIngredient[];
  missingBases: MissingBase[];
  currentIngredientsUsage: IngredientUsage[];
  currentBasesUsage: BaseUsage[];
  showPurchaseDialog: boolean;
  setShowPurchaseDialog: (show: boolean) => void;
}

export interface ProductionSummaryProps {
  selectedProducts: SelectedProduct[];
  currentIngredientsUsage: IngredientUsage[];
  currentBasesUsage: BaseUsage[];
  missingIngredients: MissingIngredient[];
  missingBases: MissingBase[];
}

// Type aliases
export type SetSelectedProducts = Dispatch<SetStateAction<SelectedProduct[]>>;
export type SetProducts = Dispatch<SetStateAction<Product[]>>;