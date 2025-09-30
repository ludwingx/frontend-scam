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
    fecha_entrega?: string;
    sucursal: string;
    proveedor?: string;
    numero_factura?: string;
    estado?: string;
    observaciones?: string;
    detalle_compra: DetalleCompra[];
    subtotal?: number;
    iva?: number;
    descuento?: number;
    total_compra: number;
    metodo_pago?: string;
    usuario_registro?: string;
  };
  
  // Datos ficticios centralizados
  export const dataFicticia = {
    // Inventario actual de ingredientes
    comestibles: [
      { id: 1, nombre: "Harina de trigo 000", quantity: 48.5, unit_measurement: "kilo(s)", proveedor: "Molinos del Sur", tipo: "Comestible", stock_minimo: 30, stock_optimo: 60 },
      { id: 2, nombre: "Azúcar blanca refinada", quantity: 25.7, unit_measurement: "kilo(s)", proveedor: "Dulce S.A.", tipo: "Comestible", stock_minimo: 25, stock_optimo: 50 },
      { id: 3, nombre: "Huevos frescos", quantity: 185, unit_measurement: "unidad(es)", proveedor: "Granja Feliz", tipo: "Comestible", stock_minimo: 100, stock_optimo: 250 },
      { id: 4, nombre: "Leche entera en polvo", quantity: 15.2, unit_measurement: "kilo(s)", proveedor: "Lácteos Norte", tipo: "Comestible", stock_minimo: 10, stock_optimo: 25 },
      { id: 5, nombre: "Mantequilla sin sal", quantity: 12.8, unit_measurement: "kilo(s)", proveedor: "Lácteos Norte", tipo: "Comestible", stock_minimo: 8, stock_optimo: 20 },
      { id: 6, nombre: "Chocolate amargo 70% cacao", quantity: 8.3, unit_measurement: "kilo(s)", proveedor: "Chocolates Andinos", tipo: "Comestible", stock_minimo: 5, stock_optimo: 15 },
      { id: 7, nombre: "Frutas mixtas congeladas", quantity: 18.6, unit_measurement: "kilo(s)", proveedor: "Frutas del Valle", tipo: "Comestible", stock_minimo: 10, stock_optimo: 30 },
      { id: 8, nombre: "Crema de leche", quantity: 22.4, unit_measurement: "litro(s)", proveedor: "Lácteos del Oriente", tipo: "Comestible", stock_minimo: 15, stock_optimo: 35 },
    ] as unknown as Ingrediente[],
    
    // Materiales no comestibles
    noComestibles: [
      { id: 9, nombre: "Cajas de cartón para tortas", quantity: 85, unit_measurement: "unidad(es)", tipo: "No comestible", stock_minimo: 50, stock_optimo: 150 },
      { id: 10, nombre: "Bolsas plásticas con logo", quantity: 420, unit_measurement: "unidad(es)", tipo: "No comestible", stock_minimo: 200, stock_optimo: 600 },
      { id: 11, nombre: "Detergente líquido", quantity: 15.8, unit_measurement: "litro(s)", tipo: "No comestible", stock_minimo: 10, stock_optimo: 25 },
      { id: 12, nombre: "Guantes de látex desechables", quantity: 35, unit_measurement: "par(es)", tipo: "No comestible", stock_minimo: 20, stock_optimo: 60 },
      { id: 13, nombre: "Toallas de papel absorbente", quantity: 25, unit_measurement: "paquete(s)", tipo: "No comestible", stock_minimo: 15, stock_optimo: 40 },
      { id: 14, nombre: "Film transparente", quantity: 8, unit_measurement: "rollo(s)", tipo: "No comestible", stock_minimo: 5, stock_optimo: 15 },
      { id: 15, nombre: "Papel encerado", quantity: 12, unit_measurement: "rollo(s)", tipo: "No comestible", stock_minimo: 5, stock_optimo: 20 },
    ] as unknown as Ingrediente[],
    
    // Sucursales
    sucursales: [
      { id: 1, nombre: "Sucursal Radial 19", direccion: "Av. Radial 19 #123, Santa Cruz de la Sierra", telefono: "+591 3 3367890" },
      { id: 2, nombre: "Sucursal Villa 1ro de Mayo", direccion: "Calle 1ro de Mayo #456, Santa Cruz de la Sierra", telefono: "+591 3 3378901" },
      { id: 3, nombre: "Sucursal Radial 26", direccion: "Av. Radial 26 #789, Santa Cruz de la Sierra", telefono: "+591 3 3389012" },
      { id: 4, nombre: "Sucursal Equipetrol", direccion: "Av. San Martín #1234, Santa Cruz de la Sierra", telefono: "+591 3 3390123" },
    ],
    
    // Historial de compras
    compras: [
      {
        id: 1,
        fecha_compra: "2025-09-28",
        fecha_entrega: "2025-09-29",
        sucursal: "Sucursal Radial 19",
        proveedor: "Distribuidora de Alimentos S.A.",
        numero_factura: "FAC-2025-000123",
        estado: "Recibido",
        observaciones: "Pedido completo, en buen estado",
        detalle_compra: [
          { id: 101, nombre_ingrediente: "Harina de trigo 000", cantidad: 25, precio_unitario: 9.20, unit_measurement: "kilo(s)", tipo: "Comestible", subtotal: 230.00 },
          { id: 102, nombre_ingrediente: "Azúcar blanca refinada", cantidad: 15, precio_unitario: 6.50, unit_measurement: "kilo(s)", tipo: "Comestible", subtotal: 97.50 },
          { id: 103, nombre_ingrediente: "Huevos frescos", cantidad: 120, precio_unitario: 1.20, unit_measurement: "unidad(es)", tipo: "Comestible", subtotal: 144.00 },
        ],
        subtotal: 471.50,
        iva: 66.01,
        descuento: 0.00,
        total_compra: 537.51,
        metodo_pago: "Transferencia bancaria",
        usuario_registro: "Juan Pérez"
      },
      {
        id: 2,
        fecha_compra: "2025-09-27",
        fecha_entrega: "2025-09-28",
        sucursal: "Sucursal Villa 1ro de Mayo",
        proveedor: "Lácteos del Oriente",
        numero_factura: "FAC-2025-000456",
        estado: "En tránsito",
        observaciones: "Entrega programada para mañana en la mañana",
        detalle_compra: [
          { id: 104, nombre_ingrediente: "Leche entera en polvo", cantidad: 10, precio_unitario: 28.90, unit_measurement: "kilo(s)", tipo: "Comestible", subtotal: 289.00 },
          { id: 105, nombre_ingrediente: "Crema de leche", cantidad: 15, precio_unitario: 12.50, unit_measurement: "litro(s)", tipo: "Comestible", subtotal: 187.50 },
          { id: 106, nombre_ingrediente: "Mantequilla sin sal", cantidad: 8, precio_unitario: 15.75, unit_measurement: "kilo(s)", tipo: "Comestible", subtotal: 126.00 },
        ],
        subtotal: 602.50,
        iva: 84.35,
        descuento: 30.00,
        total_compra: 656.85,
        metodo_pago: "Crédito 30 días",
        usuario_registro: "María González"
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