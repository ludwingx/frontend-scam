import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface IngredientsSummaryProps {
  totalIngredientsUsage: {
    ingredient: {
      id: number;
      name: string;
      currentStock: number;
      unit: string;
      minStock: number;
    };
    total: number;
  }[];
}

export default function IngredientsSummary({
  totalIngredientsUsage,
}: IngredientsSummaryProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Ingredientes utilizados en todas las producciones</span>
          <Badge variant="secondary">
            {totalIngredientsUsage.length} ingredientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {totalIngredientsUsage.map(({ ingredient, total }) => (
            <div key={ingredient.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-center">
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-sm text-muted-foreground">
                  {total.toFixed(2)} {ingredient.unit}
                </span>
              </div>
              <Progress
                value={(total / ingredient.currentStock) * 100}
                className="h-2 mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 {ingredient.unit}</span>
                <span>
                  {ingredient.currentStock.toFixed(2)} {ingredient.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}