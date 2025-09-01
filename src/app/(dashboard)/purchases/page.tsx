"use client";

import { useEffect, useState } from "react";
import { getPurchases } from "@/services/purchaseService";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { PurchasesActions } from "./PurchasesActions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/date-range-filter";

import { Purchase } from "./columns";

export default function Page() {
  const [data, setData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Set default date range to last 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: thirtyDaysAgo,
    to: today,
  });

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Load data immediately when component mounts
  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fechaDesde = formatDateForAPI(dateRange.from);
      const fechaHasta = formatDateForAPI(dateRange.to);
      
      // Get all purchases within the date range
      const allPurchases = await getPurchases({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      });
      
      
      if (!Array.isArray(allPurchases)) {
        throw new Error('Formato de respuesta inválido: Se esperaba un array de compras');
      }

      // The API returns a flat list of purchase items, but we want to show them all
      // since we're already filtering by date range in the API call
      const sortedPurchases = [...allPurchases].sort((a, b) => 
        new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime()
      );
      
      setData(sortedPurchases);
      
      if (sortedPurchases.length === 0) {
        setError('No se encontraron compras para el rango de fechas seleccionado');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cargar las compras: ${errorMessage}`);
      setError('No se pudieron cargar las compras. Por favor, intente nuevamente.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };
  console.log('lista de compras', data);
  // Fetch purchases when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchPurchases();
    }
  }, [dateRange]);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-background">
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">
                Gestión de Compras
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Gestión de Compras</h2>
        <small className="text-sm font-medium text-muted-foreground">
          Aquí podrás visualizar, registrar, editar y eliminar las compras de ingredientes y materiales.
        </small>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <DateRangeFilter 
          onDateRangeChange={handleDateRangeChange} 
          className="w-full md:w-auto"
        />
        <PurchasesActions onSuccess={fetchPurchases} />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-destructive">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchPurchases}
            >
              Reintentar
            </Button>
          </div>
        ) : data.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No hay compras registradas para el mes actual
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            enableFilter
            filterPlaceholder="Filtrar por fecha de compra..."
            filterColumn="fecha_compra"
            enablePagination
            enableRowSelection
            enableColumnVisibility
          />
        )}
      </div>
    </div>
  );
}