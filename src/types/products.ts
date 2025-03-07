import { Ingredient } from "./ingredients";

export type Product = {
    id: number;
    name: string;
    price: number;
    business: string;
    status: string;
    img: string;
    ingredients: Ingredient[]; // Use the correct type here
  };