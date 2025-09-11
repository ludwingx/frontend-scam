"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleNewSale = () => {
    router.push('/sales/new');
  };

  return (
    <Button className="gap-2" onClick={handleNewSale}>
      <Plus className="h-4 w-4" />
      Nueva Venta
    </Button>
  );
}
