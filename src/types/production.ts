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
    id: number;
    name: string;
    description: string;
    brand: string;
    image?: string;
    recipe: RecipeItem[];
  }
  
  export interface SelectedProduct extends Product {
    quantity: number | null;
    canProduce: boolean;
    missingIngredients?: {
      ingredientId: number;
      missing: number;
    }[];
  }
  
  export type ProductionStatus = "pending" | "in_progress" | "completed";
  
  export interface Production {
    id: number;
    products: SelectedProduct[];
    status: ProductionStatus;
    createdAt: string;
    dueDate: string;
    missingIngredients?: {
      ingredient: Ingredient;
      missingAmount: number;
    }[];
    ingredientsUsage?: {
      ingredient: Ingredient;
      amountUsed: number;
    }[];
  }
  
  export interface ProductionCardProps {
    production: Production;
    ingredients: Ingredient[];
    onStartProduction: (id: number) => void;
    showIngredientsUsage: boolean;
    onToggleIngredientsUsage: () => void;
  }
  
  export interface ProductionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProducts: SelectedProduct[];
    setSelectedProducts: (products: SelectedProduct[]) => void;
    ingredients: Ingredient[];
    setIngredients: (ingredients: Ingredient[]) => void;
    dueDate: string;
    setDueDate: (date: string) => void;
    addProduction: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredProducts: Product[];
    missingIngredients: { ingredient: Ingredient; missingAmount: number }[];
    currentIngredientsUsage: { ingredient: Ingredient; amountUsed: number }[];
    showPurchaseDialog: boolean;
    setShowPurchaseDialog: (show: boolean) => void;
  }