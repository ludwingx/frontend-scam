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
  submitButtonText,
}: ReusableDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] sm:max-h-auto bg-white">
        <DialogHeader >
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex justify-end" >
          <Button type="submit" onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}