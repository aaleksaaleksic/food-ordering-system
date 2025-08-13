"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { dt } from "@/lib/design-tokens";
import type { Permission } from "@/types/permissions";
import type { UserDto } from "@/types/user";

const editUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    permissions: z.array(z.string()),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
    user: UserDto;
    onSubmit: SubmitHandler<EditUserFormData>;
    isPending?: boolean;
}

const ALL_PERMISSIONS: Permission[] = [
    "CAN_CREATE_USERS",
    "CAN_READ_USERS",
    "CAN_UPDATE_USERS",
    "CAN_DELETE_USERS",
];

const PERMISSION_LABELS: Record<Permission, string> = {
    CAN_CREATE_USERS: "Create Users",
    CAN_READ_USERS: "Read Users",
    CAN_UPDATE_USERS: "Update Users",
    CAN_DELETE_USERS: "Delete Users",
};

export function EditUserForm({ user, onSubmit, isPending = false }: EditUserFormProps) {
    const form = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            permissions: user.permissions,
        },
    });

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        const currentPermissions = form.getValues("permissions");
        const newPermissions = checked
            ? [...currentPermissions, permission]
            : currentPermissions.filter(p => p !== permission);

        form.setValue("permissions", newPermissions);
    };

    return (
        <Card className={dt.cards.default}>
            <CardHeader>
                <CardTitle className={dt.typography.sectionTitle}>
                    Edit User
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={dt.spacing.formFields}>

                        {/* First Name */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter first name"
                                            className="focus:border-orange-500 focus:ring-orange-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter last name"
                                            className="focus:border-orange-500 focus:ring-orange-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            className="focus:border-orange-500 focus:ring-orange-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Permissions */}
                        <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permissions</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                                            {ALL_PERMISSIONS.map((permission) => (
                                                <label
                                                    key={permission}
                                                    className="flex items-center space-x-2 cursor-pointer hover:bg-orange-50 p-2 rounded transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value.includes(permission)}
                                                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {PERMISSION_LABELS[permission]}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <LoadingSpinner size="sm" />
                                        <span>Updating...</span>
                                    </div>
                                ) : (
                                    <span>Update User</span>
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}