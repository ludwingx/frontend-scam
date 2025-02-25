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
} from "@/components/ui/sidebar";
import { fetchProfileData } from "@/actions/getDataUserID";

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
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
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
      name: "Usuarios",
      url: "/users",
      icon: Users,
    },
    {
      name: "Iniciar Sesion",
      url: "/signin",
      icon: Settings2,
    },
  ],
};
  type User= {
    id: number;
    full_name: string;
    ci: string;
    rol_id: number;
    rol_name: string;
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
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          {userData && <NavUser user={userData} />}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }