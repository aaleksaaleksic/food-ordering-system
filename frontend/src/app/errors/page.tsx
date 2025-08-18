"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, Clock, User, RefreshCcw, FileText } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useErrorHistory } from "@/hooks/use-errors";
import { useCan } from "@/hooks/use-permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { dt } from "@/lib/design-tokens";
import {formatSerbianDate} from "@/utils/date";
import type { ErrorMessage } from "@/types/error";

export default function ErrorHistoryPage() {
    const { isAdmin } = useCan();
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: errorData, isLoading, error, refetch } = useErrorHistory(page, pageSize, isAdmin());

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const getOperationBadge = (operation: string) => {
        const config = {
            'PLACE_ORDER': { label: 'Place Order', color: 'bg-blue-100 text-blue-800' },
            'SCHEDULE_ORDER': { label: 'Schedule Order', color: 'bg-purple-100 text-purple-800' },
            'AUTO_CREATE_SCHEDULED': { label: 'Auto Schedule', color: 'bg-orange-100 text-orange-800' }
        };
        const opConfig = config[operation as keyof typeof config] || { label: operation, color: 'bg-gray-100 text-gray-800' };

        return (
            <Badge className={`${opConfig.color} text-xs`}>
                {opConfig.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <AuthGuard permission="CAN_SEARCH_ORDER">
                <AppLayout>
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                </AppLayout>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard permission="CAN_SEARCH_ORDER">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={dt.typography.pageTitle}>
                                <AlertTriangle className="w-8 h-8 inline mr-3 text-red-500" />
                                Error History
                            </h1>
                            <p className={dt.typography.muted}>
                                {isAdmin() ? "All system errors" : "Your order errors"}
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className={`${dt.buttons.outline} flex items-center gap-2`}
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Error Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className={dt.cards.default}>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                    <div className="ml-4">
                                        <p className={dt.typography.small}>Total Errors</p>
                                        <p className={`${dt.typography.subsectionTitle} font-bold`}>
                                            {errorData?.totalElements || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={dt.cards.default}>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Clock className="w-8 h-8 text-orange-500" />
                                    <div className="ml-4">
                                        <p className={dt.typography.small}>This Page</p>
                                        <p className={`${dt.typography.subsectionTitle} font-bold`}>
                                            {errorData?.content?.length || 0} of {errorData?.totalElements || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={dt.cards.default}>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <FileText className="w-8 h-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className={dt.typography.small}>Pages</p>
                                        <p className={`${dt.typography.subsectionTitle} font-bold`}>
                                            {page + 1} of {errorData?.totalPages || 1}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Errors Table */}
                    <Card className={dt.cards.default}>
                        <CardHeader>
                            <CardTitle className={dt.typography.sectionTitle}>
                                Error Messages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className={dt.spacing.cardContent}>
                            {errorData?.content && errorData.content.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Timestamp</TableHead>
                                                <TableHead>Operation</TableHead>
                                                <TableHead>Error Message</TableHead>
                                                <TableHead>Order ID</TableHead>
                                                {isAdmin() && <TableHead>User</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {errorData.content.map((error) => (
                                                <TableRow key={error.id}>
                                                    <TableCell className={dt.tables.cell}>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div className={dt.typography.small}>
                                                                    {formatSerbianDate(error.timestamp)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className={dt.tables.cell}>
                                                        {getOperationBadge(error.operation)}
                                                    </TableCell>

                                                    <TableCell className={dt.tables.cell}>
                                                        <div className="max-w-md">
                                                            <p className={`${dt.typography.small} text-red-600`}>
                                                                {error.errorMessage}
                                                            </p>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className={dt.tables.cell}>
                                                        {error.orderId ? (
                                                            <Badge variant="outline">
                                                                #{error.orderId}
                                                            </Badge>
                                                        ) : (
                                                            <span className={dt.typography.muted}>—</span>
                                                        )}
                                                    </TableCell>

                                                    {isAdmin() && (
                                                        <TableCell className={dt.tables.cell}>
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-gray-400" />
                                                                <div className={dt.typography.small}>
                                                                    <div>{error.user.firstName} {error.user.lastName}</div>
                                                                    <div className={dt.typography.muted}>
                                                                        {error.user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between mt-6">
                                        <div className={dt.typography.small}>
                                            Showing {(page * pageSize) + 1} to {Math.min((page + 1) * pageSize, errorData.totalElements)} of {errorData.totalElements} errors
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className={dt.buttons.outline}
                                            >
                                                Previous
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={!errorData || page >= errorData.totalPages - 1}
                                                className={dt.buttons.outline}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className={`${dt.typography.subsectionTitle} mb-2`}>No errors found</h3>
                                    <p className={dt.typography.muted}>
                                        {isAdmin() ? "No system errors have been recorded." : "You don't have any order errors."}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </AuthGuard>
    );
}