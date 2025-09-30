"use client";

import { useState, useMemo } from "react";
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
  User,
  Package,
  DollarSign,
  MapPin,
  Phone,
  MessageCircle,
  ImageIcon,
  ChevronDown,
  Users,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mapeo de estados
const STATUS_MAP: Record<number, string> = {
  1: "Pendiente",
  2: "En cocina", 
  3: "Listo para recoger",
  4: "En camino",
  5: "Entregado",
  6: "Cancelado"
};

// Colores para los estados (versiones más claras para fondos)
const STATUS_BG_COLORS = {
  1: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800",
  2: "bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800",
  3: "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800",
  4: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300 text-indigo-800",
  5: "bg-green-100 hover:bg-green-200 border-green-300 text-green-800",
  6: "bg-red-100 hover:bg-red-200 border-red-300 text-red-800",
};

const DELIVERY_TYPE_MAP: Record<number, string> = {
  1: "Delivery",
  2: "Recoger en tienda"
};

const STATUS_OPTIONS = [
  { id: "1", label: "Pendiente" },
  { id: "2", label: "En cocina" },
  { id: "3", label: "Listo para recoger" },
  { id: "4", label: "En camino" },
  { id: "5", label: "Entregado" },
  { id: "6", label: "Cancelado" },
];

interface ProductDetail {
  id_detalle: number;
  id_producto: number;
  sabor_producto: string;
  tamaño_producto: string;
  precio_producto: number;
  id_negocio: number;
  nombre_negocio: string;
  cantidad: number;
  precio_unitario_venta: number;
  subtotal: number;
  frase?: {
    frase: string;
    costo_frase: number;
    comentario_frase: string;
  };
  personalizacion?: {
    imagen_base64: string;
    costo_personalizacion: number;
    comentario_personalizacion: string;
  };
}

interface DeliveryInfo {
  id_entrega: number;
  id_tipo_entrega: number;
  nombre_tipo_entrega: string;
  direccion_entrega: string;
  nombre_receptor: string;
  telefono_receptor: string;
  costo_delivery: number;
  estado_delivery: string;
  nombre_sucursal: string | null;
  observaciones: string;
  costo_total: number;
}

interface Sale {
  id_venta: number;
  id_usuario_registro: number;
  nombre_usuario_registro: string;
  id_cliente: number;
  nombre_cliente: string;
  fecha_entrega_estimada: string;
  fecha_entrega_real: string | null;
  observaciones: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  id_estado_entrega: number;
  nombre_estado_entrega: string;
  entrega: DeliveryInfo;
  detalles: ProductDetail[];
  total_general: number;
  tempId: string;
  id_estado?: number;
}

interface TodaySalesTableProps {
  sales?: Sale[];
  updateSaleStatus?: (id: string, statusId: string) => void;
}

// Tipo para los datos de venta sin el tempId
type SaleInput = Omit<Sale, 'tempId'> & {
  id_venta: number;
  id_estado_entrega: number;
  entrega: Omit<DeliveryInfo, 'direccion_entrega'> & {
    direccion_entrega: string | null;
  };
};

// Función para sanitizar y adaptar los datos
function sanitizeSales(sales: SaleInput[]): Sale[] {
  return sales.map((sale, index) => ({
    ...sale,
    tempId: `sale-${sale.id_venta}-${index}`,
    // Asegurar que id_estado tenga un valor por defecto si no está definido
    id_estado: sale.id_estado_entrega || 1, // 1 = Pendiente por defecto
    // Asegurar que la dirección de entrega sea un string vacío si es null
    entrega: {
      ...sale.entrega,
      direccion_entrega: sale.entrega.direccion_entrega || '',
    },
  } as Sale));
}

import salesData from "../data/salesData.json";

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

// Type assertion for the imported sales data
const typedSalesData = salesData.sales as unknown as SaleInput[];

