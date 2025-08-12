"use client";

import { AppHeader } from "./app-header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { dt } from "@/lib/design-tokens";

interface AppLayoutProps {
    children: React.ReactNode;
}


export function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthGuard>
            <div className={dt.layouts.mainPage}>
                <AppHeader />
                <main className={dt.layouts.pageContainer}>
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}