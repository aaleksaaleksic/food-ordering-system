import { AxiosInstance } from "axios";
import type { UserDto } from "@/types/user";


export const getAllUsers = (client: AxiosInstance) =>
    client.get<UserDto[]>("/v1/users");


export const deleteUser = (client: AxiosInstance, id: number) =>
    client.delete(`/v1/users/${id}`);


export const createUser = (client: AxiosInstance, data: any) =>
    client.post<UserDto>("/v1/users", data);

export const updateUser = (client: AxiosInstance, id: number, data: any) =>
    client.put<UserDto>(`/v1/users/${id}`, data);

export const getUserById = (client: AxiosInstance, id: number) =>
    client.get<UserDto>(`/v1/users/${id}`);