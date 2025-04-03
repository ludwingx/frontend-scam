"use client";

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
  onClose?: () => void;
  submitButtonText?: string;
  isOpen?: boolean;
  className?: string;
}

export function ReusableDialogWidth({
  title,
  description,
  trigger,
  children,
  onSubmit,
  onClose,
  submitButtonText = "Guardar",
  isOpen = false,
  className = "",
}: ReusableDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  const handleClose = () => {
    setInternalIsOpen(false);
    onClose?.();
  };

  const handleOpenChange = (open: boolean) => {
    setInternalIsOpen(open);
    if (!open) {
      onClose?.();
    }
  };

  return (
    <Dialog open={internalIsOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className={`sm:max-w-[1000px] max-h-[90vh] overflow-y-auto ${className}`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(e);
          }}
          className="space-y-6"
        >
          <div className="py-4">
            {children}
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}