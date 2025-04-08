// Estructura para POST (registro)
export interface RecipePost {
  name: string;
  description: string;
  detalleBases: IngredienteDetalle[];
}

export interface IngredienteDetalle {
  ingredienteId: number;
  cantidad: number;
  unidad: string;
}

// Estructura para GET (respuesta del servidor)
export interface RecipeGetResponse {
  success: boolean;
  data: RecipeData;
  message: string;
}

export interface RecipeData {
  id: number;
  name: string;
  description: string | null;
  status: number;
  detalleBases: IngredienteDetalleGet[];
}

export interface IngredienteDetalleGet {
  id: number;
  ingredienteId: number;
  nombre_ingrediente: string;
  cantidad: number;
  unidad: string;
}
