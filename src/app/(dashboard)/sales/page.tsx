"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Download,
  MoreVertical,
  FileText,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Cake,
  PieChart,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Datos de productos específicos de Santa Cruz Alimentos
const productsByBrand = {
  "Mil Sabores": [
    { name: "Cuñape", description: "Pan de queso tradicional (100g)" },
    { name: "Tamales a la olla", description: "Tamales tradicionales" },
    { name: "Sonso", description: "Pan de yuca y queso (150g)" },
    { name: "Empanada de Arroz", description: "Empanada de arroz rellena (120g)" },
  ],
  TortaExpress: [
    { name: "Torta de Oreo", description: "Torta de galletas Oreo (24cm)" },
    { name: "Torta de Moka", description: "Torta de café y chocolate (24cm)" },
    { name: "Torta de Durazno", description: "Torta con relleno de durazno (24cm)" },
    { name: "Torta de Vainilla", description: "Torta clásica de vainilla (24cm)" },
    { name: "Torta de Chocolate", description: "Torta de chocolate 3 pisos (24cm)" },
    { name: "Torta de Red Velvet", description: "Torta terciopelo rojo (24cm)" },
  ],
};

export default function Page() {
  // Datos de ejemplo para las ventas con productos reales
  const salesData = [
    {
      id: "SCA-001",
      client: "Restaurante La Cabaña",
      date: "2023-11-15",
      amount: 12500,
      status: "completed",
      brand: "Mil Sabores",
      products: [
        { name: "Cuñape", quantity: 70, price: 8 },
        { name: "Empanada de Arroz", quantity: 30, price: 10 },
      ],
    },
    {
      id: "SCA-002",
      client: "Cafetería Dulce Tentación",
      date: "2023-11-16",
      amount: 18750,
      status: "processing",
      brand: "TortaExpress",
      products: [
        { name: "Torta de Chocolate", quantity: 2, price: 450 },
        { name: "Torta de Red Velvet", quantity: 1, price: 500 },
        { name: "Torta de Oreo", quantity: 3, price: 480 },
      ],
    },
    {
      id: "SCA-003",
      client: "Supermercado Del Valle",
      date: "2023-11-17",
      amount: 23400,
      status: "pending",
      brand: "Mil Sabores",
      products: [
        { name: "Sonso", quantity: 100, price: 7 },
        { name: "Tamales a la olla", quantity:200, price: 12 },
      ],
    },
    {
      id: "SCA-004",
      client: "Pastelería Sweet Dreams",
      date: "2023-11-18",
      amount: 9800,
      status: "completed",
      brand: "TortaExpress",
      products: [
        { name: "Torta de Vainilla", quantity: 84, price: 400 },
        { name: "Torta de Durazno", quantity: 2, price: 420 },
      ],
    },
    {
      id: "SCA-005",
      client: "Eventos Corporativos S.A.",
      date: "2023-11-19",
      amount: 15600,
      status: "cancelled",
      brand: "TortaExpress",
      products: [{ name: "Torta de Moka", quantity: 3, price: 520 }],
    },
  ];

  // Función para obtener la descripción de un producto
  const getProductDescription = (brand: keyof typeof productsByBrand, productName: string) => {
    const brandProducts = productsByBrand[brand];
    const product = brandProducts.find(p => p.name === productName);
    return product?.description || "Descripción no disponible";
  };

  // Estadísticas resumidas por marca
  const stats = {
    totalSales: salesData.reduce((sum, sale) => sum + sale.amount, 0),
    completedSales: salesData.filter((sale) => sale.status === "completed").length,
    pendingSales: salesData.filter((sale) => sale.status === "pending").length,
    processingSales: salesData.filter((sale) => sale.status === "processing").length,
    cancelledSales: salesData.filter((sale) => sale.status === "cancelled").length,
    milSaboresSales: salesData
      .filter((sale) => sale.brand === "Mil Sabores")
      .reduce((sum, sale) => sum + sale.amount, 0),
    tortaExpressSales: salesData
      .filter((sale) => sale.brand === "TortaExpress")
      .reduce((sum, sale) => sum + sale.amount, 0),
    topProducts: Array.from(
      salesData
        .flatMap((sale) => sale.products)
        .reduce((map, product) => {
          const total = (map.get(product.name) || 0) + product.quantity;
          return map.set(product.name, total);
        }, new Map())
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3),
    // Nuevas estadísticas basadas en productsByBrand
    productsByBrandStats: Object.entries(productsByBrand).map(([brand, products]) => ({
      brand,
      totalProducts: products.length,
      totalSold: salesData
        .filter(sale => sale.brand === brand)
        .flatMap(sale => sale.products)
        .reduce((sum, product) => sum + product.quantity, 0)
    }))
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-background">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-foreground">
                Ventas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Ventas</h2>
            <small className="text-sm font-medium text-muted-foreground">
              Gestión de pedidos y ventas
            </small>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-semibold mb-1">Marcas disponibles:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {Object.entries(productsByBrand).map(([brand, products]) => (
                    <li key={brand}>
                      <span className="font-medium">{brand}</span>: {products.length} productos
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ventas Totales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +18% respecto al mes pasado
            </p>
          </CardContent>
        </Card>

        {stats.productsByBrandStats.map((brandStats) => (
          <Card key={brandStats.brand}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {brandStats.brand}
              </CardTitle>
              {brandStats.brand === "Mil Sabores" ? (
                <PieChart className="h-4 w-4 text-blue-500" />
              ) : (
                <Cake className="h-4 w-4 text-purple-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {brandStats.totalSold} unidades
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {brandStats.totalProducts} productos disponibles
              </p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos Completados
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSales}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.completedSales / salesData.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar ventas..." className="pl-9 w-full" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filtrar por marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.keys(productsByBrand).map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="processing">En proceso</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="flex flex-col gap-4 mb-6 md:mb-0 overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-1">
                      ID <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {sale.brand}
                      </Badge>
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {sale.products.map((product, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <span className="text-sm hover:underline cursor-help">
                                {product.name} ({product.quantity} unidades)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getProductDescription(sale.brand as keyof typeof productsByBrand, product.name)}</p>
                              <p className="font-medium mt-1">Precio unitario: ${product.price}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${sale.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sale.status === "completed"
                            ? "default"
                            : sale.status === "processing"
                            ? "secondary"
                            : sale.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {sale.status === "completed"
                          ? "Completado"
                          : sale.status === "processing"
                          ? "En proceso"
                          : sale.status === "pending"
                          ? "Pendiente"
                          : "Cancelado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <FileText className="h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Procesar pedido
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-500">
                            <XCircle className="h-4 w-4" />
                            Cancelar venta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <small className="text-sm font-medium text-muted-foreground">
              Mostrando {salesData.length} de {salesData.length} ventas
            </small>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Marca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center gap-8 mb-4">
                    {stats.productsByBrandStats.map((brandStat, index) => (
                      <div key={brandStat.brand} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            index === 0 ? "bg-blue-500" : "bg-purple-500"
                          }`}
                        ></div>
                        <span>{brandStat.brand}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-muted-foreground">
                    <p>Total de unidades vendidas por marca:</p>
                    <ul className="mt-2 space-y-1">
                      {stats.productsByBrandStats.map((brandStat) => (
                        <li key={brandStat.brand} className="font-medium">
                          {brandStat.brand}: {brandStat.totalSold} unidades
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map(([productName, quantity], index) => (
                  <div key={productName}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {index + 1}. {productName}
                      </span>
                      <span className="text-sm font-medium">
                        {quantity} unidades
                      </span>
                    </div>
                    <Progress
                      value={(quantity / stats.topProducts[0][1]) * 100}
                      className={`h-2 ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                ))}
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>
                    Total de productos vendidos:{" "}
                    {salesData
                      .flatMap((sale) => sale.products)
                      .reduce((sum, product) => sum + product.quantity, 0)}{" "}
                    unidades
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}