"use client"; // Mark as Client Component

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

interface ReusableDialogProps {
  title: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onClose?: () => void; // Function to handle closing the dialog
  submitButtonText?: string;
  isOpen?: boolean; // Add isOpen to the interface
}

export function ReusableDialogWidth({
  title,
  description,
  trigger,
  children,
  onSubmit,
  onClose,
  submitButtonText,
  isOpen = false, // Default value for isOpen
}: ReusableDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen); // Use isOpen prop

  const handleClose = () => {
    setInternalIsOpen(false); // Close the dialog
    if (onClose) onClose(); // Call onClose if defined
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={setInternalIsOpen}>
      <DialogTrigger asChild onClick={() => setInternalIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-auto bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
            if (onSubmit) {
              onSubmit(e); // Pasar el evento a la función onSubmit
            }
            handleClose();
          }}
        >
          {children}
          <DialogFooter className="flex justify-end">
            <Button type="submit">{submitButtonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
