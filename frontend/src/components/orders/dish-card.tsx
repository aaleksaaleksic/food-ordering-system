"use client";

import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dt } from "@/lib/design-tokens";
import type { Dish } from "@/types/order";

interface DishCardProps {
    dish: Dish;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

export function DishCard({ dish, quantity, onAdd, onRemove }: DishCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD'
        }).format(amount);
    };

    return (
        <Card className={`
            ${quantity > 0 ? dt.cards.selected : dt.cards.interactive}
            transition-all duration-200
        `}>
            <CardContent className={`p-4 ${dt.spacing.componentSpacing}`}>

                {/* Dish Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className={`${dt.typography.cardTitle} leading-tight`}>
                            {dish.name}
                        </h3>
                        <Badge variant="outline" className={`mt-1 ${dt.typography.small}`}>
                            {dish.category}
                        </Badge>
                    </div>
                    <div className="text-right ml-3">
                        <div className={`font-bold ${dt.typography.subsectionTitle} text-${dt.colors.primary}`}>
                            {formatCurrency(dish.price)}
                        </div>
                    </div>
                </div>

                {/* Description */}
                {dish.description && (
                    <p className={`${dt.typography.small} text-gray-600 line-clamp-2`}>
                        {dish.description}
                    </p>
                )}

                {/* Availability Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {dish.available ? (
                            <Badge variant="secondary" className={`${dt.badges.delivered}`}>
                                Available
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className={dt.badges.canceled}>
                                Out of Stock
                            </Badge>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    {dish.available && (
                        <div className="flex items-center gap-2">
                            {quantity > 0 && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={onRemove}
                                        className={`${dt.buttons.outline} h-8 w-8 p-0 rounded-full`}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>

                                    <span className={`${dt.typography.subsectionTitle} font-semibold min-w-[2rem] text-center`}>
                                        {quantity}
                                    </span>
                                </>
                            )}

                            <Button
                                size="sm"
                                onClick={onAdd}
                                className={`${dt.buttons.primary} h-8 w-8 p-0 rounded-full`}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quantity Indicator */}
                {quantity > 0 && (
                    <div className={`${dt.cards.info} rounded-lg p-2 text-center`}>
                        <span className={`${dt.typography.small} font-medium text-${dt.colors.primary}-800`}>
                            {quantity} × {formatCurrency(dish.price)} = {formatCurrency(dish.price * quantity)}
                        </span>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}