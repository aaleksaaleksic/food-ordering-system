"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, RefreshCcw, Calendar, User, Clock, Package } from "lucide-react";

import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { useOrders } from "@/hooks/use-orders";
import { useCan } from "@/hooks/use-permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { dt } from "@/lib/design-tokens";
import type { OrderStatus, OrderSearchParams } from "@/types/order";

const searchSchema = z.object({
    statusFilter: z.array(z.string()).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    userId: z.string().optional(), // Only for admins
});

type SearchFormData = z.infer<typeof searchSchema>;

const ORDER_STATUSES: OrderStatus[] = [
    "ORDERED", "PREPARING", "IN_DELIVERY", "DELIVERED", "CANCELED"
];

const STATUS_LABELS = {
    ORDERED: "Ordered",
    PREPARING: "Preparing",
    IN_DELIVERY: "In Delivery",
    DELIVERED: "Delivered",
    CANCELED: "Canceled"
};

export default function OrdersPage() {
    const { isAdmin } = useCan();
    const [searchParams, setSearchParams] = useState<OrderSearchParams>({});
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);

    const { data: orders, isLoading, error, refetch } = useOrders(searchParams, isPollingEnabled);

    const form = useForm<SearchFormData>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            statusFilter: [],
            dateFrom: "",
            dateTo: "",
            userId: "",
        },
    });

    useEffect(() => {
        setSearchParams({});
    }, []);

    const onSearch = (data: SearchFormData) => {
        const params: OrderSearchParams = {};

        if (data.statusFilter && data.statusFilter.length > 0) {
            params.status = data.statusFilter as OrderStatus[];
        }

        if (data.dateFrom) {
            params.dateFrom = new Date(data.dateFrom).toISOString();
        }

        if (data.dateTo) {
            params.dateTo = new Date(data.dateTo).toISOString();
        }

        if (data.userId && isAdmin()) {
            params.userId = parseInt(data.userId);
        }

        setSearchParams(params);
    };

    const clearFilters = () => {
        form.reset({
            statusFilter: [],
            dateFrom: "",
            dateTo: "",
            userId: "",
        });
        setSearchParams({});
    };

    const togglePolling = () => {
        setIsPollingEnabled(!isPollingEnabled);
    };

    if (error) {
        return (
            <AuthGuard permission="CAN_SEARCH_ORDER">
                <AppLayout>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Card className="w-full max-w-md">
                            <CardContent className="pt-6 text-center">
                                <p className="text-red-600 mb-4">Failed to load orders</p>
                                <Button onClick={() => refetch()}>Try Again</Button>
                            </CardContent>
                        </Card>
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
                                <Package className="w-8 h-8 inline mr-3 text-orange-500" />
                                Orders Management
                            </h1>
                            <p className={dt.typography.muted}>
                                {isAdmin() ? "View and manage all orders" : "Track your orders"}
                            </p>
                        </div>

                        {/* Real-time toggle */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant={isPollingEnabled ? "default" : "outline"}
                                size="sm"
                                onClick={togglePolling}
                                className="flex items-center gap-2"
                            >
                                <RefreshCcw className={`w-4 h-4 ${isPollingEnabled ? 'animate-spin' : ''}`} />
                                {isPollingEnabled ? "Live Updates ON" : "Live Updates OFF"}
                            </Button>
                        </div>
                    </div>

                    {/* Search Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Search Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSearch)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                    {/* Status Filter */}
                                    <FormField
                                        control={form.control}
                                        name="statusFilter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {ORDER_STATUSES.map((status) => (
                                                        <div key={status} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={status}
                                                                checked={field.value?.includes(status)}
                                                                onCheckedChange={(checked) => {
                                                                    const current = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...current, status]);
                                                                    } else {
                                                                        field.onChange(current.filter(s => s !== status));
                                                                    }
                                                                }}
                                                            />
                                                            <label htmlFor={status} className="text-sm flex items-center gap-2">
                                                                <OrderStatusBadge status={status} />
                                                                {STATUS_LABELS[status]}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date From */}
                                    <FormField
                                        control={form.control}
                                        name="dateFrom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    From Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date To */}
                                    <FormField
                                        control={form.control}
                                        name="dateTo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    To Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="datetime-local"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* User ID*/}
                                    {isAdmin() && (
                                        <FormField
                                            control={form.control}
                                            name="userId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        User ID
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter user ID"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 justify-end">
                                        <Button type="submit" className="w-full">
                                            <Search className="w-4 h-4 mr-2" />
                                            Search
                                        </Button>
                                        <Button type="button" variant="outline" onClick={clearFilters} className="w-full">
                                            Clear Filters
                                        </Button>
                                    </div>

                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <OrdersTable
                            orders={orders || []}
                            isPollingEnabled={isPollingEnabled}
                        />
                    )}

                </div>
            </AppLayout>
        </AuthGuard>
    );
}