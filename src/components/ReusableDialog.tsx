import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface ReusableDialogProps {
  title: string;
  description: React.ReactNode;
  trigger: React.ReactNode;
  onSubmit: (e: FormEvent) => void;
  submitButtonText: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void; // Nueva prop para manejar cambios de estado
  isOpen?: boolean; // Nueva prop para controlar si el diálogo está abierto
}

export function ReusableDialog({
  title,
  description,
  trigger,
  onSubmit,
  submitButtonText,
  children,
  onOpenChange,
  isOpen
}: ReusableDialogProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevenir el envío automático del formulario
    onSubmit(e); // Llamar a la función onSubmit proporcionada
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {children}
          <DialogFooter>
            <Button type="submit">{submitButtonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}