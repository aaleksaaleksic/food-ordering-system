"use client";

import { useMe } from "./use-auth";
import type { Permission } from "@/types/permissions";

export function useCan() {
    const { data: me } = useMe();
    const set = new Set(me?.permissions ?? []);
    const can = (p: Permission) => set.has(p);
    const hasAny = (ps: Permission[]) => ps.some((p) => set.has(p));
    const hasAll = (ps: Permission[]) => ps.every((p) => set.has(p));
    return { me, can, hasAny, hasAll, isLoaded: !!me };
}
