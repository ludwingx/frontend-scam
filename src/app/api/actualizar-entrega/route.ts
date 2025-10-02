import { NextResponse } from "next/server";

const BASE_URL = "https://torta-express-production.af9gwe.easypanel.host/webhook/server";
const BASIC_USER = "Administrador";
const BASIC_PASS = "429683C4C977415CAAFCCE10F7D57E11";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_venta, id_estado_entrega } = body;

    if (!id_venta || !id_estado_entrega) {
      return NextResponse.json(
        { success: false, error: "Faltan parámetros requeridos: id_venta, id_estado_entrega" },
        { status: 400 }
      );
    }

    const upstreamUrl = new URL(BASE_URL);
    upstreamUrl.searchParams.set("accion", "actualizar_estado_entrega");
    upstreamUrl.searchParams.set("id_venta", id_venta.toString());
    const authHeader = `Basic ${Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64")}`;

    console.log(`Updating estado for sale ${id_venta} to ${id_estado_entrega}`);

    const res = await fetch(upstreamUrl.toString(), {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_venta,
        id_estado_entrega
      }),
    });

    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
        // Intentar parsear como JSON si es posible
        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            { success: false, error: errorJson.error || 'Error desconocido del servidor' },
            { status: res.status }
          );
        } catch {
          // Si no es JSON, usar el texto plano
          return NextResponse.json(
            { success: false, error: errorText || 'Error del servidor' },
            { status: res.status }
          );
        }
      } catch (e) {
        console.error('Error al leer la respuesta de error:', e);
        return NextResponse.json(
          { success: false, error: 'Error al procesar la respuesta del servidor' },
          { status: 500 }
        );
      }
    }

    // Manejar la respuesta exitosa
    try {
      const responseText = await res.text();
      let responseData;
      
      // Intentar parsear como JSON
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.warn('La respuesta no es un JSON válido, usando respuesta como texto');
        responseData = { message: responseText };
      }

      return NextResponse.json({ 
        success: true, 
        data: responseData,
        message: "Estado actualizado correctamente"
      });

    } catch (error: any) {
      console.error("Error in /api/actualizar-entrega:", error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || "Error al actualizar el estado",
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in /api/actualizar-entrega:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error al procesar la solicitud",
      }, 
      { status: 500 }
    );
  }
}