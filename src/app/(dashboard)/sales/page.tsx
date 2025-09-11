
"use client";

import { useState } from 'react';
import BreadcrumbNav from "./components/BreadcrumbNav";
import FutureSalesTable from "./components/FutureSalesTable";
import Header from "./components/Header";
import SalesHistoryTable from "./components/SalesHistoryTable";
import TodaySalesTable from "./components/TodaySalesTable";
import salesData from "./data/salesData.json";

export interface Sale {
  id: number;
  client: string;
  brand: string;
  date: string;
  products: { name: string; quantity: number }[];
  amount: number;
  status: string;
}

const statusOptions = [
  { id: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'in-progress', label: 'En proceso', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', label: 'Completado', color: 'bg-green-100 text-green-800' },
  { id: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
];

export default function Page() {
  const [sales, setSales] = useState<Sale[]>(salesData.sales as Sale[]);

  const updateSaleStatus = (saleId: number, newStatusId: string) => {
    setSales(prevSales => 
      prevSales.map(sale => 
        sale.id === saleId 
          ? { ...sale, status: statusOptions.find(s => s.id === newStatusId)?.label || newStatusId }
          : sale
      )
    );
  };

  return (
    <div className="sales-bg flex flex-col min-h-screen p-6">
      <div className="flex flex-col gap-4 mb-6">
        <BreadcrumbNav />
        <h2 className="text-3xl font-semibold text-gray-900">
          Órdenes de Venta
        </h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las órdenes de venta.
        </small>
      </div>
      
      <div className="flex justify-end mb-6">
        <Header />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySalesTable 
          sales={sales} 
          statuses={statusOptions} 
          updateSaleStatus={updateSaleStatus} 
        />
        <FutureSalesTable 
          sales={sales} 
          statuses={statusOptions}
          updateSaleStatus={updateSaleStatus} 
        />
      </div>
      <div className="mt-6">
        <SalesHistoryTable 
          sales={sales} 
          statuses={statusOptions}
          updateSaleStatus={updateSaleStatus}
        />
      </div>
    </div>
  );
}
