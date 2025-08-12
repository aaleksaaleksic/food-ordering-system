"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import { getAllUsers, deleteUser } from "@/api/users";
import { toastSuccess, toastRequestError } from '@/lib/toast';


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