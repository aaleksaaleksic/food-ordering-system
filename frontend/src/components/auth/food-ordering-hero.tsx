'use client';

import { ChefHat, Users, Shield, CheckCircle, UtensilsCrossed } from 'lucide-react';
import { dt } from '@/lib/design-tokens';

export function FoodOrderingHero() {
    return (
        <div className={`${dt.spacing.pageSections} text-center lg:text-left`}>
            <div className={dt.spacing.cardContent}>
                {/* Logo & Brand */}
                <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <h1 className={dt.typography.pageTitle}>Tasty</h1>
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    The absolute best way
                    <span className="text-orange-600 block">to order your food</span>
                </h2>

                {/* Description */}
                <p className="text-xl text-gray-600 max-w-lg">
                    You order, we deliver! It's that simple :)
                </p>
            </div>

        </div>
    );
}