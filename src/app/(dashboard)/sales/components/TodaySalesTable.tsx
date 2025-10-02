"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Truck,
  Home,
  Clock,
  ShoppingCart,
  Eye,
  Calendar,
  Users,
  Package,
  DollarSign,
  MapPin,
  MessageCircle,
  ImageIcon,
  ChevronDown,
  Search,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sale } from "@/types/sales";
import { useEstadosEntrega } from "@/hooks/use-estados-entrega";

// Componente para mostrar el icono según el tipo de entrega
function DeliveryTypeIcon({ typeId }: { typeId: number }) {
  switch (typeId) {
    case 1:
      return <Truck className="h-3 w-3" />;
    case 2:
      return <Home className="h-3 w-3" />;
    default:
      return <Home className="h-3 w-3" />;
  }
}

interface TodaySalesTableProps {
  sales?: Sale[];
  updateSaleStatus?: (id: string, statusId: string) => void;
}

const DELIVERY_TYPE_MAP: Record<number, string> = {
  1: "Delivery",
  2: "Recoger en tienda"
};

// Colores base para estados
const BASE_STATUS_COLORS = [
  "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800",
  "bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800", 
  "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800",
  "bg-indigo-100 hover:bg-indigo-200 border-indigo-300 text-indigo-800",
  "bg-green-100 hover:bg-green-200 border-green-300 text-green-800",
  "bg-red-100 hover:bg-red-200 border-red-300 text-red-800",
];

