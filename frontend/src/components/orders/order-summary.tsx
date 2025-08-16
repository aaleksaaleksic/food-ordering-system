"use client";

import { UseFormReturn } from "react-hook-form";
import { ShoppingCart, Trash2, Clock, Calendar, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";

interface CartItem {
    dish: {
        id: number;
        name: string;
        price: number;
        category: string;
    };
    quantity: number;
}

interface OrderSummaryProps {
    cart: CartItem[];
    onUpdateQuantity: (dishId: number, quantity: number) => void;
    onClearCart: () => void;
    isScheduleMode: boolean;
    onToggleScheduleMode: () => void;
    canSchedule: boolean;
    scheduleForm: UseFormReturn<{ scheduledFor: string }>;
    onPlaceOrder: () => void;
    onScheduleOrder: (data: { scheduledFor: string }) => void;
    isPlacingOrder: boolean;
    isSchedulingOrder: boolean;
    minScheduleTime: string;
}

export function OrderSummary({
                                 cart,
                                 onUpdateQuantity,
                                 onClearCart,
                                 isScheduleMode,
                                 onToggleScheduleMode,
                                 canSchedule,
                                 scheduleForm,
                                 onPlaceOrder,
                                 onScheduleOrder,
                                 isPlacingOrder,
                                 isSchedulingOrder,
                                 minScheduleTime
                             }: OrderSummaryProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const isLoading = isPlacingOrder || isSchedulingOrder;
    const canProceed = cart.length > 0 && !isLoading;

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Order Summary
                    </span>
                    {cart.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearCart}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {/* Empty Cart */}
                {cart.length === 0 && (
                    <div className="text-center py-8">
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Your cart is empty</p>
                        <p className="text-sm text-gray-500">Add some dishes to get started!</p>
                    </div>
                )}

                {/* Cart Items */}
                {cart.length > 0 && (
                    <>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {cart.map((item) => (
                                <div key={item.dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{item.dish.name}</h4>
                                        <p className="text-xs text-gray-600">{formatCurrency(item.dish.price)} each</p>
                                        <Badge variant="outline" className="text-xs mt-1">
                                            {item.dish.category}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onUpdateQuantity(item.dish.id, item.quantity - 1)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>

                                        <span className="font-semibold min-w-[1.5rem] text-center text-sm">
                                            {item.quantity}
                                        </span>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onUpdateQuantity(item.dish.id, item.quantity + 1)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    <div className="text-right ml-3">
                                        <p className="font-semibold text-sm">
                                            {formatCurrency(item.dish.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Order Totals */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Items ({cartItemsCount})</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">{formatCurrency(cartTotal)}</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Order Type Toggle */}
                        {canSchedule && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={!isScheduleMode ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => !isScheduleMode || onToggleScheduleMode()}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Order Now
                                    </Button>
                                    <Button
                                        variant={isScheduleMode ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => isScheduleMode || onToggleScheduleMode()}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Schedule
                                    </Button>
                                </div>

                                {/* Schedule Form */}
                                {isScheduleMode && (
                                    <Form {...scheduleForm}>
                                        <form onSubmit={scheduleForm.handleSubmit(onScheduleOrder)} className="space-y-3">
                                            <FormField
                                                control={scheduleForm.control}
                                                name="scheduledFor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm">Schedule for</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="datetime-local"
                                                                min={minScheduleTime}
                                                                {...field}
                                                                className="text-sm"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </form>
                                    </Form>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            {isScheduleMode ? (
                                <Button
                                    onClick={scheduleForm.handleSubmit(onScheduleOrder)}
                                    disabled={!canProceed}
                                    className="w-full bg-orange-500 hover:bg-orange-600"
                                    size="lg"
                                >
                                    {isSchedulingOrder ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Scheduling Order...
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule Order
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={onPlaceOrder}
                                    disabled={!canProceed}
                                    className="w-full bg-orange-500 hover:bg-orange-600"
                                    size="lg"
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Helper Text */}
                            <p className="text-xs text-gray-500 text-center">
                                {isScheduleMode
                                    ? "Your order will be prepared at the scheduled time"
                                    : "Your order will be prepared immediately"
                                }
                            </p>
                        </div>
                    </>
                )}

            </CardContent>
        </Card>
    );
}