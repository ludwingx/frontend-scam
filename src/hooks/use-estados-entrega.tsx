// hooks/use-estados-entrega.ts
import { useState, useEffect } from 'react';

export interface EstadoEntrega {
  id_estado_entrega: number;
  nombre_estado_entrega: string;
  color?: string;
  orden?: number;
}

export function useEstadosEntrega() {
  const [estados, setEstados] = useState<EstadoEntrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstados = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Iniciando carga de estados desde API...');
      
      const response = await fetch('/api/estados-entrega', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 Datos de estados desde API:', result);
      
      if (result && Array.isArray(result)) {
        console.log(`✅ ${result.length} estados cargados directamente desde array`);
        setEstados(result);
      } else if (result.data && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} estados cargados desde result.data`);
        setEstados(result.data);
      } else if (result.success && Array.isArray(result.data)) {
        console.log(`✅ ${result.data.length} estados cargados desde result.success.data`);
        setEstados(result.data);
      } else {
        console.error('❌ Estructura de respuesta no reconocida:', result);
        throw new Error("Estructura de respuesta no válida");
      }
      
    } catch (err: any) {
      console.error("❌ Error cargando estados:", err);
      setError(err.message || "Error al cargar los estados desde la API");
      setEstados([]);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoVenta = async (idVenta: number, idEstado: number): Promise<boolean> => {
    try {
      console.log('🔄 Enviando actualización de estado a la API:', { idVenta, idEstado });
      
      // Usar el endpoint local de Next.js que manejará la autenticación
      const response = await fetch('/api/actualizar-entrega', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_venta: idVenta,
          id_estado_entrega: idEstado
        }),
      });

      console.log('📡 Response status:', response.status);
      
      // Verificar si la respuesta está vacía
      const responseText = await response.text();
      console.log('📦 Raw response:', responseText);
      
      // Si la respuesta está vacía pero el estado es 200, asumimos éxito
      if (response.status === 200 && !responseText.trim()) {
        console.log(`✅ Estado de venta ${idVenta} actualizado exitosamente a ${idEstado} (respuesta vacía)`);
        return true;
      }
      
      // Si hay contenido, intentar parsear como JSON
      if (responseText.trim()) {
        try {
          const result = JSON.parse(responseText);
          console.log('📦 Parsed response:', result);
          
          // Verificar si la respuesta indica éxito
          const success = result.success === true || result.actualizado === true || 
                         (result.data && (result.data.success === true || result.data.actualizado === true));
          
          if (success) {
            console.log(`✅ Estado de venta ${idVenta} actualizado exitosamente a ${idEstado}`);
            return true;
          } else {
            const errorMsg = result.error?.message || result.message || 'La API no pudo actualizar el estado';
            throw new Error(errorMsg);
          }
        } catch (parseError) {
          console.error('❌ Error al analizar la respuesta JSON:', parseError);
          // Si no es JSON válido pero el estado es 200, asumimos éxito
          if (response.ok) {
            console.log(`✅ Estado de venta ${idVenta} actualizado exitosamente a ${idEstado} (respuesta no JSON)`);
            return true;
          }
          throw new Error('La respuesta del servidor no es válida');
        }
      }
      
      // Si llegamos aquí y el estado no es 200, hubo un error
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status}): ${response.statusText}`);
      }
      
      return true;
      
    } catch (error: any) {
      console.error('❌ Error al actualizar el estado de la venta:', error);
      // Mostrar un mensaje más amigable al usuario
      const errorMessage = error.message || 'Error al conectar con el servidor';
      alert(`Error: ${errorMessage}`);
      return false;
    }
  };

  useEffect(() => {
    fetchEstados();
  }, []);

  return {
    estados,
    loading,
    error,
    refetch: () => fetchEstados(true),
    actualizarEstadoVenta
  };
}

export default useEstadosEntrega;