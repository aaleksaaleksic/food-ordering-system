"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import {getAllUsers, deleteUser, createUser, updateUser, getUserById} from "@/api/users";
import { toastSuccess, toastRequestError } from '@/lib/toast';
import {CreateUserRequest, UpdateUserRequest} from "@/types/user-request";


export function useUsers() {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["users"],
        queryFn: async () => (await getAllUsers(client)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000, // 30 sekundi cache
    });
}

export function useCreateUser() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => createUser(client, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
            toastSuccess("User created successfully.");
        },
        onError: (error) => toastRequestError(error, "Failed to create user"),
    });
}

export function useUpdateUser() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
            updateUser(client, id, data),
        onSuccess: (_, variables) => {

            qc.invalidateQueries({ queryKey: ["users"] });
            qc.invalidateQueries({ queryKey: ["users", variables.id] });
            toastSuccess("User updated successfully.");
        },
        onError: (error) => toastRequestError(error, "Failed to update user"),
    });
}

export function useUser(id: number) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["users", id],
        queryFn: async () => (await getUserById(client, id)).data,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
        enabled: !!id,
    });
}


export function useDeleteUser() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteUser(client, id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
            toastSuccess("User deleted successfully.");
        },
        onError: (error) => toastRequestError(error, "Failed to delete user"),
    });
}