"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

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

const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    permissions: z.array(z.string()), // BEZ .default([]) !
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
    onSubmit: SubmitHandler<CreateUserFormData>;
    isPending?: boolean;
}

const ALL_PERMISSIONS: Permission[] = [
    "CAN_CREATE_USERS",
    "CAN_READ_USERS",
    "CAN_UPDATE_USERS",
    "CAN_DELETE_USERS",
    "CAN_SEARCH_ORDER",
    "CAN_PLACE_ORDER",
    "CAN_CANCEL_ORDER",
    "CAN_TRACK_ORDER",
    "CAN_SCHEDULE_ORDER"
];

const PERMISSION_LABELS: Record<Permission, string> = {
    CAN_CREATE_USERS: "Create Users",
    CAN_READ_USERS: "Read Users",
    CAN_UPDATE_USERS: "Update Users",
    CAN_DELETE_USERS: "Delete Users",
    CAN_SEARCH_ORDER: "Search Orders",
    CAN_PLACE_ORDER: "Place Orders",
    CAN_CANCEL_ORDER: "Cancel Orders",
    CAN_TRACK_ORDER: "Track Orders",
    CAN_SCHEDULE_ORDER: "Schedule Orders"
};

const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
    CAN_CREATE_USERS: "Can add new users to the system",
    CAN_READ_USERS: "Can view user list and details",
    CAN_UPDATE_USERS: "Can edit existing user information",
    CAN_DELETE_USERS: "Can remove users from the system",
    CAN_SEARCH_ORDER: "Can search and view orders",
    CAN_PLACE_ORDER: "Can create new orders",
    CAN_CANCEL_ORDER: "Can cancel existing orders",
    CAN_TRACK_ORDER: "Can track order status",
    CAN_SCHEDULE_ORDER: "Can schedule orders for later"
};

const PERMISSION_PRESETS = {
    admin: {
        name: "Super Admin",
        description: "Full access to everything",
        permissions: ALL_PERMISSIONS
    },
    manager: {
        name: "Manager",
        description: "User management + Order operations",
        permissions: [
            "CAN_READ_USERS",
            "CAN_UPDATE_USERS",
            "CAN_SEARCH_ORDER",
            "CAN_PLACE_ORDER",
            "CAN_CANCEL_ORDER",
            "CAN_TRACK_ORDER"
        ] as Permission[]
    },
    customer: {
        name: "Customer",
        description: "Order management only",
        permissions: [
            "CAN_SEARCH_ORDER",
            "CAN_PLACE_ORDER",
            "CAN_CANCEL_ORDER",
            "CAN_TRACK_ORDER",
            "CAN_SCHEDULE_ORDER"
        ] as Permission[]
    },
    limited: {
        name: "View Only",
        description: "Basic read permissions",
        permissions: [
            "CAN_SEARCH_ORDER",
            "CAN_TRACK_ORDER"
        ] as Permission[]
    },
    none: {
        name: "No Access",
        description: "No permissions (for testing)",
        permissions: [] as Permission[]
    }
};

