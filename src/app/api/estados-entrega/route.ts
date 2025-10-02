import { NextResponse } from "next/server";

const BASE_URL = "https://torta-express-production.af9gwe.easypanel.host/webhook/server";
const BASIC_USER = "Administrador";
const BASIC_PASS = "429683C4C977415CAAFCCE10F7D57E11";

// Cache para estados de entrega
let cachedEstados: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos de caché

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // Usar caché si está disponible y no se fuerza actualización
    const now = Date.now();
    if (!forceRefresh && cachedEstados && (now - lastFetchTime) < CACHE_DURATION) {
      console.log("Returning cached estados data");
      return NextResponse.json({ success: true, data: cachedEstados });
    }

    const upstreamUrl = new URL(BASE_URL);
    upstreamUrl.searchParams.set("accion", "estado_entrega");

    const authHeader = `Basic ${Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64")}`;

    console.log(`Fetching estados from: ${upstreamUrl.toString()}`);

    const res = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Upstream error: ${res.status} - ${errorText}`);
      throw new Error(`Error from upstream: ${res.status} - ${errorText}`);
    }

    const contentType = res.headers.get("content-type") || "";
    let responseData;

    if (contentType.includes("application/json")) {
      try {
        const responseText = await res.text();
        if (!responseText || responseText.trim() === '') {
          console.log("Empty response from upstream, using empty array");
          responseData = [];
        } else {
          responseData = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        responseData = [];
      }
    } else {
      const textResponse = await res.text();
      console.log("Non-JSON response:", textResponse.substring(0, 100));
      responseData = [];
    }

    // Normalizar la respuesta a un array
    let estadosData = Array.isArray(responseData) ? responseData : (responseData?.data || []);

    if (!estadosData) {
      estadosData = [];
    }

    console.log(`Processed ${estadosData.length} estados from API`);

    // Actualizar caché
    cachedEstados = estadosData;
    lastFetchTime = now;

    return NextResponse.json({ 
      success: true, 
      data: estadosData,
      timestamp: new Date().toISOString(),
      count: estadosData.length
    });

  } catch (error: any) {
    console.error("Error in /api/estados-entrega:", error);
    
    if (cachedEstados) {
      console.log("Using cached estados due to error");
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching fresh data, using cached version",
        data: cachedEstados,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    console.log("No cached estados available, returning empty array");
    return NextResponse.json(
      { 
        success: true, 
        data: [],
        error: error.message || "Error al obtener los estados de entrega",
        timestamp: new Date().toISOString()
      }, 
      { status: 200 }
    );
  }
}