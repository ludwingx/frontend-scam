import { Ingredient } from "./ingredients";

export type FinalsProducts = {
    id: number;
    name: string;
    quantity: number;
    stock: number;
    unit_measurement: string
    ingredients : Ingredient[]
};