export function CreateUserForm({ onSubmit, isPending = false }: CreateUserFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            permissions: [], // defaultValues osigurava []
        },
    });

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        const currentPermissions = form.getValues("permissions");
        const newPermissions = checked
            ? [...currentPermissions, permission]
            : currentPermissions.filter(p => p !== permission);

        form.setValue("permissions", newPermissions);
    };

    const applyPreset = (presetKey: keyof typeof PERMISSION_PRESETS) => {
        const preset = PERMISSION_PRESETS[presetKey];
        form.setValue("permissions", preset.permissions);
    };

    const userPermissions = ALL_PERMISSIONS.filter(p => p.includes('USER'));
    const orderPermissions = ALL_PERMISSIONS.filter(p => p.includes('ORDER'));

    const currentPermissions = form.watch("permissions") || [];

    return (
        <Card className={dt.cards.default}>
            <CardHeader>
                <CardTitle className={dt.typography.sectionTitle}>
                    Create New User
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={dt.spacing.formFields}>

                        {/* Basic Information */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 ${dt.spacing.gridGap}`}>

                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={dt.forms.label}>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter first name"
                                                className={dt.forms.input}
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
                                        <FormLabel className={dt.forms.label}>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter last name"
                                                className={dt.forms.input}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={dt.forms.label}>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            className={dt.forms.input}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={dt.forms.label}>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter secure password (min 6 characters)"
                                                className={`${dt.forms.input} pr-12`}
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${dt.typography.muted} hover:text-gray-700`}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Permission Presets - NOVO! */}
                        <div className={`p-4 border rounded-lg ${dt.cards.default}`}>
                            <h4 className={`${dt.typography.cardTitle} mb-3`}>
                                🚀 Quick Permission Presets
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {Object.entries(PERMISSION_PRESETS).map(([key, preset]) => (
                                    <Button
                                        key={key}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => applyPreset(key as keyof typeof PERMISSION_PRESETS)}
                                        className={`${dt.buttons.outline} text-center p-3 h-auto flex-col`}
                                    >
                                        <span className={`${dt.typography.small} font-medium`}>
                                            {preset.name}
                                        </span>

                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`${dt.forms.label} ${dt.typography.cardTitle}`}>
                                        Detailed Permissions
                                    </FormLabel>

                                    <div className={dt.spacing.componentSpacing}>

                                        {/* User Management Permissions */}
                                        <div className={`p-4 border rounded-lg ${dt.cards.default}`}>
                                            <h4 className={`${dt.typography.cardTitle} mb-3 text-blue-700`}>
                                                👥 User Management
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {userPermissions.map((permission) => (
                                                    <div key={permission} className="flex items-start space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id={permission}
                                                            checked={currentPermissions.includes(permission)}
                                                            onChange={(e) =>
                                                                handlePermissionChange(permission, e.target.checked)
                                                            }
                                                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <label
                                                                htmlFor={permission}
                                                                className={`${dt.typography.body} font-medium cursor-pointer`}
                                                            >
                                                                {PERMISSION_LABELS[permission]}
                                                            </label>
                                                            <p className={`${dt.typography.small} text-gray-600 mt-1`}>
                                                                {PERMISSION_DESCRIPTIONS[permission]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Management Permissions */}
                                        <div className={`p-4 border rounded-lg ${dt.cards.default}`}>
                                            <h4 className={`${dt.typography.cardTitle} mb-3 text-orange-700`}>
                                                🍽️ Order Management
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {orderPermissions.map((permission) => (
                                                    <div key={permission} className="flex items-start space-x-3">
                                                        <input
                                                            type="checkbox"
                                                            id={permission}
                                                            checked={currentPermissions.includes(permission)}
                                                            onChange={(e) =>
                                                                handlePermissionChange(permission, e.target.checked)
                                                            }
                                                            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <label
                                                                htmlFor={permission}
                                                                className={`${dt.typography.body} font-medium cursor-pointer`}
                                                            >
                                                                {PERMISSION_LABELS[permission]}
                                                            </label>
                                                            <p className={`${dt.typography.small} text-gray-600 mt-1`}>
                                                                {PERMISSION_DESCRIPTIONS[permission]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Permission Summary */}
                                        {currentPermissions.length > 0 && (
                                            <div className={`p-3 ${dt.cards.info} border rounded-lg`}>
                                                <p className={`${dt.typography.small} font-medium text-orange-800 mb-2`}>
                                                    Selected Permissions ({currentPermissions.length}):
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {currentPermissions.map((permission) => (
                                                        <span
                                                            key={permission}
                                                            className={`px-2 py-1 ${dt.typography.small} bg-orange-200 text-orange-800 rounded-md`}
                                                        >
                                                            {PERMISSION_LABELS[permission as Permission]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Permissions Warning */}
                                        {currentPermissions.length === 0 && (
                                            <div className={`p-3 ${dt.cards.error} border rounded-lg`}>
                                                <p className={`${dt.typography.small} font-medium text-red-800`}>
                                                    ⚠️ Warning: This user will have no permissions and won't be able to access any features.
                                                </p>
                                            </div>
                                        )}

                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className={`${dt.buttons.primary} flex-1`}
                            >
                                {isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Creating User...
                                    </>
                                ) : (
                                    "Create User"
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}