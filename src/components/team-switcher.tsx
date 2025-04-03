"use client";

import * as React from "react";
import { ChevronsUpDown, MapPinHouse } from "lucide-react";
import { useSucursal } from "@/hooks/use-sucursal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Team {
  id: string;
  name: string;
  plan: string;
  logo: React.ElementType;
}

export function TeamSwitcher({ teams = [] }: { teams?: Team[] }) {
  const { isMobile } = useSidebar();
  const { sucursalActual, setSucursal } = useSucursal();
  const [initialized, setInitialized] = React.useState(false);
  
  // Logo único para todas las sucursales
  const DefaultLogo = MapPinHouse;

  // Efecto para manejar la inicialización
  React.useEffect(() => {
    if (initialized || typeof window === 'undefined' || teams.length === 0) {
      return;
    }

    // Intentar cargar sucursal guardada
    const savedSucursal = localStorage.getItem('sucursal-actual');
    
    if (savedSucursal) {
      try {
        const parsed = JSON.parse(savedSucursal);
        const validTeam = teams.find(t => t.id === parsed.id);
        if (validTeam) {
          setSucursal(validTeam);
          setInitialized(true);
          return;
        }
      } catch (e) {
        console.error("Error parsing saved sucursal", e);
        localStorage.removeItem('sucursal-actual');
      }
    }

    // Establecer primera sucursal como predeterminada
    if (!sucursalActual) {
      setSucursal(teams[0]);
    }
    
    setInitialized(true);
  }, [teams, sucursalActual, setSucursal, initialized]);

  // Efecto para guardar cambios (solo cuando cambia sucursalActual)
  React.useEffect(() => {
    if (initialized && sucursalActual && typeof window !== 'undefined') {
      localStorage.setItem('sucursal-actual', JSON.stringify(sucursalActual));
    }
  }, [sucursalActual, initialized]);

  const handleSucursalChange = (team: Team) => {
    if (team.id !== sucursalActual?.id) {
      setSucursal(team);
    }
  };

  if (!sucursalActual || teams.length === 0) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 dark:data-[state=open]:bg-sidebar-accent dark:data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white dark:bg-sidebar-primary dark:text-sidebar-primary-foreground">
                <DefaultLogo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {sucursalActual.name}
                </span>
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">{sucursalActual.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-500 dark:text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-gray-500 dark:text-muted-foreground">
              Sucursales
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleSucursalChange(team)}
                className="gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-gray-200 dark:border-gray-600">
                  <DefaultLogo className="size-4 shrink-0 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{team.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{team.plan}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}