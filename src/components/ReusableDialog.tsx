import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface ReusableDialogProps {
  title: string;
  description: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Tipo actualizado
  submitButtonText?: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  showSubmitButton?: boolean;
}

export function ReusableDialog({
  title,
  description,
  trigger,
  onSubmit,
  submitButtonText = "Guardar Cambios", // Valor por defecto
  children,
  onOpenChange,
  isOpen,
  showSubmitButton = true,
}: ReusableDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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