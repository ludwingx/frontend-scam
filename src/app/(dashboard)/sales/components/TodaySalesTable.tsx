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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  Check,
  ArrowUpDown,
  Filter,
  Truck,
  Home,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLORS = {
  Pendiente: {
    base: "bg-yellow-200 text-yellow-800 font-semibold",
    hover: "hover:bg-yellow-500 hover:text-white",
  },
  "En cocina": {
    base: "bg-orange-200 text-orange-800 font-semibold",
    hover: "hover:bg-orange-500 hover:text-white",
  },
  "Listo para recoger": {
    base: "bg-purple-200 text-purple-800 font-semibold",
    hover: "hover:bg-purple-500 hover:text-white",
  },
  "En camino": {
    base: "bg-indigo-200 text-indigo-800 font-semibold",
    hover: "hover:bg-indigo-500 hover:text-white",
  },
  Entregado: {
    base: "bg-green-200 text-green-800 font-semibold",
    hover: "hover:bg-green-500 hover:text-white",
  },
  Cancelado: {
    base: "bg-red-200 text-red-800 font-semibold",
    hover: "hover:bg-red-500 hover:text-white",
  },
};

// OPCIONES DE ESTADO ACTUALIZADAS
const STATUS_OPTIONS = [
  { id: "pending", label: "Pendiente" },
  { id: "in-kitchen", label: "En cocina" },
  { id: "ready", label: "Listo para recoger" },
  { id: "on-the-way", label: "En camino" },
  { id: "delivered", label: "Entregado" },
  { id: "cancelled", label: "Cancelado" },
];

