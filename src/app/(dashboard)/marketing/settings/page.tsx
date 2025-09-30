// src/app/(dashboard)/marketing/configuracion-marca/page.tsx

"use client"

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Edit, Calendar, Building, Phone, Palette, Users, Package, FileText, Target, MapPin, MessageCircle, Star, Trophy, Gift, TrendingUp } from 'lucide-react'

interface Producto {
  id: string
  nombre: string
  descripcion: string
  publico_ideal: string
  precio_promedio: string
  categoria: string
}

interface ConfiguracionMensual {
  mes: string
  objetivos: string[]
  productosDestacados: string[]
  festividades: string[]
  promociones: string[]
  fechaActualizacion: string
  estado: 'activo' | 'planificado' | 'completado'
}

export default function ConfiguracionMarcaPage() {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: '1',
      nombre: 'Torta de Chocolate Intenso',
      descripcion: 'Capas de bizcocho de chocolate húmedo, relleno de ganache y cubierta de chocolate semiamargo',
      publico_ideal: 'Amantes del chocolate puro, regalo para hombres',
      precio_promedio: '120 Bs.',
      categoria: 'premium'
    },
    {
      id: '2',
      nombre: 'Torta de Oreo',
      descripcion: 'Deliciosa torta con base de galletas Oreo, crema de queso y trozos de chocolate',
      publico_ideal: 'Jóvenes y amantes de lo dulce',
      precio_promedio: '110 Bs.',
      categoria: 'popular'
    },
    {
      id: '3',
      nombre: 'Torta Tres Leches',
      descripcion: 'Bizcocho esponjoso empapado en mezcla de tres leches, cubierto con merengue',
      publico_ideal: 'Familias, celebraciones tradicionales',
      precio_promedio: '100 Bs.',
      categoria: 'clasico'
    },
    {
      id: '4',
      nombre: 'Cheesecake de Frutos Rojos',
      descripcion: 'Suave cheesecake con base de galleta, cubierto con salsa de frutos rojos naturales',
      publico_ideal: 'Público adulto, ocasiones especiales',
      precio_promedio: '130 Bs.',
      categoria: 'premium'
    }
  ])

  const [zonasEntrega, setZonasEntrega] = useState<string[]>(['Zona Norte', 'Radial 26', '5to anillo', 'Equipetrol', 'Av. Cristo Redentor'])
  const [propuestaValor, setPropuestaValor] = useState<string[]>(['Entrega en 40 minutos', 'Ingredientes premium', 'Personalización gratuita', 'Recetas familiares', 'Atención 24/7'])
  const [audiencia, setAudiencia] = useState<string[]>(['Familias de clase media', 'Jóvenes profesionales', 'Empresas para eventos', 'Celebraciones especiales', 'Amantes de la repostería'])
  const [doloresCliente, setDoloresCliente] = useState<string[]>(['Falta de tiempo para hornear', 'Necesidad de sorprender en eventos', 'Búsqueda de calidad premium', 'Personalización urgente', 'Presupuesto limitado'])

  const [configuracionesMensuales, setConfiguracionesMensuales] = useState<ConfiguracionMensual[]>([
    {
      mes: 'Octubre 2024',
      objetivos: ['Incrementar ventas en 20%', 'Lanzar nueva línea de mini tortas', 'Aumentar engagement en Instagram'],
      productosDestacados: ['Torta de Oreo', 'Torta Tres Leches', 'Mini Tortas Halloween'],
      festividades: ['Día de la Madre', 'Halloween', 'Aniversario del local'],
      promociones: ['2x1 en tortas medianas', 'Descuento del 15% en pedidos anticipados', 'Envío gratis en Zona Norte'],
      fechaActualizacion: '2024-09-28',
      estado: 'activo'
    },
    {
      mes: 'Noviembre 2024',
      objetivos: ['Posicionar nueva línea navideña', 'Aumentar engagement en redes', 'Captar clientes corporativos'],
      productosDestacados: ['Torta de Frutas', 'Panetón especial', 'Galletas navideñas'],
      festividades: ['Black Friday', 'Pre-navidad', 'Cyber Monday'],
      promociones: ['Early bird para pedidos navideños', 'Combo familiar', 'Descuento por volumen'],
      fechaActualizacion: '2024-10-25',
      estado: 'planificado'
    },
    {
      mes: 'Diciembre 2024',
      objetivos: ['Maximizar ventas navideñas', 'Fidelizar clientes recurrentes', 'Expandir a nuevas zonas'],
      productosDestacados: ['Torta Navideña Especial', 'Postres Individuales', 'Regalos Corporativos'],
      festividades: ['Navidad', 'Año Nuevo', 'Fiestas de Fin de Año'],
      promociones: ['Pack Familiar Navideño', 'Descuento por anticipación', 'Regalo sorpresa en pedidos grandes'],
      fechaActualizacion: '2024-11-20',
      estado: 'planificado'
    }
  ])

  // Estados de edición
  const [editando, setEditando] = useState<{[key: string]: boolean}>({
    negocio: false,
    contacto: false,
    identidad: false,
    audiencia: false,
    productos: false
  })

  const toggleEdicion = (seccion: string) => {
    setEditando(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }))
  }

  const agregarProducto = () => {
    setProductos([
      ...productos,
      {
        id: Date.now().toString(),
        nombre: '',
        descripcion: '',
        publico_ideal: '',
        precio_promedio: '',
        categoria: 'popular'
      }
    ])
  }

  const eliminarProducto = (id: string) => {
    if (productos.length > 1) {
      setProductos(productos.filter(producto => producto.id !== id))
    }
  }

  const actualizarProducto = (id: string, campo: keyof Producto, valor: string) => {
    setProductos(productos.map(producto => 
      producto.id === id ? { ...producto, [campo]: valor } : producto
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos a guardar:', {
      productos,
      zonasEntrega,
      propuestaValor,
      audiencia,
      doloresCliente
    })
  }

  // Componente para mostrar arrays como badges
  const BadgesList = ({ items, maxItems = 3 }: { items: string[], maxItems?: number }) => (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, maxItems).map((item, index) => (
        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
          {item}
        </Badge>
      ))}
      {items.length > maxItems && (
        <Badge variant="outline" className="text-xs">
          +{items.length - maxItems} más
        </Badge>
      )}
    </div>
  )

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: TrendingUp }
      case 'planificado':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar }
      case 'completado':
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Trophy }
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Calendar }
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'popular':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'clasico':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-primary">
                Panel de Control
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/marketing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Marketing
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Configuración de Marca</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuración de Marca</h1>
            <p className="text-muted-foreground mt-2">
              Configura los datos permanentes y mensuales de tu negocio para generar contenido personalizado
            </p>
          </div>
       
        </div>
      </div>

      {/* Sección 1: Configuración Inicial */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Building className="h-6 w-6" />
            Configuración Inicial
          </h2>
          <Badge variant="outline" className="text-sm">
            Datos Iniciales
          </Badge>
        </div>

        {/* Grupo 1: Información Básica - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Información del Negocio */}
          <Card className="md:col-span-2 border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Información del Negocio</CardTitle>
                    <CardDescription>Datos fundamentales de tu empresa</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleEdicion('negocio')}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {editando.negocio ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editando.negocio ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreNegocio" className="text-sm font-medium">Nombre del Negocio</Label>
                      <Input
                        id="nombreNegocio"
                        defaultValue="Torta Express"
                        placeholder="Ej: Torta Express"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eslogan" className="text-sm font-medium">Eslogan</Label>
                      <Input
                        id="eslogan"
                        defaultValue="El mejor sabor, al mejor precio"
                        placeholder="Ej: El mejor sabor, al mejor precio"
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion" className="text-sm font-medium">Ubicación</Label>
                    <Textarea
                      id="ubicacion"
                      defaultValue="Zona Norte, Radial 26 y 5to. anillo, calle #2, Santa Cruz de la Sierra, Bolivia"
                      placeholder="Ej: Zona Norte, Radial 26 y 5to. anillo..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Zonas de Entrega</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar zona de entrega"
                        className="h-9"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              setZonasEntrega([...zonasEntrega, input.value.trim()])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="min-h-[40px]">
                      <BadgesList items={zonasEntrega} maxItems={4} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Nombre</Label>
                      <p className="text-sm font-medium">Torta Express</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">Eslogan</Label>
                      <p className="text-sm">El mejor sabor, al mejor precio</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Ubicación</Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Zona Norte, Radial 26 y 5to. anillo, calle #2, Santa Cruz de la Sierra, Bolivia
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Zonas de Entrega</Label>
                    <BadgesList items={zonasEntrega} maxItems={4} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Información de Contacto */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Contacto</CardTitle>
                    <CardDescription>Medios de comunicación</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleEdicion('contacto')}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {editando.contacto ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editando.contacto ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm font-medium">Teléfono</Label>
                    <Input id="telefono" defaultValue="62013533" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</Label>
                    <Input id="whatsapp" defaultValue="59162013533" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                    <Input id="instagram" defaultValue="@tortaexpress.sc" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
                    <Input id="facebook" defaultValue="TortaExpressSantaCruz" className="h-9" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">62013533</p>
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">59162013533</p>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-lg">
                    <FileText className="h-4 w-4 text-pink-600" />
                    <div>
                      <p className="text-sm font-medium">@tortaexpress.sc</p>
                      <p className="text-xs text-muted-foreground">Instagram</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">TortaExpressSantaCruz</p>
                      <p className="text-xs text-muted-foreground">Facebook</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Identidad de Marca */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Identidad</CardTitle>
                    <CardDescription>Propuesta de valor</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleEdicion('identidad')}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {editando.identidad ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editando.identidad ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="descripcionLarga" className="text-sm font-medium">Descripción</Label>
                    <Textarea
                      id="descripcionLarga"
                      defaultValue="Somos una pastelería familiar con 10 años de experiencia..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Propuesta de Valor</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar propuesta"
                        className="h-9"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              setPropuestaValor([...propuestaValor, input.value.trim()])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="min-h-[40px]">
                      <BadgesList items={propuestaValor} maxItems={3} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Descripción</Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Somos una pastelería familiar con 10 años de endulzar los momentos especiales de Santa Cruz...
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Propuesta de Valor</Label>
                    <BadgesList items={propuestaValor} maxItems={3} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Audiencia */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Audiencia</CardTitle>
                    <CardDescription>Público objetivo</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleEdicion('audiencia')}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {editando.audiencia ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editando.audiencia ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Público Objetivo</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar público"
                        className="h-9"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              setAudiencia([...audiencia, input.value.trim()])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="min-h-[40px]">
                      <BadgesList items={audiencia} maxItems={3} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Problemas que Resuelve</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar problema"
                        className="h-9"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              setDoloresCliente([...doloresCliente, input.value.trim()])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="min-h-[40px]">
                      <BadgesList items={doloresCliente} maxItems={3} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Público Objetivo</Label>
                    <BadgesList items={audiencia} maxItems={3} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-muted-foreground">Problemas que Resuelve</Label>
                    <BadgesList items={doloresCliente} maxItems={3} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Grupo 2: Productos */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Catálogo de Productos</CardTitle>
                    <CardDescription>Gestiona tu portafolio de productos</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleEdicion('productos')}
                    className="h-8"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {editando.productos ? 'Cancelar' : 'Editar'}
                  </Button>
                  {!editando.productos && (
                    <Button variant="outline" size="sm" className="h-8" onClick={agregarProducto}>
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editando.productos ? (
                <div className="space-y-4">
                  {productos.map((producto, index) => (
                    <div key={producto.id} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium text-sm">Producto {index + 1}</Label>
                        {productos.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarProducto(producto.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Nombre</Label>
                          <Input
                            value={producto.nombre}
                            onChange={(e) => actualizarProducto(producto.id, 'nombre', e.target.value)}
                            placeholder="Ej: Torta de Chocolate Intenso"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Precio Promedio</Label>
                          <Input
                            value={producto.precio_promedio}
                            onChange={(e) => actualizarProducto(producto.id, 'precio_promedio', e.target.value)}
                            placeholder="Ej: 90 Bs."
                            className="h-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Descripción</Label>
                        <Textarea
                          value={producto.descripcion}
                          onChange={(e) => actualizarProducto(producto.id, 'descripcion', e.target.value)}
                          placeholder="Ej: Capas de bizcocho de chocolate húmedo..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Público Ideal</Label>
                        <Input
                          value={producto.publico_ideal}
                          onChange={(e) => actualizarProducto(producto.id, 'publico_ideal', e.target.value)}
                          placeholder="Ej: Amantes del chocolate puro..."
                          className="h-9"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={agregarProducto} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {productos.map((producto) => (
                    <div key={producto.id} className="p-4 border rounded-lg space-y-3 bg-muted/5 hover:bg-muted/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{producto.nombre}</h4>
                          <Badge variant="outline" className={`text-xs ${getCategoriaColor(producto.categoria)}`}>
                            {producto.categoria}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-600">{producto.precio_promedio}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{producto.descripcion}</p>
                      <div className="pt-2 border-t">
                        <Label className="text-xs font-medium text-muted-foreground">Público Ideal:</Label>
                        <p className="text-xs text-muted-foreground mt-1">{producto.publico_ideal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección 2: Configuración Mensual */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Configuración Mensual
          </h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Configuración
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {configuracionesMensuales.map((config, index) => {
            const statusConfig = getStatusConfig(config.estado)
            const StatusIcon = statusConfig.icon
            
            return (
              <Card key={index} className="relative border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{config.mes}</CardTitle>
                        <CardDescription>Actualizado: {config.fechaActualizacion}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusConfig.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Objetivos
                    </Label>
                    <BadgesList items={config.objetivos} maxItems={2} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-amber-600" />
                      Productos Destacados
                    </Label>
                    <BadgesList items={config.productosDestacados} maxItems={2} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Gift className="h-4 w-4 text-purple-600" />
                      Festividades
                    </Label>
                    <BadgesList items={config.festividades} maxItems={2} />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Promociones
                    </Label>
                    <BadgesList items={config.promociones} maxItems={2} />
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}