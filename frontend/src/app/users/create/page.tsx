"use client";

import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/use-users";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { CreateUserForm, type CreateUserFormData } from "@/components/users/create-user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Info } from "lucide-react";
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

                    {/* Page Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className={`${dt.buttons.ghost} text-gray-600 hover:text-orange-600`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div>
                            <h1 className={`${dt.typography.pageTitle} flex items-center gap-3`}>
                                <Users className="w-8 h-8 text-orange-500" />
                                Create New User
                            </h1>
                            <p className={dt.typography.muted}>
                                Add a new user to the system with appropriate permissions
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <CreateUserForm
                                onSubmit={handleSubmit}
                                isPending={isPending}
                            />
                        </div>


                    </div>

                </div>
            </AppLayout>
        </AuthGuard>
    );
}