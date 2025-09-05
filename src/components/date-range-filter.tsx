"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";
import { useRef } from 'react';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangeFilterProps {
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void;
  className?: string;
}

export function DateRangeFilter({ onDateRangeChange, className }: DateRangeFilterProps) {
  // Default to current month
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set a default range of the last 30 days
  const defaultFromDate = new Date(today);
  defaultFromDate.setDate(today.getDate() - 30);

  const [fromDate, setFromDate] = React.useState<Date>(defaultFromDate);
  const [toDate, setToDate] = React.useState<Date>(today);
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [isToOpen, setIsToOpen] = React.useState(false);

  // Handle initial load and date changes
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await onDateRangeChange({ from: fromDate, to: toDate });
      } catch (error) {
        console.error('Error in date range change:', error);
      }
    };

    // Only run once on mount
    const timer = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle date changes
  const prevFromDate = useRef(fromDate);
  const prevToDate = useRef(toDate);

  React.useEffect(() => {
    // Only run if dates actually changed
    if (
      fromDate.getTime() !== prevFromDate.current.getTime() ||
      toDate.getTime() !== prevToDate.current.getTime()
    ) {
      onDateRangeChange({ from: fromDate, to: toDate });
      prevFromDate.current = fromDate;
      prevToDate.current = toDate;
    }
  }, [fromDate, toDate]);

  const formatDate = (date: Date) => format(date, "dd/MM/yyyy", { locale: es });
  
  const handleFromDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const newFromDate = new Date(date);
    newFromDate.setHours(0, 0, 0, 0);
    setFromDate(newFromDate);
    setIsFromOpen(false);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const newToDate = new Date(date);
    newToDate.setHours(23, 59, 59, 999);
    setToDate(newToDate);
    setIsToOpen(false);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <div className="flex flex-col">
        <label htmlFor="from-date" className="text-sm font-medium mb-1">
          Desde:
        </label>
        <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
          <PopoverTrigger asChild>
            <Button
              id="from-date"
              variant="outline"
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(fromDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateSelect}
              initialFocus
              locale={es}
              disabled={false}
              month={fromDate}
              onMonthChange={(date) => setFromDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col">
        <label htmlFor="to-date" className="text-sm font-medium mb-1">
          Hasta:
        </label>
        <Popover open={isToOpen} onOpenChange={setIsToOpen}>
          <PopoverTrigger asChild>
            <Button
              id="to-date"
              variant="outline"
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
              disabled={!fromDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(toDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateSelect}
              initialFocus
              locale={es}
              disabled={false}
              month={toDate}
              onMonthChange={(date) => setToDate(date)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
