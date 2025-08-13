"use client";

import { useRouter, useParams } from "next/navigation";
import { useUser, useUpdateUser } from "@/hooks/use-users";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { EditUserForm, type EditUserFormData } from "@/components/users/edit-user-form";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { dt } from "@/lib/design-tokens";
import type { UpdateUserRequest } from "@/types/user-request";
import type { Permission } from "@/types/permissions";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = parseInt(params.id as string);

    const { data: user, isLoading, error } = useUser(userId);
    const { mutate: updateUser, isPending } = useUpdateUser();

    const handleSubmit = (data: EditUserFormData) => {
        const updateRequest: UpdateUserRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            permissions: data.permissions as Permission[],
        };

        updateUser({ id: userId, data: updateRequest }, {
            onSuccess: () => {
                router.push("/users");
            }
        });
    };

    if (isLoading) {
        return (
            <AuthGuard permission="CAN_UPDATE_USERS">
                <AppLayout>
                    <PageSpinner />
                </AppLayout>
            </AuthGuard>
        );
    }

    if (error || !user) {
        return (
            <AuthGuard permission="CAN_UPDATE_USERS">
                <AppLayout>
                    <div className={dt.spacing.pageSections}>
                        <Card className={dt.cards.error}>
                            <CardContent className="pt-6 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h2 className={dt.typography.sectionTitle}>User Not Found</h2>
                                <p className="text-red-700 mb-4">
                                    The user you're trying to edit doesn't exist or you don't have permission to access it.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/users")}
                                >
                                    Back to Users
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </AppLayout>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard permission="CAN_UPDATE_USERS">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    {/* Header s back button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-orange-600"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div>
                            <h1 className={dt.typography.pageTitle}>Edit User</h1>
                            <p className={dt.typography.muted}>
                                Editing: {user.firstName} {user.lastName} ({user.email})
                            </p>
                        </div>
                    </div>

                    {/* User Form */}
                    <div className="max-w-2xl">
                        <EditUserForm
                            user={user}
                            onSubmit={handleSubmit}
                            isPending={isPending}
                        />
                    </div>

                    {/* Info about current user */}
                    <div className="max-w-2xl">
                        <div className={`${dt.cards.info} p-4`}>
                            <h3 className={`${dt.typography.subsectionTitle} mb-2`}>Current Permissions</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.permissions.length === 0 ? (
                                    <span className="text-sm text-orange-700 italic">No permissions assigned</span>
                                ) : (
                                    user.permissions.map((permission) => (
                                        <span
                                            key={permission}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                        >
                                            {permission.replace("CAN_", "").replace("_", " ").toLowerCase()}
                                        </span>
                                    ))
                                )}
                            </div>
                            <div className="mt-3 text-xs text-orange-700">
                                <strong>Note:</strong> Password cannot be changed through this form for security reasons.
                            </div>
                        </div>
                    </div>

                </div>
            </AppLayout>
        </AuthGuard>
    );
}