// In route.ts
import { NextResponse } from "next/server";

const BASE_URL = "https://torta-express-production.af9gwe.easypanel.host/webhook/server";
const BASIC_USER = "Administrador";
const BASIC_PASS = "429683C4C977415CAAFCCE10F7D57E11";

// Cache para almacenar temporalmente los datos
let cachedSales: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos de caché

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const accion = url.searchParams.get("accion") || "obtener_ventas";
    const idVenta = url.searchParams.get("id_venta");
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // Usar caché si está disponible y no se fuerza actualización
    const now = Date.now();
    if (!forceRefresh && cachedSales && (now - lastFetchTime) < CACHE_DURATION) {
      console.log("Returning cached sales data");
      return NextResponse.json({ success: true, data: cachedSales });
    }

    const upstreamUrl = new URL(BASE_URL);
    upstreamUrl.searchParams.set("accion", accion);
    if (idVenta) {
      upstreamUrl.searchParams.set("id_venta", idVenta);
    }

    const authHeader = `Basic ${Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64")}`;

    console.log(`Fetching data from: ${upstreamUrl.toString()}`);

    const res = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      // Remover next.revalidate ya que puede causar problemas en API routes
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Upstream error: ${res.status} - ${errorText}`);
      throw new Error(`Error from upstream: ${res.status} - ${errorText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    let responseData;

    // Procesar la respuesta de manera más robusta
    if (contentType.includes("application/json")) {
      try {
        const responseText = await res.text();
        // Verificar que la respuesta no esté vacía
        if (!responseText || responseText.trim() === '') {
          console.log("Empty response from upstream, using empty array");
          responseData = [];
        } else {
          responseData = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        // Si falla el parsing, devolver array vacío
        responseData = [];
      }
    } else {
      // Si no es JSON, tratar como texto y verificar si es vacío
      const textResponse = await res.text();
      console.log("Non-JSON response:", textResponse.substring(0, 100));
      responseData = [];
    }

    // Normalizar la respuesta a un array
    let salesData = Array.isArray(responseData) ? responseData : (responseData?.data || []);

    // Si no hay datos, usar array vacío
    if (!salesData) {
      salesData = [];
    }

    console.log(`Processed ${salesData.length} sales from API`);

    // Actualizar caché
    cachedSales = salesData;
    lastFetchTime = now;

    return NextResponse.json({ 
      success: true, 
      data: salesData,
      timestamp: new Date().toISOString(),
      count: salesData.length
    });

  } catch (error: any) {
    console.error("Error in /api/ventas:", error);
    
    // Si hay un error pero tenemos datos en caché, devolverlos
    if (cachedSales) {
      console.log("Using cached data due to error");
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching fresh data, using cached version",
        data: cachedSales,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    // Si no hay caché, devolver array vacío en lugar de error
    console.log("No cached data available, returning empty array");
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        error: error.message || "Error al obtener las ventas",
        timestamp: new Date().toISOString()
      }, 
      { status: 200 } // Siempre devolver 200 con array vacío
    );
  }
}