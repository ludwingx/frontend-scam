"use client";

import { getCookie } from "cookies-next";

// Verify API URL is set
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
}

interface PurchaseItem {
  id_insumo: number;
  cantidad: number;
  precio_unitario: number;
  proveedor?: string;
  observaciones?: string;
}

interface PurchasePaymentItem {
  id_compra: number;
  metodo_pago?: string;
  fecha_pagado?: string;
}

interface PurchaseAnulacionItem {
  id_compra: number;
  observaciones?: string;
}

export const registerPurchase = async (items: PurchaseItem[]) => {
  try {
    const token = getCookie("token");
    const response = await fetch(`${API_URL}/api/registrar_compra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        compras: items.map(item => ({
          id_insumo: item.id_insumo,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          ...(item.proveedor && { proveedor: item.proveedor }),
          ...(item.observaciones && { observaciones: item.observaciones }),
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Error al registrar la compra");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const payPurchase = async (payments: PurchasePaymentItem[]) => {
  try {
    const token = getCookie("token");
    const response = await fetch(`${API_URL}/api/pagar_compra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        compras: payments.map(payment => ({
          id_compra: payment.id_compra,
          ...(payment.metodo_pago && { metodo_pago: payment.metodo_pago }),
          ...(payment.fecha_pagado && { fecha_pagado: payment.fecha_pagado }),
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al marcar la compra como pagada: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const cancelPurchase = async (cancellations: PurchaseAnulacionItem[]) => {
  try {
    const token = getCookie("token");
    const response = await fetch(`${API_URL}/api/anular_compra`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        compras: cancellations.map(cancel => ({
          id_compra: cancel.id_compra,
          ...(cancel.observaciones && { observaciones: cancel.observaciones }),
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al anular la compra: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPurchases = async (filters: {
  fecha_desde?: string;
  fecha_hasta?: string;
  estado?: 'Registrado' | 'Pagado' | 'Anulado';
  id_insumo?: number;
} = {}) => {
  try {
    const token = getCookie("token");

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const requestBody = {
      fecha_desde: filters.fecha_desde || formatDate(thirtyDaysAgo),
      fecha_hasta: filters.fecha_hasta || formatDate(today),
      estado: filters.estado,
      id_insumo: filters.id_insumo,
    };

    const endpoint = '/api/ver_compras';
    const url = `${API_URL}${endpoint}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    };

    let response;
    try {
      response = await fetch(url, options);
    } catch {
      throw new Error(`No se pudo conectar al servidor. Por favor verifica tu conexión a internet.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener las compras: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    if (!data || !data.success) return [];

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    throw error;
  }
};
