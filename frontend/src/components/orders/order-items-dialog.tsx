"use client";

import { X, Package, Utensils } from "lucide-react";
import { format } from "date-fns";

import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order";

interface OrderItemsDialogProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderItemsDialog({ order, isOpen, onClose }: OrderItemsDialogProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    const calculateOrderTotal = () => {
        return order.items.reduce((total, item) => {
            return total + (item.priceAtTime * item.quantity);
        }, 0);
    };

    const calculateSubtotal = (item: typeof order.items[0]) => {
        return item.priceAtTime * item.quantity;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-orange-500" />
                        Order #{order.id.toString().padStart(4, '0')} Details
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-auto p-1"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Status:</span>
                                    <div className="mt-1">
                                        <OrderStatusBadge status={order.status} size="lg" />
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-600">Customer:</span>
                                    <div className="mt-1 font-medium">
                                        {order.createdBy.firstName} {order.createdBy.lastName}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {order.createdBy.email}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-600">Order Date:</span>
                                    <div className="mt-1 font-medium">
                                        {format(new Date(order.createdAt), 'PPP')}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {format(new Date(order.createdAt), 'p')}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-600">Delivery:</span>
                                    <div className="mt-1 font-medium">
                                        {order.scheduledFor ? (
                                            <>
                                                <Badge variant="outline" className="mr-2">Scheduled</Badge>
                                                <div className="text-sm">
                                                    {format(new Date(order.scheduledFor), 'PPP p')}
                                                </div>
                                            </>
                                        ) : (
                                            <Badge variant="secondary">Immediate</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Utensils className="w-5 h-5" />
                            Ordered Items ({order.items.length})
                        </h3>

                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <Card key={item.id} className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {item.dish.name}
                                                        </h4>
                                                        {item.dish.description && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {item.dish.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.dish.category}
                                                            </Badge>
                                                            {!item.dish.available && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Currently Unavailable
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right ml-4">
                                                <div className="text-sm text-gray-600">
                                                    {formatCurrency(item.priceAtTime)} × {item.quantity}
                                                </div>
                                                <div className="font-semibold text-lg">
                                                    {formatCurrency(calculateSubtotal(item))}
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
                                    <span>Items ({order.items.length})</span>
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