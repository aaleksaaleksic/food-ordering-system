import type { Permission } from "./permissions";

export type UserDto = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    permissions: Permission[];
};
