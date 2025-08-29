"use client";

import { getCookie } from "cookies-next";

// Verify API URL is set
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.error('NEXT_PUBLIC_API_URL is not set in environment variables');
  throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
}

console.log('Using API URL:', API_URL);

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
    console.error("Error registering purchase:", error);
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
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText
      });
      throw new Error(`Error al marcar la compra como pagada: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Purchase paid successfully:', { data });
    return data;
  } catch (error) {
    console.error("Error paying purchase:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
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
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText
      });
      throw new Error(`Error al anular la compra: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Purchase cancelled successfully:', { data });
    return data;
  } catch (error) {
    console.error("Error canceling purchase:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
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
    
    // Set default date range to last 30 days if no dates provided
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    // Prepare request body with default dates if not provided
    const requestBody = {
      fecha_desde: filters.fecha_desde || formatDate(thirtyDaysAgo),
      fecha_hasta: filters.fecha_hasta || formatDate(today),
      estado: filters.estado,
      id_insumo: filters.id_insumo,
    };

    const endpoint = '/api/ver_compras';
    const url = `${API_URL}${endpoint}`;
    
    console.log('Preparing request to:', url);
    console.log('Request body:', requestBody);
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    };

    console.log('Fetching purchases with:', { url, options });
    
    let response;
    try {
      console.log('Sending request to:', url);
      response = await fetch(url, options);
      console.log('Received response with status:', response.status);
    } catch (networkError) {
      console.error('Network error when calling API:', {
        url,
        error: networkError,
        message: networkError instanceof Error ? networkError.message : 'Unknown network error',
      });
      throw new Error(`No se pudo conectar al servidor. Por favor verifica tu conexión a internet.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText
      });
      throw new Error(`Error al obtener las compras: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    // The API returns data in a { success, message, data } structure
    if (!data || !data.success) {
      console.error('API returned unsuccessful response:', data);
      return [];
    }
    
    // Extract the purchases array from the response data
    const purchases = Array.isArray(data.data) ? data.data : [];
    console.log(`Returning ${purchases.length} purchases`);
    
    // Log first purchase details if available
    if (purchases.length > 0) {
      console.log('First purchase sample:', {
        id_compra: purchases[0].id_compra,
        fecha_compra: purchases[0].fecha_compra,
        proveedor: purchases[0].proveedor,
        cantidad: purchases[0].cantidad,
        precio_unitario: purchases[0].precio_unitario,
        monto_total: purchases[0].monto_total
      });
    }
    
    return purchases;
  } catch (error) {
    console.error("Error fetching purchases:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
