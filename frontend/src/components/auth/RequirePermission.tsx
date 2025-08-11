"use client";

import React from "react";
import type { Permission } from "@/types/permissions";
import { useCan } from "@/hooks/use-permissions";

export function RequirePermission({
                                      children,
                                      permission,
                                      fallback = null,
                                  }: {
    children: React.ReactNode;
    permission: Permission;
    fallback?: React.ReactNode;
}) {
    const { can, isLoaded } = useCan();
    if (!isLoaded) return null;
    return can(permission) ? <>{children}</> : <>{fallback}</>;
}
