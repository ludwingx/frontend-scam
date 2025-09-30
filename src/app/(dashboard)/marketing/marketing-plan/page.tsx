// src/app/(dashboard)/marketing/marketing-plan/page.tsx

"use client"

import { useState, useEffect } from 'react'
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Facebook, Instagram, Clock, Target, Calendar as CalendarIcon, Plus, Sparkles } from 'lucide-react'

// Tipos basados en la estructura del JSON
type ContenidoGenerado = {
  fecha: string
  hora_publicacion: string
  negocio_id: string
  plataforma: string
  tipo_contenido: string
  titulo: string
  copy_publicacion: string
  hashtags: string[]
  producto_destacado: string
  objetivo_estrategico: string
  tono_aplicado: string
  emojis_utilizados: string[]
  llamado_accion: string
  estado: string
  fecha_creacion: string
  fecha_actualizacion: string
}

type Metadata = {
  estado_procesamiento: string
  total_caracteres: number
  emojis_count: number
  hashtags_count: number
  coherencia_estilo: string
  alineacion_objetivos: string
}

type MarketingPlan = {
  output: {
    contenido_generado: ContenidoGenerado
    metadata: Metadata
  }
}

// Simulación de datos basada en tu estructura JSON
const marketingData: MarketingPlan[] = [
  {
    output: {
      contenido_generado: {
        fecha: "2025-10-01",
        hora_publicacion: "10:00",
        negocio_id: "TORTA_EXPRESS_001",
        plataforma: "Facebook",
        tipo_contenido: "Promoción",
        titulo: "¡Celebramos el mes de la madre con un dulce regalo!",
        copy_publicacion: "🎉 ¡Octubre es un mes especial en Torta Express! Este mes, queremos ayudarte a sorprender a mamá con nuestra deliciosa Torta de Oreo, ¡el regalo perfecto para hacerla sentir única! 🥳 Personaliza tu mensaje y disfruta de un sabor incomparable. ¡Haz tu pedido ya! 📞 62013533 #TortaExpress #MesDeLaMadre #TortaDeOreo",
        hashtags: ["#TortaExpress", "#MesDeLaMadre", "#TortaDeOreo"],
        producto_destacado: "Torta de Oreo",
        objetivo_estrategico: "Incrementar ventas Torta Oreo",
        tono_aplicado: "Cercano, alegre y confiable",
        emojis_utilizados: ["🎉", "🥳", "📞"],
        llamado_accion: "¡Haz tu pedido ya!",
        estado: "pendiente",
        fecha_creacion: "2025-10-15T10:30:00.000Z",
        fecha_actualizacion: "2025-10-15T10:30:00.000Z"
      },
      metadata: {
        estado_procesamiento: "Exitoso",
        total_caracteres: 235,
        emojis_count: 3,
        hashtags_count: 3,
        coherencia_estilo: "Alto",
        alineacion_objetivos: "Alto"
      }
    }
  },
  {
    output: {
      contenido_generado: {
        fecha: "2025-10-01",
        hora_publicacion: "15:00",
        negocio_id: "TORTA_EXPRESS_001",
        plataforma: "Instagram",
        tipo_contenido: "Story",
        titulo: "¿Cuál es tu sabor favorito?",
        copy_publicacion: "📱 ¡Hola Santa Cruz! ¿Chocolate 🍫, Vainilla 🧁 o Oreo 🍪? Vota en nuestra encuesta y participa por una mini torta gratis! 👇",
        hashtags: ["#Encuesta", "#TortaExpress", "#SantaCruz"],
        producto_destacado: "Torta de Chocolate Intenso",
        objetivo_estrategico: "Generar engagement",
        tono_aplicado: "Cercano y divertido",
        emojis_utilizados: ["📱", "🍫", "🧁", "🍪", "👇"],
        llamado_accion: "Vota en nuestra encuesta",
        estado: "programado",
        fecha_creacion: "2025-10-15T10:30:00.000Z",
        fecha_actualizacion: "2025-10-15T10:30:00.000Z"
      },
      metadata: {
        estado_procesamiento: "Exitoso",
        total_caracteres: 145,
        emojis_count: 5,
        hashtags_count: 3,
        coherencia_estilo: "Alto",
        alineacion_objetivos: "Medio"
      }
    }
  },
  {
    output: {
      contenido_generado: {
        fecha: "2025-10-05",
        hora_publicacion: "12:00",
        negocio_id: "TORTA_EXPRESS_001",
        plataforma: "Facebook",
        tipo_contenido: "Post",
        titulo: "Fin de semana dulce",
        copy_publicacion: "¡Hola Santa Cruz! 🎂 ¿Planes para el fin de semana? Endulza tus momentos con nuestra Torta Tres Leches Clásica. ¡Perfecta para compartir en familia! 🏡 Pedidos al 62013533",
        hashtags: ["#TortaExpress", "#FinDeSemana", "#TortaTresLeches"],
        producto_destacado: "Torta de Tres Leches Clásica",
        objetivo_estrategico: "Ventas fin de semana",
        tono_aplicado: "Cercano y familiar",
        emojis_utilizados: ["🎂", "🏡"],
        llamado_accion: "Pedidos al 62013533",
        estado: "pendiente",
        fecha_creacion: "2025-10-15T10:30:00.000Z",
        fecha_actualizacion: "2025-10-15T10:30:00.000Z"
      },
      metadata: {
        estado_procesamiento: "Exitoso",
        total_caracteres: 180,
        emojis_count: 2,
        hashtags_count: 3,
        coherencia_estilo: "Alto",
        alineacion_objetivos: "Alto"
      }
    }
  }
]

