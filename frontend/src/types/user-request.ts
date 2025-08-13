import type { Permission } from "./permissions";

export type CreateUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    permissions: Permission[];
};

export type UpdateUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    permissions: Permission[];
};