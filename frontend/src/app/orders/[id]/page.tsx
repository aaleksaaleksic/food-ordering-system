"use client";

import { use } from "react";
import { ArrowLeft, Package, Clock, User, Calendar, X, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { OrderItemResponse } from "@/types/order";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderProgressTracker } from "@/components/orders/order-progress-tracker";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { useCan } from "@/hooks/use-permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { dt } from "@/lib/design-tokens";
import {formatSerbianDateOnly, formatSerbianTimeOnly} from "@/utils/date";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}




export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const orderId = parseInt(resolvedParams.id);
    const { isAdmin, can } = useCan();



    const { data: order, isLoading, error, refetch } = useOrder(orderId, true);
    const cancelOrderMutation = useCancelOrder();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    const calculateOrderTotal = () =>
        (order?.items ?? []).reduce((sum, it) => sum + it.priceAtTime * it.quantity, 0);

    const calculateSubtotal = (item: OrderItemResponse) => item.priceAtTime * item.quantity; // ← Umesto OrderItem

    const canCancelOrder = () => {
        return order &&
            can("CAN_CANCEL_ORDER") &&
            order.status === "ORDERED" &&
            order.active;
    };

    const handleCancelOrder = async () => {
        if (!order || !canCancelOrder()) return;

        try {
            await cancelOrderMutation.mutateAsync(order.id);
        } catch (error) {
        }
    };

    const handleGoBack = () => {
        router.push("/orders");
    };

    if (isLoading) {
        return (
            <AuthGuard permission="CAN_TRACK_ORDER">
                <AppLayout>
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                </AppLayout>
            </AuthGuard>
        );
    }

    if (error || !order) {
        return (
            <AuthGuard permission="CAN_TRACK_ORDER">
                <AppLayout>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Card className="w-full max-w-md">
                            <CardContent className="pt-6 text-center">
                                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Order not found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    The order you're looking for doesn't exist or you don't have permission to view it.
                                </p>
                                <Button onClick={handleGoBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Orders
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </AppLayout>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard permission="CAN_TRACK_ORDER">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGoBack}
                                className={`${dt.buttons.outline} flex items-center gap-2`}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className={dt.typography.pageTitle}>
                                    <Package className="w-8 h-8 inline mr-3 text-orange-500" />
                                    Order #{order.id.toString().padStart(4, '0')}
                                </h1>
                                <p className={dt.typography.muted}>
                                    Track your order status and details
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Live Updates Indicator */}
                            <Badge variant="secondary" className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Live Updates
                            </Badge>

                            {/* Manual Refresh */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                className={`${dt.buttons.outline} flex items-center gap-2`}
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Refresh
                            </Button>

                            {/* Cancel Order */}
                            {canCancelOrder() && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleCancelOrder}
                                    disabled={cancelOrderMutation.isPending}
                                    className={`
                                        ${dt.buttons.destructive} 
                                        flex items-center gap-2
                                        ${cancelOrderMutation.isPending ? dt.loading.fade : ''}
                                    `}
                                >
                                    {cancelOrderMutation.isPending ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <X className="w-4 h-4" />
                                    )}
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-3 ${dt.spacing.gridGap}`}>

                        {/* Order Progress & Details */}
                        <div className={`lg:col-span-2 ${dt.spacing.componentSpacing}`}>

                            {/* Order Progress Tracker */}
                            <Card className={dt.cards.default}>
                                <CardHeader>
                                    <CardTitle className={`${dt.typography.sectionTitle} flex items-center gap-2`}>
                                        <Clock className="w-5 h-5" />
                                        Order Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={dt.spacing.cardContent}>
                                    <OrderProgressTracker
                                        currentStatus={order.status}
                                        isActive={order.active}
                                        createdAt={order.createdAt}
                                        scheduledFor={order.scheduledFor}
                                    />
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card className={dt.cards.default}>
                                <CardHeader>
                                    <CardTitle className={`${dt.typography.sectionTitle} flex items-center gap-2`}>
                                        <Package className="w-5 h-5" />
                                        Order Items ({order.items.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={dt.spacing.cardContent}>
                                    <div className={dt.spacing.componentSpacing}>
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className={`${dt.typography.cardTitle} text-gray-900`}>
                                                        {item.dish.name}
                                                    </h4>
                                                    {item.dish.description && (
                                                        <p className={`${dt.typography.small} text-gray-600 mt-1`}>
                                                            {item.dish.description}
                                                        </p>
                                                    )}
                                                    <div className={`flex items-center gap-2 mt-2 ${dt.typography.small}`}>
                                                        <Badge variant="outline">
                                                            {item.dish.category}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="text-right ml-4">
                                                    <div className={dt.typography.small}>
                                                        {formatCurrency(item.priceAtTime)} × {item.quantity}
                                                    </div>
                                                    <div className={`${dt.typography.subsectionTitle} font-semibold`}>
                                                        {formatCurrency(calculateSubtotal(item))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className={`sticky top-8 ${dt.spacing.componentSpacing}`}>

                                {/* Order Status Card */}
                                <Card className={dt.cards.default}>
                                    <CardHeader>
                                        <CardTitle className={`${dt.typography.sectionTitle} text-center`}>
                                            Order Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className={`${dt.spacing.cardContent} text-center`}>
                                        <OrderStatusBadge status={order.status} size="lg" />

                                        {!order.active && (
                                            <div className={`p-3 ${dt.cards.error} border`}>
                                                <p className={`${dt.typography.small} text-red-800`}>
                                                    ⚠️ This order is no longer active
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Order Information */}
                                <Card className={dt.cards.default}>
                                    <CardHeader>
                                        <CardTitle className={dt.typography.sectionTitle}>Order Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className={dt.spacing.cardContent}>

                                        {/* Customer Info (Admin only) */}
                                        {isAdmin() && (
                                            <div>
                                                <div className={`flex items-center gap-2 ${dt.typography.small} text-gray-600 mb-1`}>
                                                    <User className="w-4 h-4" />
                                                    Customer
                                                </div>
                                                <div className="font-medium">
                                                    {order.createdBy.firstName} {order.createdBy.lastName}
                                                </div>
                                                <div className={dt.typography.small}>
                                                    {order.createdBy.email}
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Date */}
                                        <div>
                                            <div
                                                className={`flex items-center gap-2 ${dt.typography.small} text-gray-600 mb-1`}>
                                                <Calendar className="w-4 h-4"/>
                                                Order Date
                                            </div>
                                            <div className="font-medium">
                                                {formatSerbianDateOnly(order.createdAt)}
                                            </div>
                                            <div className={dt.typography.small}>
                                                {formatSerbianTimeOnly(order.createdAt)}
                                            </div>
                                        </div>

                                        {/* Scheduled For */}
                                        {order.scheduledFor && (
                                            <div>
                                                <div className={`flex items-center gap-2 ${dt.typography.small} text-gray-600 mb-1`}>
                                                    <Clock className="w-4 h-4" />
                                                    Scheduled For
                                                </div>
                                                <div className="font-medium">
                                                    {formatSerbianDateOnly(order.scheduledFor)}
                                                </div>
                                                <div className={`${dt.typography.small} text-${dt.colors.primary} font-medium`}>
                                                    {formatSerbianTimeOnly(order.scheduledFor)}
                                                </div>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>

                                {/* Order Total */}
                                <Card className="bg-gray-50">
                                    <CardContent className={`p-4 ${dt.spacing.componentSpacing}`}>
                                        <div className={dt.typography.small}>
                                            <div className="flex justify-between">
                                                <span>Items ({order.items.length})</span>
                                                <span>{formatCurrency(calculateOrderTotal())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Delivery</span>
                                                <span className={`text-${dt.colors.success}`}>Free</span>
                                            </div>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className={`${dt.typography.subsectionTitle} flex justify-between font-bold`}>
                                            <span>Total</span>
                                            <span className={`text-${dt.colors.primary}`}>
                                                {formatCurrency(calculateOrderTotal())}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>

                    </div>

                </div>
            </AppLayout>
        </AuthGuard>
    );
}
