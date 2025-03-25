"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  CheckCircle2,
  Clock,
  Plus,
  RotateCw,
  XCircle,
  ArrowRightCircle,
  Package,
  ChevronDown
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Tipos de datos
type Ingredient = {
  id: number
  name: string
  stock: number
  unit: string
}

type RecipeItem = {
  ingredient: Ingredient
  quantity: number
}

type Recipe = {
  id: number
  name: string
  items: RecipeItem[]
}

type Production = {
  id: number
  name: string
  recipe: Recipe
  quantity: number
  status: "pending" | "in_progress" | "completed" | "canceled"
  createdAt: string
  dueDate: string
}

// Datos ficticios
const mockIngredients: Ingredient[] = [
  { id: 1, name: "Harina", stock: 100, unit: "kg" },
  { id: 2, name: "Azúcar", stock: 50, unit: "kg" },
  { id: 3, name: "Huevos", stock: 200, unit: "unidades" },
]

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: "Receta de Cuñapes",
    items: [
      { ingredient: mockIngredients[0], quantity: 0.5 },
      { ingredient: mockIngredients[1], quantity: 0.2 },
      { ingredient: mockIngredients[2], quantity: 2 },
    ],
  },
]

const mockProductions: Production[] = [
  {
    id: 1,
    name: "Cuñapes",
    recipe: mockRecipes[0],
    quantity: 100,
    status: "pending",
    createdAt: "2023-10-01",
    dueDate: "2023-10-10",
  },
  {
    id: 2,
    name: "Pan de Trigo",
    recipe: mockRecipes[0],
    quantity: 50,
    status: "in_progress",
    createdAt: "2023-10-05",
    dueDate: "2023-10-15",
  },
]

// Componente de estado mejorado
const StatusSelector = ({
  status,
  onStatusChange,
}: {
  status: string
  onStatusChange: (status: Production["status"]) => void
}) => {
  const [open, setOpen] = useState(false)

  const statuses = [
    {
      value: "pending",
      label: "Pendiente",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      value: "in_progress",
      label: "En Proceso",
      icon: RotateCw,
      color: "text-blue-500",
    },
    {
      value: "completed",
      label: "Completado",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      value: "canceled",
      label: "Cancelado",
      icon: XCircle,
      color: "text-red-500",
    },
  ]

  const selectedStatus = statuses.find((s) => s.value === status) || statuses[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <selectedStatus.icon className={`h-4 w-4 ${selectedStatus.color}`} />
          <span>{selectedStatus.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder="Cambiar estado..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => {
                    onStatusChange(status.value as Production["status"])
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <status.icon className={`h-4 w-4 ${status.color}`} />
                  <span>{status.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Componente principal
export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>(mockProductions)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [missingIngredients, setMissingIngredients] = useState<{
    ingredient: Ingredient
    required: number
    missing: number
  }[]>([])
  const [newProductionData, setNewProductionData] = useState<{
    name: string
    quantity: number
    recipe: Recipe
  } | null>(null)
  const router = useRouter()

  const checkIngredients = (name: string, quantity: number, recipe: Recipe) => {
    // Calcular ingredientes necesarios y verificar stock
    const requiredIngredients = recipe.items.map(item => ({
      ingredient: item.ingredient,
      required: item.quantity * quantity,
      missing: Math.max(0, (item.quantity * quantity) - item.ingredient.stock)
    }))

    const missing = requiredIngredients.filter(item => item.missing > 0)

    if (missing.length > 0) {
      setMissingIngredients(missing)
      setNewProductionData({ name, quantity, recipe })
      setIsConfirmationModalOpen(true)
      return false
    }
    return true
  }

  const confirmCreateProduction = () => {
    if (!newProductionData) return
    
    const newProduction: Production = {
      id: Date.now(),
      name: newProductionData.name,
      recipe: newProductionData.recipe,
      quantity: newProductionData.quantity,
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    setProductions(prev => [...prev, newProduction])
    toast.warning("Producción creada como pendiente por falta de ingredientes")
    setIsConfirmationModalOpen(false)
    setIsCreateModalOpen(false)
    setNewProductionData(null)
  }

  const handleCreateProduction = (name: string, quantity: number, recipe: Recipe) => {
    if (checkIngredients(name, quantity, recipe)) {
      // Si no faltan ingredientes, crear producción directamente
      const newProduction: Production = {
        id: Date.now(),
        name,
        recipe,
        quantity,
        status: "in_progress",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      setProductions(prev => [...prev, newProduction])
      toast.success("Producción creada exitosamente")
      setIsCreateModalOpen(false)
    }
  }

  const handleStatusChange = (id: number, newStatus: Production["status"]) => {
    setProductions(prev =>
      prev.map(prod =>
        prod.id === id ? { ...prod, status: newStatus } : prod
      )
    )
    toast.success("Estado actualizado")
  }

  const handlePurchaseRedirect = () => {
    const missingIds = missingIngredients.map(ing => ing.ingredient.id)
    router.push(`/purchases?missing=${missingIds.join(",")}`)
    setIsConfirmationModalOpen(false)
    setIsCreateModalOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
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
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Producción
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Título y descripción */}
        <h2 className="text-3xl font-semibold text-gray-900">Producción</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las producciones.
        </small>
      </div>

      {/* Botón de acción */}
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Producción
        </Button>
      </div>

      {/* Tabla de producciones */}
      <Card>
        <CardHeader>
          <CardTitle>Producciones Activas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Receta</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productions.map((production) => (
                <TableRow key={production.id}>
                  <TableCell className="font-medium">#{production.id}</TableCell>
                  <TableCell>{production.name}</TableCell>
                  <TableCell>{production.quantity} unidades</TableCell>
                  <TableCell>{production.recipe.name}</TableCell>
                  <TableCell>
                    {new Date(production.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusSelector
                      status={production.status}
                      onStatusChange={(status) =>
                        handleStatusChange(production.id, status)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para crear nueva producción */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Crear Nueva Producción</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const name = form.elements.namedItem("name") as HTMLInputElement
                  const quantity = form.elements.namedItem("quantity") as HTMLInputElement
                  
                  handleCreateProduction(
                    name.value,
                    Number(quantity.value),
                    mockRecipes[0] // Usar la primera receta por defecto
                  )
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input id="name" required placeholder="Ej: Cuñapes especiales" />
                </div>
                <div>
                  <Label htmlFor="quantity">Cantidad a Producir</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    required 
                    placeholder="Ej: 100" 
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Producción
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de confirmación para ingredientes faltantes */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ingredientes Faltantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  No hay suficiente stock para completar la producción. ¿Deseas crear la producción como pendiente?
                </p>
                
                <div className="border rounded-lg divide-y">
                  {missingIngredients.map((item) => (
                    <div key={item.ingredient.id} className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium">{item.ingredient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock actual: {item.ingredient.stock} {item.ingredient.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Necesario: {item.required.toFixed(2)} {item.ingredient.unit}
                        </p>
                      </div>
                      <div className="text-red-500 text-sm font-medium">
                        Faltan: {item.missing.toFixed(2)} {item.ingredient.unit}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsConfirmationModalOpen(false)
                      setIsCreateModalOpen(false)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handlePurchaseRedirect}
                  >
                    <ArrowRightCircle className="mr-2 h-4 w-4" />
                    Comprar Ingredientes
                  </Button>
                  <Button onClick={confirmCreateProduction}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear como Pendiente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}