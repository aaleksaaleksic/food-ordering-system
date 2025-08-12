"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import { listUsers, deleteUser } from "@/api/users";
import { toastPromise, toastRequestError, toastSuccess } from "@/lib/toast";
import type { UserDto } from "@/types/user";

const USERS_QK = ["users"];

export function useUsers() {
    const client = useHttpClient();
    return useQuery({
        queryKey: USERS_QK,
        queryFn: async () => (await listUsers(client)).data,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}

export function useDeleteUser() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteUser(client, id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: USERS_QK });
            const prev = qc.getQueryData<UserDto[]>(USERS_QK);

            if (prev) {
                qc.setQueryData<UserDto[]>(
                    USERS_QK,
                    prev.filter((u) => u.id !== id)
                );
            }

            return { prev };
        },
        onError: (err, _id, ctx) => {

            if (ctx?.prev) qc.setQueryData(USERS_QK, ctx.prev);
            toastRequestError(err, "Delete failed");
        },
        onSuccess: () => {
            toastSuccess("User deleted.");
        },
        onSettled: () => {

            qc.invalidateQueries({ queryKey: USERS_QK });
        },
    });
}
