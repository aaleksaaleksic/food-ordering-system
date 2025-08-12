"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import AuthGuard from "@/components/auth/AuthGuard";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { useCan } from "@/hooks/use-permissions";
import {UserDto} from "@/types/user";

export default function UsersPage() {
    return (
        <AuthGuard>
            <UsersInner />
        </AuthGuard>
    );
}

type UsersTableProps = {
    rows: UserDto[];
    canUpdate: boolean;
    canDelete: boolean;
    onDelete: (id: number) => void;
};

function UsersInner() {
    const { data, isLoading, isError, refetch } = useUsers();
    const { can } = useCan();
    const { mutate: doDelete } = useDeleteUser();

    const canRead = can("CAN_READ_USERS");
    const canCreate = can("CAN_CREATE_USERS");
    const canUpdate = can("CAN_UPDATE_USERS");
    const canDelete = can("CAN_DELETE_USERS");


    if (!canRead) {
        return (
            <div className="mx-auto max-w-5xl p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            You don't have permissions to see users.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Users</h1>

                {canCreate ? (
                    <Link href="/users/new">
                        <Button variant="default">Add user</Button>
                    </Link>
                ) : (
                    <Button variant="secondary" disabled title="No permission">
                        Add user
                    </Button>
                )}
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">All users</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
                    {isError && (
                        <div className="text-sm text-red-500">
                            Something went wrong. <button className="underline" onClick={() => refetch()}>Try again.</button>
                        </div>
                    )}

                    {data && data.length === 0 && (
                        <div className="text-sm text-muted-foreground">No users.</div>
                    )}

                    {data && data.length > 0 && (
                        <UsersTableProxy
                            rows={data}
                            canUpdate={canUpdate}
                            canDelete={canDelete}
                            onDelete={(id) => doDelete(id)}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


function UsersTableProxy(props: UsersTableProps) {
    const { UserTable } = require("@/components/users/user-table");
    return <UserTable {...props} />;
}
