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
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

// Datos de productos específicos de Santa Cruz Alimentos
const productsByBrand = {
  "Mil Sabores": [
    { id: 1, name: "Cuñape", description: "Pan de queso tradicional (100g)", price: 8 },
    { id: 2, name: "Tamales a la olla", description: "Tamales tradicionales", price: 12 },
    { id: 3, name: "Sonso", description: "Pan de yuca y queso (150g)", price: 7 },
    { id: 4, name: "Empanada de Arroz", description: "Empanada de arroz rellena (120g)", price: 10 },
  ],
  TortaExpress: [
    { id: 5, name: "Torta de Oreo", description: "Torta de galletas Oreo (24cm)", price: 480 },
    { id: 6, name: "Torta de Moka", description: "Torta de café y chocolate (24cm)", price: 520 },
    { id: 7, name: "Torta de Durazno", description: "Torta con relleno de durazno (24cm)", price: 420 },
    { id: 8, name: "Torta de Vainilla", description: "Torta clásica de vainilla (24cm)", price: 400 },
    { id: 9, name: "Torta de Chocolate", description: "Torta de chocolate 3 pisos (24cm)", price: 450 },
    { id: 10, name: "Torta de Red Velvet", description: "Torta terciopelo rojo (24cm)", price: 500 },
  ],
};

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface SaleFormData {
  client: string;
  brand: keyof typeof productsByBrand | "";
  products: ProductItem[];
  paymentMethod: string;
  deliveryDate: string;
  notes: string;
}

export default function Page() {
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [saleForm, setSaleForm] = useState<SaleFormData>({
    client: "",
    brand: "",
    products: [],
    paymentMethod: "",
    deliveryDate: "",
    notes: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para las ventas con productos reales
  const [salesData, setSalesData] = useState([
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
        { name: "Tamales a la olla", quantity: 200, price: 12 },
      ],
    },
  ]);

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
    productsByBrandStats: Object.entries(productsByBrand).map(([brand, products]) => ({
      brand,
      totalProducts: products.length,
      totalSold: salesData
        .filter(sale => sale.brand === brand)
        .flatMap(sale => sale.products)
        .reduce((sum, product) => sum + product.quantity, 0)
    }))
  };

  // Filtrar productos basados en la búsqueda
  const filteredProducts = saleForm.brand 
    ? productsByBrand[saleForm.brand].filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calcular el total de la venta
  const calculateTotal = () => {
    return saleForm.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  // Agregar producto a la venta
  const addProductToSale = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error("Seleccione un producto y una cantidad válida");
      return;
    }

    const existingProductIndex = saleForm.products.findIndex(p => p.id === selectedProduct.id);

    if (existingProductIndex >= 0) {
      // Actualizar cantidad si el producto ya existe
      const updatedProducts = [...saleForm.products];
      updatedProducts[existingProductIndex].quantity += quantity;
      setSaleForm({ ...saleForm, products: updatedProducts });
    } else {
      // Agregar nuevo producto
      const productToAdd = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        description: getProductDescription(saleForm.brand as keyof typeof productsByBrand, selectedProduct.name),
        price: selectedProduct.price,
        quantity: quantity
      };
      setSaleForm({ ...saleForm, products: [...saleForm.products, productToAdd] });
    }

    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm("");
    toast.success("Producto agregado a la venta");
  };

  // Eliminar producto de la venta
  const removeProductFromSale = (productId: number) => {
    setSaleForm({
      ...saleForm,
      products: saleForm.products.filter(p => p.id !== productId)
    });
    toast.info("Producto eliminado de la venta");
  };

  // Actualizar cantidad de un producto en la venta
  const updateProductQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromSale(productId);
      return;
    }

    setSaleForm({
      ...saleForm,
      products: saleForm.products.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    });
  };

  // Crear nueva venta
  const createSale = () => {
    if (!saleForm.client || !saleForm.brand || saleForm.products.length === 0) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    const newSale = {
      id: `SCA-${(salesData.length + 1).toString().padStart(3, '0')}`,
      client: saleForm.client,
      date: new Date().toISOString().split('T')[0],
      amount: calculateTotal(),
      status: "pending",
      brand: saleForm.brand,
      products: saleForm.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price
      })),
      paymentMethod: saleForm.paymentMethod,
      deliveryDate: saleForm.deliveryDate
    };

    setSalesData([...salesData, newSale]);
    toast.success("Venta creada exitosamente");
    resetSaleForm();
    setIsCreateSaleOpen(false);
  };

  // Reiniciar formulario de venta
  const resetSaleForm = () => {
    setSaleForm({
      client: "",
      brand: "",
      products: [],
      paymentMethod: "",
      deliveryDate: "",
      notes: "",
    });
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm("");
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
            <Input 
              placeholder="Buscar ventas..." 
              className="pl-9 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <Button className="gap-2" onClick={() => setIsCreateSaleOpen(true)}>
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

      {/* Diálogo para crear nueva venta */}
      <Dialog open={isCreateSaleOpen} onOpenChange={setIsCreateSaleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Venta</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del cliente */}
            <div className="space-y-4">
              <h3 className="font-medium">Información del Cliente</h3>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Input
                  id="client"
                  placeholder="Nombre del cliente"
                  value={saleForm.client}
                  onChange={(e) => setSaleForm({...saleForm, client: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select
                  value={saleForm.brand}
                  onValueChange={(value) => setSaleForm({
                    ...saleForm, 
                    brand: value as keyof typeof productsByBrand,
                    products: [] // Reset productos al cambiar marca
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(productsByBrand).map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={saleForm.paymentMethod}
                  onValueChange={(value) => setSaleForm({...saleForm, paymentMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="credit">Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Fecha de Entrega</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={saleForm.deliveryDate}
                  onChange={(e) => setSaleForm({...saleForm, deliveryDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  placeholder="Notas adicionales"
                  value={saleForm.notes}
                  onChange={(e) => setSaleForm({...saleForm, notes: e.target.value})}
                />
              </div>
            </div>

            {/* Selección de productos */}
            <div className="space-y-4">
              <h3 className="font-medium">Productos</h3>
              
              {saleForm.brand ? (
                <>
                  {/* Contenedor de búsqueda y lista integrados */}
                  <div className="space-y-4 border rounded-lg p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar productos..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        <div className="space-y-2">
                          {filteredProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                                selectedProduct?.id === product.id
                                  ? "bg-accent"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() => setSelectedProduct({
                                id: product.id,
                                name: product.name,
                                price: product.price
                              })}
                            >
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.description}
                                </p>
                              </div>
                              <span className="font-medium">${product.price}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No se encontraron productos
                        </div>
                      )}
                    </div>

                    {/* Controles de cantidad y botón de agregar */}
                    <div className="pt-2 space-y-2">
                      <Label>Cantidad</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={addProductToSale}
                        disabled={!selectedProduct}
                      >
                        Agregar Producto
                      </Button>
                    </div>
                  </div>

                  {/* Lista de productos agregados (se mantiene igual) */}
                  {saleForm.products.length > 0 && (
                    <div className="space-y-2">
                      <Label>Productos en la venta</Label>
                      {/* ... (mismo contenido que antes) */}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Seleccione una marca para ver los productos disponibles
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateSaleOpen(false);
              resetSaleForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={createSale} disabled={!saleForm.client || !saleForm.brand || saleForm.products.length === 0}>
              <Check className="h-4 w-4 mr-2" />
              Confirmar Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}