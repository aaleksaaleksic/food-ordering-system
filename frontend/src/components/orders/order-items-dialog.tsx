"use client";

import { format } from "date-fns";
import { X, Package, Calendar, Clock, User } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "./order-status-badge";
import { useCan } from "@/hooks/use-permissions";
import { dt } from "@/lib/design-tokens";
import type { OrderResponse } from "@/types/order";

interface OrderItemsDialogProps {
    order: OrderResponse;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderItemsDialog({ order, isOpen, onClose }: OrderItemsDialogProps) {
    const { isAdmin } = useCan();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    const calculateOrderTotal = () => {
        return order.items?.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0) ?? 0;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order #{order.id.toString().padStart(4, '0')} Details
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-auto p-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Package className="w-4 h-4" />
                                Status
                            </div>
                            <OrderStatusBadge status={order.status} />
                            {order.statusDisplayName && (
                                <div className="text-sm text-gray-500 mt-1">
                                    {order.statusDisplayName}
                                </div>
                            )}
                        </div>

                        {/* Customer Info*/}
                        {isAdmin() && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <User className="w-4 h-4" />
                                    Customer
                                </div>
                                <div className="font-medium">
                                    {order.createdBy.fullName || `${order.createdBy.firstName} ${order.createdBy.lastName}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {order.createdBy.email}
                                </div>
                            </div>
                        )}

                        {/* Order Date */}
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4" />
                                Order Date
                            </div>
                            <div className="font-medium">
                                {format(new Date(order.createdAt), 'PPP')}
                            </div>
                            <div className="text-sm text-gray-500">
                                {format(new Date(order.createdAt), 'p')}
                            </div>
                        </div>

                        {/* Scheduled For */}
                        {order.scheduledFor && (
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Clock className="w-4 h-4" />
                                    Scheduled For
                                </div>
                                <div className="font-medium">
                                    {format(new Date(order.scheduledFor), 'PPP')}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {format(new Date(order.scheduledFor), 'p')}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div>
                        <h3 className={`${dt.typography.subsectionTitle} mb-4`}>
                            Order Items ({order.totalItems || order.items?.length || 0})
                        </h3>

                        <div className="space-y-3">
                            {order.items?.map((item) => (
                                <Card key={item.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">
                                                    {item.dish.name}
                                                </h4>
                                                {item.dish.description && (
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        {item.dish.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-sm">
                                                    <Badge variant="secondary">
                                                        {item.dish.category}
                                                    </Badge>
                                                    <span className="text-gray-600">
                                                        Quantity: <span className="font-medium">{item.quantity}</span>
                                                    </span>
                                                    <span className="text-gray-600">
                                                        Price: <span className="font-medium">{formatCurrency(item.priceAtTime)}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right ml-4">
                                                <div className="text-lg font-bold text-orange-600">
                                                    {formatCurrency(item.totalPrice)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.quantity} × {formatCurrency(item.priceAtTime)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <Card className="bg-gray-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Total Amount</span>
                                <span className="text-xl text-orange-600">
                                    {formatCurrency(calculateOrderTotal())}
                                </span>
                            </div>

                            <Separator className="my-3" />

                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>Items ({order.totalItems || order.items?.length || 0})</span>
                                    <span>{formatCurrency(calculateOrderTotal())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Status Note */}
                    {!order.active && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <p className="text-sm text-red-800">
                                    ⚠️ This order is no longer active and may have been canceled or completed.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}