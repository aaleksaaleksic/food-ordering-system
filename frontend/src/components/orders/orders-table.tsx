"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, X, Clock, User, Package, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { OrderStatusBadge } from "./order-status-badge";
import { OrderItemsDialog } from "./order-items-dialog";
import { useCancelOrder } from "@/hooks/use-orders";
import { useCan } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { dt } from "@/lib/design-tokens";
import type { OrderResponse } from "@/types/order";
import {formatSerbianDateOnly, formatSerbianTimeOnly} from "@/utils/date";

interface OrdersTableProps {
    orders: OrderResponse[];
    isPollingEnabled?: boolean;
}

export function OrdersTable({ orders, isPollingEnabled = false }: OrdersTableProps) {
    const router = useRouter();
    const { isAdmin, can } = useCan();
    const cancelOrderMutation = useCancelOrder();
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null); // ← AŽURIRAJ TIP

    const handleViewOrder = (orderId: number) => {
        if (can("CAN_TRACK_ORDER")) {
            router.push(`/orders/${orderId}`);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        if (can("CAN_CANCEL_ORDER")) {
            try {
                await cancelOrderMutation.mutateAsync(orderId);
            } catch (error) {
            }
        }
    };

    const canCancelOrder = (order: OrderResponse) => {
        return can("CAN_CANCEL_ORDER") &&
            order.status === "ORDERED";
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };


    const calculateOrderTotal = (order: OrderResponse) => {
        return order.items?.reduce((total, item) => {
            return total + item.totalPrice; // ← Koristi computed totalPrice field
        }, 0) ?? 0;
    };

    if (orders.length === 0) {
        return (
            <Card className={dt.cards.default}>
                <CardContent className={`${dt.spacing.cardContent} text-center py-12`}>
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className={`${dt.typography.subsectionTitle} mb-2`}>No orders found</h3>
                    <p className={`${dt.typography.muted} mb-4`}>
                        {isAdmin() ? "No orders match your search criteria." : "You haven't placed any orders yet."}
                    </p>
                    {can("CAN_PLACE_ORDER") && (
                        <Button
                            onClick={() => router.push("/orders/create")}
                            className={dt.buttons.primary}
                        >
                            Place Your First Order
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className={dt.cards.default}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className={`${dt.typography.sectionTitle} flex items-center gap-2`}>
                        <Package className="w-5 h-5" />
                        Orders ({orders.length})
                    </CardTitle>
                    {isPollingEnabled && (
                        <Badge variant="secondary" className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Live Updates
                        </Badge>
                    )}
                </CardHeader>

                <CardContent className={dt.spacing.cardContent}>
                    <div className={dt.tables.container}>
                        <Table className={dt.tables.table}>
                            <TableHeader className={dt.tables.header}>
                                <TableRow>
                                    <TableHead className={dt.tables.headerCell}>Order #</TableHead>
                                    <TableHead className={dt.tables.headerCell}>Status</TableHead>
                                    <TableHead className={dt.tables.headerCell}>Items</TableHead>
                                    <TableHead className={dt.tables.headerCell}>Total</TableHead>
                                    {isAdmin() && <TableHead className={dt.tables.headerCell}>Customer</TableHead>}
                                    <TableHead className={dt.tables.headerCell}>Created</TableHead>
                                    <TableHead className={dt.tables.headerCell}>Scheduled</TableHead>
                                    <TableHead className={`${dt.tables.headerCell} text-right`}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className={`
                                            ${dt.tables.row}
                                            ${!order.active ? 'opacity-60' : ''}
                                        `}
                                    >
                                        {/* Order ID */}
                                        <TableCell className={`${dt.tables.cell} font-mono font-semibold`}>
                                            #{order.id.toString().padStart(4, '0')}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className={dt.tables.cell}>
                                            <OrderStatusBadge status={order.status} />
                                        </TableCell>

                                        {/* Items Count */}
                                        <TableCell className={dt.tables.cell}>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className={`${dt.colors.primary} hover:text-orange-800 underline flex items-center gap-1`}
                                            >
                                                {order.totalItems || order.items?.length || 0} item{(order.totalItems || order.items?.length || 0) !== 1 ? 's' : ''}
                                                <Eye className="w-3 h-3" />
                                            </button>
                                        </TableCell>

                                        {/* Total Price */}
                                        <TableCell className={`${dt.tables.cell} font-semibold`}>
                                            {formatCurrency(calculateOrderTotal(order))}
                                        </TableCell>

                                        {/* Customer */}
                                        {isAdmin() && (
                                            <TableCell className={dt.tables.cell}>
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div className={dt.typography.small}>
                                                        <div className="font-medium">
                                                            {order.createdBy.fullName || `${order.createdBy.firstName} ${order.createdBy.lastName}`}
                                                        </div>
                                                        <div className={dt.typography.muted}>
                                                            {order.createdBy.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        )}

                                        {/* Created Date */}
                                        <TableCell className={dt.tables.cell}>
                                            <div className={`flex items-center gap-2 ${dt.typography.small}`}>
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div>{formatSerbianDateOnly(order.createdAt)}</div>
                                                    <div className={dt.typography.muted}>
                                                        {formatSerbianTimeOnly(order.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Scheduled For */}
                                        <TableCell className={dt.tables.cell}>
                                            {order.scheduledFor ? (
                                                <div className={`flex items-center gap-2 ${dt.typography.small}`}>
                                                    <Clock className="w-4 h-4 text-blue-400" />
                                                    <div>
                                                        <div>{format(new Date(order.scheduledFor), 'MMM dd, yyyy')}</div>
                                                        <div className={dt.typography.muted}>
                                                            {format(new Date(order.scheduledFor), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className={dt.typography.muted}>—</span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className={`${dt.tables.cell} text-right`}>
                                            <div className="flex items-center justify-end gap-2">
                                                {can("CAN_TRACK_ORDER") && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewOrder(order.id)}
                                                        className={dt.buttons.ghost}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {canCancelOrder(order) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancelOrder(order.id)}
                                                        disabled={cancelOrderMutation.isPending}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    >
                                                        {cancelOrderMutation.isPending ? (
                                                            <LoadingSpinner size="sm" />
                                                        ) : (
                                                            <X className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Items Dialog */}
            {selectedOrder && (
                <OrderItemsDialog
                    order={selectedOrder}
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </>
    );
}