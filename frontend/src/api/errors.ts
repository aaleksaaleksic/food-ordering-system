import { AxiosInstance } from "axios";
import type {ErrorMessage, ErrorPageResponse} from "@/types/error";

export const getErrorHistory = (client: AxiosInstance, page: number = 0, size: number = 10) =>
    client.get<ErrorPageResponse>(`/v1/errors?page=${page}&size=${size}`);

export const getAllErrors = (client: AxiosInstance, page: number = 0, size: number = 10) =>
    client.get<ErrorPageResponse>(`/v1/errors/all?page=${page}&size=${size}`);

export const getErrorsByOperation = (client: AxiosInstance, operation: string) =>
    client.get<ErrorMessage[]>(`/v1/errors/operation/${operation}`);

export const getErrorsByTimeRange = (client: AxiosInstance, from: string, to: string) =>
    client.get<ErrorMessage[]>(`/v1/errors/timerange?from=${from}&to=${to}`);

export const countErrorsForUser = (client: AxiosInstance, userId: number) =>
    client.get<number>(`/v1/errors/count/${userId}`);

export const deleteOldErrors = (client: AxiosInstance, olderThan: string) =>
    client.delete(`/v1/errors/cleanup?olderThan=${olderThan}`);