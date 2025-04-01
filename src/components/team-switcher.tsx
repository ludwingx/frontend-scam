// src/components/team-switcher.tsx
"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { useSucursal } from "@/hooks/use-sucursal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface Team {
  id: string
  name: string
  logo: React.ElementType
  plan: string
}

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar()
  const { sucursalActual, setSucursal } = useSucursal()

  // Efecto para manejar la persistencia
  React.useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window !== 'undefined') {
      const savedSucursal = localStorage.getItem('sucursal-actual')
      
      if (savedSucursal) {
        try {
          const parsed = JSON.parse(savedSucursal)
          const validTeam = teams.find(t => t.id === parsed.id)
          if (validTeam) {
            setSucursal(validTeam)
            return
          }
        } catch (e) {
          console.error("Error parsing saved sucursal", e)
          localStorage.removeItem('sucursal-actual')
        }
      }

      // Si no hay sucursal guardada válida, establecer la primera
      if (teams.length > 0 && !sucursalActual) {
        setSucursal(teams[0])
      }
    }
  }, []) // Solo se ejecuta una vez al montar

  // Efecto para guardar cambios
  React.useEffect(() => {
    if (sucursalActual) {
      localStorage.setItem('sucursal-actual', JSON.stringify(sucursalActual))
    }
  }, [sucursalActual])

  const handleSucursalChange = (team: Team) => {
    setSucursal(team)
  }

  if (!sucursalActual) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <sucursalActual.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {sucursalActual.name}
                </span>
                <span className="truncate text-xs">{sucursalActual.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Sucursales
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleSucursalChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.plan}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}