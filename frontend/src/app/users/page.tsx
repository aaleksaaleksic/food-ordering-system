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
import { Plus, Users, RefreshCw } from "lucide-react";
import { dt } from "@/lib/design-tokens";

export default function UsersPage() {
    const router = useRouter();
    const { data: users, isLoading, error, refetch } = useUsers();
    const { can, me } = useCan();

    useEffect(() => {
        if (me && me.permissions.length === 0) {
            toastError("You have no permissions assigned. Contact administrator.");
        }
    }, [me]);

    const handleRefresh = () => {
        refetch();
    };

    return (
        <AuthGuard permission="CAN_READ_USERS">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h1 className={dt.typography.pageTitle}>Users</h1>
                                <p className={dt.typography.muted}>
                                    Manage system users and their permissions
                                    {users && <span className="ml-2">({users.length} total)</span>}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="text-gray-600 hover:text-orange-600"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            {can("CAN_CREATE_USERS") && (
                                <Button
                                    onClick={() => router.push("/users/create")}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create User
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <Card className={dt.cards.error}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-red-600 text-sm">!</span>
                                    </div>
                                    <div>
                                        <p className="text-red-800 font-medium">Failed to load users</p>
                                        <p className="text-red-700 text-sm">Please try again or contact support if the problem persists.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Users Table */}
                    <UsersTable
                        users={users || []}
                        isLoading={isLoading}
                    />

                    {/* Permission info card */}
                    {me && (
                        <Card className={dt.cards.info}>
                            <CardHeader>
                                <CardTitle className={dt.typography.subsectionTitle}>Your Permissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {me.permissions.length === 0 ? (
                                        <span className="text-sm text-orange-700 italic">No permissions assigned</span>
                                    ) : (
                                        me.permissions.map((permission) => (
                                            <span
                                                key={permission}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                            >
                                                {permission.replace("CAN_", "").replace("_", " ").toLowerCase()}
                                            </span>
                                        ))
                                    )}
                                </div>

                                <div className="mt-3 text-xs text-orange-700 space-y-1">
                                    {can("CAN_CREATE_USERS") && <div>• You can create new users</div>}
                                    {can("CAN_UPDATE_USERS") && <div>• Click on email addresses to edit users</div>}
                                    {can("CAN_DELETE_USERS") && <div>• You can delete users from the table</div>}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </AppLayout>
        </AuthGuard>
    );
}