import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  
  export default function BreadcrumbNav() {
    return (
      <Breadcrumb >
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              href="/dashboard"
            >
              Panel de Control
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="text-sm font-medium text-foreground"
              href="/dashboard/sales"
            >
              Gestión de Ventas
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  