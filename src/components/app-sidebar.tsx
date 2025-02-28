"use client";
import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Command,
  Container,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingBasket,
  ShoppingCart,
  SquareTerminal,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { fetchProfileData } from "@/actions/getDataUserID";

import { User } from "@/types/user";
import { NavMain } from "./nav-main";

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
      icon: ShoppingCart
    },
    {
      name: "Inventario",
      url: "/storage",
      icon: Container
    },
    

    {
      name: "Iniciar Sesion",
      url: "/signin",
      icon: Settings2,
    },
  ],
  navMain: [
    // {
    //   title: "Playground",
    //   url: "#",
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "History",
    //       url: "#",
    //     },
    //     {
    //       title: "Starred",
    //       url: "#",
    //     },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Usuarios",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Roles",
          url: "/roles",
    
        }

      ]
    },
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
          <img
            src="/SCZ-Alimentos-Logo.svg"
            className="flex justify-center items-center"
            alt="Logo"
            width={200}
            height={200}
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