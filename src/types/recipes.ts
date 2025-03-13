export interface Recipe {
  id: number;
  name: string;
  status: string;
  ingredientes: Array<{
    ingredienteId: number; // Cambiado a ingredienteId
    cantidad: number;
    unidad: string;
  }>;
}