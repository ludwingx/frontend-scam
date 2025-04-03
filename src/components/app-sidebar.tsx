// src/components/app-sidebar.tsx
"use client"

import * as React from "react"
import {
  AlignVerticalSpaceAround,
  Box,
  BriefcaseBusiness,
  Building,
  Building2,
  Cake,
  Container,
  LayoutDashboard,
  MapPinHouse,
  NotepadText,
  Package,
  PackagePlus,
  ScanFace,
  ShoppingBasket,
  ShoppingCart,
  UserRoundCog,
  Users,
  Wheat,
} from "lucide-react"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "@/types/user"
import { NavMain } from "./nav-main"
import Image from "next/image"
import { fetchProfileData } from "@/services/userService"
import { TeamSwitcher } from "./team-switcher"

// Datos estáticos fuera del componente
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      id: 'suc-1',
      name: "Sucursal 1",
      logo: MapPinHouse,
      plan: "Radial 19 1/2",
    },
    {
      id: 'suc-2',
      name: "Sucursal 2",
      logo: MapPinHouse,
      plan: "Av Virgen de Cotoca",
    },
    {
      id: 'suc-3',
      name: "Sucursal 3",
      logo: MapPinHouse,
      plan: "Radial 26",
    },
  ],
  projects: [
    {
      name: "Panel de Control",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Compras",
      url: "/purchases",
      icon: ShoppingCart,
    },
    {
      name: "Producción",
      url: "/production",
      icon: PackagePlus,
    },
  ],
  navMain: [
    {
      title: "Gestion de Usuarios",
      url: "/users-management",
      icon: UserRoundCog,
      items: [
        {
          title: "Usuarios",
          url: "/users-management/users",
          icon: Users
        },
        {
          title: "Roles",
          url: "/users-management/roles",
          icon: ScanFace
        },
      ],
    },
    {
      title: "Gestión de Items",
      url: "/items-management",
      icon: Box,
      items: [
        {
          title: "Ingredientes",
          url: "/ingredients",
          icon: ShoppingBasket
        },
        {
          title: "Recetas",
          url: "/recipes",
          icon: NotepadText
        },
        {
          title: "Productos",
          url: "/products",
          icon: Package
        },
      ]
    },
    {
      title: "Inventarios",
      url: "/inventories",
      icon: Container,
      items: [
        {
          title: "Materias Primas",
          url: "/inventories/raw-materials",
          icon: Wheat
        },
        {
          title: "Productos Bases",
          url: "/inventories/base-products",
          icon: AlignVerticalSpaceAround
        },
        {
          title: "Productos Finales",
          url: "/inventories/final-products",
          icon: Cake
        }
      ],
    },
    {
      title: "Organización",
      url: "/organization",
      icon: Building2,
      items: [
        {
          title: "Negocios",
          url: "/organization/business",
          icon: BriefcaseBusiness
        },
        {
          title: "sucursales",
          url: "/organization/branches",
          icon: Building
        },
      ]
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<User | null>(null);

  // Carga inicial del perfil del usuario (solo una vez)
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchProfileData();
        setUserData(data);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams}  />
        <div className="flex flex-col items-center">
          <Image
            src="/SCZ-Alimentos-Logo.svg"
            alt="Logo"
            width={200}
            height={200}
            className="flex justify-center items-center"
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser/>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}