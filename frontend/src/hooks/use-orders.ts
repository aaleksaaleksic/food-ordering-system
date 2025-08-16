"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import {
    searchOrders,
    placeOrder,
    scheduleOrder,
    trackOrder,
    cancelOrder
} from "@/api/orders";
import { toastSuccess, toastRequestError } from '@/lib/toast';
import type { OrderSearchParams } from "@/types/order";
import type {PlaceOrderRequest, ScheduleOrderRequest} from "@/api/request/order";

export function useOrders(
    searchParams: OrderSearchParams = {},
    enablePolling = false,
    enabled = true,
) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["orders", searchParams],
        queryFn: async () => (await searchOrders(client, searchParams)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: enablePolling ? 0 : 30_000,
        refetchInterval: enablePolling ? 5000 : false,
        enabled
    });
}

export function useOrder(orderId: number, enablePolling = false) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: async () => (await trackOrder(client, orderId)).data,
        enabled: !!orderId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: enablePolling ? 0 : 30_000,
        refetchInterval: enablePolling ? 3000 : false,
    });
}


export function usePlaceOrder() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: PlaceOrderRequest) => placeOrder(client, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            toastSuccess("Order placed successfully! 🍽️");
        },
        onError: (error) => toastRequestError(error, "Failed to place order"),
    });
}

export function useScheduleOrder() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: ScheduleOrderRequest) => scheduleOrder(client, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            toastSuccess("Order scheduled successfully! ⏰");
        },
        onError: (error) => toastRequestError(error, "Failed to schedule order"),
    });
}

export function useCancelOrder() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => cancelOrder(client, orderId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            toastSuccess("Order cancelled successfully.");
        },
        onError: (error) => toastRequestError(error, "Failed to cancel order"),
    });
}