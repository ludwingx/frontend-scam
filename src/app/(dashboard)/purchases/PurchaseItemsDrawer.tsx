"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Purchase } from "./columns";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PurchaseItemsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: Purchase | null;
}

export function PurchaseItemsDrawer({
  open,
  onOpenChange,
  purchase,
}: PurchaseItemsDrawerProps) {
  if (!purchase) return null;

  const formattedDate = format(new Date(purchase.fecha_compra), "PPP", {
    locale: es,
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-3xl mx-auto rounded-t-2xl shadow-xl">
        {/* Header */}
        <DrawerHeader className="px-6 py-4 border-b">
          <DrawerTitle className="text-xl sm:text-2xl font-semibold tracking-tight">
            Orden de Compra #{purchase.id_compra}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            {formattedDate} • {purchase.proveedor || "Sin proveedor"}
          </DrawerDescription>
        </DrawerHeader>

        {/* Body */}
        <div className="flex-1 flex flex-col px-3 sm:px-6">
          {/* Desktop Header */}
          <div className="hidden sm:grid grid-cols-5 gap-2 text-sm font-medium text-muted-foreground border-b pb-2 mb-2">
            <div>Insumo</div>
            <div className="text-center">Cantidad</div>
            <div className="text-center">Precio Unit.</div>
            <div className="text-center">Subtotal</div>
            <div></div>
          </div>

          <ScrollArea className="flex-1 pr-1 sm:pr-2">
            {purchase.items.map((item, index) => (
              <div
                key={`${item.id_insumo}-${index}`}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 p-3 sm:py-4 sm:px-2 rounded-xl border bg-card/50 shadow-sm hover:shadow-md transition-all mb-3"
              >
                {/* Columna Insumo */}
                <div className="flex flex-col">
                  <span className="font-medium text-base sm:text-sm">
                    {item.nombre_insumo}
                  </span>
                  <div className="flex justify-between sm:block">
                    <span className="text-xs text-muted-foreground">
                      {item.unidad_medida}
                    </span>
                    {/* Mobile quick info */}
                    <span className="sm:hidden text-sm font-medium">
                      Bs. {item.precio_unitario.toFixed(2)} ×{" "}
                      {item.cantidad.toFixed(3)} = Bs.{" "}
                      {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Desktop only */}
                <div className="hidden sm:flex items-center justify-center">
                  {item.cantidad.toFixed(3)}
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  Bs. {item.precio_unitario.toFixed(2)}
                </div>
                <div className="hidden sm:flex items-center justify-center font-medium">
                  Bs. {item.subtotal.toFixed(2)}
                </div>
                <div className="hidden sm:block"></div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Totales */}
        <div className="border-t px-6 py-4 bg-muted/40 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {purchase.items.length}{" "}
              {purchase.items.length === 1 ? "item" : "items"} en total
            </div>
            <div className="text-xl font-bold text-primary">
              Total: Bs. {purchase.monto_total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DrawerFooter className="p-4 border-t-0">
          <DrawerClose asChild>
            <Button
              variant="secondary"
              className="w-full sm:w-auto rounded-xl"
            >
              Cerrar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
