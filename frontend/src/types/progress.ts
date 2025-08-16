import type {OrderStatus} from "@/types/order";
import {CheckCircle, ChefHat, Clock, Truck} from "lucide-react";

export interface OrderProgressTrackerProps {
    currentStatus: OrderStatus;
    isActive: boolean;
    createdAt: string;
    scheduledFor?: string;
}

export const PROGRESS_STEPS = [
    {
        status: "ORDERED" as OrderStatus,
        label: "Order Placed",
        icon: Clock,
        description: "Your order has been received"
    },
    {
        status: "PREPARING" as OrderStatus,
        label: "Preparing",
        icon: ChefHat,
        description: "Kitchen is preparing your order"
    },
    {
        status: "IN_DELIVERY" as OrderStatus,
        label: "In Delivery",
        icon: Truck,
        description: "Your order is on the way"
    },
    {
        status: "DELIVERED" as OrderStatus,
        label: "Delivered",
        icon: CheckCircle,
        description: "Order successfully delivered"
    }
];