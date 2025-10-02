// Shared sales domain types

export interface TodaySalesTableProps {
  sales?: SaleInput[];
  updateSaleStatus?: (id: string, statusId: string) => void;
}

export interface ProductDetail {
  id_detalle: number;
  id_producto: number;
  sabor_producto: string;
  tamaño_producto: string;
  precio_producto: number;
  id_negocio: number;
  nombre_negocio: string;
  cantidad: number;
  precio_unitario_venta: number;
  subtotal: number;
  frase?: {
    frase: string;
    costo_frase: number;
    comentario_frase: string;
  };
  personalizacion?: {
    imagen_base64: string;
    costo_personalizacion: number;
    comentario_personalizacion: string;
  };
}

export interface DeliveryInfo {
  id_entrega: number;
  id_tipo_entrega: number;
  nombre_tipo_entrega: string;
  direccion_entrega: string;
  nombre_receptor: string;
  telefono_receptor: string;
  costo_delivery: number;
  estado_delivery: string;
  nombre_sucursal: string | null;
  observaciones: string;
  costo_total: number;
}

export interface Sale {
  fecha_creacion: any;
  id_venta: number;
  id_usuario_registro: number;
  nombre_usuario_registro: string;
  id_cliente: number;
  nombre_cliente: string;
  fecha_entrega_estimada: string;
  fecha_entrega_real: string | null;
  observaciones: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  id_estado_entrega: number;
  nombre_estado_entrega: string;
  entrega: DeliveryInfo;
  detalles: ProductDetail[];
  total_general: number;
  tempId: string;
  id_estado?: number;
}

// Input shape that comes from API without tempId and with nullable address
export type SaleInput = Omit<Sale, 'tempId'> & {
  id_venta: number;
  id_estado_entrega: number;
  entrega: Omit<DeliveryInfo, 'direccion_entrega'> & {
    direccion_entrega: string | null;
  };
};