export default function TodaySalesTable({
  sales = [],
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  },
}: TodaySalesTableProps) {
  // ✅ ELIMINADO: estado interno localSales
  // ✅ USAMOS directamente las props sales
  
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeSort] = useState<"asc" | "desc" | "none">("asc");

  const { estados, loading: loadingEstados, error: errorEstados, actualizarEstadoVenta } = useEstadosEntrega();

  // Mapeo dinámico de estados - SOLO datos reales de la API
  const STATUS_MAP = useMemo(() => {
    const map: Record<number, string> = {};
    if (estados && estados.length > 0) {
      estados.forEach((estado) => {
        map[estado.id_estado_entrega] = estado.nombre_estado_entrega;
      });
    }
    return map;
  }, [estados]);

  // Opciones para el filtro de estados - SOLO datos reales
  const STATUS_OPTIONS = useMemo(() => {
    if (estados && estados.length > 0) {
      return estados.map((estado) => ({
        id: estado.id_estado_entrega.toString(),
        label: estado.nombre_estado_entrega
      }));
    }
    return [];
  }, [estados]);

  // Colores dinámicos para los estados - basados en datos reales
  const STATUS_BG_COLORS = useMemo(() => {
    const colors: Record<number, string> = {};
    
    if (estados && estados.length > 0) {
      estados.forEach((estado, index) => {
        colors[estado.id_estado_entrega] = BASE_STATUS_COLORS[index % BASE_STATUS_COLORS.length];
      });
    }
    
    return colors;
  }, [estados]);

  // Obtener la hora actual
  const currentTime = useMemo(() => new Date(), []);
  
  // Separar pedidos en próximos y pasados - usando las props sales
  const { upcomingSales, pastSales } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const filtered = sales.filter((sale) => {
      if (!sale.fecha_entrega_estimada || typeof sale.fecha_entrega_estimada !== 'string') {
        return false;
      }
      
      try {
        const saleDate = sale.fecha_entrega_estimada.split("T")[0];
        const saleDateTime = new Date(sale.fecha_entrega_estimada);
        return !isNaN(saleDateTime.getTime()) && saleDate === today;
      } catch {
        return false;
      }
    });

    const upcoming = [];
    const past = [];
    
    for (const sale of filtered) {
      if (!sale.fecha_entrega_estimada) continue;
      
      const saleTime = new Date(sale.fecha_entrega_estimada);
      if (isNaN(saleTime.getTime())) continue;
      
      const timeDiff = (currentTime.getTime() - saleTime.getTime()) / (1000 * 60);
      
      if (timeDiff > 30) {
        past.push(sale);
      } else {
        upcoming.push(sale);
      }
    }

    // Ordenar por fecha de forma ascendente
    upcoming.sort((a, b) => {
      const dateA = new Date(a.fecha_entrega_estimada).getTime();
      const dateB = new Date(b.fecha_entrega_estimada).getTime();
      return dateA - dateB;
    });
    past.sort((a, b) => {
      const dateA = new Date(a.fecha_entrega_estimada).getTime();
      const dateB = new Date(b.fecha_entrega_estimada).getTime();
      return dateA - dateB;
    });

    return { upcomingSales: upcoming, pastSales: past };
  }, [sales, currentTime]); // ✅ Dependencia de sales (props)

  // Combinar y filtrar las ventas según los filtros aplicados
  const filteredSales = useMemo(() => {
    const filterSales = (salesArray: Sale[]) => {
      let result = salesArray.filter((sale) => {
        const statusMatch = filterStatus === "all" || STATUS_MAP[sale.id_estado_entrega] === filterStatus;
        const searchMatch = searchTerm === "" || 
          sale.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.entrega.nombre_receptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.id_venta.toString().includes(searchTerm);
        
        return statusMatch && searchMatch;
      });

      // Ordenar por hora
      if (timeSort !== "none") {
        result = result.sort((a, b) => {
          const dateA = new Date(a.fecha_entrega_estimada).getTime();
          const dateB = new Date(b.fecha_entrega_estimada).getTime();
          return timeSort === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      return result;
    };

    const filteredUpcoming = filterSales(upcomingSales);
    const filteredPast = filterSales(pastSales);

    return { upcoming: filteredUpcoming, past: filteredPast };
  }, [upcomingSales, pastSales, filterStatus, searchTerm, timeSort, STATUS_MAP]);

  const handleStatusChange = async (saleId: string, newStatusId: string) => {
    const newStatus = parseInt(newStatusId);
    const sale = sales.find(s => s.tempId === saleId); // ✅ Buscar en las props sales
    
    if (!sale) {
      console.error('❌ Venta no encontrada:', saleId);
      return;
    }

    console.log('🔄 Iniciando cambio de estado:', {
      saleId,
      ventaId: sale.id_venta,
      estadoAnterior: sale.id_estado_entrega,
      nuevoEstado: newStatus
    });

    // ✅ ELIMINADO: No actualizamos estado local, solo llamamos a la API y al callback del padre

    try {
      const success = await actualizarEstadoVenta(sale.id_venta, newStatus);
      
      if (success) {
        console.log('✅ Estado actualizado exitosamente en la API');
        // ✅ Solo llamamos al callback del padre para que actualice las props
        updateSaleStatus(saleId, newStatusId);
      } else {
        throw new Error('La API retornó success: false');
      }
    } catch (error) {
      console.error('❌ Error al actualizar estado en la API:', error);
      alert('Error al actualizar el estado. Por favor, intenta nuevamente.');
    }
  };

  // Calculate total amount for today's sales
  const allTodaySales = [...upcomingSales, ...pastSales];
  const totalAmount = allTodaySales.reduce((sum, sale) => sum + sale.total_general, 0);
  const formattedTotal = new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(totalAmount);

  // Loading state para estados
  if (loadingEstados && estados.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Pedidos de Hoy</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando estados de entrega...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state para estados
  if (errorEstados) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Pedidos de Hoy</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <ShoppingCart className="h-8 w-8 text-destructive" />
            <p className="font-medium">Error al cargar los estados</p>
            <p className="text-sm text-muted-foreground">{errorEstados}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay estados cargados después de terminar la carga
  if (estados.length === 0 && !loadingEstados) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Pedidos de Hoy</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <Package className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No hay estados configurados</p>
            <p className="text-sm text-muted-foreground">
              Los estados de entrega no están disponibles en este momento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay ventas para hoy
  if (allTodaySales.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Pedidos de Hoy</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No hay pedidos para hoy</p>
                <p className="text-sm text-gray-400">Los pedidos de hoy aparecerán aquí</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Componente para renderizar una fila de venta
  const renderSaleRow = (sale: Sale) => {
    const deliveryType = DELIVERY_TYPE_MAP[sale.entrega.id_tipo_entrega] || "Desconocido";
    const isPast = pastSales.some(pastSale => pastSale.tempId === sale.tempId);
    const currentStatus = sale.id_estado_entrega || 1;
    const statusName = STATUS_MAP[currentStatus] || "Desconocido";
    const statusColor = STATUS_BG_COLORS[currentStatus] || "bg-gray-100 text-gray-800";

    return (
      <TableRow key={sale.tempId} className={`hover:bg-muted/50 ${isPast ? 'bg-red-50' : ''}`}>
        <TableCell className="font-medium">#{sale.id_venta}</TableCell>
        <TableCell className="max-w-[140px]">
          <div className="flex flex-col">
            <span className="font-medium truncate">{sale.nombre_cliente}</span>
            <span className="text-xs text-muted-foreground truncate">
              Receptor: {sale.entrega.nombre_receptor}
            </span>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="text-sm">
            {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          {isPast && (
            <div className="text-xs text-red-500 font-medium mt-1">
              ⚠️ Atrasado
            </div>
          )}
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat("es-BO", {
            style: "currency",
            currency: "BOB",
            minimumFractionDigits: 2,
          }).format(sale.total_general)}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800"
          >
            <DeliveryTypeIcon typeId={sale.entrega.id_tipo_entrega} />
            {deliveryType}
          </Badge>
        </TableCell>
        <TableCell>
          <Select
            value={currentStatus.toString()}
            onValueChange={(value) => handleStatusChange(sale.tempId, value)}
          >
            <SelectTrigger className={`h-8 w-full ${statusColor} transition-colors duration-200`}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{statusName}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem 
                  key={status.id} 
                  value={status.id}
                  className={`${STATUS_BG_COLORS[parseInt(status.id)] || "bg-gray-100 text-gray-800"} mb-1 last:mb-0 rounded-md`}
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <SaleDetailsDialog 
            sale={sale} 
            onStatusChange={handleStatusChange}
            statusMap={STATUS_MAP}
            statusBgColors={STATUS_BG_COLORS}
            deliveryTypeMap={DELIVERY_TYPE_MAP}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Pedidos de Hoy</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-md">
              Total: {formattedTotal}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 mb-4 gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, receptor o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] h-8">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.id} value={status.label}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {filteredSales.upcoming.length > 0 || filteredSales.past.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[140px]">Cliente</TableHead>
                    <TableHead className="w-[100px]">Hora Entrega</TableHead>
                    <TableHead className="w-[120px]">Monto Total</TableHead>
                    <TableHead className="w-[120px]">Tipo Entrega</TableHead>
                    <TableHead className="w-[150px]">Estado</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.upcoming.length > 0 && (
                    <>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={7} className="p-0">
                          <div className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-green-50">
                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                            <span className="font-semibold text-green-700">
                              Próximos pedidos ({filteredSales.upcoming.length})
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {filteredSales.upcoming.map(renderSaleRow)}
                    </>
                  )}
                  
                  {filteredSales.past.length > 0 && (
                    <>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={7} className="p-0">
                          <div className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-red-50">
                            <Clock className="h-4 w-4 mr-2 text-red-600" />
                            <span className="font-semibold text-red-700">
                              Pedidos atrasados ({filteredSales.past.length})
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {filteredSales.past.map(renderSaleRow)}
                    </>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No hay pedidos con este filtro</p>
                <p className="text-sm text-gray-400">Intenta con otro filtro o término de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para el modal de detalles de venta
function SaleDetailsDialog({ 
  sale, 
  onStatusChange,
  statusMap,
  statusBgColors,
  deliveryTypeMap,
}: { 
  sale: Sale; 
  onStatusChange: (id: string, statusId: string) => void;
  statusMap: Record<number, string>;
  statusBgColors: Record<number, string>;
  deliveryTypeMap: Record<number, string>;
}) {
  const [open, setOpen] = useState(false);
  const status = statusMap[sale.id_estado_entrega] || "Desconocido";
  const deliveryType = deliveryTypeMap[sale.entrega.id_tipo_entrega] || "Desconocido";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Eye className="h-4 w-4" />
          Detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles del Pedido #{sale.id_venta}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Información del Cliente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cliente:</span>
                    <span>{sale.nombre_cliente}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Receptor:</span>
                    <span>{sale.entrega.nombre_receptor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Teléfono:</span>
                    <span className="font-mono">{sale.entrega.telefono_receptor}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Información de Entrega
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fecha:</span>
                    <span>
                      {new Date(sale.fecha_entrega_estimada).toLocaleDateString("es-BO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Hora:</span>
                    <span>
                      {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tipo:</span>
                    <Badge variant="outline">
                      {deliveryType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Resumen del Pedido
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${statusBgColors[sale.id_estado_entrega as keyof typeof statusBgColors] || "bg-gray-100 text-gray-800"}`}>
                      {status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subtotal:</span>
                    <span>
                      {new Intl.NumberFormat("es-BO", {
                        style: "currency",
                        currency: "BOB",
                        minimumFractionDigits: 2,
                      }).format(sale.total_general - sale.entrega.costo_delivery)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Delivery:</span>
                    <span>
                      {new Intl.NumberFormat("es-BO", {
                        style: "currency",
                        currency: "BOB",
                        minimumFractionDigits: 2,
                      }).format(sale.entrega.costo_delivery)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 font-medium">
                    <span>Total:</span>
                    <span className="text-lg">
                      {new Intl.NumberFormat("es-BO", {
                        style: "currency",
                        currency: "BOB",
                        minimumFractionDigits: 2,
                      }).format(sale.total_general)}
                    </span>
                  </div>
                </div>
              </div>

              {sale.entrega.direccion_entrega && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección de Entrega
                  </h3>
                  <p className="text-sm text-muted-foreground">{sale.entrega.direccion_entrega}</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos ({(sale.detalles || []).length})
            </h3>
            <div className="space-y-4">
              {(sale.detalles || []).map((detalle) => {
                const productTotal = (detalle.cantidad || 0) * (detalle.precio_unitario_venta || 0);
                const hasFrase = detalle.frase && detalle.frase.frase;
                const hasPersonalizacion = detalle.personalizacion && detalle.personalizacion.imagen_base64;
                
                return (
                  <div key={detalle.id_detalle || `detalle-${Math.random()}`} className="border rounded-lg p-4 bg-muted/5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{detalle.sabor_producto || "Producto sin nombre"}</div>
                        <div className="text-sm text-muted-foreground">
                          {detalle.tamaño_producto || "Tamaño no especificado"} • Cantidad: {detalle.cantidad || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg">
                          {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(productTotal)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {detalle.cantidad || 0} × {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.precio_unitario_venta || 0)}
                        </div>
                      </div>
                    </div>

                    {(hasFrase || hasPersonalizacion) && (
                      <div className="border-t pt-3 mt-3 space-y-3">
                        {hasFrase && (
                          <div className="flex items-start gap-3">
                            <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">Frase personalizada</div>
                              <div className="text-muted-foreground italic my-1">"{detalle.frase!.frase}"</div>
                              <div className="text-xs text-muted-foreground">{detalle.frase!.comentario_frase}</div>
                              <div className="text-xs font-medium mt-1">
                                +{new Intl.NumberFormat("es-BO", {
                                  style: "currency",
                                  currency: "BOB",
                                  minimumFractionDigits: 2,
                                }).format(detalle.frase!.costo_frase || 0)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {hasPersonalizacion && (
                          <div className="flex items-start gap-3">
                            <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">Personalización</div>
                              <div className="text-xs text-muted-foreground my-1">{detalle.personalizacion!.comentario_personalizacion}</div>
                              <div className="text-xs font-medium">
                                +{new Intl.NumberFormat("es-BO", {
                                  style: "currency",
                                  currency: "BOB",
                                  minimumFractionDigits: 2,
                                }).format(detalle.personalizacion!.costo_personalizacion || 0)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sale.observaciones && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Observaciones Generales</h3>
                <p className="text-sm text-muted-foreground">{sale.observaciones}</p>
              </div>
            )}
            
            {sale.entrega.observaciones && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Instrucciones de Entrega</h3>
                <p className="text-sm text-muted-foreground">{sale.entrega.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}