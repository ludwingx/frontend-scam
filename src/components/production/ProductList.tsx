import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import defaultProductImage from "../../../public/cuñape.png";
import { Product, ProductListProps } from "@/types/production";
import { Check } from "lucide-react"; // Importamos el icono de check de Lucide

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
      return [...prev, product];
    });
  };

  return (
    <div className="w-1/3 flex flex-col border-r overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="p-4 space-y-2 bg-white dark:bg-gray-800 border-b">
        <Label className="text-sm font-medium">Buscar productos</Label>
        <Input
          placeholder="Nombre o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 focus-visible:ring-primary/50"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
            No se encontraron productos
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => {
              const isSelected = selectedProducts.some(p => p.id === product.id);
              return (
                <div
                  key={product.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                    ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 dark:bg-primary/20 dark:border-primary/50 shadow-sm"
                        : "border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/70"
                    }
                    hover:shadow-md hover:scale-[1.01] transform-gpu`}
                  onClick={() => selectProduct(product)}
                >
                  {/* Imagen del producto */}
                  <div className={`h-12 w-12 rounded flex-shrink-0 flex items-center justify-center relative transition-all
                    ${
                      isSelected
                        ? "ring-2 ring-primary/50 dark:ring-primary/70 bg-primary/5"
                        : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/50"
                    }`}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name || "Producto sin nombre"}
                        fill
                        className={`object-cover rounded transition-transform ${
                          isSelected 
                            ? "scale-105" 
                            : "group-hover:scale-105"
                        }`}
                        sizes="55px"
                      />
                    ) : (
                      <Image
                        src={defaultProductImage}
                        alt="Sin imagen"
                        sizes="55px"
                        className={`opacity-50 dark:opacity-70 transition-opacity ${
                          isSelected 
                            ? "opacity-70 dark:opacity-80" 
                            : "group-hover:opacity-60 dark:group-hover:opacity-80"
                        }`}
                      />
                    )}
                  </div>
                  
                  {/* Texto del producto */}
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium text-sm truncate transition-colors ${
                      isSelected
                        ? "text-primary dark:text-primary-300"
                        : "text-gray-900 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-200"
                    }`}>
                      {product.name}
                    </h3>
                    <p className={`text-xs truncate transition-colors ${
                      isSelected
                        ? "text-primary/80 dark:text-primary-200/80"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-primary/70 dark:group-hover:text-primary-300/80"
                    }`}>
                      {product.brand}
                    </p>
                  </div>

                  {/* Checkmark - Versión definitiva */}
                  <div className={`flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full border-2 ml-2 ${
                    isSelected
                      ? "bg-primary border-primary dark:bg-primary-400 dark:border-primary-400"
                      : "border-gray-300 dark:border-gray-500 group-hover:border-primary"
                  }`}>
                    {isSelected && (
                      <Check className="h-3 w-3 text-white dark:text-gray-900 stroke-[3px]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}