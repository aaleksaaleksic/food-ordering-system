"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    User,
    LogOut,
    Users,
    ShoppingCart,
    Package,
    Search,
    Plus,
    Menu,
    X
} from "lucide-react";

import { useMe, useLogout } from "@/hooks/use-auth";
import { useCan } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dt } from "@/lib/design-tokens";

interface NavLink {
    href: string;
    label: string;
    icon: any;
    permission?: string;
    badge?: string;
}

export function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const logout = useLogout();
    const { data: me } = useMe();
    const { can, isAdmin } = useCan();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks: NavLink[] = [
        // Order Management Links
        {
            href: "/orders",
            label: "My Orders",
            icon: Package,
            permission: "CAN_SEARCH_ORDER"
        },
        {
            href: "/orders/create",
            label: "Place Order",
            icon: Plus,
            permission: "CAN_PLACE_ORDER",
            badge: "New"
        },

        // User Management Links (Admin only)
        {
            href: "/users",
            label: "Users",
            icon: Users,
            permission: "CAN_READ_USERS"
        }
    ];

    const visibleNavLinks = navLinks.filter(link =>
        !link.permission || can(link.permission as any)
    );

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const isActivePage = (href: string) => {
        if (href === "/orders" && pathname.startsWith("/orders")) {
            return pathname === "/orders" || pathname.match(/^\/orders\/\d+$/);
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        href="/orders"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        onClick={closeMobileMenu}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <span className={`${dt.typography.sectionTitle} text-gray-900`}>
                            Food Ordering
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {visibleNavLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = isActivePage(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-md ${dt.typography.body} font-medium transition-colors
                                        ${isActive
                                        ? `${dt.cards.info} text-orange-700`
                                        : `${dt.typography.muted} hover:text-gray-900 ${dt.buttons.ghost}`
                                    }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                    {link.badge && (
                                        <Badge variant="secondary" className={`${dt.typography.small} bg-orange-100 text-orange-700`}>
                                            {link.badge}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">

                        {/* User Info & Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className={`${dt.buttons.ghost} flex items-center gap-2 h-auto py-2`}>
                                    <div className="hidden sm:block text-right">
                                        <div className={`${dt.typography.body} font-medium text-gray-900`}>
                                            {me?.firstName} {me?.lastName}
                                        </div>
                                        <div className={dt.typography.small}>
                                            {isAdmin() ? "Administrator" : "Customer"}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-orange-600" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">

                                {/* User Info */}
                                <div className="px-3 py-2 border-b">
                                    <p className={`${dt.typography.body} font-medium`}>{me?.firstName} {me?.lastName}</p>
                                    <p className={dt.typography.small}>{me?.email}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {isAdmin() && (
                                            <Badge variant="secondary" className={dt.typography.small}>Admin</Badge>
                                        )}
                                        {can("CAN_PLACE_ORDER") && (
                                            <Badge variant="outline" className={dt.typography.small}>Customer</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                {can("CAN_PLACE_ORDER") && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders/create" className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Place New Order
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                {can("CAN_SEARCH_ORDER") && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            View My Orders
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                {visibleNavLinks.length > 0 && <DropdownMenuSeparator />}

                                {/* Logout */}
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`md:hidden ${dt.buttons.ghost}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <nav className={`px-2 pt-2 pb-3 ${dt.spacing.componentSpacing}`}>
                            {visibleNavLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = isActivePage(link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMobileMenu}
                                        className={`
                                            flex items-center gap-3 px-3 py-3 rounded-md ${dt.typography.body} font-medium transition-colors
                                            ${isActive
                                            ? `${dt.cards.info} text-orange-700`
                                            : `${dt.typography.muted} hover:text-gray-900 ${dt.buttons.ghost}`
                                        }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                        {link.badge && (
                                            <Badge variant="secondary" className={`ml-auto bg-orange-100 text-orange-700 ${dt.typography.small}`}>
                                                {link.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Mobile Logout */}
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md ${dt.typography.body} font-medium text-red-600 hover:bg-red-50 transition-colors`}
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

            </div>
        </header>
    );
}