"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useHttpClient } from "@/context/HttpClientContext";
import {login, me} from "@/api/auth";
import type { LoginRequest } from "@/api/request/auth";
import type { AuthResponse } from "@/api/response/auth";
import { toastSuccess, toastRequestError } from '@/lib/toast';
import {useRouter} from "next/navigation";


export function useLogin() {
    const client = useHttpClient();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: LoginRequest) => login(client, body),
        onSuccess: (res) => {
            const data: AuthResponse = res.data;
            localStorage.setItem("token", data.token);
            qc.invalidateQueries({ queryKey: ["me"] });
            toastSuccess("Logged in.");

        },
        onError: (error) => toastRequestError(error, "Login failed"),
    });
}


export function useMe() {
    const client = useHttpClient();
    const hasToken =
        typeof window !== "undefined" && !!localStorage.getItem("token");
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => (await me(client)).data,
        enabled: hasToken,
        retry : false,
        refetchOnWindowFocus : false,
        staleTime: 60_000,
    });
}

export function useLogout() {
    const qc = useQueryClient();
    const router = useRouter();
    return () => {
        localStorage.removeItem("token");
        qc.removeQueries({ queryKey: ["me"], exact: false });
        router.replace("/auth/login");
    };
}
