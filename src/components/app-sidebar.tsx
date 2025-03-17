"use client";
import * as React from "react";
import {
  AlignVerticalSpaceAround,
  AudioWaveform,
  Box,
  BriefcaseBusiness,
  Building,
  Building2,
  Cake,
  Command,
  Container,
  GalleryVerticalEnd,
  LayoutDashboard,
  NotepadText,
  Package,
  PackagePlus,
  ScanFace,
  Settings2,
  ShoppingBasket,
  ShoppingCart,
  UserRoundCog,
  Users,
  Wheat,
} from "lucide-react";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { fetchProfileData } from "@/services/getDataUserID";
import { User } from "@/types/user";
import { NavMain } from "./nav-main";
import Image from "next/image";

// Datos de ejemplo
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
    {
      name: "Iniciar Sesion",
      url: "/signin",
      icon: Settings2,
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez, al montar el componente

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="/SCZ-Alimentos-Logo.svg"
          alt="Logo"
          width={200}
          height={200}
          className="flex justify-center items-center"
          priority // Asegura que la imagen se cargue con prioridad
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain}  />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}