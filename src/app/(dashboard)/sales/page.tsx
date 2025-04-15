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
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

// Datos de productos
const productsByBrand = {
  "Mil Sabores": [
    { id: 1, name: "Cuñape", description: "Pan de queso tradicional (100g)", price: 8 },
    { id: 2, name: "Tamales a la olla", description: "Tamales tradicionales", price: 12 },
    { id: 3, name: "Sonso", description: "Pan de yuca y queso (150g)", price: 7 },
    { id: 4, name: "Empanada de Arroz", description: "Empanada de arroz rellena (120g)", price: 10 },
  ],
  "TortaExpress": [
    { id: 5, name: "Torta de Oreo", description: "Torta de galletas Oreo (24cm)", price: 480 },
    { id: 6, name: "Torta de Moka", description: "Torta de café y chocolate (24cm)", price: 520 },
    { id: 7, name: "Torta de Durazno", description: "Torta con relleno de durazno (24cm)", price: 420 },
    { id: 8, name: "Torta de Vainilla", description: "Torta clásica de vainilla (24cm)", price: 400 },
    { id: 9, name: "Torta de Chocolate", description: "Torta de chocolate 3 pisos (24cm)", price: 450 },
    { id: 10, name: "Torta de Red Velvet", description: "Torta terciopelo rojo (24cm)", price: 500 },
    { id: 11, name: "Torta de Caramelo", description: "Torta de caramelo (24cm)", price: 480 },
    { id: 12, name: "Torta de Fresa", description: "Torta de fresa (24cm)", price: 420 },
    { id: 13, name: "Torta de Limón", description: "Torta de limón (24cm)", price: 400 },
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

type FormStep = "client" | "products" | "review";

export default function Page() {
  const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false);
  const [saleForm, setSaleForm] = useState<SaleFormData>({
    client: "",
    brand: "",
    products: [],
    paymentMethod: "",
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState<FormStep>("client");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Datos de ejemplo para las ventas
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

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: number, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, newQuantity)
    }));
  };

  // Agregar productos seleccionados a la venta
  const addSelectedProducts = () => {
    const selectedProducts = filteredProducts.filter(product => quantities[product.id] > 0);
    
    if (selectedProducts.length === 0) {
      toast.error("Seleccione al menos un producto con cantidad mayor a 0");
      return;
    }

    const updatedProducts = [...saleForm.products];
    
    selectedProducts.forEach(product => {
      const existingIndex = updatedProducts.findIndex(p => p.id === product.id);
      const quantity = quantities[product.id];
      
      if (existingIndex >= 0) {
        updatedProducts[existingIndex].quantity += quantity;
      } else {
        updatedProducts.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: quantity
        });
      }
    });

    setSaleForm({ ...saleForm, products: updatedProducts });
    setQuantities({});
    toast.success("Productos agregados a la venta");
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
    setCurrentStep("client");
  };

  // Reiniciar formulario de venta
  const resetSaleForm = () => {
    setSaleForm({
      client: "",
      brand: "",
      products: [],
      paymentMethod: "",
      deliveryDate: new Date().toISOString().split('T')[0],
      notes: "",
    });
    setQuantities({});
    setSearchTerm("");
  };

  // Navegar entre pasos
  const nextStep = () => {
    if (currentStep === "client" && (!saleForm.client || !saleForm.brand)) {
      toast.error("Complete los datos del cliente y seleccione una marca");
      return;
    }

    if (currentStep === "products" && saleForm.products.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    if (currentStep === "client") {
      setCurrentStep("products");
    } else if (currentStep === "products") {
      setCurrentStep("review");
    }
  };

  const prevStep = () => {
    if (currentStep === "products") {
      setCurrentStep("client");
    } else if (currentStep === "review") {
      setCurrentStep("products");
    }
  };

  // Componente para el paso de información del cliente
  const ClientStep = () => (
    <div className="space-y-4">
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
          onValueChange={(value) => {
            setSaleForm({
              ...saleForm, 
              brand: value as keyof typeof productsByBrand,
              products: []
            });
            setQuantities({});
          }}
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
  );

  // Componente para el paso de selección de productos (simplificado)
  const ProductsStep = () => (
    <div className="space-y-6">
      {saleForm.brand ? (
        <>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-sm font-medium mt-1">${product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, (quantities[product.id] || 0) - 1)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={quantities[product.id] || 0}
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, (quantities[product.id] || 0) + 1)}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </div>
              )}
            </div>

            <Button
              className="w-full mt-2"
              onClick={addSelectedProducts}
              disabled={Object.values(quantities).every(qty => qty <= 0)}
            >
              Agregar Productos Seleccionados
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Productos en la venta</h3>
            
            {saleForm.products.length > 0 ? (
              <>
                <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                  {saleForm.products.map((product) => (
                    <div key={product.id} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="w-20 text-right font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeProductFromSale(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {saleForm.products.length} producto{saleForm.products.length !== 1 ? 's' : ''}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">${calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                <p>No hay productos agregados</p>
                <p className="text-sm">Selecciona productos de la lista</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg">Seleccione una marca para ver los productos disponibles</p>
          <p className="text-sm mt-2">Vuelve al paso anterior y elige una marca</p>
        </div>
      )}
    </div>
  );

  // Componente para el paso de revisión
  const ReviewStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Resumen de la Venta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium">{saleForm.client}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Marca</p>
            <p className="font-medium">{saleForm.brand}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Método de Pago</p>
            <p className="font-medium capitalize">
              {saleForm.paymentMethod || "No especificado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Entrega</p>
            <p className="font-medium">
              {saleForm.deliveryDate || "No especificada"}
            </p>
          </div>
          {saleForm.notes && (
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Notas</p>
              <p className="font-medium">{saleForm.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Detalle de Productos</h3>
        <div className="border rounded-lg divide-y">
          {saleForm.products.map((product) => (
            <div key={product.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Cantidad</p>
                  <p className="font-medium">{product.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Precio Unitario</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right w-24">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {saleForm.products.length} producto{saleForm.products.length !== 1 ? 's' : ''}
          </span>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              href="/dashboard"
            >
              Panel de Control
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-sm font-medium text-foreground">
              Ventas
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Ventas
            </h2>
            <small className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gestión de pedidos y ventas
            </small>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateSaleOpen(true)}>
            <Plus className="h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID</TableHead>
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
                          <span key={i} className="text-sm">
                            {product.name} ({product.quantity} unidades)
                          </span>
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
      </div>

      <Button
        className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg"
        size="lg"
        onClick={() => setIsCreateSaleOpen(true)}
      >
        <span className="text-xl">+</span>
      </Button>

      <Dialog open={isCreateSaleOpen} onOpenChange={(open) => {
        if (!open) {
          resetSaleForm();
          setCurrentStep("client");
        }
        setIsCreateSaleOpen(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky bg-background dark:bg-gray-900">
            <DialogTitle>Crear Venta</DialogTitle>
            <div className="flex flex-col pt-2">
              <div className="flex items-center justify-between px-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === "client" && step === 1
                          ? "bg-primary text-primary-foreground"
                          : currentStep === "products" && step === 2
                          ? "bg-primary text-primary-foreground"
                          : currentStep === "review" && step === 3
                          ? "bg-primary text-primary-foreground"
                          : ["client", "products", "review"].indexOf(currentStep) + 1 > step
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {["client", "products", "review"].indexOf(currentStep) + 1 > step ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        (currentStep === "client" && step === 1) ||
                        (currentStep === "products" && step === 2) ||
                        (currentStep === "review" && step === 3)
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step === 1
                        ? "Cliente"
                        : step === 2
                        ? "Productos"
                        : "Revisión"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300"
                  style={{
                    width: `${(currentStep === "client" ? 0 : currentStep === "products" ? 50 : 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </DialogHeader>
          
          <div>
            {currentStep === "client" && <ClientStep />}
            {currentStep === "products" && <ProductsStep />}
            {currentStep === "review" && <ReviewStep />}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 border-t border-border/50">
            <div className="flex justify-end w-full gap-2">
              {currentStep !== "client" && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
              )}
              <Button onClick={currentStep !== "review" ? nextStep : createSale}>
                {currentStep !== "review" ? (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Confirmar Venta"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}