// Mapeo de tipos de pedido a iconos y colores
const ORDER_TYPE_CONFIG = {
  delivery: {
    label: "Delivery",
    icon: Truck,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  pickup: {
    label: "Recoger",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
};

interface Sale {
  id: number;
  client: string;
  brand: string;
  date: string;
  products: { name: string; quantity: number }[];
  amount: number;
  status: string;
  orderType: "delivery" | "pickup"; // Nuevo campo
}
interface TodaySalesTableProps {
  sales?: Array<
    Omit<Sale, "orderType"> & { orderType: string | "delivery" | "recogida" }
  >;
  updateSaleStatus?: (id: number, statusId: string) => void;
}

function sanitizeSales(sales: any[]): Sale[] {
  return sales.map((sale) => ({
    ...sale,
    orderType: sale.orderType === "pickup" ? "pickup" : "delivery",
  }));
}

import salesData from "../data/salesData.json";

export default function TodaySalesTable({
  sales = salesData.sales,
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  },
}: TodaySalesTableProps) {
  const [localSales, setLocalSales] = useState<Sale[]>(sanitizeSales(sales));
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeSort, setTimeSort] = useState<"asc" | "desc" | "none">("desc");
  const [amountSort, setAmountSort] = useState<"asc" | "desc" | "none">("none");

  // Obtener la hora actual
  const currentTime = new Date();
  
  // Separar pedidos en próximos y pasados
  const { upcomingSales, pastSales } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const filtered = localSales.filter((sale) => {
      const saleDate = sale.date.split("T")[0];
      return saleDate === today;
    });

    // Separar en pedidos próximos y pasados
    const upcoming = [];
    const past = [];
    
    for (const sale of filtered) {
      const saleTime = new Date(sale.date);
      // Considerar un pedido como "pasado" si su hora es más de 30 minutos antes de la hora actual
      const timeDiff = (currentTime.getTime() - saleTime.getTime()) / (1000 * 60);
      
      if (timeDiff > 30) {
        past.push(sale);
      } else {
        upcoming.push(sale);
      }
    }

    // Ordenar por fecha de forma descendente (más reciente primero)
    upcoming.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingSales: upcoming, pastSales: past };
  }, [localSales, currentTime]);

  // Combinar y filtrar las ventas según los filtros aplicados
  const filteredSales = useMemo(() => {
    // Primero aplicar filtros a ambos grupos
    const filterSales = (salesArray: Sale[]) => {
      let result = salesArray.filter(
        (sale) => filterStatus === "all" || sale.status === filterStatus
      );

      // Ordenar por hora si es necesario
      if (timeSort !== "none") {
        result = result.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return timeSort === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      // Ordenar por monto si es necesario
      if (amountSort !== "none") {
        result = result.sort((a, b) => {
          return amountSort === "asc" ? a.amount - b.amount : b.amount - a.amount;
        });
      }

      return result;
    };

    const filteredUpcoming = filterSales(upcomingSales);
    const filteredPast = filterSales(pastSales);

    return { upcoming: filteredUpcoming, past: filteredPast };
  }, [upcomingSales, pastSales, filterStatus, timeSort, amountSort]);

  const handleStatusChange = (saleId: number, newStatusId: string) => {
    const newStatus =
      STATUS_OPTIONS.find((s) => s.id === newStatusId)?.label || newStatusId;

    setLocalSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === saleId ? { ...sale, status: newStatus } : sale
      )
    );

    updateSaleStatus(saleId, newStatusId);
  };

  // Calculate total amount for today's sales
  const allTodaySales = [...upcomingSales, ...pastSales];
  const totalAmount = allTodaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const formattedTotal = new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(totalAmount);

  // If there are no sales for today, don't render anything
  if (allTodaySales.length === 0) {
    return null;
  }

  // Componente para renderizar una fila de venta
  const renderSaleRow = (sale: Sale) => {
    const statusColors = STATUS_COLORS[
      sale.status as keyof typeof STATUS_COLORS
    ] || {
      base: "bg-gray-100 text-gray-800",
      hover: "hover:bg-gray-700 hover:text-white",
    };

    const orderTypeConfig = ORDER_TYPE_CONFIG[
      sale.orderType
    ] || {
      label: "Desconocido",
      icon: Home,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };
    const IconComponent = orderTypeConfig.icon;

    return (
      <TableRow key={sale.id}>
        <TableCell className="font-medium">{sale.id}</TableCell>
        <TableCell>{sale.client}</TableCell>
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
          <div className="flex flex-col space-y-1">
            {sale.products.map((product, i) => (
              <div
                key={i}
                className="flex items-center text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                {product.name} ({product.quantity} unidades)
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell>
          {new Intl.NumberFormat("es-BO", {
            style: "currency",
            currency: "BOB",
            minimumFractionDigits: 2,
          }).format(sale.amount)}
        </TableCell>
        <TableCell>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${orderTypeConfig.bgColor} ${orderTypeConfig.color}`}
          >
            <IconComponent className="h-3 w-3" />
            {orderTypeConfig.label}
          </div>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-auto min-h-8 px-2 py-1.5 ${statusColors.base} ${statusColors.hover} cursor-pointer transition-colors whitespace-normal text-wrap text-left max-w-[180px]`}
              >
                {sale.status}
                <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>
                Cambiar estado
              </DropdownMenuLabel>
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status.id}
                  className="flex items-center justify-between"
                  onClick={() =>
                    handleStatusChange(sale.id, status.id)
                  }
                >
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        STATUS_COLORS[
                          status.label as keyof typeof STATUS_COLORS
                        ]?.base.split(" ")[0] || "bg-gray-100"
                      }`}
                    />
                    {status.label}
                  </div>
                  {status.label === sale.status && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex-1 pb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-medium font-semibold">
              Ventas de Hoy
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {allTodaySales.length} ventas registradas • Total: {formattedTotal}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros - Ordenados según las columnas de la tabla */}
          <div className="flex flex-wrap gap-4 mb-4 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrar por:</span>
            </div>

            {/* Ordenar por Monto (columna 5) */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Monto:</span>
              <Select
                value={amountSort}
                onValueChange={(value: "asc" | "desc" | "none") =>
                  setAmountSort(value)
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sin orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin orden</SelectItem>
                  <SelectItem value="asc">Menor a mayor</SelectItem>
                  <SelectItem value="desc">Mayor a menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
                {/* Filtro por Estado (columna 7) */}
                <div className="flex items-center gap-2">
              <span className="text-sm">Estado:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.id} value={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div style={{ minHeight: 600, maxHeight: 600, overflowY: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Productos</TableHead>
                  <TableHead className="font-semibold">Monto</TableHead>
                  <TableHead className="font-semibold">
                    Tipo de Pedido
                  </TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.upcoming.length > 0 || filteredSales.past.length > 0 ? (
                  <>
                    {/* Pedidos próximos */}
                    {filteredSales.upcoming.map(renderSaleRow)}
                    
                    {/* Separador para pedidos pasados */}
                    {filteredSales.past.length > 0 && (
                      <>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableCell colSpan={7} className="p-0">
                            <div className="flex items-center px-4 py-2 text-sm font-medium text-black bg-red-200">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="font-semibold">Pedidos con tiempo vencido</span>
                            </div>
                          </TableCell>
                        </TableRow>
                        {filteredSales.past.map(renderSaleRow)}
                      </>
                    )}
                  </>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      No hay ventas para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}