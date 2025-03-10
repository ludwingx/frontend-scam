import { Ingredient } from "./ingredients";

export type ProductsBase = {
    id: number;
    name: string;
    unit_measurement: string;
    quantity: number;
    stock: number;
    ingredients : Ingredient[]
};