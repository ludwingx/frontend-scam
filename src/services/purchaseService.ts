"use client";

import axios from "axios";

export interface PurchaseItem {
  id_compra: number;
  id_insumo: number;
  fecha_compra: string;
  proveedor: string | null;
  estado: "Pendiente" | "Pagado" | "Cancelado";
  fecha_pagado: string | null;
  metodo_pago: string | null;
  observaciones: string | null;
  cantidad: string;
  precio_unitario: string;
  monto_total: string;
  nombre_insumo?: string;
  unidad_medida?: string;
}

/**
 * Obtener todas las compras con filtros opcionales
 */
export const getPurchases = async (filters: {
  fecha_desde?: string;
  fecha_hasta?: string;
  estado?: "Pendiente" | "Pagado" | "Cancelado";
  id_insumo?: number;
} = {}): Promise<PurchaseItem[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data } = await axios.get(`${API_URL}/purchases`, { params: filters });
    return data;
  } catch (error) {
    console.error("❌ Error al obtener compras:", error);
    throw error;
  }
};

/**
 * Registrar una nueva compra
 */
export const registerPurchase = async (purchaseItems: Omit<PurchaseItem, "id_compra">[]) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data } = await axios.post(`${API_URL}/purchases`, { items: purchaseItems });
    return data;
  } catch (error) {
    console.error("❌ Error al registrar compra:", error);
    throw error;
  }
};

/**
 * Marcar una compra como pagada
 */
export const payPurchase = async (id_compra: number) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data } = await axios.patch(`${API_URL}/purchases/${id_compra}/pay`);
    return data;
  } catch (error) {
    console.error("❌ Error al pagar compra:", error);
    throw error;
  }
};

/**
 * Cancelar una compra
 */
export const cancelPurchase = async (id_compra: number) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const { data } = await axios.patch(`${API_URL}/purchases/${id_compra}/cancel`);
    return data;
  } catch (error) {
    console.error("❌ Error al cancelar compra:", error);
    throw error;
  }
};
