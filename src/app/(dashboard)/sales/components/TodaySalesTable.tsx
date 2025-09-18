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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  id_producto: number;
  cantidad: number;
  precio_unitario_venta: number;
  frase?: {
    frase: string;
    costo_frase: number;
  };
  personalizacion?: {
    imagen_base64: string;
    costo_personalizacion: number;
  };
}

interface DeliveryInfo {
  id_tipo_entrega: number;
  direccion_entrega: string;
  nombre_receptor: string;
  telefono_receptor: string;
  costo_delivery: number;
  estado_delivery: string;
  nombre_sucursal: string | null;
  fecha_recojo_programada: string | null;
  observaciones: string;
  costo_total: string;
}

interface Sale {
  id_usuario_registro: number;
  id_estado: number;
  fecha_entrega_estimada: string;
  observaciones: string;
  entrega: DeliveryInfo;
  detalles: ProductDetail[];
  tempId: string;
}

interface TodaySalesTableProps {
  sales?: Sale[];
  updateSaleStatus?: (id: string, statusId: string) => void;
}

// Función para sanitizar y adaptar los datos
function sanitizeSales(sales: any[]): Sale[] {
  return sales.map((sale, index) => ({
    ...sale,
    tempId: `sale-${index}-${Date.now()}`,
  }));
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

export default function TodaySalesTable({
  sales = salesData.sales,
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  },
}: TodaySalesTableProps) {
  const [localSales, setLocalSales] = useState<Sale[]>(sanitizeSales(sales));
  const [filterStatus, setFilterStatus] = useState("all");
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
      let result = salesArray.filter(
        (sale) => filterStatus === "all" || STATUS_MAP[sale.id_estado] === filterStatus
      );

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
  }, [upcomingSales, pastSales, filterStatus, timeSort]);

  const handleStatusChange = (saleId: string, newStatusId: string) => {
    const newStatus = parseInt(newStatusId);

    setLocalSales((prevSales) =>
      prevSales.map((sale) =>
        sale.tempId === saleId ? { ...sale, id_estado: newStatus } : sale
      )
    );

    updateSaleStatus(saleId, newStatusId);
  };

  // Calculate total amount for today's sales
  const allTodaySales = [...upcomingSales, ...pastSales];
  const totalAmount = allTodaySales.reduce((sum, sale) => sum + parseFloat(sale.entrega.costo_total), 0);
  const formattedTotal = new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(totalAmount);

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

    return (
      <TableRow key={sale.tempId} className="hover:bg-muted/50">
        <TableCell className="font-medium">#{sale.tempId.slice(-4)}</TableCell>
        <TableCell className="max-w-[120px] truncate">{sale.entrega.nombre_receptor}</TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="text-sm">
            {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat("es-BO", {
            style: "currency",
            currency: "BOB",
            minimumFractionDigits: 2,
          }).format(parseFloat(sale.entrega.costo_total))}
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
            value={sale.id_estado.toString()}
            onValueChange={(value) => handleStatusChange(sale.tempId, value)}
          >
            <SelectTrigger className={`h-8 w-full ${STATUS_BG_COLORS[sale.id_estado as keyof typeof STATUS_BG_COLORS] || "bg-gray-100 text-gray-800"} transition-colors duration-200`}>
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{STATUS_MAP[sale.id_estado] || "Desconocido"}</span>
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
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center space-x-2">
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
                    <TableHead>Cliente</TableHead>
                    <TableHead className="w-[100px]">Hora Entrega</TableHead>
                    <TableHead className="w-[120px]">Monto Total</TableHead>
                    <TableHead className="w-[120px]">Tipo Entrega</TableHead>
                    <TableHead className="w-[150px]">Estado</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.upcoming.map(renderSaleRow)}
                  {filteredSales.past.length > 0 && (
                    <>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell colSpan={7} className="p-0">
                          <div className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-yellow-100">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-semibold">Pedidos con tiempo vencido</span>
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
                <p className="text-sm text-gray-400">Intenta con otro filtro</p>
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
  const status = STATUS_MAP[sale.id_estado] || "Desconocido";
  const deliveryType = DELIVERY_TYPE_MAP[sale.entrega.id_tipo_entrega] || "Desconocido";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Eye className="h-4 w-4" />
          Detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Pedido #{sale.tempId.slice(-4)}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cliente:</span>
                <span>{sale.entrega.nombre_receptor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Teléfono:</span>
                <span>{sale.entrega.telefono_receptor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Fecha entrega:</span>
                <span>
                  {new Date(sale.fecha_entrega_estimada).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Hora entrega:</span>
                <span>
                  {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Monto Total:</span>
                <span>
                  {new Intl.NumberFormat("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    minimumFractionDigits: 2,
                  }).format(parseFloat(sale.entrega.costo_total))}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Tipo de entrega:</span>
                <Badge variant="outline" className="ml-1">
                  {deliveryType}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Estado:</span>
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_BG_COLORS[sale.id_estado as keyof typeof STATUS_BG_COLORS] || "bg-gray-100 text-gray-800"}`}>
                  {status}
                </div>
              </div>
              {sale.entrega.direccion_entrega && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium">Dirección:</span>
                    <p className="text-muted-foreground">{sale.entrega.direccion_entrega}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </h3>
            <div className="space-y-4">
              {sale.detalles.map((detalle, i) => {
                const productTotal = detalle.cantidad * detalle.precio_unitario_venta;
                const hasFrase = detalle.frase && detalle.frase.frase;
                const hasPersonalizacion = detalle.personalizacion && detalle.personalizacion.imagen_base64;
                
                return (
                  <div key={i} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">Producto ID: {detalle.id_producto}</div>
                        <div className="text-sm text-muted-foreground">
                          Cantidad: {detalle.cantidad} × {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.precio_unitario_venta)}
                        </div>
                        
                        {hasFrase && (
                          <div className="mt-2 flex items-start gap-2 text-sm">
                            <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium">Frase:</span>
                              <p className="text-muted-foreground">"{detalle.frase!.frase}"</p>
                              <p className="text-xs text-muted-foreground">
                                Costo adicional: {new Intl.NumberFormat("es-BO", {
                                  style: "currency",
                                  currency: "BOB",
                                  minimumFractionDigits: 2,
                                }).format(detalle.frase!.costo_frase)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {hasPersonalizacion && (
                          <div className="mt-2 flex items-start gap-2 text-sm">
                            <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="font-medium">Personalización:</span>
                              <p className="text-xs text-muted-foreground">
                                Incluye imagen personalizada
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Costo adicional: {new Intl.NumberFormat("es-BO", {
                                  style: "currency",
                                  currency: "BOB",
                                  minimumFractionDigits: 2,
                                }).format(detalle.personalizacion!.costo_personalizacion)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        {new Intl.NumberFormat("es-BO", {
                          style: "currency",
                          currency: "BOB",
                          minimumFractionDigits: 2,
                        }).format(productTotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    minimumFractionDigits: 2,
                  }).format(parseFloat(sale.entrega.costo_total))}
                </span>
              </div>
            </div>
          </div>
          
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
      </DialogContent>
    </Dialog>
  );
}