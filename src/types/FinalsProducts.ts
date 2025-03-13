import { Ingredient } from "./ingredients";

export type FinalsProducts = {
    id: number;
    name: string;
    cantidad: number;
    stock: number;
    unidad: string
    ingredients : Ingredient[]
};