"use client";

import { useState, useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Package, CreditCard, Calendar, Download, Filter, BarChart3, DollarSign, ShoppingCart, Truck, CheckCircle, XCircle, Clock, Target } from "lucide-react";
import SalesHistoryTable from "../components/SalesHistoryTable";
import salesData from "../data/salesData.json";

// Función para actualizar el estado de una venta
const updateSaleStatus = (id: number, statusId: string) => {
  console.log(`Updating sale ${id} status to ${statusId}`);
  // En una aplicación real, aquí harías una llamada a la API
};

// Componente para gráfico de ventas (placeholder mejorado)
const SalesChart = ({ timeRange }: { timeRange: string }) => (
  <div className="h-[300px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center p-4">
    <div className="text-center">
      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
      <p className="text-blue-600 font-medium">Tendencia de Ventas ({timeRange})</p>
      <p className="text-blue-400 text-sm mt-2">Aquí se mostrará un gráfico de líneas con la evolución de tus ventas</p>
      <div className="mt-4 flex justify-center">
        <div className="h-2 w-40 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
        </div>
      </div>
      <p className="text-xs text-blue-500 mt-2">+15% vs período anterior</p>
    </div>
  </div>
);

// Componente para gráfico de métodos de pago (mejorado)
const PaymentMethodsChart = () => {
  const paymentMethods = [
    { name: "Tarjeta", value: 65, color: "bg-blue-500" },
    { name: "Efectivo", value: 25, color: "bg-green-500" },
    { name: "Transferencia", value: 8, color: "bg-purple-500" },
    { name: "Otros", value: 2, color: "bg-gray-500" },
  ];

  return (
    <div className="h-[200px] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Métodos de Pago</h3>
        <span className="text-xs text-muted-foreground">Últimos 30 días</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {paymentMethods.map((method, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${method.color} mr-2`}></div>
            <span className="text-xs">{method.name}</span>
            <span className="text-xs font-medium ml-auto">{method.value}%</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full" 
          style={{ width: '65%' }}
        ></div>
      </div>
    </div>
  );
};

// Componente para mostrar el estado de las ventas
const SalesStatusChart = ({ completed, pending, cancelled }: { completed: number; pending: number; cancelled: number }) => {
  const total = completed + pending + cancelled;
  
  return (
    <div className="h-[200px] p-4">
      <h3 className="font-medium mb-4">Estado de Ventas</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
          <span className="text-xs">Completadas</span>
          <span className="text-xs font-medium ml-auto">{completed} ({Math.round((completed/total)*100)}%)</span>
        </div>
        <Progress value={(completed/total)*100} className="h-1" />
        
        <div className="flex items-center">
          <Clock className="h-3 w-3 text-yellow-500 mr-2" />
          <span className="text-xs">Pendientes</span>
          <span className="text-xs font-medium ml-auto">{pending} ({Math.round((pending/total)*100)}%)</span>
        </div>
        <Progress value={(pending/total)*100} className="h-1" />
        
        <div className="flex items-center">
          <XCircle className="h-3 w-3 text-red-500 mr-2" />
          <span className="text-xs">Canceladas</span>
          <span className="text-xs font-medium ml-auto">{cancelled} ({Math.round((cancelled/total)*100)}%)</span>
        </div>
        <Progress value={(cancelled/total)*100} className="h-1" />
      </div>
    </div>
  );
};

export default function SalesHistoryPage() {
  const [sales] = useState(salesData.sales);
  const [timeRange, setTimeRange] = useState("month");

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;
    const completedSales = sales.filter(sale => sale.status === "Completado").length;
    const deliverySales = sales.filter(sale => sale.orderType === "delivery").length;
    const pendingSales = sales.filter(sale => sale.status === "Pendiente").length;
    const cancelledSales = sales.filter(sale => sale.status === "Cancelado").length;
    
    // Encontrar la venta más alta
    const highestSale = sales.length > 0 
      ? sales.reduce((max, sale) => sale.amount > max.amount ? sale : max, sales[0])
      : null;

    // Calcular ventas por categoría (ejemplo)
    const salesByCategory = [
      { category: "Electrónicos", value: 42, color: "bg-blue-500" },
      { category: "Ropa", value: 28, color: "bg-green-500" },
      { category: "Hogar", value: 15, color: "bg-purple-500" },
      { category: "Otros", value: 15, color: "bg-gray-500" },
    ];

    return {
      totalSales,
      averageSale,
      completedSales,
      deliverySales,
      pendingSales,
      cancelledSales,
      totalTransactions: sales.length,
      highestSale,
      salesByCategory
    };
  }, [sales]);

  // Formatear montos en bolivianos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sales">Ventas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Historial de Ventas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Historial de Ventas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visualiza y analiza el rendimiento de tus ventas
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalSales)}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <p className="text-xs text-muted-foreground">
                +15.2% desde el último {timeRange}
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedSales} completadas
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.averageSale)}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <p className="text-xs text-muted-foreground">
                +5.3% desde el último {timeRange}
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Truck className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.deliverySales}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length > 0 ? Math.round((metrics.deliverySales / sales.length) * 100) : 0}% de pedidos
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
        </Card>
      </div>

      {/* Charts and Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Resumen de Ventas</CardTitle>
              <CardDescription>
                Tendencia de ventas en el período seleccionado
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +15.2%
            </Badge>
          </CardHeader>
          <CardContent>
            <SalesChart timeRange={timeRange} />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>
                Distribución de formas de pago
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <PaymentMethodsChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estado de Ventas</CardTitle>
              <CardDescription>
                Distribución por estado
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SalesStatusChart 
                completed={metrics.completedSales} 
                pending={metrics.pendingSales} 
                cancelled={metrics.cancelledSales} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venta Más Alta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {metrics.highestSale ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(metrics.highestSale.amount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Cliente: {metrics.highestSale.client}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: #{metrics.highestSale.id.toString().padStart(4, '0')}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay datos de ventas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías Populares</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{category.category}</span>
                  <Badge variant="secondary">{category.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objetivo Mensual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">75%</span>
                <span className="text-sm text-muted-foreground">15,000/20,000 BOB</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">+12% respecto al mes anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas</CardTitle>
          <CardDescription>
            Lista completa de todas las transacciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesHistoryTable 
            sales={sales} 
            updateSaleStatus={updateSaleStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}