"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import {
    getErrorHistory,
    getAllErrors,
    getErrorsByOperation,
    getErrorsByTimeRange,
    countErrorsForUser,
    deleteOldErrors
} from "@/api/errors";
import { toastSuccess, toastRequestError } from '@/lib/toast';
import type { ErrorPageResponse, ErrorMessage } from "@/types/error";

export function useErrorHistory(page: number = 0, size: number = 10, isAdmin: boolean = false) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["errors", "history", page, size, isAdmin],
        queryFn: async () => {
            if (isAdmin) {
                return (await getAllErrors(client, page, size)).data;
            } else {
                return (await getErrorHistory(client, page, size)).data;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
    });
}

export function useErrorsByOperation(operation: string) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["errors", "operation", operation],
        queryFn: async () => (await getErrorsByOperation(client, operation)).data,
        enabled: !!operation,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useErrorsByTimeRange(from: string, to: string) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["errors", "timerange", from, to],
        queryFn: async () => (await getErrorsByTimeRange(client, from, to)).data,
        enabled: !!from && !!to,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });
}

export function useErrorCount(userId: number) {
    const client = useHttpClient();

    return useQuery({
        queryKey: ["errors", "count", userId],
        queryFn: async () => (await countErrorsForUser(client, userId)).data,
        enabled: !!userId,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 300_000,
    });
}

export function useDeleteOldErrors() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (olderThan: string) => deleteOldErrors(client, olderThan),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["errors"] });
            toastSuccess("Old errors deleted successfully.");
        },
        onError: (error) => toastRequestError(error, "Failed to delete old errors"),
    });
}