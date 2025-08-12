"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-auth";
import { useCan } from "@/hooks/use-permissions";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Permission } from "@/types/permissions";

interface AuthGuardProps {
    children: React.ReactNode;
    permission?: Permission;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, permission, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { data: me, isLoading, error } = useMe();
    const { can } = useCan();


    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/auth/login");
                return;
            }
        }
    }, [router]);

    if (isLoading) {
        return <PageSpinner />;
    }

    if (error || !me) {
        router.replace("/auth/login");
        return <PageSpinner />;
    }

    if (permission && !can(permission)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex items-center justify-center min-h-[400px] px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            You don't have permission to access this page.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/auth/login")}
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}