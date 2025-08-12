'use client';

import { toast } from 'sonner';
import type { AxiosError } from 'axios';

export const toastSuccess = (message: string, description?: string) =>
    toast.success(message, description ? { description } : undefined);

export const toastInfo = (message: string, description?: string) =>
    toast.message(message, description ? { description } : undefined);

export const toastWarning = (message: string, description?: string) =>
    toast.warning(message, description ? { description } : undefined);

export const toastError = (message: string, description?: string) =>
    toast.error(message, description ? { description } : undefined);

export function toastRequestError(err: unknown, fallback = 'Something went wrong') {
    const ax = err as AxiosError<any>;
    if (ax?.isAxiosError) {
        const status = ax.response?.status;
        const data = ax.response?.data;

        if (data && typeof data === 'object' && typeof data.message === 'string') {
            return toast.error(data.message);
        }

        if (data?.errors && typeof data.errors === 'object') {
            const firstError = Object.values<string>(data.errors)[0];
            return toast.error(firstError ?? fallback);
        }


        if (status === 401) return toast.error('Unauthorized: please log in again.');
        if (status === 403) return toast.error('Forbidden: you do not have permission.');
        if (status === 404) return toast.error('Not found.');
        if (status === 409) return toast.error('Conflict: email already in use.');
        if (status && status >= 500) return toast.error('Server error. Try again later.');
    }

    return toast.error(fallback);
}

export function toastPromise<T>(p: Promise<T>, messages: {
    loading?: string;
    success?: string | ((val: T) => string);
    error?: string | ((err: unknown) => string);
}) {
    return toast.promise(p, {
        loading: messages.loading ?? 'Please wait…',
        success: (val) => (typeof messages.success === 'function' ? messages.success(val) : (messages.success ?? 'Success!')),
        error: (err) => (typeof messages.error === 'function' ? messages.error(err) : (messages.error ?? 'Failed')),
    });
}
