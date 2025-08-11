"use client";

import React, { createContext, useContext, useMemo } from "react";
import axios, { AxiosInstance } from "axios";

const HttpClientContext = createContext<AxiosInstance | null>(null);

export const HttpClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const client = useMemo(() => {
        const ax = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
        });

        ax.interceptors.request.use((config) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        });

        return ax;
    }, []);

    return <HttpClientContext.Provider value={client}>{children}</HttpClientContext.Provider>;
};

export const useHttpClient = () => {
    const ctx = useContext(HttpClientContext);
    if (!ctx) throw new Error("useHttpClient must be used inside HttpClientProvider");
    return ctx;
};
