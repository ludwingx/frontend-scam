// data.ts
export type Ingrediente = {
    id: number;
    nombre: string;
    quantity: number;
    unit_measurement: string;
    proveedor?: string;
    tipo: "Comestible" | "No comestible";
  };
  
  export type DetalleCompra = {
    id: number;
    nombre_ingrediente: string;
    cantidad: number;
    precio_unitario: number;
    unit_measurement?: string;
    tipo?: "Comestible" | "No comestible";
  };
  
  export type Purchases = {
    id: number;
    fecha_compra: string;
    sucursal: string;
    detalle_compra: DetalleCompra[];
    total_compra: number;
  };
  
  // Datos ficticios centralizados
  export const dataFicticia = {
    comestibles: [
      { id: 1, nombre: "Harina de trigo", quantity: 50, unit_measurement: "kilo(s)", proveedor: "Molinos del Sur", tipo: "Comestible" },
      { id: 2, nombre: "Azúcar blanca", quantity: 30, unit_measurement: "kilo(s)", proveedor: "Dulce S.A.", tipo: "Comestible" },
      { id: 3, nombre: "Huevos frescos", quantity: 200, unit_measurement: "unidad(es)", proveedor: "Granja Feliz", tipo: "Comestible" },
      { id: 4, nombre: "Leche entera", quantity: 20, unit_measurement: "litro(s)", proveedor: "Lácteos Norte", tipo: "Comestible" },
      { id: 5, nombre: "Mantequilla", quantity: 15, unit_measurement: "kilo(s)", proveedor: "Lácteos Norte", tipo: "Comestible" },
    ] as Ingrediente[],
    
    noComestibles: [
      { id: 6, nombre: "Cajas de cartón", quantity: 100, unit_measurement: "unidad(es)", tipo: "No comestible" },
      { id: 7, nombre: "Bolsas plásticas", quantity: 500, unit_measurement: "unidad(es)", tipo: "No comestible" },
      { id: 8, nombre: "Detergente", quantity: 20, unit_measurement: "litro(s)", tipo: "No comestible" },
      { id: 9, nombre: "Guantes de latex", quantity: 50, unit_measurement: "par(es)", tipo: "No comestible" },
      { id: 10, nombre: "Toallas de papel", quantity: 30, unit_measurement: "paquete(s)", tipo: "No comestible" },
    ] as Ingrediente[],
    
    sucursales: [
      { id: 1, nombre: "Radial 19", direccion: "Av. Radial 19 #123" },
      { id: 2, nombre: "Villa 1ro de mayo", direccion: "Calle 1ro de Mayo #456" },
      { id: 3, nombre: "Radial 26", direccion: "Av. Radial 26 #789" },
    ],
    
    compras: [
      {
        id: 1,
        fecha_compra: "2023-10-01",
        sucursal: "Radial 19",
        detalle_compra: [
          { id: 101, nombre_ingrediente: "Harina de trigo", cantidad: 5, precio_unitario: 8.50, unit_measurement: "kilo(s)", tipo: "Comestible" },
          { id: 102, nombre_ingrediente: "Azúcar blanca", cantidad: 3, precio_unitario: 6.20, unit_measurement: "kilo(s)", tipo: "Comestible" },
          { id: 103, nombre_ingrediente: "Cajas de cartón", cantidad: 20, precio_unitario: 2.30, unit_measurement: "unidad(es)", tipo: "No comestible" },
        ],
        total_compra: 85.10
      },
      {
        id: 2,
        fecha_compra: "2023-10-02",
        sucursal: "Radial 26",
        detalle_compra: [
          { id: 104, nombre_ingrediente: "Huevos frescos", cantidad: 60, precio_unitario: 0.80, unit_measurement: "unidad(es)", tipo: "Comestible" },
          { id: 105, nombre_ingrediente: "Bolsas plásticas", cantidad: 100, precio_unitario: 0.15, unit_measurement: "unidad(es)", tipo: "No comestible" },
        ],
        total_compra: 63.00
      },
      {
        id: 3,
        fecha_compra: "2023-10-03",
        sucursal: "Villa 1ro de mayo",
        detalle_compra: [
          { id: 106, nombre_ingrediente: "Leche entera", cantidad: 10, precio_unitario: 4.20, unit_measurement: "litro(s)", tipo: "Comestible" },
          { id: 107, nombre_ingrediente: "Mantequilla", cantidad: 2, precio_unitario: 12.50, unit_measurement: "kilo(s)", tipo: "Comestible" },
          { id: 108, nombre_ingrediente: "Detergente", cantidad: 5, precio_unitario: 8.00, unit_measurement: "litro(s)", tipo: "No comestible" },
        ],
        total_compra: 85.00
      }
    ] as Purchases[]
  };