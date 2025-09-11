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
      <DrawerContent className="sm:max-w-3xl mx-auto rounded-t-2xl shadow-lg">
        <DrawerHeader className="px-6 py-4 border-b">
          <DrawerTitle className="text-lg sm:text-xl font-semibold">
            Orden de Compra #{purchase.id_compra}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            {formattedDate}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 flex flex-col px-3 sm:px-6">
          <div className="hidden sm:grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground border-b py-2 mb-2 uppercase ">
            <div className="font-semibold text-sm">Insumo</div>
            <div className="text-center font-semibold text-sm">Proveedor</div>
            <div className="text-center font-semibold text-sm">Cantidad</div>
            <div className="text-center font-semibold text-sm">Precio Unit.</div>
            <div className="text-center font-semibold text-sm">Subtotal</div>
            <div></div>
          </div>

          <ScrollArea className="flex-1 pr-1 sm:pr-2">
            <div className="divide-y">
              {purchase.items.map((item, index) => (
                <div
                  key={`${item.id_insumo}-${index}`}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {item.nombre_insumo}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.unidad_medida}
                    </span>
                    <span className="sm:hidden text-xs font-medium mt-1">
                      Proveedor: {item.proveedor || 'Sin proveedor'}<br/>
                      Bs. {item.precio_unitario.toFixed(2)} × {Number.isInteger(item.cantidad) ? item.cantidad : parseFloat(item.cantidad.toFixed(3))} = Bs. {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-sm">
                    {item.proveedor || 'Sin proveedor'}
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-sm">
                    {Number.isInteger(item.cantidad) ? item.cantidad : parseFloat(item.cantidad.toFixed(3))}
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-sm">
                    Bs. {item.precio_unitario.toFixed(2)}
                  </div>
                  <div className="hidden sm:flex items-center justify-center font-medium text-sm">
                    Bs. {item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="border-t px-6 py-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {purchase.items.length}{" "}
              {purchase.items.length === 1 ? "item" : "items"} en total
            </div>
            <div className="text-lg sm:text-xl font-bold text-primary">
              Total: Bs. {purchase.monto_total.toFixed(2)}
            </div>
          </div>
        </div>
        <DrawerFooter className="p-4 border-t-0">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto rounded-lg">
              Cerrar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