export default function TodaySalesTable({
  sales,
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  },
}: TodaySalesTableProps) {
  // Sanitize the sales data
  const sanitizedDefaultSales = useMemo(() => sanitizeSales(typedSalesData), []);
  const sanitizedPropSales = useMemo(() => sales ? sanitizeSales(sales as unknown as SaleInput[]) : null, [sales]);
  
  // Use the provided sales if available, otherwise use the default
  const [localSales, setLocalSales] = useState<Sale[]>(sanitizedPropSales || sanitizedDefaultSales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeSort] = useState<"asc" | "desc" | "none">("asc");

  // Obtener la hora actual
  const currentTime = new Date();
  
  // Separar pedidos en próximos y pasados
  const { upcomingSales, pastSales } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const filtered = localSales.filter((sale) => {
      const saleDate = sale.fecha_entrega_estimada.split("T")[0];
      return saleDate === today;
    });

    // Separar en pedidos próximos y pasados
    const upcoming = [];
    const past = [];
    
    for (const sale of filtered) {
      const saleTime = new Date(sale.fecha_entrega_estimada);
      const timeDiff = (currentTime.getTime() - saleTime.getTime()) / (1000 * 60);
      
      if (timeDiff > 30) {
        past.push(sale);
      } else {
        upcoming.push(sale);
      }
    }

    // Ordenar por fecha de forma ascendente (más tempranas primero)
    upcoming.sort((a, b) => new Date(a.fecha_entrega_estimada).getTime() - new Date(b.fecha_entrega_estimada).getTime());
    past.sort((a, b) => new Date(a.fecha_entrega_estimada).getTime() - new Date(b.fecha_entrega_estimada).getTime());

    return { upcomingSales: upcoming, pastSales: past };
  }, [localSales, currentTime]);

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
  }, [upcomingSales, pastSales, filterStatus, searchTerm, timeSort]);

  const handleStatusChange = (saleId: string, newStatusId: string) => {
    const newStatus = parseInt(newStatusId);

    setLocalSales((prevSales) =>
      prevSales.map((sale) =>
        sale.tempId === saleId ? { 
          ...sale, 
          id_estado_entrega: newStatus,
          nombre_estado_entrega: STATUS_MAP[newStatus] || "Desconocido"
        } : sale
      )
    );

    updateSaleStatus(saleId, newStatusId);
  };

  // Calculate total amount for today's sales
  const allTodaySales = [...upcomingSales, ...pastSales];
  const totalAmount = allTodaySales.reduce((sum, sale) => sum + sale.total_general, 0);
  const formattedTotal = new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(totalAmount);

  // Estadísticas rápidas
  const stats = useMemo(() => {
    const total = allTodaySales.length;
    const pending = allTodaySales.filter(s => s.id_estado_entrega === 1).length;
    const inProgress = allTodaySales.filter(s => s.id_estado_entrega === 2).length;
    const delivered = allTodaySales.filter(s => s.id_estado_entrega === 5).length;

    return { total, pending, inProgress, delivered };
  }, [allTodaySales]);

  // If there are no sales for today
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
            value={sale.id_estado_entrega.toString()}
            onValueChange={(value) => handleStatusChange(sale.tempId, value)}
          >
            <SelectTrigger className={`h-8 w-full ${STATUS_BG_COLORS[sale.id_estado_entrega as keyof typeof STATUS_BG_COLORS] || "bg-gray-100 text-gray-800"} transition-colors duration-200`}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{STATUS_MAP[sale.id_estado_entrega] || "Desconocido"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem 
                  key={status.id} 
                  value={status.id}
                  className={`${STATUS_BG_COLORS[parseInt(status.id) as keyof typeof STATUS_BG_COLORS] || "bg-gray-100 text-gray-800"} mb-1 last:mb-0 rounded-md`}
                >
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <SaleDetailsDialog sale={sale} onStatusChange={handleStatusChange} />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Pedidos de Hoy</CardTitle>
          <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-md">
            Total: {formattedTotal}
          </div>
        </div>
        {/* Estadísticas rápidas */}
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Total: {stats.total}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Pendientes: {stats.pending}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>En cocina: {stats.inProgress}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Entregados: {stats.delivered}</span>
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
                      {filteredSales.upcoming.length > 0 && (
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
                      )}
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
}: { 
  sale: Sale; 
  onStatusChange: (id: string, statusId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const status = STATUS_MAP[sale.id_estado_entrega] || "Desconocido";
  const deliveryType = DELIVERY_TYPE_MAP[sale.entrega.id_tipo_entrega] || "Desconocido";

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
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_BG_COLORS[sale.id_estado_entrega as keyof typeof STATUS_BG_COLORS] || "bg-gray-100 text-gray-800"}`}>
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
              Productos ({sale.detalles.length})
            </h3>
            <div className="space-y-4">
              {sale.detalles.map((detalle) => {
                const productTotal = detalle.cantidad * detalle.precio_unitario_venta;
                const hasFrase = detalle.frase && detalle.frase.frase;
                const hasPersonalizacion = detalle.personalizacion && detalle.personalizacion.imagen_base64;
                const extrasTotal = (detalle.frase?.costo_frase || 0) + (detalle.personalizacion?.costo_personalizacion || 0);
                
                return (
                  <div key={detalle.id_detalle} className="border rounded-lg p-4 bg-muted/5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{detalle.sabor_producto}</div>
                        <div className="text-sm text-muted-foreground">
                          {detalle.tamaño_producto} • Cantidad: {detalle.cantidad}
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
                          {detalle.cantidad} × {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.precio_unitario_venta)}
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
                                }).format(detalle.frase!.costo_frase)}
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
                                }).format(detalle.personalizacion!.costo_personalizacion)}
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