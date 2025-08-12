import { AxiosInstance } from "axios";
import type { UserDto } from "@/types/user";


export const getAllUsers = (client: AxiosInstance) =>
    client.get<UserDto[]>("/users");


export const deleteUser = (client: AxiosInstance, id: number) =>
    client.delete(`/users/${id}`);


export const createUser = (client: AxiosInstance, data: any) =>
    client.post<UserDto>("/users", data);

export const updateUser = (client: AxiosInstance, id: number, data: any) =>
    client.put<UserDto>(`/users/${id}`, data);