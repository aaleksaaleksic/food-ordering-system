"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/use-users";
import { useCan } from "@/hooks/use-permissions";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { UsersTable } from "@/components/users/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toastError } from "@/lib/toast";
import { dt } from "@/lib/design-tokens";

export default function UsersPage() {
    const router = useRouter();
    const { data: users, isLoading, error } = useUsers();
    const { can, me } = useCan();

    useEffect(() => {
        if (me && me.permissions.length === 0) {
            toastError("You have no permissions assigned. Contact administrator.");
        }
    }, [me]);

    return (
        <AuthGuard permission="CAN_READ_USERS">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className={dt.typography.pageTitle}>Users</h1>
                            <p className={dt.typography.muted}>Manage system users and their permissions</p>
                        </div>

                        {can("CAN_CREATE_USERS") && (
                            <Button
                                onClick={() => router.push("/users/create")}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Create User
                            </Button>
                        )}
                    </div>

                    {error && (
                        <Card className={dt.cards.error}>
                            <CardContent className="pt-6">
                                <p className="text-red-800">
                                    Failed to load users. Please try again.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <UsersTable
                        users={users || []}
                        isLoading={isLoading}
                    />

                    {me && (
                        <Card className={dt.cards.info}>
                            <CardHeader>
                                <CardTitle className={dt.typography.subsectionTitle}>Your Permissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {me.permissions.length === 0 ? (
                                        <span className="text-sm text-blue-700 italic">No permissions assigned</span>
                                    ) : (
                                        me.permissions.map((permission) => (
                                            <span
                                                key={permission}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {permission.replace("CAN_", "").replace("_", " ").toLowerCase()}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </AppLayout>
        </AuthGuard>
    );
}