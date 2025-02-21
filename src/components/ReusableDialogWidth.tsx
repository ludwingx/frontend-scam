"use client"; // Marcar como Client Component

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
  description: string;
  trigger: ReactNode;
  children: ReactNode;
  onSubmit?: () => void;
  submitButtonText?: string;
}

export function ReusableDialogWidth({
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
      <DialogContent className="sm:max-w-[850px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}