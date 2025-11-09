export interface CreateConsumptionDto {
    userId: string; // The user being tracked
    barcode?: string;
    productName: string;
    brand?: string;
    imageUrl?: string;
    quantity: number;
    location?: string;
    notes?: string;
    date?: Date; // optional, defaults to now
    nutrients: {
        sugars: number;
        caffeine: number;
        calories: number;
    };
}

export interface UpdateConsumptionDto {
    quantity?: number;
    location?: string;
    notes?: string;
    date?: Date;
}

export interface ConsumptionFilterDto {
    userId?: string; // The user being tracked (optional, can be in query params)
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    productName?: string;
    contributor?: string; // user ID
    location?: string;
    page?: number;
    limit?: number;
}

export interface ProductSearchDto {
    barcode?: string;
    query?: string; // product name search
}