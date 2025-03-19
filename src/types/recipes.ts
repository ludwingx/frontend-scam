export interface Recipe {
  id: number;
  name: string;
  status: number;
  detalleRecetas: Array<{
    id: number;
    ingredienteId: number;
    nombre_ingrediente: string;
    cantidad: number;
    unidad: string;
  }>;
  ingredientes?: Array<{ // Añadir esta propiedad
    ingredienteId: number;
    cantidad: number;
    unidad: string;
  }>;
}