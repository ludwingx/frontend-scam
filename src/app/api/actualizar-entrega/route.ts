import { NextResponse } from "next/server";

const BASE_URL = "https://torta-express-production.af9gwe.easypanel.host/webhook/server";
const BASIC_USER = "Administrador";
const BASIC_PASS = "429683C4C977415CAAFCCE10F7D57E11";

export async function POST(request: Request) {
  try {
    console.log('🔍 Recibiendo solicitud de actualización de estado');
    const body = await request.json();
    console.log('📦 Cuerpo de la solicitud:', body);
    
    const { id_venta, id_estado_entrega } = body;

    // Validar parámetros requeridos
    if (!id_venta || !id_estado_entrega) {
      console.error('❌ Faltan parámetros requeridos:', { id_venta, id_estado_entrega });
      return NextResponse.json(
        { 
          success: false, 
          error: "Faltan parámetros requeridos: id_venta, id_estado_entrega",
          receivedData: body
        },
        { status: 400 }
      );
    }

    // Construir URL con parámetros de consulta
    const upstreamUrl = new URL(BASE_URL);
    upstreamUrl.searchParams.set("accion", "actualizar_estado_entrega");
    upstreamUrl.searchParams.set("id_venta", id_venta.toString());
    
    // Crear encabezado de autenticación
    const authHeader = `Basic ${Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64")}`;

    console.log(`🔄 Actualizando estado de venta ${id_venta} a ${id_estado_entrega}`);
    console.log('🌐 URL de la API:', upstreamUrl.toString());

    try {
      // Realizar la petición a la API
      const response = await fetch(upstreamUrl.toString(), {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_venta: Number(id_venta),
          id_estado_entrega: Number(id_estado_entrega)
        }),
      });

      console.log('📥 Respuesta de la API - Status:', response.status);
      
      // Obtener el texto de la respuesta
      const responseText = await response.text();
      console.log('📦 Respuesta en texto plano:', responseText);

      // Retornar toda la información relevante al frontend para depuración
      if (!response.ok) {
        return NextResponse.json({
          success: false,
          status: response.status,
          responseText,
          message: 'Error en el webhook externo',
        }, { status: response.status });
      }

      // Intentar parsear como JSON
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        console.log('📋 Respuesta parseada:', responseData);
      } catch (e) {
        console.log('ℹ️ La respuesta no es un JSON válido, usando texto plano');
        responseData = { message: responseText };
      }

      // Manejar errores de la API
      if (!response.ok) {
        console.error('❌ Error en la respuesta de la API:', {
          status: response.status,
          statusText: response.statusText,
          response: responseData
        });
        
        return NextResponse.json(
          { 
            success: false, 
            error: responseData.error || response.statusText || 'Error desconocido del servidor',
            status: response.status,
            response: responseData
          },
          { status: response.status }
        );
      }

      // Éxito
      return NextResponse.json({ 
        success: true, 
        data: responseData,
        message: "Estado actualizado correctamente"
      });

    } catch (error: any) {
      console.error('❌ Error al realizar la petición a la API:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || "Error al conectar con el servidor",
        }, 
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("❌ Error en /api/actualizar-entrega:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Error al procesar la solicitud",
      }, 
      { status: 500 }
    );
  }
}