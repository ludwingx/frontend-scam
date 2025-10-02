"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Home, Truck, Search, Download, BadgeDollarSign, QrCode, CreditCard, Calendar, X, Users, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isSameYear, isSameMonth, startOfMonth, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";

// Configuración para tipos de pedido
const ORDER_TYPE_CONFIG = {
  delivery: {
    label: "Delivery",
    icon: Truck,
    color: "text-red-600 font-semibold",
    bgColor: "bg-red-100",
  },
  pickup: {
    label: "Recoger",
    icon: Home,
    color: "text-blue-600 font-semibold",
    bgColor: "bg-blue-100",
  },
};

// Configuración para métodos de pago
const PAYMENT_METHOD_CONFIG = {
  efectivo: {
    label: "Efectivo",
    icon: BadgeDollarSign,
    color: "text-green-700 font-semibold",
    bgColor: "bg-green-200",
  },
  qr: {
    label: "QR",
    icon: QrCode,
    color: "text-purple-600 font-semibold",
    bgColor: "bg-purple-200",
  },
  tarjeta: {
    label: "Tarjeta",
    icon: CreditCard,
    color: "text-blue-600 font-semibold",
    bgColor: "bg-blue-200",
  },
  transferencia: {
    label: "Transferencia",
    icon: CreditCard,
    color: "text-orange-600 font-semibold",
    bgColor: "bg-orange-200",
  }
};

// Función para normalizar el método de pago
const normalizePaymentMethod = (method: string) => {
  const normalized = method.toLowerCase().replace(/\s+/g, '');
  return normalized in PAYMENT_METHOD_CONFIG ? normalized : 'efectivo';
};

// Definir colores de estado (basado en los estados reales de tu API)
const STATUS_COLORS = {
  Pendiente: {
    base: "bg-yellow-200 text-yellow-800 font-semibold",
  },
  "En cocina": {
    base: "bg-orange-200 text-orange-800 font-semibold",
  },
  "Listo para recoger": {
    base: "bg-purple-200 text-purple-800 font-semibold",
  },
  "En camino": {
    base: "bg-indigo-200 text-indigo-800 font-semibold",
  },
  Entregado: {
    base: "bg-green-200 text-green-800 font-semibold",
  },
  Cancelado: {
    base: "bg-red-200 text-red-800 font-semibold",
  },
};

interface StatusOption {
  id: string;
  label: string;
}

export interface Sale {
  id: number;
  client: string;
  brand: string;
  date: string;
  products: { name: string; quantity: number; price: number }[];
  amount: number;
  status: string;
  orderType: "delivery" | "pickup";
  paymentMethod: string;
  notes?: string;
  receptor?: string; // Agregado para mostrar el receptor
}

interface SalesHistoryTableProps {
  sales: Sale[];
  statuses?: StatusOption[];
}

