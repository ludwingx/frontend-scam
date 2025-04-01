// src/hooks/use-sucursal.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Sucursal {
  id: string
  name: string
  logo: React.ElementType
  plan: string
}

interface SucursalState {
  sucursalActual: Sucursal | null
  setSucursal: (sucursal: Sucursal) => void
}

export const useSucursal = create<SucursalState>()(
  persist(
    (set) => ({
      sucursalActual: null,
      setSucursal: (sucursal) => set({ sucursalActual: sucursal }),
    }),
    {
      name: 'sucursal-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)