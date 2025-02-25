import Component from "@/components/linepoint-chart";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, Wallet, Clock, AlertCircle, Activity } from "lucide-react"; // Iconos

export default function Dashboard() {
  // Datos de ejemplo

  const bajoStock = [
    { nombre: "Harina", cantidad: "2 kg" },
    { nombre: "Azúcar", cantidad: "5 kg" },
  ];

  const actividadReciente = [
    { id: 123, tipo: "Venta", monto: "Bs. 200" },
    { id: 456, tipo: "Pedido", estado: "Completado" },
  ];

  return (
    <div className="pr-4 pl-4 grid gap-4">
      {/* Sección 1: Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ventas del Mes</CardTitle>
            <TrendingUp className="h-6 w-6 text-green-500"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Bs. 10,000</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            +8.3% respecto al mes anterior
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Compras del Mes</CardTitle>
            <ShoppingCart className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Bs. 5,000</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            +5.2% respecto al mes anterior
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Balance Financiero</CardTitle>
            <Wallet className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Bs. 5,000</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Ingresos netos después de gastos
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pedidos Pendientes</CardTitle>
            <Clock className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            En proceso de preparación
          </CardFooter>
        </Card>
      </div>

      {/* Sección 2: Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Component/>
      <Component/>
      </div>

      {/* Sección 3: Inventario */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ingredientes con Bajo Stock</CardTitle>
          <AlertCircle className="h-6 w-6 text-red-500" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {bajoStock.map((item, index) => (
              <li key={index} className="flex justify-between p-2 hover:bg-gray-50 rounded">
                <span>{item.nombre}</span>
                <span className="font-medium">{item.cantidad}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Sección 4: Actividad Reciente */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Actividad Reciente</CardTitle>
          <Activity className="h-6 w-6 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {actividadReciente.map((item, index) => (
              <li key={index} className="flex justify-between p-2 hover:bg-gray-50 rounded">
                <span>{item.tipo} #{item.id}</span>
                <span className="font-medium">{item.monto || item.estado}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}