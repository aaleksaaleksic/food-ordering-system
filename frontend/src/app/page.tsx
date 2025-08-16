"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-auth";
import { useCan } from "@/hooks/use-permissions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function HomePage() {
    const router = useRouter();
    const { data: me, isLoading } = useMe();
    const { can, canManageOrders } = useCan();

    useEffect(() => {
        if (!isLoading) {
            if (!me) {
                router.replace("/auth/login");
            } else if (canManageOrders()) {
                router.replace("/orders");
            } else if (can("CAN_READ_USERS")) {
                router.replace("/users");
            } else {
                router.replace("/auth/login?error=no_permissions");
            }
        }
    }, [me, isLoading, canManageOrders, can, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );
}