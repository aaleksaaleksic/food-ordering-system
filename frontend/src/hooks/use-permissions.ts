"use client";

import { useMe } from "@/hooks/use-auth";
import type { Permission } from "@/types/permissions";

export function useCan() {
    const { data: me, isLoading } = useMe();

    const can = (permission: Permission): boolean => {
        if (!me?.permissions) return false;
        return me.permissions.includes(permission);
    };

    const canAny = (permissions: Permission[]): boolean => {
        if (!me?.permissions) return false;
        return permissions.some(permission => me.permissions.includes(permission));
    };

    const canAll = (permissions: Permission[]): boolean => {
        if (!me?.permissions) return false;
        return permissions.every(permission => me.permissions.includes(permission));
    };

    const isLoaded = () => !isLoading && !!me;

    const canManageOrders = () => canAny([
        "CAN_SEARCH_ORDER",
        "CAN_PLACE_ORDER",
        "CAN_CANCEL_ORDER",
        "CAN_TRACK_ORDER",
        "CAN_SCHEDULE_ORDER"
    ]);

    const canManageUsers = () => canAny([
        "CAN_CREATE_USERS",
        "CAN_READ_USERS",
        "CAN_UPDATE_USERS",
        "CAN_DELETE_USERS"
    ]);

    const isAdmin = () => canAll([
        "CAN_CREATE_USERS",
        "CAN_READ_USERS",
        "CAN_UPDATE_USERS",
        "CAN_DELETE_USERS"
    ]);

    return {
        can,
        canAny,
        canAll,
        canManageOrders,
        canManageUsers,
        isAdmin,
        isLoaded,
        permissions: me?.permissions || []
    };
}