"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for demonstration
const MOCK_SALES = [
  {
    id: 1001,
    client: "Restaurante El Dorado",
    brand: "Nestlé",
    date: new Date().toISOString().split("T")[0],
    products: [
      { name: "Leche en polvo", quantity: 5 },
      { name: "Café instantáneo", quantity: 10 }
    ],
    amount: 125.75,
    status: "Pendiente"
  },
  {
    id: 1002,
    client: "Cafetería Central",
    brand: "Dos Pinos",
    date: new Date().toISOString().split("T")[0],
    products: [
      { name: "Leche entera", quantity: 20 },
      { name: "Queso crema", quantity: 8 }
    ],
    amount: 198.50,
    status: "En Proceso"
  },
  {
    id: 1003,
    client: "Panadería Dulce Hogar",
    brand: "Lala",
    date: new Date().toISOString().split("T")[0],
    products: [
      { name: "Mantequilla", quantity: 15 },
      { name: "Crema para batir", quantity: 10 }
    ],
    amount: 156.25,
    status: "Completado"
  },
  {
    id: 1004,
    client: "Restaurante Mar y Tierra",
    brand: "Saputo",
    date: new Date().toISOString().split("T")[0],
    products: [
      { name: "Queso mozzarella", quantity: 12 },
      { name: "Queso parmesano", quantity: 5 },
      { name: "Mantequilla sin sal", quantity: 8 }
    ],
    amount: 234.90,
    status: "Pendiente"
  },
  {
    id: 1005,
    client: "Cafetería La Esquina",
    brand: "Nestlé",
    date: new Date().toISOString().split("T")[0],
    products: [
      { name: "Leche deslactosada", quantity: 8 },
      { name: "Crema para café", quantity: 5 }
    ],
    amount: 87.30,
    status: "En Proceso"
  }
];

const STATUS_OPTIONS = [
  { id: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  { id: "in-progress", label: "En Proceso", color: "bg-blue-100 text-blue-800" },
  { id: "completed", label: "Completado", color: "bg-green-100 text-green-800" },
  { id: "cancelled", label: "Cancelado", color: "bg-red-100 text-red-800" }
];

interface Sale {
  id: number;
  client: string;
  brand: string;
  date: string;
  products: { name: string; quantity: number }[];
  amount: number;
  status: string;
}

interface TodaySalesTableProps {
  sales?: Sale[];
  statuses?: { id: string; label: string; color: string }[];
  updateSaleStatus?: (id: number, statusId: string) => void;
}

export default function TodaySalesTable({ 
  sales = MOCK_SALES, 
  statuses = STATUS_OPTIONS,
  updateSaleStatus = (id, statusId) => {
    // In a real app, this would update the status in the backend
    console.log(`Updating sale ${id} status to ${statusId}`);
  } 
}: TodaySalesTableProps) {
  const [localSales, setLocalSales] = useState<Sale[]>(sales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const todaySales = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return localSales.filter(sale => {
      // Handle both date-only and timestamp formats
      const saleDate = sale.date.split("T")[0];
      return saleDate === today;
    });
  }, [localSales]);

  const filteredSales = useMemo(() => {
    return todaySales.filter(sale => 
      filterStatus === "all" || sale.status === filterStatus
    );
  }, [todaySales, filterStatus]);

  const totalPages = Math.ceil(filteredSales.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + rowsPerPage);

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.label === status) || 
           { id: 'unknown', label: status, color: 'bg-gray-100 text-gray-800' };
  };

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

  // Calculate total amount for today's sales
  const totalAmount = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(totalAmount);

  // If there are no sales for today, don't render anything
  if (todaySales.length === 0) {
    return null;
  }

  return (
    <div className="flex-1 pb-6">
      <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Ventas de Hoy</CardTitle>
          <p className="text-sm text-muted-foreground">
            {todaySales.length} ventas registradas • Total: {formattedTotal}
          </p>
        </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                paginatedSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell >{sale.client}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(sale.date).toLocaleString('es-BO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }).replace(',', '')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {sale.products.map((product, i) => (
                          <span key={i} className="text-sm">
                            {product.name} ({product.quantity} unidades)
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('es-BO', {
                        style: 'currency',
                        currency: 'BOB',
                        minimumFractionDigits: 2
                      }).format(sale.amount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className={`h-8 px-2 ${getStatusInfo(sale.status).color} hover:opacity-80 cursor-pointer`}
                          >
                            {getStatusInfo(sale.status).label}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {statuses.map((status) => (
                            <DropdownMenuItem 
                              key={status.id}
                              className={`flex items-center justify-between ${status.id === getStatusInfo(sale.status).id ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                              onClick={() => handleStatusChange(sale.id, status.id)}
                            >
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${status.color.split(' ')[0]}`} />
                                {status.label}
                              </div>
                              {status.id === getStatusInfo(sale.status).id && (
                                <Check className="h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No hay ventas para mostrar.
                  </TableCell>
                </TableRow>
              )}
              
              {/* Empty rows for consistent height */}
              {Array.from({ length: Math.max(0, rowsPerPage - paginatedSales.length) }).map((_, index) => (
                <TableRow key={`empty-${index}`}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <TableCell key={i}>&nbsp;</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 p-4 border-t">
          <div className="flex items-center gap-2">
            <small className="text-sm font-medium text-muted-foreground">
              Mostrando {Math.min(rowsPerPage, filteredSales.length)} de {filteredSales.length} ventas
            </small>
            <span className="ml-4 font-medium">Filas:</span>
            <Select 
              value={String(rowsPerPage)} 
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
