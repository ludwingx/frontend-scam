"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Tipos de datos
interface Ingredient {
  id: number;
  name: string;
  quantity: number; // Cantidad en stock
}

interface RecipeItem {
  ingredient: Ingredient;
  quantityPerUnit: number; // Cantidad necesaria por unidad de producto
}

interface Recipe {
  productId: number;
  items: RecipeItem[];
}

interface Production {
  id: number;
  name: string;
  quantity: number; // Cantidad de productos a producir
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  dueDate: string;
  brand: string;
  recipe: Recipe; // Receta asociada
}

export default function ProductionPage() {
  const [data, setData] = useState<Production[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<Ingredient[]>([]);
  const router = useRouter();

  // Datos ficticios
  const mockIngredients: Ingredient[] = [
    { id: 1, name: "Harina", quantity: 100 },
    { id: 2, name: "Azúcar", quantity: 50 },
    { id: 3, name: "Huevos", quantity: 20 },
  ];

  const mockRecipes: Recipe[] = [
    {
      productId: 1,
      items: [
        { ingredient: mockIngredients[0], quantityPerUnit: 0.5 }, // 0.5 kg de harina por unidad
        { ingredient: mockIngredients[1], quantityPerUnit: 0.2 }, // 0.2 kg de azúcar por unidad
        { ingredient: mockIngredients[2], quantityPerUnit: 2 }, // 2 huevos por unidad
      ],
    },
  ];

  const mockProductions: Production[] = [
    {
      id: 1,
      name: "Cuñapes",
      quantity: 100,
      status: "pending",
      createdAt: "2023-10-01",
      dueDate: "2023-10-10",
      brand: "Marca A",
      recipe: mockRecipes[0],
    },
  ];

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setData(mockProductions);
    }, 1000); // Simula un retraso de 1 segundo
  }, []);

  // Función para crear una nueva producción
  const createProduction = (name: string, quantity: number, recipe: Recipe) => {
    // Calcular los ingredientes necesarios
    const requiredIngredients = recipe.items.map((item) => ({
      ingredient: item.ingredient,
      requiredQuantity: item.quantityPerUnit * quantity,
    }));

    // Verificar el stock
    const missing = requiredIngredients.filter(
      (item) => item.ingredient.quantity < item.requiredQuantity
    );

    if (missing.length > 0) {
      // Mostrar los ingredientes faltantes
      setMissingIngredients(missing.map((item) => item.ingredient));
      // Cambiar el estado a "pendiente"
      const newProduction: Production = {
        id: Date.now(),
        name,
        quantity,
        status: "pending",
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        brand: "Marca A",
        recipe,
      };
      setData((prevData) => [...prevData, newProduction]);
      toast.warning("Falta stock para completar la producción.");
    } else {
      // Si hay suficiente stock, crear la producción
      const newProduction: Production = {
        id: Date.now(),
        name,
        quantity,
        status: "in_progress",
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        brand: "Marca A",
        recipe,
      };
      setData((prevData) => [...prevData, newProduction]);
      toast.success(`Producción "${name}" creada exitosamente.`);
    }
  };

  // Redirigir a la página de compras con los ingredientes faltantes
  const redirectToPurchases = () => {
    const missingIds = missingIngredients.map((ing) => ing.id);
    router.push(`/purchases?missing=${missingIds.join(",")}`);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-50">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">Producción</h2>
        <small className="text-sm font-medium text-gray-600">
          Aquí podrás gestionar las producciones.
        </small>
      </div>

      {/* Botón flotante para crear una nueva producción */}
      <Button
        className="fixed bottom-8 right-8 bg-blue-600 text-white hover:bg-blue-600/90 rounded-full p-4 shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-xl">+</span>
      </Button>

      {/* Modal para crear una nueva producción */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <CreateProductionForm
            onCreate={createProduction}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}

      {/* Modal para mostrar los ingredientes faltantes */}
      {missingIngredients.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Ingredientes Faltantes</h3>
            <ul className="mb-4">
              {missingIngredients.map((ingredient) => (
                <li key={ingredient.id} className="text-sm text-gray-600">
                  {ingredient.name} (Faltan: {ingredient.quantity})
                </li>
              ))}
            </ul>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-600/90"
              onClick={redirectToPurchases}
            >
              Comprar Ingredientes
            </Button>
          </div>
        </div>
      )}

      {/* Lista de producciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((production) => (
          <ProductionCard key={production.id} production={production} />
        ))}
      </div>
    </div>
  );
}

// Componente de tarjeta para cada producción
function ProductionCard({ production }: { production: Production }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold">{production.name}</h3>
      <p className="text-sm text-gray-600">Cantidad: {production.quantity}</p>
      <p className="text-sm text-gray-600">Estado: {production.status}</p>
      <p className="text-sm text-gray-600">Marca: {production.brand}</p>
      <p className="text-sm text-gray-600">
        Fecha Límite: {new Date(production.dueDate).toLocaleDateString()}
      </p>
    </div>
  );
}

// Componente para crear una nueva producción
function CreateProductionForm({
  onCreate,
  onClose,
}: {
  onCreate: (name: string, quantity: number, recipe: Recipe) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("El nombre de la producción no puede estar vacío.");
      return;
    }

    if (quantity <= 0) {
      toast.error("La cantidad debe ser un número positivo.");
      return;
    }

    // Usar la primera receta ficticia (puedes agregar un selector de recetas)
    const recipe =   
    onCreate(name, quantity, recipe);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">Crear Nueva Producción</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-600/90">
            Crear
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}