"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Minus, ShoppingCart, Calendar, Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DishCard } from "@/components/orders/dish-card";
import { OrderSummary } from "@/components/orders/order-summary";
import {useAllDishes, useAvailableDishes, useDishCategories} from "@/hooks/use-dishes";
import { usePlaceOrder, useScheduleOrder } from "@/hooks/use-orders";
import { useCan } from "@/hooks/use-permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { dt } from "@/lib/design-tokens";
import type { Dish } from "@/types/order";
import {OrderItemRequest} from "@/api/request/order";
import {formatSerbianDate} from "@/utils/date";

const scheduleSchema = z.object({
    scheduledFor: z.string().min(1, "Please select a date and time"),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface CartItem {
    dish: Dish;
    quantity: number;
}

export default function CreateOrderPage() {
    const router = useRouter();
    const { can , isAdmin} = useCan();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isScheduleMode, setIsScheduleMode] = useState(false);

    const { data: dishes, isLoading: dishesLoading } = isAdmin()
        ? useAllDishes()
        : useAvailableDishes();

    const { data: categories } = useDishCategories();

    const placeOrderMutation = usePlaceOrder();
    const scheduleOrderMutation = useScheduleOrder();

    const scheduleForm = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            scheduledFor: "",
        },
    });

    const filteredDishes = dishes?.filter(dish => {
        const matchesCategory = selectedCategory === "all" || dish.category === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch && (isAdmin() || dish.available);
    }) || [];

    const addToCart = (dish: Dish) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.dish.id === dish.id);
            if (existingItem) {
                return prev.map(item =>
                    item.dish.id === dish.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { dish, quantity: 1 }];
        });
    };

    const removeFromCart = (dishId: number) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.dish.id === dishId);
            if (!existingItem) return prev;

            if (existingItem.quantity === 1) {
                return prev.filter(item => item.dish.id !== dishId);
            }

            return prev.map(item =>
                item.dish.id === dishId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartQuantity = (dishId: number) => {
        return cart.find(item => item.dish.id === dishId)?.quantity || 0;
    };

    const cartTotal = cart.reduce((total, item) => {
        return total + (item.dish.price * item.quantity);
    }, 0);

    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;

        const orderItems: OrderItemRequest[] = cart.map(item => ({
            dishId: item.dish.id,
            quantity: item.quantity,
        }));

        try {
            await placeOrderMutation.mutateAsync({ items: orderItems });
            clearCart();
            router.push("/orders");
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleScheduleOrder = async (data: ScheduleFormData) => {
        if (cart.length === 0) return;

        const orderItems: OrderItemRequest[] = cart.map(item => ({
            dishId: item.dish.id,
            quantity: item.quantity,
        }));

        try {
            const scheduledDateTime = new Date(data.scheduledFor);
            const serbianFormat = formatSerbianDate(scheduledDateTime);

            console.log('Original input:', data.scheduledFor);
            console.log('Sending to backend (Serbian format):', serbianFormat);

            await scheduleOrderMutation.mutateAsync({
                items: orderItems,
                scheduledFor: serbianFormat,
            });

            clearCart();
            setIsScheduleMode(false);
            scheduleForm.reset();
            router.push("/orders");
        } catch (error) {
            console.error('Schedule order error:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    const getMinScheduleTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    if (dishesLoading) {
        return (
            <AuthGuard permission="CAN_PLACE_ORDER">
                <AppLayout>
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                </AppLayout>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard permission="CAN_PLACE_ORDER">
            <AppLayout>
                <div className={dt.spacing.pageSections}>

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={dt.typography.pageTitle}>
                                <ShoppingCart className="w-8 h-8 inline mr-3 text-orange-500" />
                                Create Order
                            </h1>
                            <p className={dt.typography.muted}>
                                Select dishes and place your order
                            </p>
                        </div>

                        {/* Cart Summary */}
                        {cart.length > 0 && (
                            <Card className={`${dt.cards.info} p-4`}>
                                <CardContent className={`${dt.spacing.componentSpacing} flex items-center gap-4 p-0`}>
                                    <div className={dt.typography.small}>
                                        <div className="font-semibold">{cartItemsCount} items</div>
                                        <div className={`text-${dt.colors.primary} font-bold`}>
                                            {formatCurrency(cartTotal)}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => document.getElementById('order-summary')?.scrollIntoView({ behavior: 'smooth' })}
                                        className={dt.buttons.primary}
                                    >
                                        Review Order
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-3 ${dt.spacing.gridGap}`}>

                        {/* Dishes Section */}
                        <div className={`lg:col-span-2 ${dt.spacing.componentSpacing}`}>

                            {/* Filters */}
                            <Card className={dt.cards.default}>
                                <CardHeader>
                                    <CardTitle className={`${dt.typography.sectionTitle} flex items-center gap-2`}>
                                        <Search className="w-5 h-5" />
                                        Browse Menu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className={dt.spacing.componentSpacing}>

                                    {/* Search */}
                                    <div>
                                        <Input
                                            placeholder="Search dishes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full ${dt.forms.input}`}
                                        />
                                    </div>

                                    {/* Category Filter */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={selectedCategory === "all" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedCategory("all")}
                                            className={selectedCategory === "all" ? dt.buttons.primary : dt.buttons.outline}
                                        >
                                            All Categories
                                        </Button>
                                        {categories?.map(category => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category)}
                                                className={selectedCategory === category ? dt.buttons.primary : dt.buttons.outline}
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>

                                </CardContent>
                            </Card>

                            {/* Dishes Grid */}
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${dt.spacing.gridGap}`}>
                                {filteredDishes.map(dish => (
                                    <DishCard
                                        key={dish.id}
                                        dish={dish}
                                        quantity={getCartQuantity(dish.id)}
                                        onAdd={() => addToCart(dish)}
                                        onRemove={() => removeFromCart(dish.id)}
                                    />
                                ))}
                            </div>

                            {filteredDishes.length === 0 && (
                                <Card className={dt.cards.default}>
                                    <CardContent className={`${dt.spacing.cardContent} text-center py-12`}>
                                        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className={`${dt.typography.subsectionTitle} mb-2`}>
                                            No dishes found
                                        </h3>
                                        <p className={dt.typography.muted}>
                                            Try adjusting your search or category filter.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8" id="order-summary">
                                <OrderSummary
                                    cart={cart}
                                    onUpdateQuantity={(dishId, quantity) => {
                                        if (quantity === 0) {
                                            setCart(prev => prev.filter(item => item.dish.id !== dishId));
                                        } else {
                                            setCart(prev => prev.map(item =>
                                                item.dish.id === dishId
                                                    ? { ...item, quantity }
                                                    : item
                                            ));
                                        }
                                    }}
                                    onClearCart={clearCart}
                                    isScheduleMode={isScheduleMode}
                                    onToggleScheduleMode={() => setIsScheduleMode(!isScheduleMode)}
                                    canSchedule={can("CAN_SCHEDULE_ORDER")}
                                    scheduleForm={scheduleForm}
                                    onPlaceOrder={handlePlaceOrder}
                                    onScheduleOrder={handleScheduleOrder}
                                    isPlacingOrder={placeOrderMutation.isPending}
                                    isSchedulingOrder={scheduleOrderMutation.isPending}
                                    minScheduleTime={getMinScheduleTime()}
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </AppLayout>
        </AuthGuard>
    );
}