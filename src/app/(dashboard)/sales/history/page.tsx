"use client";

import { useState, useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Package, CreditCard, Calendar, Download, Filter, BarChart3, DollarSign, ShoppingCart, Truck, CheckCircle, XCircle, Clock, Target, TrendingDown } from "lucide-react";
import SalesHistoryTable from "../components/SalesHistoryTable";
import salesData from "../data/salesData.json";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

// Función para filtrar ventas por período de tiempo
const filterSalesByTimeRange = (sales: any[], timeRange: string) => {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.date);
    
    switch (timeRange) {
      case "day":
        return saleDate.toDateString() === currentDate.toDateString();
      
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return saleDate >= startOfWeek && saleDate <= endOfWeek;
      
      case "month":
        return saleDate.getMonth() === currentDate.getMonth() && 
               saleDate.getFullYear() === currentDate.getFullYear();
      
      case "year":
        return saleDate.getFullYear() === currentDate.getFullYear();
      
      default:
        return true;
    }
  });
};

// Configuración del gráfico
const chartConfig = {
  presencial: {
    label: "En puerta",
    color: "hsl(var(--chart-1))",
  },
  delivery: {
    label: "Delivery",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Formatear montos en bolivianos
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
};

// Componente para gráfico de ventas con datos reales
const SalesChart = ({ timeRange, sales, onTimeRangeChange }: { timeRange: string; sales: any[]; onTimeRangeChange: (value: string) => void }) => {
  const chartData = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    // Agrupar ventas por período seleccionado
    const groupedData: Record<string, { presencial: number; delivery: number }> = {};

    sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      let key = '';

      if (timeRange === "day") {
        const hour = saleDate.getHours();
        const hourLabel = `${hour}:00`;
        key = hourLabel;
      } else if (timeRange === "week") {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        key = days[saleDate.getDay()];
      } else if (timeRange === "month") {
        key = saleDate.getDate().toString();
      } else if (timeRange === "year") {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        key = months[saleDate.getMonth()];
      }

      if (!groupedData[key]) {
        groupedData[key] = { presencial: 0, delivery: 0 };
      }

      if (sale.orderType === 'delivery') {
        groupedData[key].delivery += sale.amount;
      } else {
        groupedData[key].presencial += sale.amount;
      }
    });

    // Convertir to array y ordenar
    let result = Object.entries(groupedData).map(([key, value]) => ({
      key,
      presencial: value.presencial,
      delivery: value.delivery
    }));

    // Ordenar según el período
    if (timeRange === "day") {
      result.sort((a, b) => parseInt(a.key) - parseInt(b.key));
      // Formatear etiquetas de hora
      result = result.map(item => ({
        ...item,
        key: `${item.key}`
      }));
    } else if (timeRange === "week") {
      const dayOrder = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      result.sort((a, b) => dayOrder.indexOf(a.key) - dayOrder.indexOf(b.key));
    } else if (timeRange === "month") {
      result.sort((a, b) => parseInt(a.key) - parseInt(b.key));
    } else if (timeRange === "year") {
      const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      result.sort((a, b) => monthOrder.indexOf(a.key) - monthOrder.indexOf(b.key));
    }

    return result;
  }, [sales, timeRange]);

  const xAxisKey = "key";
  
  // Calcular el valor máximo para el eje Y
  const maxValue = Math.max(...chartData.map(item => item.presencial + item.delivery), 0);
  // Calcular un valor máximo redondeado para el eje Y
  const maxYValue = Math.ceil(maxValue / 500) * 500;
  
  return (
    <ChartContainer config={chartConfig} className="h-[550px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={6}
          domain={[0, maxYValue]}
          tickFormatter={(value) => new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 0
          }).format(value)}
        />
        <ChartTooltip 
          cursor={false} 
          content={
            <ChartTooltipContent 
              indicator="dot"
              labelFormatter={(value) => value}
              formatter={(value, name) => [
                new Intl.NumberFormat('es-BO', {
                  style: 'currency',
                  currency: 'BOB',
                  minimumFractionDigits: 2
                }).format(Number(value)),
                name === 'presencial' ? 'En puerta' : 'Delivery'
              ]}
            />
          }
        />
        <defs>
          <linearGradient id="fillPresencial" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-presencial)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-presencial)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillDelivery" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-delivery)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-delivery)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="delivery"
          type="natural"
          fill="url(#fillDelivery)"
          fillOpacity={0.4}
          stroke="var(--color-delivery)"
          stackId="a"
        />
        <Area
          dataKey="presencial"
          type="natural"
          fill="url(#fillPresencial)"
          fillOpacity={0.4}
          stroke="var(--color-presencial)"
          stackId="a"
        />
        <ChartLegend 
          content={<ChartLegendContent />}
        />
      </AreaChart>
    </ChartContainer>
  );
};

