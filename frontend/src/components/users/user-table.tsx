"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { UserDto } from "@/types/user";
import { RequirePermission } from "@/components/auth/RequirePermission";
import type { Permission } from "@/types/permissions";

export function UserTable({
                              rows,
                              onDelete,
                              canUpdate,
                              canDelete,
                          }: {
    rows: UserDto[];
    onDelete: (id: number) => void;
    canUpdate: boolean;
    canDelete: boolean;
}) {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                <tr>
                    <Th>First name</Th>
                    <Th>Last name</Th>
                    <Th>Email</Th>
                    <Th>Permissions</Th>
                    <Th className="text-right">Actions</Th>
                </tr>
                </thead>
                <tbody>
                {rows.map((u) => (
                    <tr key={u.id} className="border-t">
                        <Td>{u.firstName}</Td>
                        <Td>{u.lastName}</Td>
                        <Td>
                            {canUpdate ? (
                                <Link
                                    href={`/users/${u.id}`}
                                    className="text-primary underline-offset-2 hover:underline"
                                >
                                    {u.email}
                                </Link>
                            ) : (
                                <span className="text-muted-foreground">{u.email}</span>
                            )}
                        </Td>
                        <Td>
                            <div className="flex flex-wrap gap-1">
                                {u.permissions.map((p) => (
                                    <span
                                        key={p}
                                        className="inline-flex items-center rounded bg-secondary px-2 py-0.5 text-xs"
                                    >
                      {p}
                    </span>
                                ))}
                            </div>
                        </Td>
                        <Td className="text-right">
                            {canDelete ? (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(u.id)}
                                >
                                    Delete
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" disabled>
                                    Delete
                                </Button>
                            )}
                        </Td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function Th({ children, className = "" }: any) {
    return <th className={`px-3 py-2 text-left font-semibold ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: any) {
    return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}
