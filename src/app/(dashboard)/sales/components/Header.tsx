"use client";

import { Button } from "@/components/ui/button";
import { Plus, History } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push('/sales/new');
  };

  const handleSalesHistory = () => {
    router.push('/sales/history');
  };

  return (
    <div className="flex gap-2">
      <Button className="gap-2" onClick={handleSalesHistory} variant="outline">
        <History className="h-4 w-4" />
        Historial de Ventas
      </Button>
      <Button className="gap-2" onClick={handleNewSale}>
        <Plus className="h-4 w-4" />
        Nueva Venta
      </Button>
    </div>
  );
}