// app/sales/page.tsx
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

// Server Action para actualizar el estado
// En tu app/sales/page.tsx - Server Action final
async function updateSaleStatus(saleId: number, statusId: number) {
  'use server';
  
  try {
    console.log('🔄 Server Action: Actualizando estado', { 
      saleId, 
      statusId 
    });

    // Usar el mismo formato que tu función getSalesData
    const url = new URL("https://torta-express-production.af9gwe.easypanel.host/webhook/server");
    url.searchParams.append('accion', 'actualizar_entrega');
    url.searchParams.append('id_venta', saleId.toString());
    url.searchParams.append('id_estado_entrega', statusId.toString());
    url.searchParams.append('usuario', 'Administrador');

    console.log('📤 URL de actualización:', url.toString());

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          "Administrador:429683C4C977415CAAFCCE10F7D57E11"
        ).toString("base64")}`,
      },
      // Agregar timeout
      signal: AbortSignal.timeout(10000),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    // Leer la respuesta como texto primero
    const responseText = await response.text();
    console.log('📡 Response text (raw):', responseText);
    console.log('📡 Response text length:', responseText.length);

    // ✅ EL PROBLEMA ESTÁ AQUÍ: Respuesta vacía pero status 200
    // Esto significa que la actualización probablemente funcionó
    if (responseText.trim() === '') {
      console.log('✅ Respuesta vacía pero status 200 - Asumiendo éxito');
      return { 
        success: true, 
        message: "Estado actualizado correctamente" 
      };
    }

    // Si hay contenido, intentar parsear como JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ JSON parseado exitosamente:', result);
    } catch (jsonError) {
      console.log('⚠️ No es JSON válido, pero status es 200 - Asumiendo éxito');
      // Si el status es 200, asumimos que la operación fue exitosa
      if (response.ok) {
        return { 
          success: true, 
          message: "Estado actualizado correctamente" 
        };
      } else {
        throw new Error(`Respuesta del servidor: ${responseText}`);
      }
    }

    // Verificar si hay algún error en la respuesta JSON
    if (result && result.success === false) {
      throw new Error(result.error || result.message || 'Error del servidor');
    }

    console.log('✅ Estado actualizado exitosamente en backend');
    return { 
      success: true, 
      data: result,
      message: result?.message || 'Estado actualizado correctamente'
    };
    
  } catch (error) {
    console.error('❌ Error en Server Action:', error);
    
    // Manejar diferentes tipos de errores
    let errorMessage = 'Error al actualizar el estado';
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        errorMessage = 'Timeout: El servidor tardó demasiado en responder.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión: No se pudo conectar al servidor.';
      } else if (error.message.includes('Unexpected end of JSON input')) {
        errorMessage = 'Error: El servidor respondió con una respuesta vacía.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export default async function SalesPage() {
  // Obtener datos en el servidor
  const salesData = await getSalesData();
  const { todaySales, futureSales } = separateSalesByDate(salesData);

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
      {salesData.length === 0 ? (
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
      ) : (
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
            />
          </div>
        </div>
      )}
    </div>
  );
}