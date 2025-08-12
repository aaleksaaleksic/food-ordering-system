'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMe } from '@/hooks/use-auth';
import type { Permission } from '@/types/permissions';
import { toastInfo } from '@/lib/toast';
import { Loader2 } from 'lucide-react';

type AllowMode = 'authed' | 'guest' | 'both';

type AuthGuardProps = {
    children: React.ReactNode;


    allow?: AllowMode;


    permissions?: Permission[];


    permissionsMode?: 'any' | 'all';


    redirectToIfUnauthed?: string | null;
    redirectToIfNoPermission?: string | null;


    fallback?: React.ReactNode;


    toastOnNoPermission?: boolean;
};

function checkPermissions(
    userPerms: Permission[] | undefined,
    required: Permission[] | undefined,
    mode: 'any' | 'all'
) {
    if (!required || required.length === 0) return true;
    const set = new Set(userPerms ?? []);
    return mode === 'all'
        ? required.every((p) => set.has(p))
        : required.some((p) => set.has(p));
}

export default function AuthGuard({
                                      children,
                                      allow = 'authed',
                                      permissions,
                                      permissionsMode = 'any',
                                      redirectToIfUnauthed,
                                      redirectToIfNoPermission,
                                      fallback = null,
                                      toastOnNoPermission = true,
                                  }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

    const { data: me, isLoading, isFetching, isError } = useMe();

    if (hasToken && (isLoading || isFetching)) {
        return (
            <div className="w-full h-[50vh] grid place-items-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (allow !== 'authed') {
        const isGuest = !hasToken || isError || !me;
        if (isGuest) {
            return <>{children}</>;
        }
        router.replace(redirectToIfUnauthed ?? '/users');
        return null;
    }

    const isAuthed = hasToken && !isError && !!me;
    if (!isAuthed) {
        const loginUrl =
            redirectToIfUnauthed ??
            `/auth/login?next=${encodeURIComponent(pathname || '/users')}`;
        if (redirectToIfUnauthed !== null) router.replace(loginUrl);
        return redirectToIfUnauthed === null ? <>{fallback}</> : null;
    }

    const ok = checkPermissions(me?.permissions, permissions, permissionsMode);
    if (!ok) {
        if (toastOnNoPermission) toastInfo('You do not have permission for this page.');
        if (redirectToIfNoPermission !== null) {
            router.replace(redirectToIfNoPermission ?? '/');
            return null;
        }
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
