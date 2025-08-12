"use client";

import { useRouter } from "next/navigation";
import { useMe, useLogout } from "@/hooks/use-auth";
import { useCan } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChefHat } from "lucide-react";
import { dt } from "@/lib/design-tokens";

export function AppHeader() {
    const router = useRouter();
    const { data: me } = useMe();
    const { can } = useCan();
    const logout = useLogout();

    if (!me) return null;

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                            <ChefHat className="w-5 h-5 text-white" />
                        </div>
                        <h1 className={`${dt.typography.sectionTitle} bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
                            Tasty
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        {can("CAN_READ_USERS") && (
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/users")}
                                className="text-gray-700 hover:text-orange-600 transition-colors"
                            >
                                Users
                            </Button>
                        )}
                    </nav>

                    {/* User info & logout */}
                    <div className="flex items-center space-x-4">
                        <span className={dt.typography.body}>
                            Welcome, <span className="font-medium text-orange-700">{me.firstName} {me.lastName}</span>
                        </span>

                        <Separator orientation="vertical" className="h-6" />

                        <span className={dt.typography.small}>
                            {me.email}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}