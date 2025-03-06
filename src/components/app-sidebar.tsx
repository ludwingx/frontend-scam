"use client";
import * as React from "react";
import {
  AudioWaveform,
  BriefcaseBusiness,
  Command,
  Container,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingBasket,
  ShoppingCart,
  Users,
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
import { fetchProfileData } from "@/actions/getDataUserID";
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
      name: "Negocios",
      url: "/business",
      icon: BriefcaseBusiness,
    },
    {
      name: "Ingredientes",
      url: "/ingredients",
      icon: ShoppingBasket,
    },
    {
      name: "Productos",
      url: "/products",
      icon: Package,
    },
    {
      name: "Compras",
      url: "/purchases",
      icon: ShoppingCart,
    },
    {
      name: "Inventario",
      url: "/storage",
      icon: Container,
    },
    {
      name: "Iniciar Sesion",
      url: "/signin",
      icon: Settings2,
    },
  ],
  navMain: [
    {
      title: "Usuarios",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Roles",
          url: "/roles",
        },
      ],
    },
    {
      title: "Inventarios",
      url: "/inventories",
      icon: Container,
      items: [
        {
          title: "Materias Primas",
          url: "/inventories/raw-materials",
        },
        {
          title: "Productos Bases",
          url: "/inventories/base-products",
        },
        {
          title: "Productos Finales",
          url: "/inventories/final-products",
        }
      ],
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}