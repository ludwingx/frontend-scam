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
  
  // Logo único para todas las sucursales
  const DefaultLogo = MapPinHouse;

  // Efecto para manejar la persistencia
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSucursal = localStorage.getItem('sucursal-actual');
      
      if (savedSucursal) {
        try {
          const parsed = JSON.parse(savedSucursal);
          const validTeam = teams.find(t => t.id === parsed.id);
          if (validTeam) {
            setSucursal(validTeam);
            return;
          }
        } catch (e) {
          console.error("Error parsing saved sucursal", e);
          localStorage.removeItem('sucursal-actual');
        }
      }

      if (teams.length > 0 && !sucursalActual) {
        setSucursal(teams[0]);
      }
    }
  }, [teams, sucursalActual, setSucursal]);

  // Efecto para guardar cambios
  React.useEffect(() => {
    if (sucursalActual && typeof window !== 'undefined') {
      localStorage.setItem('sucursal-actual', JSON.stringify(sucursalActual));
    }
  }, [sucursalActual]);

  const handleSucursalChange = (team: Team) => {
    setSucursal(team);
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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <DefaultLogo className="size-4" />
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
                  <DefaultLogo className="size-4 shrink-0" />
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
  );
}