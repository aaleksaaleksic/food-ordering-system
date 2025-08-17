export type OrderStatus =
    | "ORDERED"
    | "PREPARING"
    | "IN_DELIVERY"
    | "DELIVERED"
    | "CANCELED";

export interface Dish {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    available: boolean;
}

export interface DishSimple {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
}


export interface OrderItemResponse {
    id: number;
    dish: DishSimple;
    quantity: number;
    priceAtTime: number;
    totalPrice: number;        //  Computed field
}


export interface UserSimple {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;          // Computed field
}

export interface OrderResponse {
    id: number;
    status: OrderStatus;
    createdBy: UserSimple;
    active: boolean;
    createdAt: string;
    scheduledFor?: string;
    items: OrderItemResponse[];
    totalItems: number;        //  Computed field
    statusDisplayName: string; //  Computed field
}

export interface OrderItem {
    id: number;
    dish: Dish;
    quantity: number;
    priceAtTime: number;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Order {
    id: number;
    status: OrderStatus;
    createdBy: User;
    active: boolean;
    createdAt: string;
    scheduledFor?: string;
    items: OrderItem[];
}

export interface OrderSearchParams {
    status?: OrderStatus[];
    dateFrom?: string;
    dateTo?: string;
    userId?: number;
}