import {Permission} from "@/types/permissions";

export type MeDto = {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    permissions: Permission[];
};