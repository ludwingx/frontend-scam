"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Check, ChevronLeft, ChevronRight, Filter, Home, Truck } from "lucide-react";

// Modificar los textos a una sola palabra
const ORDER_TYPE_CONFIG = {
  delivery: {
    label: "Delivery", // Se mantiene igual (una palabra)
    icon: Truck,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  pickup: {
    label: "Recoger", // Cambiado de "Recoge en tienda" a "Recoger"
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Definir colores de estado consistentes con la otra tabla
const STATUS_COLORS = {
  Pendiente: {
    base: "bg-yellow-200 text-yellow-800 font-semibold",
    hover: "hover:bg-yellow-500 hover:text-white",
  },
  "En proceso": {
    base: "bg-blue-200 text-blue-800 font-semibold",
    hover: "hover:bg-blue-500 hover:text-white",
  },
  Completado: {
    base: "bg-green-200 text-green-800 font-semibold",
    hover: "hover:bg-green-500 hover:text-white",
  },
  Cancelado: {
    base: "bg-red-200 text-red-800 font-semibold",
    hover: "hover:bg-red-500 hover:text-white",
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
  products: { name: string; quantity: number }[];
  amount: number;
  status: string;
  orderType: "delivery" | "pickup";
}

interface FutureSalesTableProps {
  sales: Sale[];
  statuses: StatusOption[];
  updateSaleStatus: (saleId: number, newStatus: string) => void;
}

export default function FutureSalesTable({ 
  sales = [], 
  statuses = [
    { id: "pending", label: "Pendiente" },
    { id: "in-kitchen", label: "En cocina" },
    { id: "ready", label: "Listo para recoger" },
    { id: "on-the-way", label: "En camino" },
    { id: "delivered", label: "Entregado" },
    { id: "cancelled", label: "Cancelado" },
  ],
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  } 
}: FutureSalesTableProps) {
  const [localSales, setLocalSales] = useState<Sale[]>(sales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeSort, setTimeSort] = useState<"asc" | "desc" | "none">("desc");
  const [amountSort, setAmountSort] = useState<"asc" | "desc" | "none">("none");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const futureSales = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return localSales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() > today.getTime();
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [localSales]);

  const filteredSales = useMemo(() => {
    let result = futureSales.filter(sale => 
      filterStatus === "all" || sale.status === filterStatus
    );

    if (timeSort !== "none") {
      result = result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return timeSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    if (amountSort !== "none") {
      result = result.sort((a, b) => {
        return amountSort === "asc" ? a.amount - b.amount : b.amount - a.amount;
      });
    }

    return result;
  }, [futureSales, filterStatus, timeSort, amountSort]);

  const totalPages = Math.ceil(filteredSales.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + rowsPerPage);

  const handleStatusChange = (saleId: number, newStatusId: string) => {
    const newStatus = statuses.find(s => s.id === newStatusId)?.label || newStatusId;
    
    setLocalSales(prevSales => 
      prevSales.map(sale => 
        sale.id === saleId 
          ? { ...sale, status: newStatus }
          : sale
      )
    );
    
    updateSaleStatus(saleId, newStatusId);
  };

  if (futureSales.length === 0) {
    return null;
  }

  const totalAmount = futureSales.reduce((sum, sale) => sum + sale.amount, 0);
  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(totalAmount);

  return (
    <div className="flex-1 pb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-medium font-semibold">
              Ventas Futuras
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {futureSales.length} ventas programadas • Total: {formattedTotal}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrar por:</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Estado:</span>
              <Select 
                value={filterStatus} 
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Monto:</span>
              <Select
                value={amountSort}
                onValueChange={(value: "asc" | "desc" | "none") => {
                  setAmountSort(value);
                  setCurrentPage(1);
                }}
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
          </div>

          <div style={{ minHeight: 600, maxHeight: 600, overflowY: 'auto' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Productos</TableHead>
                  <TableHead className="font-semibold">Monto</TableHead>
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
                      base: "bg-gray-100 text-gray-800",
                      hover: "hover:bg-gray-700 hover:text-white",
                    };
                    
                    const orderTypeConfig = ORDER_TYPE_CONFIG[
                      sale.orderType as keyof typeof ORDER_TYPE_CONFIG
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
                              <div key={i} className="flex items-center text-sm">
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
                          <Badge 
                            variant="outline" 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${orderTypeConfig.bgColor} ${orderTypeConfig.color}`}
                          >
                            <IconComponent className="h-3 w-3" />
                            {orderTypeConfig.label}
                          </Badge>
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
                              {statuses.map((status) => (
                                <DropdownMenuItem
                                  key={status.id}
                                  className="flex items-center justify-between"
                                  onClick={() => handleStatusChange(sale.id, status.id)}
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
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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