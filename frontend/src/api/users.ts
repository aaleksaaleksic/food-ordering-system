import { AxiosInstance } from "axios";
import type { UserDto } from "@/types/user";

export const listUsers = (client: AxiosInstance) =>
    client.get<UserDto[]>("/users");

export const deleteUser = (client: AxiosInstance, id: number) =>
    client.delete<void>(`/users/${id}`);