// Componente para la tarjeta de contenido
function ContenidoCard({ contenido, onGenerateContent }: { 
  contenido: MarketingPlan 
  onGenerateContent: (fecha: string, plataforma?: string) => void 
}) {
  const data = contenido.output.contenido_generado
  const metadata = contenido.output.metadata

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'secondary'
      case 'programado':
        return 'default'
      case 'publicado':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getPlatformIcon(data.plataforma)}
              {data.titulo}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {data.hora_publicacion}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {data.objetivo_estrategico}
              </span>
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(data.estado)}>
            {data.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          {/* Información principal */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Plataforma:</span>
              <Badge variant="outline" className="ml-2">
                {data.plataforma}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Producto:</span>
              <span className="ml-2">{data.producto_destacado}</span>
            </div>
          </div>

          {/* Preview del copy */}
          <div className="text-sm">
            <p className="line-clamp-2 text-muted-foreground">
              {data.copy_publicacion}
            </p>
          </div>

          {/* Hashtags preview */}
          <div className="flex flex-wrap gap-1">
            {data.hashtags.slice(0, 3).map((hashtag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {hashtag}
              </Badge>
            ))}
            {data.hashtags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{data.hashtags.length - 3} más
              </Badge>
            )}
          </div>

          {/* Metadata rápida */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{metadata.total_caracteres} caracteres</span>
            <span>{metadata.emojis_count} emojis</span>
            <span>Coherencia: {metadata.coherencia_estilo}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Ver detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getPlatformIcon(data.plataforma)}
                  {data.titulo}
                </DialogTitle>
                <DialogDescription>
                  Contenido programado para el {data.fecha} a las {data.hora_publicacion}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Información general */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">Plataforma</h4>
                    <p>{data.plataforma}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Tipo de Contenido</h4>
                    <p>{data.tipo_contenido}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Producto Destacado</h4>
                    <p>{data.producto_destacado}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Estado</h4>
                    <Badge variant={getStatusVariant(data.estado)}>
                      {data.estado}
                    </Badge>
                  </div>
                </div>

                {/* Copy completo */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Contenido</h4>
                  <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap">
                    {data.copy_publicacion}
                  </div>
                </div>

                {/* Hashtags completos */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Hashtags ({data.hashtags.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {data.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Emojis utilizados */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Emojis Utilizados</h4>
                  <div className="flex gap-1 text-lg">
                    {data.emojis_utilizados.map((emoji, index) => (
                      <span key={index}>{emoji}</span>
                    ))}
                  </div>
                </div>

                {/* Objetivo y métricas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Objetivo Estratégico</h4>
                    <p className="text-sm">{data.objetivo_estrategico}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Métricas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Caracteres:</span>
                        <span>{metadata.total_caracteres}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coherencia:</span>
                        <Badge variant="outline">{metadata.coherencia_estilo}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Alineación:</span>
                        <Badge variant="outline">{metadata.alineacion_objetivos}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Llamado a la acción */}
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Llamado a la Acción</h4>
                  <p className="text-sm">{data.llamado_accion}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onGenerateContent(data.fecha, data.plataforma)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generar Similar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para el calendario tipo tabla
function CalendarTable({ 
  data, 
  selectedDate,
  onDateSelect 
}: { 
  data: MarketingPlan[],
  selectedDate: string | null,
  onDateSelect: (date: string) => void 
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Navegación entre meses
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }
  
  // Obtener el primer día del mes
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  
  // Obtener el último día del mes
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  
  // Crear array de días del mes
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  // Agrupar contenido por fecha
  const contentByDate: { [key: string]: MarketingPlan[] } = {}
  data.forEach(item => {
    const date = item.output.contenido_generado.fecha
    if (!contentByDate[date]) {
      contentByDate[date] = []
    }
    contentByDate[date].push(item)
  })

  // Días de la semana (mover fuera del componente para evitar recreación)
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="w-full">
      {/* Encabezado del mes */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPreviousMonth}
          className="w-8 h-8 p-0"
        >
          &lt;
        </Button>
        <div className="text-center">
          <h3 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToCurrentMonth}
            className="text-xs"
          >
            Hoy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToNextMonth}
            className="w-8 h-8 p-0"
          >
            &gt;
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {/* Espacios vacíos para alinear el primer día */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square p-1" />
        ))}
        
        {/* Días del mes */}
        {days.map(day => {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayContent = contentByDate[dateStr] || []
          const isToday = day === new Date().getDate() && 
                         currentMonth === new Date().getMonth() && 
                         currentYear === new Date().getFullYear()
          
          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className={`
                aspect-square p-1.5 border rounded-lg text-sm transition-all duration-200
                ${isToday 
                  ? 'bg-primary/10 border-primary shadow-sm' 
                  : selectedDate === dateStr
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-background hover:bg-muted/50 border-border'
                }
                ${dayContent.length > 0 ? 'border-green-200 bg-green-50/50 hover:bg-green-50' : ''}
                flex flex-col overflow-hidden group
              `}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`text-xs font-medium ${
                  isToday ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {weekDays[new Date(currentYear, currentMonth, day).getDay()].charAt(0)}
                </span>
                <span className={`font-medium ${
                  isToday 
                    ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm'
                    : 'text-foreground'
                }`}>
                  {day}
                </span>
              </div>
              
              {dayContent.length > 0 && (
                <div className="mt-1 flex-1 w-full overflow-hidden">
                  <div className="space-y-1">
                    {dayContent.slice(0, 2).map((item, index) => {
                      const platform = item.output.contenido_generado.plataforma
                      const isFacebook = platform.toLowerCase() === 'facebook'
                      return (
                        <div
                          key={index}
                          className={`
                            flex items-center gap-1 p-1 rounded text-xs truncate
                            ${isFacebook ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}
                            group-hover:opacity-90 transition-opacity
                          `}
                          title={`${platform}: ${item.output.contenido_generado.titulo}`}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            isFacebook ? 'bg-blue-500' : 'bg-pink-500'
                          }`} />
                          <span className="truncate">
                            {item.output.contenido_generado.tipo_contenido}
                          </span>
                        </div>
                      )
                    })}
                    {dayContent.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center mt-1">
                        +{dayContent.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Leyenda</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 bg-background rounded-md border">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium">Facebook</p>
              <p className="text-xs text-muted-foreground">Publicaciones</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background rounded-md border">
            <div className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium">Instagram</p>
              <p className="text-xs text-muted-foreground">Publicaciones</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-background rounded-md border">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium">Programado</p>
              <p className="text-xs text-muted-foreground">Contenido activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarketingPlanPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Filtrar contenido por fecha seleccionada
  const filteredContent = selectedDate 
    ? marketingData.filter(item => item.output.contenido_generado.fecha === selectedDate)
    : []

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  // Función para generar contenido
  const handleGenerateContent = async (fecha: string, plataforma?: string) => {
    setIsGenerating(true)
    
    // Simulamos una llamada a la API
    try {
      console.log(`Generando contenido para ${fecha}${plataforma ? ` en ${plataforma}` : ''}`)
      
      // Aquí iría la llamada real a tu API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulamos éxito
      alert(`¡Contenido generado exitosamente para ${fecha}!`)
      
    } catch (error) {
      console.error('Error generando contenido:', error)
      alert('Error al generar contenido. Por favor, intenta nuevamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
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
              <BreadcrumbPage>Plan de Marketing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h2 className="text-3xl font-semibold">Plan de Marketing</h2>
          <small className="text-sm text-muted-foreground">
            Visualiza y gestiona tu calendario de contenido para redes sociales
          </small>
        </div>
      </div>

      {/* Layout principal: Calendario y contenido al 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario - 50% del ancho */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendario de Contenido
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `Día seleccionado: ${new Date(selectedDate).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}`
                : 'Haz clic en cualquier día para ver el contenido programado'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarTable 
              data={marketingData}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect} 
            />
          </CardContent>
        </Card>

        {/* Contenido del día seleccionado - 50% del ancho */}
        <div className="flex flex-col h-full">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {selectedDate 
                      ? `Contenido programado`
                      : 'Vista previa del contenido'
                    }
                  </CardTitle>
                  <CardDescription>
                    {selectedDate 
                      ? `${filteredContent.length} publicación${filteredContent.length !== 1 ? 'es' : ''} programada${filteredContent.length !== 1 ? 's' : ''}`
                      : 'Selecciona una fecha para ver el contenido programado'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)] overflow-y-auto">
              {selectedDate ? (
                filteredContent.length > 0 ? (
                  <div className="space-y-4">
                    {filteredContent.map((contenido, index) => (
                      <ContenidoCard 
                        key={index} 
                        contenido={contenido}
                        onGenerateContent={handleGenerateContent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No hay contenido programado</p>
                    <p className="text-sm mt-2 mb-4">
                      No hay publicaciones programadas para esta fecha
                    </p>
                    <Button 
                      onClick={() => handleGenerateContent(selectedDate)}
                      disabled={isGenerating}
                      className="flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generar Contenido para este día
                        </>
                      )}
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Selecciona una fecha</p>
                  <p className="text-sm mt-2">
                    Haz clic en cualquier día del calendario para ver el contenido programado
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground/70">
                    Los días con contenido programado aparecen en verde claro
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}