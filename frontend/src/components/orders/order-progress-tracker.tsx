"use client";

import { format } from "date-fns";
import { Clock, ChefHat, Truck, CheckCircle, XCircle, Calendar } from "lucide-react";
import { OrderStatusBadge } from "./order-status-badge";
import { dt } from "@/lib/design-tokens";
import type { OrderStatus } from "@/types/order";
import {OrderProgressTrackerProps, PROGRESS_STEPS} from "@/types/progress";



export function OrderProgressTracker({
                                         currentStatus,
                                         isActive,
                                         createdAt,
                                         scheduledFor
                                     }: OrderProgressTrackerProps) {

    const getCurrentStepIndex = () => {
        if (!isActive && currentStatus === "CANCELED") return -1;
        return PROGRESS_STEPS.findIndex(step => step.status === currentStatus);
    };

    const isStepCompleted = (stepIndex: number) => {
        const currentIndex = getCurrentStepIndex();
        return currentIndex >= stepIndex;
    };

    const isStepActive = (stepIndex: number) => {
        const currentIndex = getCurrentStepIndex();
        return currentIndex === stepIndex;
    };

    const getStepStatus = (stepIndex: number) => {
        if (isStepCompleted(stepIndex)) return "completed";
        if (isStepActive(stepIndex)) return "active";
        return "pending";
    };

    if (!isActive && currentStatus === "CANCELED") {
        return (
            <div className={dt.spacing.componentSpacing}>

                {/* Canceled Status */}
                <div className={`text-center p-6 ${dt.cards.error} border rounded-lg`}>
                    <XCircle className={`w-16 h-16 mx-auto text-${dt.colors.danger} mb-4`} />
                    <h3 className={`${dt.typography.subsectionTitle} text-red-900 mb-2`}>
                        Order Canceled
                    </h3>
                    <p className={`${dt.typography.muted} text-red-700`}>
                        This order has been canceled and will not be processed.
                    </p>
                </div>

                {/* Order Timeline */}
                <div className="border-t pt-6">
                    <h4 className={`${dt.typography.cardTitle} mb-4`}>Order Timeline</h4>
                    <div className={dt.spacing.componentSpacing}>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 bg-${dt.colors.success} rounded-full`}></div>
                            <div className={dt.typography.small}>
                                <span className="font-medium">Order placed:</span>{" "}
                                {format(new Date(createdAt), 'PPP p')}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 bg-${dt.colors.danger} rounded-full`}></div>
                            <div className={dt.typography.small}>
                                <span className="font-medium">Order canceled</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className={dt.spacing.componentSpacing}>

            {/* Scheduled Order Notice */}
            {scheduledFor && (
                <div className={`p-4 ${dt.cards.info} border rounded-lg`}>
                    <div className="flex items-center gap-3">
                        <Calendar className={`w-5 h-5 text-${dt.colors.primary}`} />
                        <div>
                            <p className={`${dt.typography.body} font-medium text-blue-900`}>Scheduled Order</p>
                            <p className={`${dt.typography.small} text-blue-700`}>
                                This order is scheduled for {format(new Date(scheduledFor), 'PPP p')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Steps */}
            <div className="relative">
                {PROGRESS_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const status = getStepStatus(index);
                    const isLast = index === PROGRESS_STEPS.length - 1;

                    return (
                        <div key={step.status} className="relative">

                            {/* Progress Line */}
                            {!isLast && (
                                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200">
                                    <div
                                        className={`
                                            w-full transition-all duration-500
                                            ${status === "completed"
                                            ? `h-full bg-${dt.colors.success}`
                                            : status === "active"
                                                ? `h-1/2 bg-${dt.colors.primary}`
                                                : "h-0 bg-gray-200"
                                        }
                                        `}
                                    />
                                </div>
                            )}

                            {/* Step Content */}
                            <div className="flex items-start gap-4 pb-8">

                                {/* Step Icon */}
                                <div className={`
                                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                                    ${status === "completed"
                                    ? `bg-${dt.colors.success} border-${dt.colors.success} text-white`
                                    : status === "active"
                                        ? `bg-${dt.colors.primary} border-${dt.colors.primary} text-white animate-pulse`
                                        : "bg-white border-gray-300 text-gray-400"
                                }
                                `}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Step Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`
                                            ${dt.typography.cardTitle}
                                            ${status === "completed"
                                            ? "text-green-900"
                                            : status === "active"
                                                ? `text-${dt.colors.primary}-900`
                                                : "text-gray-500"
                                        }
                                        `}>
                                            {step.label}
                                        </h3>

                                        {/* Current Status Badge */}
                                        {status === "active" && (
                                            <OrderStatusBadge status={currentStatus} size="sm" />
                                        )}
                                    </div>

                                    <p className={`
                                        ${dt.typography.small}
                                        ${status === "completed"
                                        ? "text-green-700"
                                        : status === "active"
                                            ? `text-${dt.colors.primary}-700`
                                            : "text-gray-500"
                                    }
                                    `}>
                                        {step.description}
                                    </p>

                                    {/* Timestamp for completed steps */}
                                    {status === "completed" && step.status === "ORDERED" && (
                                        <p className={`${dt.typography.small} text-green-600 mt-1`}>
                                            {format(new Date(createdAt), 'PPP p')}
                                        </p>
                                    )}

                                    {/* Loading indicator for active step */}
                                    {status === "active" && currentStatus !== "DELIVERED" && (
                                        <div className="mt-2">
                                            <div className={`flex items-center gap-2 ${dt.typography.small} text-${dt.colors.primary}-600`}>
                                                <div className={`w-2 h-2 bg-${dt.colors.primary} rounded-full ${dt.loading.pulse}`}></div>
                                                In progress...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Estimated Time Info */}
            {isActive && currentStatus !== "DELIVERED" && (
                <div className="p-4 bg-gray-50 border rounded-lg">
                    <h4 className={`${dt.typography.cardTitle} mb-2`}>Estimated Times</h4>
                    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${dt.typography.small}`}>
                        <div>
                            <span className={dt.typography.muted}>Preparing:</span>
                            <div className="font-medium">15 minutes</div>
                        </div>
                        <div>
                            <span className={dt.typography.muted}>Delivery:</span>
                            <div className="font-medium">20 minutes</div>
                        </div>
                        <div>
                            <span className={dt.typography.muted}>Total:</span>
                            <div className={`font-medium text-${dt.colors.primary}`}>~35 minutes</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Message */}
            {currentStatus === "DELIVERED" && isActive && (
                <div className={`p-4 ${dt.cards.success} border rounded-lg`}>
                    <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 text-${dt.colors.success}`} />
                        <div>
                            <p className={`${dt.typography.body} font-medium text-green-900`}>Order Delivered!</p>
                            <p className={`${dt.typography.small} text-green-700`}>
                                Thank you for your order. We hope you enjoy your meal! 🍽️
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}