export interface OrderItemRequest {
    dishId: number;
    quantity: number;
}

export interface PlaceOrderRequest {
    items: OrderItemRequest[];
}

export interface ScheduleOrderRequest {
    items: OrderItemRequest[];
    scheduledFor: string;
}