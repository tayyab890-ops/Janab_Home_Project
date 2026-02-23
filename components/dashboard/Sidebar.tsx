"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    History,
    Settings,
    LogOut,
    Bike,
    Users,
    BarChart3,
    Map as MapIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const menuItems = {
    customer: [
        { title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard/customer" },
        { title: "Book Delivery", icon: <Package size={20} />, href: "/dashboard/customer/book" },
        { title: "Order History", icon: <History size={20} />, href: "/dashboard/customer/history" },
        { title: "Settings", icon: <Settings size={20} />, href: "/dashboard/customer/settings" },
    ],
    rider: [
        { title: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard/rider" },
        { title: "Available Tasks", icon: <Bike size={20} />, href: "/dashboard/rider/tasks" },
        { title: "My Deliveries", icon: <Package size={20} />, href: "/dashboard/rider/deliveries" },
        { title: "Map View", icon: <MapIcon size={20} />, href: "/dashboard/rider/map" },
    ],
    admin: [
        { title: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard/admin" },
        { title: "Manage Users", icon: <Users size={20} />, href: "/dashboard/admin/manage-users" },
        { title: "Manage Deliveries", icon: <Package size={20} />, href: "/dashboard/admin/manage-deliveries" },
        { title: "View All Orders", icon: <History size={20} />, href: "/dashboard/admin/all-orders" },
    ]
};

interface SidebarProps {
    role: "customer" | "rider" | "admin";
}

export default function DashboardSidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const items = menuItems[role];

    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-[calc(100vh-80px)] sticky top-20">
            <div className="p-6 flex-1">
                <div className="space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all relative group",
                                    isActive ? "text-primary font-bold" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={cn(isActive ? "text-primary" : "text-slate-400 group-hover:text-primary")}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.title}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 border-t border-slate-100">
                <button
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        } catch (err) {
                            console.error("Logout failed", err);
                            // Fallback
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-all font-medium text-sm"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
