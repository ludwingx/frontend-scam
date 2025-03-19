"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Link from "next/link";
import { fetchProfileData } from "@/services/userService";
import { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchProfileData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      deleteCookie("token", { path: "/" });
      deleteCookie("user_id", { path: "/" });
      window.location.href = "/signin";
    }
  };

  // Skeleton Loading State
  if (isLoading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Skeleton className="h-8 w-8 rounded-lg" /> {/* Avatar Skeleton */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton className="h-4 w-24 rounded-md" /> {/* Name Skeleton */}
                  <Skeleton className="mt-1 h-3 w-16 rounded-md" /> {/* Role Skeleton */}
                </div>
                <Skeleton className="ml-auto h-4 w-4 rounded-md" /> {/* Chevron Skeleton */}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
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
                  {user.full_name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
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
                    {user.full_name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.full_name}</span>
                  <span className="truncate text-xs">{user.rol_name}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                <Link href="/profile" className="w-full">
                  Cuenta
                </Link>
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