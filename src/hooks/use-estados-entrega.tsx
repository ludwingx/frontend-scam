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
      console.log('🔄 Enviando actualización a API:', { idVenta, idEstado });
      
      const response = await fetch('/api/actualizar-entrega', { // ✅ ENDPOINT CORREGIDO
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
      
      const result = await response.json();
      console.log('📦 Response data:', result);
      
      if (result.success) {
        console.log(`✅ Estado de venta ${idVenta} actualizado a ${idEstado}`);
        return true;
      } else {
        console.error('❌ Error del servidor:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
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