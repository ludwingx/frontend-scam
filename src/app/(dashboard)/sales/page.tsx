"use client";

import { useEffect, useState } from "react";
import BreadcrumbNav from "./components/BreadcrumbNav";
import FutureSalesTable from "./components/FutureSalesTable";
import Header from "./components/Header";
import TodaySalesTable from "./components/TodaySalesTable";
import { Sale } from "@/types/sales";

// Función para obtener y mapear las ventas al formato correcto
async function getSalesData(): Promise<Sale[]> {
  try {
    const res = await fetch(
      "https://torta-express-production.af9gwe.easypanel.host/webhook/server?accion=venta",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            "Administrador:429683C4C977415CAAFCCE10F7D57E11"
          ).toString("base64")}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    console.log("[Ventas API] Respuesta:", data);

    const arr = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    // Mapear al formato Sale que esperan los componentes
    const mapped: Sale[] = arr.map((s: any, index: number) => ({
      id_venta: s.id_venta || s.id || index,
      id_usuario_registro: s.id_usuario_registro || 0,
      nombre_usuario_registro: s.nombre_usuario_registro || "Administrador",
      id_cliente: s.id_cliente || 0,
      nombre_cliente: s.nombre_cliente || "Cliente no especificado",
      fecha_entrega_estimada: s.fecha_entrega_estimada || s.fecha_registro || new Date().toISOString(),
      fecha_entrega_real: s.fecha_entrega_real || null,
      observaciones: s.observaciones || "",
      fecha_registro: s.fecha_registro || new Date().toISOString(),
      fecha_actualizacion: s.fecha_actualizacion || new Date().toISOString(),
      id_estado_entrega: s.id_estado_entrega || 1,
      nombre_estado_entrega: s.nombre_estado_entrega || "Pendiente",
      entrega: s.entrega ? {
        id_entrega: s.entrega.id_entrega || 0,
        id_tipo_entrega: s.entrega.id_tipo_entrega || 1,
        nombre_tipo_entrega: s.entrega.nombre_tipo_entrega || "Delivery",
        direccion_entrega: s.entrega.direccion_entrega || "",
        nombre_receptor: s.entrega.nombre_receptor || s.nombre_cliente || "Cliente",
        telefono_receptor: s.entrega.telefono_receptor || "",
        costo_delivery: s.entrega.costo_delivery || 0,
        estado_delivery: s.entrega.estado_delivery || "Pendiente",
        nombre_sucursal: s.entrega.nombre_sucursal || null,
        observaciones: s.entrega.observaciones || "",
        costo_total: s.entrega.costo_total || s.total_general || 0
      } : {
        id_entrega: 0,
        id_tipo_entrega: 1,
        nombre_tipo_entrega: "Delivery",
        direccion_entrega: "",
        nombre_receptor: s.nombre_cliente || "Cliente",
        telefono_receptor: "",
        costo_delivery: 0,
        estado_delivery: "Pendiente",
        nombre_sucursal: null,
        observaciones: "",
        costo_total: s.total_general || 0
      },
      detalles: Array.isArray(s.detalles) ? s.detalles.map((d: any) => ({
        id_detalle: d.id_detalle || 0,
        id_producto: d.id_producto || 0,
        sabor_producto: d.sabor_producto || "Producto",
        tamaño_producto: d.tamaño_producto || "Tamaño no especificado",
        precio_producto: d.precio_producto || 0,
        id_negocio: d.id_negocio || 0,
        nombre_negocio: d.nombre_negocio || "Negocio",
        cantidad: d.cantidad || 1,
        precio_unitario_venta: d.precio_unitario_venta || 0,
        subtotal: d.subtotal || 0,
        frase: d.frase,
        personalizacion: d.personalizacion
      })) : [],
      total_general: s.total_general || s.total || 0,
      tempId: `sale-${s.id_venta || s.id || index}-${index}`,
      id_estado: s.id_estado_entrega || 1
    }));

    console.log("[Ventas API] Mapeado:", mapped);
    return mapped;
  } catch (error) {
    console.error("[Ventas API] Error:", error);
    return [];
  }
}

