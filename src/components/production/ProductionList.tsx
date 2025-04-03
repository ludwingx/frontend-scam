import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import defaultProductImage from "../../../public/cuñape.png";
import { Dispatch, SetStateAction } from "react";

// Definimos los tipos para los productos
interface Product {
  id: string;
  name: string;
  brand: string;
  image?: string;
  quantity?: number | null;
  canProduce?: boolean;
  missingIngredients?: string[];
}

interface ProductListProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  selectedProducts: Product[];
  setSelectedProducts: Dispatch<SetStateAction<Product[]>>;
}

export default function ProductList({
  searchTerm,
  setSearchTerm,
  filteredProducts,
  selectedProducts,
  setSelectedProducts,
}: ProductListProps) {
  const selectProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(p => p.id === product.id);
      if (existingIndex >= 0) {
        return prev.filter(p => p.id !== product.id);
      }
      return [
        ...prev,
        {
          ...product,
          quantity: null,
          canProduce: false,
          missingIngredients: [],
        },
      ];
    });
  };

  return (
    <div className="w-1/3 flex flex-col border-r overflow-hidden">
      {/* Sección de búsqueda */}
      <div className="p-4 space-y-2">
        <Label className="text-sm font-medium">Buscar productos</Label>
        <Input
          placeholder="Nombre o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center p-4 text-gray-500 h-full flex items-center justify-center">
            No se encontraron productos
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedProducts.some((p) => p.id === product.id)
                    ? "bg-blue-50 border border-blue-300"
                    : "hover:bg-gray-50 border border-gray-200"
                }`}
                onClick={() => selectProduct(product)}
              >
                {/* Imagen del producto */}
                <div className="h-12 w-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name || "Producto sin nombre"}
                      fill
                      className="object-cover rounded"
                      sizes="55px"
                    />
                  ) : (
                    <Image
                    src={defaultProductImage}
                    alt="Sin imagen"
                    sizes="55px"
                    className="opacity-50"
                  />
                  )}
                </div>
                
                {/* Información del producto */}
                <div>
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}