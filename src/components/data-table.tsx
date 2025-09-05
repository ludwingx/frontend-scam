"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  enableFilter?: boolean;
  filterPlaceholder?: string;
  filterColumn?: string;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  meta?: Record<string, any>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableFilter = false,
  filterPlaceholder = "Filtrar...",
  filterColumn = "name",
  enablePagination = false,
  enableRowSelection = false,
  enableColumnVisibility = false,
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Proporcionar un valor predeterminado para `data`
  const tableData = data ?? [];

  const table = useReactTable({
    data: tableData, // Usar `tableData` en lugar de `data`
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    meta,
  });

  return (
    <div className="w-auto p-2">
      {/* Filtro y visibilidad de columnas */}
      <div className="flex items-center p-2 ">
        {enableFilter && (
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}

        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const header = column.columnDef.header;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {typeof header === "string" ? header : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación y selección de filas */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} de {table.getPrePaginationRowModel().rows.length} filas
        </div>
        {enablePagination && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Filas por página:</span>
            <select
              className="border rounded px-2 py-1 text-sm bg-background"
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              {[25, 50, 100, 200].map(pageSize => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
          </div>
        )}
        {enablePagination && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <div className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </>
        )}
      </div>
    </div>
  );
}