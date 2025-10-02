"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, Filter, Home, Truck, Calendar, Eye, Users, Package, DollarSign, MapPin, Phone, Clock, FileText } from "lucide-react";
import { Sale } from "@/types/sales";

const DELIVERY_TYPE_MAP: Record<number, string> = {
  1: "Delivery",
  2: "Recoger en tienda"
};

interface FutureSalesTableProps {
  sales?: Sale[];
  // Se elimina updateSaleStatus ya que no se permite cambiar estados
}

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

// Componente para el diálogo de detalles de venta
function SaleDetailsDialog({ sale }: { sale: Sale }) {
  const [open, setOpen] = useState(false);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Información del pedido */}
          <div className="space-y-6">
            {/* Información del cliente y entrega */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Cliente</h4>
                  <p className="text-sm">{sale.nombre_cliente}</p>
                  <div className="text-sm text-muted-foreground">
                    Receptor: {sale.entrega.nombre_receptor}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">
                    {deliveryType === "Delivery" ? "Dirección de entrega" : "Sucursal de recogida"}
                  </h4>
                  <p className="text-sm">{sale.entrega.direccion_entrega || "No especificada"}</p>
                  {deliveryType === "Recoger en tienda" && sale.entrega.nombre_sucursal && (
                    <p className="text-sm text-muted-foreground">{sale.entrega.nombre_sucursal}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Teléfono</h4>
                  <p className="text-sm">{sale.entrega.telefono_receptor || "No especificado"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Fecha y hora de entrega</h4>
                  <p className="text-sm">
                    {new Date(sale.fecha_entrega_estimada).toLocaleDateString("es-BO", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            {sale.observaciones && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Observaciones del pedido</h4>
                  <p className="text-sm text-muted-foreground">{sale.observaciones}</p>
                </div>
              </div>
            )}

            {sale.entrega.observaciones && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold">Observaciones de entrega</h4>
                  <p className="text-sm text-muted-foreground">{sale.entrega.observaciones}</p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Productos y resumen */}
          <div className="space-y-6">
            {/* Lista de productos */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({(sale.detalles || []).length})
              </h4>
              <div className="space-y-3">
                {(sale.detalles || []).map((detalle, index) => (
                  <div key={detalle.id_detalle || `detalle-${index}`} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{detalle.sabor_producto || "Producto sin nombre"}</p>
                        <p className="text-sm text-muted-foreground">{detalle.tamaño_producto || "Tamaño no especificado"}</p>
                        <p className="text-sm text-muted-foreground">Negocio: {detalle.nombre_negocio || "No especificado"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.subtotal || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {detalle.cantidad || 0} × {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.precio_unitario_venta || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Frase personalizada */}
                    {detalle.frase && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Frase personalizada:</p>
                        <p className="text-sm text-blue-700">{detalle.frase.frase}</p>
                        {detalle.frase.comentario_frase && (
                          <p className="text-xs text-blue-600 mt-1">{detalle.frase.comentario_frase}</p>
                        )}
                        <p className="text-xs text-blue-600 mt-1">
                          Costo adicional: {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.frase.costo_frase || 0)}
                        </p>
                      </div>
                    )}

                    {/* Personalización con imagen */}
                    {detalle.personalizacion && (
                      <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <p className="text-sm font-medium text-purple-800">Personalización:</p>
                        {detalle.personalizacion.comentario_personalizacion && (
                          <p className="text-sm text-purple-700">{detalle.personalizacion.comentario_personalizacion}</p>
                        )}
                        <p className="text-xs text-purple-600 mt-1">
                          Costo adicional: {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(detalle.personalizacion.costo_personalizacion || 0)}
                        </p>
                        {detalle.personalizacion.imagen_base64 && (
                          <div className="mt-2">
                            <p className="text-xs text-purple-600 mb-1">Imagen de referencia:</p>
                            <img 
                              src={`data:image/jpeg;base64,${detalle.personalizacion.imagen_base64}`}
                              alt="Personalización"
                              className="w-20 h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal productos:</span>
                <span>
                  {new Intl.NumberFormat("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    minimumFractionDigits: 2,
                  }).format((sale.detalles || []).reduce((sum, detalle) => sum + (detalle.subtotal || 0), 0))}
                </span>
              </div>

              {sale.entrega.costo_delivery > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Costo de delivery:</span>
                  <span>
                    {new Intl.NumberFormat("es-BO", {
                      style: "currency",
                      currency: "BOB",
                      minimumFractionDigits: 2,
                    }).format(sale.entrega.costo_delivery || 0)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total general:</span>
                <span>
                  {new Intl.NumberFormat("es-BO", {
                    style: "currency",
                    currency: "BOB",
                    minimumFractionDigits: 2,
                  }).format(sale.total_general || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Función para calcular días restantes con texto en español
function getDaysUntilDelivery(deliveryDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const delivery = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0);
  
  const diffTime = delivery.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Mañana";
  if (diffDays === 2) return "En 2 días";
  if (diffDays === 3) return "En 3 días";
  if (diffDays === 4) return "En 4 días";
  if (diffDays === 5) return "En 5 días";
  if (diffDays === 6) return "En 6 días";
  if (diffDays === 7) return "En 1 semana";
  if (diffDays <= 14) return `En ${diffDays} días`;
  if (diffDays <= 21) return "En 2 semanas";
  if (diffDays <= 28) return "En 3 semanas";
  if (diffDays <= 35) return "En 1 mes";
  return `En ${Math.ceil(diffDays / 30)} meses`;
}

// Función para obtener el color según los días restantes
function getDaysColor(daysText: string): string {
  if (daysText === "Mañana") return "text-orange-600 font-semibold";
  if (daysText.includes("2 días") || daysText.includes("3 días")) return "text-blue-600 font-medium";
  if (daysText.includes("4 días") || daysText.includes("5 días") || daysText.includes("6 días")) return "text-green-600 font-medium";
  if (daysText.includes("1 semana") || daysText.includes("2 semanas")) return "text-gray-600";
  return "text-gray-500";
}

export default function FutureSalesTable({ 
  sales = [],
}: FutureSalesTableProps) {
  const [filterStatus, setFilterStatus] = useState("all");

  // Filtrar ventas futuras (mañana en adelante, excluyendo hoy)
  const futureSales = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return sales.filter((sale) => {
      if (!sale.fecha_entrega_estimada) return false;
      
      try {
        const saleDate = new Date(sale.fecha_entrega_estimada);
        saleDate.setHours(0, 0, 0, 0);
        
        return !isNaN(saleDate.getTime()) && saleDate.getTime() >= tomorrow.getTime();
      } catch {
        return false;
      }
    });
  }, [sales]);

  // Filtrar y ordenar ventas
  const filteredSales = useMemo(() => {
    let result = futureSales;

    // Ordenar por fecha de entrega (más próximas primero)
    result = result.sort((a, b) => 
      new Date(a.fecha_entrega_estimada).getTime() - new Date(b.fecha_entrega_estimada).getTime()
    );

    return result;
  }, [futureSales]);

  // Calcular total de ventas futuras
  const totalAmount = futureSales.reduce((sum, sale) => sum + (sale.total_general || 0), 0);
  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(totalAmount);

  if (futureSales.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Ventas Futuras</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No hay ventas futuras</p>
                <p className="text-sm text-gray-400">Las ventas programadas para fechas futuras aparecerán aquí</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Ventas Futuras</CardTitle>
          <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-md">
            Total: {formattedTotal}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {futureSales.length} ventas programadas • Próxima entrega: {
            futureSales.length > 0 ? 
            new Date(futureSales[0].fecha_entrega_estimada).toLocaleDateString("es-BO") : 
            "N/A"
          }
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Tabla */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[140px]">Cliente</TableHead>
                  <TableHead className="w-[130px]">Fecha Entrega</TableHead>
                  <TableHead className="w-[120px]">Monto Total</TableHead>
                  <TableHead className="w-[120px]">Tipo Entrega</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => {
                  const deliveryType = DELIVERY_TYPE_MAP[sale.entrega.id_tipo_entrega] || "Desconocido";
                  const daysText = getDaysUntilDelivery(sale.fecha_entrega_estimada);
                  const daysColor = getDaysColor(daysText);

                  return (
                    <TableRow key={`sale-${sale.tempId || sale.id_venta}-${sale.id_venta}`} className="hover:bg-muted/50">
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
                          {new Date(sale.fecha_entrega_estimada).toLocaleDateString("es-BO", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(sale.fecha_entrega_estimada).toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                        <div className={`text-xs font-medium mt-1 ${daysColor}`}>
                          {daysText}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("es-BO", {
                          style: "currency",
                          currency: "BOB",
                          minimumFractionDigits: 2,
                        }).format(sale.total_general || 0)}
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
                      <TableCell className="text-right">
                        <SaleDetailsDialog sale={sale} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Contador de resultados */}
        {filteredSales.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredSales.length} ventas programadas
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}