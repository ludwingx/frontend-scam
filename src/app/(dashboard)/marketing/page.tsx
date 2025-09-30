// src/app/(dashboard)/marketing/page.tsx

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Settings, 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  ScanText,
  Briefcase,
  ChartLine
} from 'lucide-react'

// Datos de ejemplo para el dashboard
const metricas = {
  contenidoGenerado: 45,
  contenidoProgramado: 28,
  engagementRate: 4.2,
  crecimientoSeguidores: 125
}

const contenidoReciente = [
  {
    id: 1,
    plataforma: 'Facebook',
    tipo: 'Post promocional',
    titulo: '¡Oferta de fin de semana!',
    estado: 'programado',
    fecha: '2024-10-05',
    hora: '10:00',
    metricas: {
      alcance: '2.4K',
      interacciones: 89
    }
  },
  {
    id: 2,
    plataforma: 'Instagram',
    tipo: 'Story',
    titulo: 'Encuesta: ¿Tu sabor favorito?',
    estado: 'publicado',
    fecha: '2024-10-04',
    hora: '15:30',
    metricas: {
      alcance: '1.8K',
      interacciones: 156
    }
  },
  {
    id: 3,
    plataforma: 'Facebook',
    tipo: 'Post informativo',
    titulo: 'Nuevos horarios de atención',
    estado: 'pendiente',
    fecha: '2024-10-06',
    hora: '09:00',
    metricas: {
      alcance: '-',
      interacciones: '-'
    }
  }
]

const proximasTareas = [
  {
    id: 1,
    tarea: 'Revisar contenido de la próxima semana',
    fecha: 'Hoy',
    prioridad: 'alta',
    url: '/marketing/marketing-plan'
  },
  {
    id: 2,
    tarea: 'Actualizar configuración mensual',
    fecha: 'Mañana',
    prioridad: 'media',
    url: '/marketing/settings'
  },
  {
    id: 3,
    tarea: 'Generar reporte de métricas',
    fecha: '15 Oct',
    prioridad: 'baja',
    url: '/marketing/analytics'
  }
]

const menuItems = [
  {
    title: "Configuración",
    url: "/marketing/settings",
    icon: Settings,
    description: "Configuración de marca y preferencias",
    status: "completo",
    badge: "Actualizado"
  },
  {
    title: "Plan de Marketing",
    url: "/marketing/marketing-plan",
    icon: CalendarDays,
    description: "Calendario de contenido y programación",
    status: "activo",
    badge: "28 programados"
  },
  {
    title: "Ideas de Contenido",
    url: "/marketing/content-ideas",
    icon: ScanText,
    description: "Generar y gestionar ideas de contenido",
    status: "nuevo",
    badge: "12 ideas"
  },
  {
    title: "Calendario de Publicaciones",
    url: "/marketing/calendar",
    icon: Calendar,
    description: "Vista calendario de publicaciones",
    status: "activo",
    badge: "4 esta semana"
  },
  {
    title: "Gestión de Campañas",
    url: "/marketing/campaigns",
    icon: Briefcase,
    description: "Crear y monitorear campañas",
    status: "pausado",
    badge: "2 activas"
  },
  {
    title: "Analítica & Reportes",
    url: "/marketing/analytics",
    icon: ChartLine,
    description: "Métricas y reportes de desempeño",
    status: "disponible",
    badge: "4.2% engagement"
  }
]

export default function MarketingPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('semana')

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'publicado':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Publicado</Badge>
      case 'programado':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="h-3 w-3 mr-1" />Programado</Badge>
      case 'pendiente':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertCircle className="h-3 w-3 mr-1" />Pendiente</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPriorityBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Alta</Badge>
      case 'media':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">Media</Badge>
      case 'baja':
        return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Baja</Badge>
      default:
        return <Badge variant="outline">{prioridad}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completo':
        return 'bg-green-100 text-green-600'
      case 'activo':
        return 'bg-blue-100 text-blue-600'
      case 'nuevo':
        return 'bg-purple-100 text-purple-600'
      case 'pausado':
        return 'bg-yellow-100 text-yellow-600'
      case 'disponible':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const handleNavigation = (url: string) => {
    router.push(url)
  }

  const handleTaskClick = (url: string) => {
    router.push(url)
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
              <BreadcrumbPage>Marketing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Marketing</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona y monitorea tu estrategia de contenido para redes sociales
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleNavigation('/marketing/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Reportes
            </Button>
            <Button onClick={() => handleNavigation('/marketing/content-ideas')}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generar Contenido
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros de período */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'hoy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('hoy')}
          >
            Hoy
          </Button>
          <Button
            variant={selectedPeriod === 'semana' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('semana')}
          >
            Esta Semana
          </Button>
          <Button
            variant={selectedPeriod === 'mes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('mes')}
          >
            Este Mes
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Actualizado hace 5 min
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('/marketing/content-ideas')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contenido Generado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.contenidoGenerado}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('/marketing/calendar')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programado</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.contenidoProgramado}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 días
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('/marketing/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('/marketing/analytics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Seguidores</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metricas.crecimientoSeguidores}</div>
            <p className="text-xs text-muted-foreground">
              Desde el último reporte
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contenido Reciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contenido Reciente
            </CardTitle>
            <CardDescription>
              Últimas publicaciones y programaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contenidoReciente.map((contenido) => (
                <div key={contenido.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      contenido.plataforma === 'Facebook' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {contenido.plataforma === 'Facebook' ? 'FB' : 'IG'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{contenido.titulo}</h4>
                        {getStatusBadge(contenido.estado)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>{contenido.tipo}</span>
                        <span>•</span>
                        <span>{contenido.fecha} a las {contenido.hora}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {contenido.metricas.alcance} alcance
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {contenido.metricas.interacciones} interacciones
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => handleNavigation('/marketing/calendar')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Calendario Completo
            </Button>
          </CardContent>
        </Card>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigation('/marketing/marketing-plan')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Planificar Contenido
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigation('/marketing/settings')}
              >
                <Target className="h-4 w-4 mr-2" />
                Configurar Objetivos
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigation('/marketing/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Ajustes de Marca
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleNavigation('/marketing/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>

          {/* Próximas Tareas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximas Tareas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximasTareas.map((tarea) => (
                  <div 
                    key={tarea.id} 
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleTaskClick(tarea.url)}
                  >
                    <div>
                      <p className="text-sm font-medium">{tarea.tarea}</p>
                      <p className="text-xs text-muted-foreground">{tarea.fecha}</p>
                    </div>
                    {getPriorityBadge(tarea.prioridad)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navegación por Módulos */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Módulos de Marketing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => handleNavigation(item.url)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(item.status)} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
                <CardDescription className="pt-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'completo' ? 'bg-green-100 text-green-700' :
                    item.status === 'activo' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'nuevo' ? 'bg-purple-100 text-purple-700' :
                    item.status === 'pausado' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    Ir al módulo →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}