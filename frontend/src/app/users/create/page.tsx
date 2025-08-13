"use client";

import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/use-users";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { CreateUserForm, type CreateUserFormData } from "@/components/users/create-user-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { dt } from "@/lib/design-tokens";
import type { CreateUserRequest } from "@/types/user-request";
import type { Permission } from "@/types/permissions";

export default function CreateUserPage() {
    const router = useRouter();
    const { mutate: createUser, isPending } = useCreateUser();

    const handleSubmit = (data: CreateUserFormData) => {
        const createRequest: CreateUserRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            permissions: data.permissions as Permission[],
        };

        createUser(createRequest, {
            onSuccess: () => {
                router.push("/users");
            }
        });
    };

    return (
        <AuthGuard permission="CAN_CREATE_USERS">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

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
                            <h1 className={dt.typography.pageTitle}>Create User</h1>
                            <p className={dt.typography.muted}>Add a new user to the system</p>
                        </div>
                    </div>

                    {/* User Form */}
                    <div className="max-w-2xl">
                        <CreateUserForm
                            onSubmit={handleSubmit}
                            isPending={isPending}
                        />
                    </div>

                    {/* Helper info */}
                    <div className="max-w-2xl">
                        <div className={`${dt.cards.info} p-4`}>
                            <h3 className={`${dt.typography.subsectionTitle} mb-2`}>Permission Guide</h3>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li><strong>Create Users:</strong> Can add new users to the system</li>
                                <li><strong>Read Users:</strong> Can view the user list and details</li>
                                <li><strong>Update Users:</strong> Can edit existing user information</li>
                                <li><strong>Delete Users:</strong> Can remove users from the system</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </AppLayout>
        </AuthGuard>
    );
}