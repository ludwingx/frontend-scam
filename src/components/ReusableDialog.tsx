import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface ReusableDialogProps {
  title: string;
  description: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit: (e: FormEvent) => void;
  submitButtonText?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void; // Prop para manejar cambios de estado
  isOpen?: boolean; // Prop para controlar si el diálogo está abierto
  showSubmitButton?: boolean; // Nueva prop para controlar si se muestra el botón de envío
}

export function ReusableDialog({
  title,
  description,
  trigger,
  onSubmit,
  submitButtonText = "Cerrar", // Valor por defecto para submitButtonText
  children,
  onOpenChange,
  isOpen,
  showSubmitButton = true, // Valor por defecto para showSubmitButton
}: ReusableDialogProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevenir el envío automático del formulario
    onSubmit(e); // Llamar a la función onSubmit proporcionada
    onOpenChange?.(false); // Cerrar el diálogo después de enviar
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pt-3">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {children}
          {/* Renderizar el DialogFooter y el botón solo si showSubmitButton es true */}
          {showSubmitButton && (
            <DialogFooter>
              <Button type="submit">{submitButtonText}</Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}