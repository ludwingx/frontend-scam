export type Recipe = {
    id: number;
    name: string;
    detalleRecetas?: [
        {
            id?: number;
            nombre_ingrediente?: string;
            cantidad?: number;
            unidad?: string
        }
    ];
};