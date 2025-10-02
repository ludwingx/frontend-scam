import SalesHistoryTable from "../components/SalesHistoryTable";

async function getSalesData() {
  try {
    const res = await fetch("https://torta-express-production.af9gwe.easypanel.host/webhook/server?accion=venta", {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from("Administrador:429683C4C977415CAAFCCE10F7D57E11").toString("base64")}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    
    console.log("API Response:", data);
    
    const arr = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    console.log("Processed array:", arr);

    const mapped = arr.map((s: any) => {
      const estadoMap: Record<number, string> = {
        1: "Pendiente",
        2: "En cocina",
        3: "Listo para recoger",
        4: "En camino",
        5: "Entregado",
        6: "Cancelado",
      };
      
      const products = Array.isArray(s.detalles)
        ? s.detalles.map((d: any) => ({
            name: [d.sabor_producto, d.tamaño_producto].filter(Boolean).join(" "),
            quantity: Number(d.cantidad) || 1,
            price: Number(d.precio_unitario_venta || 0),
          }))
        : [];
      
      return {
        id: s.id_venta || s.id || `temp-${Math.random()}`,
        client: s.nombre_cliente || "Cliente no especificado",
        brand: s.entrega?.nombre_sucursal || s.nombre_sucursal || "Sucursal no especificada",
        date: s.fecha_entrega_estimada || s.fecha_registro || new Date().toISOString(),
        products,
        amount: Number(s.total_general || s.total || 0),
        status: estadoMap[s.id_estado_entrega] || "Pendiente",
        orderType: s.entrega?.id_tipo_entrega === 1 ? "delivery" : "pickup",
        paymentMethod: s.metodo_pago || "Efectivo",
      };
    });

    console.log("Mapped sales:", mapped);
    return mapped;

  } catch (error) {
    console.error("Error fetching sales data:", error);
    return [];
  }
}

export default async function SalesHistoryPage() {
  const sales = await getSalesData();

  return (
    <div className="sales-bg flex flex-col min-h-screen p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
          Historial de Ventas
        </h2>
        <p className="text-gray-600">
          Total de ventas: {sales.length}
        </p>
      </div>

      {sales.length > 0 ? (
        <SalesHistoryTable sales={sales} />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white rounded-lg shadow">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
          <p className="text-center">No se encontraron datos de ventas en el sistema.</p>
        </div>
      )}
    </div>
  );
}