"use client";

import { Clock, ChefHat, Truck, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
    status: OrderStatus;
    showIcon?: boolean;
    size?: "sm" | "default" | "lg";
}

const STATUS_CONFIG = {
    ORDERED: {
        label: "Ordered",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        description: "Order received"
    },
    PREPARING: {
        label: "Preparing",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: ChefHat,
        description: "Kitchen is preparing your order"
    },
    IN_DELIVERY: {
        label: "In Delivery",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Truck,
        description: "Order is on the way"
    },
    DELIVERED: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        description: "Order successfully delivered"
    },
    CANCELED: {
        label: "Canceled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        description: "Order was canceled"
    }
};

export function OrderStatusBadge({
                                     status,
                                     showIcon = true,
                                     size = "default"
                                 }: OrderStatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        default: "text-sm px-2.5 py-1.5",
        lg: "text-base px-3 py-2"
    };

    const iconSizes = {
        sm: "w-3 h-3",
        default: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <Badge
            variant="secondary"
            className={`
                ${config.color} 
                ${sizeClasses[size]}
                font-medium border
                flex items-center gap-1.5
                transition-all duration-200
            `}
            title={config.description}
        >
            {showIcon && <Icon className={iconSizes[size]} />}
            {config.label}
        </Badge>
    );
}