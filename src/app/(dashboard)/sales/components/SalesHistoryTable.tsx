"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MoreHorizontal, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

interface StatusOption {
  id: string;
  label: string;
  color: string;
}

export interface Sale {
  id: number;
  client: string;
  brand: string;
  date: string;
  products: { name: string; quantity: number }[];
  amount: number;
  status: string;
}

interface SalesHistoryTableProps {
  sales: Sale[];
  statuses?: StatusOption[];
  updateSaleStatus?: (saleId: number, newStatus: string) => void;
}

export default function SalesHistoryTable({ 
  sales = [], 
  statuses = [
    { id: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'in-progress', label: 'En proceso', color: 'bg-blue-100 text-blue-800' },
    { id: 'completed', label: 'Completado', color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ],
  updateSaleStatus = (id, statusId) => {
    console.log(`Updating sale ${id} status to ${statusId}`);
  }
}: SalesHistoryTableProps) {
  const [localSales, setLocalSales] = useState<Sale[]>(sales);
  const [filterStatus, setFilterStatus] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const historySales = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return localSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate < today;
    });
  }, [localSales]);

  const filteredSales = useMemo(() => {
    return historySales.filter(sale => 
      filterStatus === "all" || 
      statuses.find(s => s.label === sale.status)?.id === filterStatus
    );
  }, [historySales, filterStatus, statuses]);

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

  // If there are no history sales, don't render anything
  if (historySales.length === 0) {
    return null;
  }

  const totalAmount = historySales.reduce((sum, sale) => sum + sale.amount, 0);
  const formattedTotal = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(totalAmount);

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Historial de Ventas</CardTitle>
          <p className="text-sm text-muted-foreground">
            {historySales.length} ventas registradas • Total: {formattedTotal}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSales.length > 0 ? (
                paginatedSales.map((sale) => {
                  const statusInfo = getStatusInfo(sale.status);
                  const saleDate = new Date(sale.date);
                  const formattedDate = new Date(sale.date).toLocaleString('es-BO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }).replace(',', '');
                  
                  return (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.client}</TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {sale.products.map((product, idx) => (
                            <span key={idx} className="text-sm">
                              {product.quantity}x {product.name}
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
                        <Badge className={`${statusInfo.color} whitespace-nowrap`}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                            {statuses.map((status) => (
                              <DropdownMenuItem
                                key={status.id}
                                onClick={() => handleStatusChange(sale.id, status.id)}
                                className="flex items-center justify-between"
                              >
                                {status.label}
                                {sale.status === status.label && <Check className="h-4 w-4" />}
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
          
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 p-4 border-t">
            <div className="flex items-center gap-2">
              <small className="text-sm font-medium text-muted-foreground">
                Mostrando {filteredSales.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + rowsPerPage, filteredSales.length)} de {filteredSales.length} ventas
              </small>
              <span className="ml-4 font-medium">Filas:</span>
              <Select 
                value={String(rowsPerPage)} 
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
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
        </div>
      </CardContent>
    </Card>
  );
}
