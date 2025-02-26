"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,

} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { deleteCookie } from "cookies-next";
import { fetchProfileData } from "@/services/fetchProfileData";
import Link from "next/link";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<{
    id: number;
    full_name: string;
    ci: string;
    rol_id: number;
    rol_name: string;
  } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchProfileData();
      if (userData) {
        setUser(userData);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    // Eliminar las cookies del token y user_id
    deleteCookie("token", { path: "/" });
    deleteCookie("user_id", { path: "/" });

    // Redirigir al usuario a la página de login
    window.location.href = "/signin";
  };

  if (!user) {
    return <div>Cargando...</div>; // O un spinner de carga
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
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={user.full_name} />
                <AvatarFallback>
                  {user.full_name}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.full_name}</span>
                <span className="truncate text-xs">{user.rol_name}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user.full_name} />
                  <AvatarFallback className="rounded-lg">
                    {user.full_name}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.full_name}</span>
                  <span className="truncate text-xs">{user.rol_name}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
               <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem >
                <BadgeCheck />
                <Link href="/profile">Cuenta</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}