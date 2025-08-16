import { AxiosInstance } from "axios";
import type { Dish } from "@/types/order";

export const getAvailableDishes = (client: AxiosInstance) =>
    client.get<Dish[]>("/v1/dishes");

export const getAllDishes = (client: AxiosInstance) =>
    client.get<Dish[]>("/v1/dishes/all");

export const getDishById = (client: AxiosInstance, id: number) =>
    client.get<Dish>(`/v1/dishes/${id}`);

export const getDishesByCategory = (client: AxiosInstance, category: string, onlyAvailable = true) =>
    client.get<Dish[]>(`/v1/dishes/category/${category}?onlyAvailable=${onlyAvailable}`);

export const searchDishesByName = (client: AxiosInstance, name: string) =>
    client.get<Dish[]>(`/v1/dishes/search?name=${encodeURIComponent(name)}`);

export const getDishCategories = (client: AxiosInstance) =>
    client.get<string[]>("/v1/dishes/categories");