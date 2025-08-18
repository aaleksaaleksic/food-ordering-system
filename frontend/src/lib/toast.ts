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



        if (data && typeof data === 'object') {

            if (data.type === 'ORDER_LIMIT' || data.error === 'MAX_ORDERS_EXCEEDED') {
                return toast.error('🚫 Maximum Orders Limit', {
                    description: 'You can only have 3 orders being prepared or delivered at the same time. Please wait for some orders to complete.'
                });
            }

            if (data.type === 'SCHEDULE_ERROR' || data.error === 'INVALID_SCHEDULE_TIME') {
                return toast.error('⏰ Invalid Schedule Time', {
                    description: 'You cannot schedule an order for a time in the past.'
                });
            }

            if (typeof data.message === 'string') {

                if (data.message.includes('Maximum number of simultaneous orders')) {
                    return toast.error('🚫 Maximum Orders Limit', {
                        description: 'You can only have 3 orders being prepared or delivered at the same time. Please wait for some orders to complete.'
                    });
                }

                if (data.message.includes('Cannot schedule order in the past')) {
                    return toast.error('⏰ Invalid Schedule Time', {
                        description: 'You cannot schedule an order for a time in the past.'
                    });
                }

                return toast.error(data.message);
            }
        }

        if (data && typeof data === 'string') {
            if (data.includes('Maximum number of simultaneous orders')) {
                return toast.error('🚫 Maximum Orders Limit', {
                    description: 'You can only have 3 orders being prepared or delivered at the same time. Please wait for some orders to complete.'
                });
            }
            return toast.error(data);
        }

        if (data?.errors && typeof data.errors === 'object') {
            const firstError = Object.values<string>(data.errors)[0];
            return toast.error(firstError ?? fallback);
        }

        // Status code fallbacks
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