// Componente para gráfico de métodos de pago (mejorado y corregido)
const PaymentMethodsChart = ({ sales }: { sales: any[] }) => {
  // Calcular distribución de métodos de pago desde los datos reales
  const paymentData = useMemo(() => {
    const methods: Record<string, {count: number, total: number}> = {};
    
    sales.forEach(sale => {
      const method = sale.paymentMethod || 'Otros';
      if (!methods[method]) {
        methods[method] = { count: 0, total: 0 };
      }
      methods[method].count += 1;
      methods[method].total += sale.amount;
    });
    
    const totalTransactions = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    
    return Object.entries(methods)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, data], index) => ({
        name,
        count: data.count,
        total: data.total,
        percentage: Math.round((data.count / totalTransactions) * 100),
        color: COLORS[index % COLORS.length],
        avgTransaction: data.count > 0 ? data.total / data.count : 0
      }));
  }, [sales]);

  const totalTransactions = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);

  // Personalizar leyenda - corregida
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 px-2">
        {payload.map((entry: any, index: number) => {
          const data = paymentData.find(p => p.name === entry.value);
          return (
            <div key={`legend-${index}`} className="flex items-center text-xs bg-muted/40 px-2 py-1 rounded-md">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium mr-1">{entry.value}:</span>
              <span className="text-muted-foreground">
                {data?.percentage}% ({data?.count})
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Personalizar tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md p-3 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Transacciones: {data.count}</p>
          <p className="text-sm">Porcentaje: {data.percentage}%</p>
          <p className="text-sm">Monto total: {formatCurrency(data.total)}</p>
          <p className="text-sm">Ticket promedio: {formatCurrency(data.avgTransaction)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[340px] flex flex-col">
      <div className="text-center mb-2">
        <h3 className="font-medium">Distribución de Métodos de Pago</h3>
        <p className="text-xs text-muted-foreground">
          {totalTransactions} transacciones • {formatCurrency(totalAmount)} total
        </p>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={paymentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
              label={({ name, percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {paymentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
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

  // Filtrar ventas según el período de tiempo seleccionado
  const filteredSales = useMemo(() => {
    return filterSalesByTimeRange(sales, timeRange);
  }, [sales, timeRange]);

  // Calcular métricas principales basadas en las ventas filtradas
  const metrics = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const averageSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;
    const completedSales = filteredSales.filter(sale => sale.status === "Completado").length;
    const deliverySales = filteredSales.filter(sale => sale.orderType === "delivery").length;
    const pendingSales = filteredSales.filter(sale => sale.status === "Pendiente").length;
    const cancelledSales = filteredSales.filter(sale => sale.status === "Cancelado").length;
    
    // Calcular porcentajes de crecimiento (simulados para este ejemplo)
    // En una aplicación real, estos valores vendrían de una comparación con el período anterior
    const growthTotalSales = 15.2;
    const growthAverageSale = 5.3;
    
    return {
      totalSales,
      averageSale,
      completedSales,
      deliverySales,
      pendingSales,
      cancelledSales,
      totalTransactions: filteredSales.length,
      growthTotalSales,
      growthAverageSale,
      deliveryPercentage: filteredSales.length > 0 ? Math.round((deliverySales / filteredSales.length) * 100) : 0
    };
  }, [filteredSales]);

  // Determinar si el crecimiento es positivo o negativo
  const GrowthIcon = ({ value }: { value: number }) => {
    if (value > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600 mr-1" />;
    } else if (value < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600 mr-1" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
              >
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 dark:text-gray-600" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sales">Ventas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 dark:text-gray-600" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Historial de Ventas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Historial de Ventas</h2>
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
        {/* Ventas Totales */}
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
              <GrowthIcon value={metrics.growthTotalSales} />
              <p className="text-xs text-muted-foreground">
                {metrics.growthTotalSales > 0 ? '+' : ''}{metrics.growthTotalSales}% desde el último {timeRange}
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
        </Card>

        {/* Transacciones */}
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

        {/* Ticket Promedio */}
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
              <GrowthIcon value={metrics.growthAverageSale} />
              <p className="text-xs text-muted-foreground">
                {metrics.growthAverageSale > 0 ? '+' : ''}{metrics.growthAverageSale}% desde el último {timeRange}
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>
        </Card>

        {/* Delivery */}
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
              {metrics.deliveryPercentage}% de pedidos
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
              <CardDescription className="text-sm text-muted-foreground pt-2">
                Tendencia de ventas basada en datos reales
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              {timeRange === "day" ? "Hoy" : timeRange === "week" ? "Esta semana" : timeRange === "month" ? "Este mes" : "Este año"}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <SalesChart timeRange={timeRange} sales={filteredSales} onTimeRangeChange={setTimeRange} />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodsChart sales={filteredSales} />
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

      <SalesHistoryTable 
        sales={filteredSales.map(sale => ({
          ...sale,
          orderType: sale.orderType === 'delivery' ? 'delivery' as const : 'pickup' as const,
          products: sale.products.map((product: any) => ({
            name: product.name,
            quantity: product.quantity,
            price: 'price' in product ? Number(product.price) : 0
          }))
        }))}
      />
    </div>
  );
}