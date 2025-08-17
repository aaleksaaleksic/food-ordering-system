import { AxiosInstance } from "axios";
import type { OrderResponse, OrderSearchParams } from "@/types/order";
import type {PlaceOrderRequest, ScheduleOrderRequest} from "@/api/request/order";

export const searchOrders = (client: AxiosInstance, params: OrderSearchParams = {}) => {
    const searchParams = new URLSearchParams();

    if (params.status && params.status.length > 0) {
        params.status.forEach(status => searchParams.append('status', status));
    }

    if (params.dateFrom) {
        searchParams.append('dateFrom', params.dateFrom);
    }

    if (params.dateTo) {
        searchParams.append('dateTo', params.dateTo);
    }

    if (params.userId) {
        searchParams.append('userId', params.userId.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/v1/orders?${queryString}` : '/v1/orders';

    return client.get<OrderResponse[]>(url);
};

export const placeOrder = (client: AxiosInstance, data: PlaceOrderRequest) =>
    client.post<OrderResponse>("/v1/orders", data);

export const scheduleOrder = (client: AxiosInstance, data: ScheduleOrderRequest) =>
    client.post<OrderResponse>("/v1/orders/schedule", data);

export const trackOrder = (client: AxiosInstance, orderId: number) =>
    client.get<OrderResponse>(`/v1/orders/${orderId}`);

export const cancelOrder = (client: AxiosInstance, orderId: number) =>
    client.put<OrderResponse>(`/v1/orders/${orderId}/cancel`);