export interface ErrorMessage {
    id: number;
    orderId?: number;
    operation: string;
    errorMessage: string;
    timestamp: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface ErrorPageResponse {
    content: ErrorMessage[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}