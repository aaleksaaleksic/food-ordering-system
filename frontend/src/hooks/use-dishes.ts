"use client";

import { useQuery } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import {
    getAvailableDishes,
    getAllDishes,
    getDishById,
    getDishesByCategory,
    searchDishesByName,
    getDishCategories
} from "@/api/dishes";

export function useAvailableDishes() {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", "available"],
        queryFn: async () => (await getAvailableDishes(client)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useAllDishes() {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", "all"],
        queryFn: async () => (await getAllDishes(client)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useDish(id: number) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", id],
        queryFn: async () => (await getDishById(client, id)).data,
        enabled: !!id,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useDishesByCategory(category: string, onlyAvailable = true) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", "category", category, onlyAvailable],
        queryFn: async () => (await getDishesByCategory(client, category, onlyAvailable)).data,
        enabled: !!category,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useSearchDishes(name: string) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", "search", name],
        queryFn: async () => (await searchDishesByName(client, name)).data,
        enabled: !!name && name.length >= 2,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
    });
}

export function useDishCategories() {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["dishes", "categories"],
        queryFn: async () => (await getDishCategories(client)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 300_000,
    });
}