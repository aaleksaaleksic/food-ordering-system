"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCan } from "@/hooks/use-permissions";
import { useDeleteUser } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { UserDto } from "@/types/user";

interface UsersTableProps {
    users: UserDto[];
    isLoading?: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
    const router = useRouter();
    const { can } = useCan();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        deleteUser(id, {
            onSettled: () => setDeletingId(null)
        });
    };

    const handleEditClick = (user: UserDto) => {
        if (can("CAN_UPDATE_USERS")) {
            router.push(`/users/${user.id}/edit`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No users found.
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions
                    </th>
                    {can("CAN_DELETE_USERS") && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {can("CAN_UPDATE_USERS") ? (
                                <button
                                    onClick={() => handleEditClick(user)}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {user.email}
                                </button>
                            ) : (
                                <span className="text-sm text-gray-900">
                                        {user.email}
                                    </span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                                {user.permissions.length === 0 ? (
                                    <span className="text-xs text-gray-400 italic">No permissions</span>
                                ) : (
                                    user.permissions.map((permission) => (
                                        <span
                                            key={permission}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                                {permission.replace("CAN_", "").replace("_", " ").toLowerCase()}
                                            </span>
                                    ))
                                )}
                            </div>
                        </td>
                        {can("CAN_DELETE_USERS") && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(user.id)}
                                    disabled={deletingId === user.id}
                                >
                                    {deletingId === user.id ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}