export default function SalesHistoryTable({ 
  sales = [], 
  statuses = [
    { id: "1", label: "Pendiente" },
    { id: "2", label: "En cocina" },
    { id: "3", label: "Listo para recoger" },
    { id: "4", label: "En camino" },
    { id: "5", label: "Entregado" },
    { id: "6", label: "Cancelado" },
  ],
}: SalesHistoryTableProps) {
  const [localSales] = useState<Sale[]>(sales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [filterOrderType, setFilterOrderType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ 
    from: undefined, 
    to: undefined 
  });

  // Configurar el rango de fechas por defecto (mes actual)
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const endOfToday = endOfDay(today);
    
    setDateRange({
      from: firstDayOfMonth,
      to: endOfToday
    });
  }, []);

  // QUITAR el filtro de ventas históricas - mostrar TODAS las ventas
  const allSales = localSales;

  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
      const matchesPaymentMethod = filterPaymentMethod === "all" || 
                                  normalizePaymentMethod(sale.paymentMethod) === filterPaymentMethod;
      const matchesOrderType = filterOrderType === "all" || sale.orderType === filterOrderType;
      
      const matchesSearch = searchTerm === "" || 
        sale.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.id.toString().includes(searchTerm) ||
        (sale.receptor && sale.receptor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sale.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtro por rango de fechas
      const saleDate = new Date(sale.date);
      const matchesDateRange = (!dateRange.from || saleDate >= dateRange.from) && 
                              (!dateRange.to || saleDate <= new Date(dateRange.to.getTime() + 86400000));

      return matchesStatus && matchesPaymentMethod && matchesOrderType && 
             matchesSearch && matchesDateRange;
    });
  }, [allSales, filterStatus, filterPaymentMethod, filterOrderType, searchTerm, dateRange]);

  // Métodos de pago únicos
  const paymentMethods = useMemo(() => {
    const methods = new Set(allSales.map(sale => normalizePaymentMethod(sale.paymentMethod)));
    return Array.from(methods);
  }, [allSales]);

  // Estados únicos
  const uniqueStatuses = useMemo(() => {
    const statusSet = new Set(allSales.map(sale => sale.status));
    return Array.from(statusSet).map(status => ({
      id: status,
      label: status
    }));
  }, [allSales]);

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilterStatus("all");
    setFilterPaymentMethod("all");
    setFilterOrderType("all");
    setSearchTerm("");
    
    // Al limpiar, volver al rango por defecto (mes actual)
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const endOfToday = endOfDay(today);
    
    setDateRange({
      from: firstDayOfMonth,
      to: endOfToday
    });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filterStatus !== "all" || 
                          filterPaymentMethod !== "all" || 
                          filterOrderType !== "all" || 
                          searchTerm !== "" || 
                          (dateRange.from && dateRange.from.getTime() !== startOfMonth(new Date()).getTime()) ||
                          (dateRange.to && dateRange.to.getTime() !== endOfDay(new Date()).getTime());

  // Función para formatear el rango de fechas en el botón
  const formatDateRange = () => {
    if (!dateRange.from) return "Seleccionar rango";
    
    if (!dateRange.to) {
      return format(dateRange.from, "dd MMM yyyy", { locale: es });
    }
    
    const from = dateRange.from;
    const to = dateRange.to;
    
    if (isSameYear(from, to) && isSameMonth(from, to)) {
      return `${format(from, "dd", { locale: es })} - ${format(to, "dd MMM yyyy", { locale: es })}`;
    }
    
    if (isSameYear(from, to)) {
      return `${format(from, "dd MMM", { locale: es })} - ${format(to, "dd MMM yyyy", { locale: es })}`;
    }
    
    return `${format(from, "dd MMM yyyy", { locale: es })} - ${format(to, "dd MMM yyyy", { locale: es })}`;
  };

  // Si no hay ventas, mostrar mensaje
  if (allSales.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay ventas disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(totalAmount);

  return (
    <Card className="mb-6 h-[800px] flex flex-col">
      <CardHeader className="flex flex-col space-y-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-xl font-medium font-semibold">Historial de Ventas</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredSales.length} de {allSales.length} ventas • Total: {formattedTotal}
          </p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Filtros con buscador integrado */}
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2 min-h-[50px]">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            {/* Buscador integrado en la línea de filtros */}
            <div className="space-y-1 min-w-[200px]">
              <Label className="text-xs">Buscar venta</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ID, cliente, producto o receptor..."
                  className="pl-8 w-full h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro de Rango de Fechas */}
            <div className="space-y-1 min-w-[200px]">
              <Label className="text-xs">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ 
                      from: range?.from, 
                      to: range?.to 
                    })}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Filtro de Método de Pago */}
            <div className="space-y-1 min-w-[130px]">
              <Label className="text-xs">Pago</Label>
              <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {PAYMENT_METHOD_CONFIG[method as keyof typeof PAYMENT_METHOD_CONFIG]?.label || method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Tipo de Pedido */}
            <div className="space-y-1 min-w-[130px]">
              <Label className="text-xs">Tipo</Label>
              <Select value={filterOrderType} onValueChange={setFilterOrderType}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="pickup">Recoger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Estado */}
            <div className="space-y-1 min-w-[130px]">
              <Label className="text-xs">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón para limpiar filtros */}
            {hasActiveFilters && (
              <div className="space-y-1">
                <Label className="text-xs invisible">Limpiar</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-9"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-md border flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Receptor</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Productos</TableHead>
                  <TableHead className="font-semibold text-right">Monto</TableHead>
                  <TableHead className="font-semibold">Método de pago</TableHead>
                  <TableHead className="font-semibold">Tipo de Pedido</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => {
                    const statusColors = STATUS_COLORS[
                      sale.status as keyof typeof STATUS_COLORS
                    ] || {
                      base: "bg-gray-100 text-gray-800 font-semibold",
                    };
                    
                    const orderTypeConfig = ORDER_TYPE_CONFIG[
                      sale.orderType as keyof typeof ORDER_TYPE_CONFIG
                    ] || {
                      label: "Desconocido",
                      icon: Home,
                      color: "text-gray-600",
                      bgColor: "bg-gray-100",
                    };
                    
                    const normalizedPaymentMethod = normalizePaymentMethod(sale.paymentMethod);
                    const paymentMethodConfig = PAYMENT_METHOD_CONFIG[
                      normalizedPaymentMethod as keyof typeof PAYMENT_METHOD_CONFIG
                    ] || {
                      label: sale.paymentMethod,
                      icon: CreditCard,
                      color: "text-gray-600",
                      bgColor: "bg-gray-100",
                    };
                    
                    const OrderIconComponent = orderTypeConfig.icon;
                    const PaymentIconComponent = paymentMethodConfig.icon;

                    return (
                      <TableRow key={sale.id}>
                        <TableCell className="font-mono text-xs">#{sale.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            {sale.client}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {sale.receptor || sale.client}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            {new Date(sale.date).toLocaleDateString("es-BO", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(sale.date).toLocaleTimeString("es-BO", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1 max-w-[200px]">
                            {sale.products.map((product, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                                <span className="truncate">
                                  {product.name} (x{product.quantity})
                                </span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat("es-BO", {
                            style: "currency",
                            currency: "BOB",
                            minimumFractionDigits: 2,
                          }).format(sale.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${paymentMethodConfig.bgColor} ${paymentMethodConfig.color}`}
                          >
                            <PaymentIconComponent className="h-3 w-3" />
                            {paymentMethodConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${orderTypeConfig.bgColor} ${orderTypeConfig.color}`}
                          >
                            <OrderIconComponent className="h-3 w-3" />
                            {orderTypeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${statusColors.base} whitespace-nowrap cursor-default`}
                          >
                            {sale.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No hay ventas que coincidan con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}