// Función para separar ventas por fecha
function separateSalesByDate(sales: Sale[]): { todaySales: Sale[], futureSales: Sale[] } {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  console.log("Hoy:", todayString, "Mañana:", tomorrowString);

  const todaySales: Sale[] = [];
  const futureSales: Sale[] = [];

  sales.forEach((sale, index) => {
    if (!sale.fecha_entrega_estimada) {
      console.log(`Venta ${index}: Sin fecha de entrega`);
      futureSales.push(sale);
      return;
    }

    try {
      const saleDate = new Date(sale.fecha_entrega_estimada);
      const saleDateString = saleDate.toISOString().split('T')[0];
      
      console.log(`Venta ${index}: Fecha ${saleDateString}, ID: ${sale.id_venta}`);

      if (isNaN(saleDate.getTime())) {
        console.log(`Venta ${index}: Fecha inválida`);
        futureSales.push(sale);
        return;
      }

      // Si es hoy
      if (saleDateString === todayString) {
        console.log(`Venta ${index}: ES DE HOY`);
        todaySales.push(sale);
      } 
      // Si es mañana o después
      else if (saleDateString >= tomorrowString) {
        console.log(`Venta ${index}: ES FUTURA`);
        futureSales.push(sale);
      } else {
        console.log(`Venta ${index}: ES PASADA (no se incluye)`);
      }
    } catch (error) {
      console.error(`Error procesando venta ${index}:`, error);
      futureSales.push(sale);
    }
  });

  console.log(`Separadas: ${todaySales.length} ventas de hoy, ${futureSales.length} ventas futuras`);
  return { todaySales, futureSales };
}

export default function Page() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [todaySales, setTodaySales] = useState<Sale[]>([]);
  const [futureSales, setFutureSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesData().then((data) => {
      console.log("Datos obtenidos de API:", data.length, "ventas");
      setSales(data);
      const separated = separateSalesByDate(data);
      setTodaySales(separated.todaySales);
      setFutureSales(separated.futureSales);
      setLoading(false);
    });
  }, []);

  // Función para actualizar el estado de una venta
  const updateSaleStatus = (saleId: string, statusId: string) => {
    const newStatus = parseInt(statusId);
    
    // Solo actualizamos el id_estado_entrega, el nombre vendrá de la API de estados
    setSales(prev => prev.map(sale => 
      sale.tempId === saleId ? { 
        ...sale, 
        id_estado_entrega: newStatus
        // El nombre_estado_entrega se actualizará automáticamente desde los estados de la API
      } : sale
    ));

    setTodaySales(prev => prev.map(sale => 
      sale.tempId === saleId ? { 
        ...sale, 
        id_estado_entrega: newStatus
      } : sale
    ));

    setFutureSales(prev => prev.map(sale => 
      sale.tempId === saleId ? { 
        ...sale, 
        id_estado_entrega: newStatus
      } : sale
    ));

    console.log(`Actualizando venta ${saleId} a estado ${statusId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <BreadcrumbNav />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                Órdenes de Venta
              </h2>
              <small className="text-sm font-medium text-gray-600">
                Aquí podrás gestionar las órdenes de venta.
              </small>
            </div>
            <div className="flex justify-end">
              <Header />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Cargando ventas...</p>
          </div>
        </div>
      ) : sales.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          {/* TodaySalesTable - Solo ventas de hoy */}
          <div className="w-full min-w-0">
            <TodaySalesTable 
              sales={todaySales} 
              updateSaleStatus={updateSaleStatus}
            />
          </div>

          {/* FutureSalesTable - Solo ventas futuras (mañana en adelante) */}
          <div className="w-full min-w-0">
            <FutureSalesTable 
              sales={futureSales} 
              updateSaleStatus={updateSaleStatus}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white rounded-lg shadow">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay ventas registradas
          </h3>
          <p className="text-center text-gray-600">
            No se encontraron datos de ventas en el sistema.
          </p>
        </div>
      )}
    </div>
  );
}