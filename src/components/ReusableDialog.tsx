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
import { ReactNode } from "react";

interface ReusableDialogProps {
  title: string;
  description: string | ReactNode;
  trigger: ReactNode;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

export function ReusableDialog({
  title,
  description,
  trigger,
  children,
  onSubmit,
  submitButtonText = "Guardar",
}: ReusableDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}> {/* Formulario principal */}
          {children}
          <DialogFooter>
            <Button type="submit">{submitButtonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}