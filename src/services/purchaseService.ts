"use client";

interface PurchaseItem {
  id_compra: number;
  id_insumo: number;
  fecha_compra: string;
  proveedor: string | null;
  estado: 'Pendiente' | 'Pagado' | 'Cancelado';
  fecha_pagado: string | null;
  metodo_pago: string | null;
  observaciones: string | null;
  cantidad: string;
  precio_unitario: string;
  monto_total: string;
  nombre_insumo?: string;
  unidad_medida?: string;
}

// Función para generar datos ficticios
const generateMockPurchases = (): PurchaseItem[] => {
  const mockPurchases: PurchaseItem[] = [];
  const today = new Date();
  const suppliers = ['Proveedor A', 'Proveedor B', 'Proveedor C'];
  const ingredients = [
    { id: 1, name: 'Harina', unit: 'kg' },
    { id: 2, name: 'Azúcar', unit: 'kg' },
    { id: 3, name: 'Huevos', unit: 'unidad' },
    { id: 4, name: 'Leche', unit: 'lt' },
    { id: 5, name: 'Mantequilla', unit: 'kg' }
  ];
  const statuses = ['Pendiente', 'Pagado', 'Cancelado'] as const;

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const purchaseDate = new Date(today);
    purchaseDate.setDate(today.getDate() - daysAgo);
    
    const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const unitPrice = Math.random() * 10 + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    mockPurchases.push({
      id_compra: i + 1,
      id_insumo: ingredient.id,
      fecha_compra: purchaseDate.toISOString(),
      proveedor: suppliers[Math.floor(Math.random() * suppliers.length)],
      estado: status,
      fecha_pagado: status === 'Pagado' ? 
        new Date(purchaseDate.getTime() + (Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString() : 
        null,
      metodo_pago: ['efectivo', 'transferencia', 'tarjeta'][Math.floor(Math.random() * 3)] || null,
      observaciones: Math.random() > 0.7 ? `Observación de ejemplo para la compra ${i + 1}` : null,
      cantidad: quantity.toString(),
      precio_unitario: unitPrice.toFixed(2),
      monto_total: (quantity * unitPrice).toFixed(2),
      nombre_insumo: ingredient.name,
      unidad_medida: ingredient.unit
    });
  }
  
  return mockPurchases;
};

export const getPurchases = async (filters: {
  fecha_desde?: string;
  fecha_hasta?: string;
  estado?: 'Pendiente' | 'Pagado' | 'Cancelado';
  id_insumo?: number;
} = {}): Promise<PurchaseItem[]> => {
  // Simular un pequeño retardo para hacerlo más realista
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filtrar datos ficticios según los filtros proporcionados
  const mockData = generateMockPurchases();
  
  return mockData.filter(purchase => {
    if (filters.estado && purchase.estado !== filters.estado) return false;
    if (filters.id_insumo && purchase.id_insumo !== filters.id_insumo) return false;
    
    if (filters.fecha_desde || filters.fecha_hasta) {
      const purchaseDate = new Date(purchase.fecha_compra).setHours(0, 0, 0, 0);
      
      if (filters.fecha_desde) {
        const desde = new Date(filters.fecha_desde).setHours(0, 0, 0, 0);
        if (purchaseDate < desde) return false;
      }
      
      if (filters.fecha_hasta) {
        const hasta = new Date(filters.fecha_hasta).setHours(23, 59, 59, 999);
        if (purchaseDate > hasta) return false;
      }
    }
    
    return true;
  });
};

// Funciones mock para mantener compatibilidad con el resto de la aplicación
export const registerPurchase = async () => {
  return { success: true, message: 'Compra registrada exitosamente (simulado)' };
};

export const payPurchase = async () => {
  return { success: true, message: 'Pago registrado exitosamente (simulado)' };
};

export const cancelPurchase = async () => {
  return { success: true, message: 'Compra anulada exitosamente (simulado)' };
};
