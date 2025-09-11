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

import { Purchase, PurchaseItem } from "./columns";
import { PurchaseItemsDrawer } from "./PurchaseItemsDrawer";

export default function Page() {
  const [data, setData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
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
      console.log("📦 Respuesta cruda del backend:", allPurchases);
      if (!Array.isArray(allPurchases)) {
        throw new Error('Formato de respuesta inválido: Se esperaba un array de compras');
      }

      // Transform the data to match the new Purchase type structure
      const transformedPurchases: Purchase[] = allPurchases.map(purchase => ({
        id_compra: purchase.id_compra,
        fecha_compra: purchase.fecha_compra,
        proveedor: purchase.proveedor,
        estado: purchase.estado as Purchase['estado'],
        fecha_pagado: purchase.fecha_pagado,
        metodo_pago: purchase.metodo_pago,
        observaciones: purchase.observaciones,
        monto_total: typeof purchase.monto_total === 'string' ? parseFloat(purchase.monto_total) : purchase.monto_total,
        items: [{
          id_insumo: purchase.id_insumo,
          nombre_insumo: purchase.nombre_insumo || `Insumo ${purchase.id_insumo}`,
          cantidad: typeof purchase.cantidad === 'string' ? parseFloat(purchase.cantidad) : purchase.cantidad || 0,
          precio_unitario: typeof purchase.precio_unitario === 'string' ? parseFloat(purchase.precio_unitario) : purchase.precio_unitario || 0,
          unidad_medida: purchase.unidad_medida || 'unidad',
          subtotal: typeof purchase.monto_total === 'string' ? parseFloat(purchase.monto_total) : purchase.monto_total || 0
        }]
      }));

      const sortedPurchases = [...transformedPurchases].sort((a, b) => 
        new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime()
      );
      
      setData(sortedPurchases);
      
      if (sortedPurchases.length === 0) {
        setError('No se encontraron compras para el rango de fechas seleccionado');
      }
    } catch (error) {
      console.error('Error al cargar las compras:', error);
      
      // Check if it's a connection error
      const isConnectionError = error instanceof Error && 
        (error.message.includes('No se pudo conectar al servidor') ||
         error.message.includes('conexión a internet'));
      
      // Mostrar mensaje de error apropiado
      if (isConnectionError) {
        setError('No se pudo conectar al servidor.');
      } else {
        setError('No se pudieron cargar las compras.');
      }
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  // Fetch purchases when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchPurchases();
    }
  }, [dateRange]);

  const handleViewItems = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-background">
      <PurchaseItemsDrawer
        open={!!selectedPurchase}
        onOpenChange={(open) => !open && setSelectedPurchase(null)}
        purchase={selectedPurchase}
      />
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
            filterPlaceholder="Filtrar compras..."
            filterColumn="id_compra"
            enablePagination
            enableRowSelection={false}
            enableColumnVisibility
            meta={{
              onViewItems: handleViewItems
            }}
          />
        )}
      </div>
    </div>
  );
}