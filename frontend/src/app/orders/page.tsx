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
import { useMe } from "@/hooks/use-auth";
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
    const { data: me } = useMe();

    const { data: orders, isLoading, error, refetch } = useOrders(searchParams, isPollingEnabled, !!me);

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
                                {isPollingEnabled ? 'Live Updates' : 'Enable Live Updates'}
                            </Button>
                        </div>
                    </div>

                    {/* Search Filters */}
                    <Card className={dt.cards.default}>
                        <CardHeader>
                            <CardTitle className={`${dt.typography.sectionTitle} flex items-center gap-2`}>
                                <Search className="w-5 h-5" />
                                Search & Filter Orders
                            </CardTitle>
                        </CardHeader>

                        <CardContent className={dt.spacing.cardContent}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSearch)} className="space-y-6">

                                    {/* Status Filter */}
                                    <FormField
                                        control={form.control}
                                        name="statusFilter"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel className={dt.typography.muted}>Filter by Status</FormLabel>
                                                <div className="flex flex-wrap gap-3">
                                                    {ORDER_STATUSES.map((status) => (
                                                        <FormField
                                                            key={status}
                                                            control={form.control}
                                                            name="statusFilter"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(status)}
                                                                            onCheckedChange={(checked) => {
                                                                                const currentValue = field.value || [];
                                                                                if (checked) {
                                                                                    field.onChange([...currentValue, status]);
                                                                                } else {
                                                                                    field.onChange(currentValue.filter((v) => v !== status));
                                                                                }
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <OrderStatusBadge status={status} />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date Range */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dateFrom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={`${dt.typography.muted} flex items-center gap-2`}>
                                                        <Calendar className="w-4 h-4" />
                                                        From Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className={dt.typography.muted}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dateTo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={`${dt.typography.muted} flex items-center gap-2`}>
                                                        <Calendar className="w-4 h-4" />
                                                        To Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className={dt.typography.muted}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* User ID Filter (Admin only) */}
                                    {isAdmin() && (
                                        <FormField
                                            control={form.control}
                                            name="userId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className={`${dt.typography.muted} flex items-center gap-2`}>
                                                        <User className="w-4 h-4" />
                                                        Filter by User ID (Admin)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter user ID..."
                                                            className={dt.typography.muted}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <Button type="submit" className={dt.buttons.primary}>
                                            <Search className="w-4 h-4 mr-2" />
                                            Search Orders
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearFilters}
                                            className={dt.buttons.secondary}
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>

                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    {isLoading ? (
                        <Card className={dt.cards.default}>
                            <CardContent className={`${dt.spacing.cardContent} flex items-center justify-center py-12`}>
                                <LoadingSpinner size="lg" />
                                <span className="ml-3 text-gray-600">Loading orders...</span>
                            </CardContent>
                        </Card>
                    ) : (
                        <OrdersTable orders={orders || []} isPollingEnabled={isPollingEnabled} />
                    )}

                </div>
            </AppLayout>
        </AuthGuard>
    );
}