"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    History,
    Settings,
    LogOut,
    Bike,
    Users,
    BarChart3,
    Map as MapIcon,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
    isOpen: boolean;
    onClose: () => void;
}

export default function DashboardSidebar({ role, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const items = menuItems[role];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 flex items-center justify-between md:block">
                <div className="flex items-center space-x-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Bike className="text-white h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold text-primary">Janab</span>
                </div>
                <button
                    onClick={onClose}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all relative group",
                                    isActive ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
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

            <div className="p-6 border-t border-slate-100 mt-auto">
                <button
                    onClick={async () => {
                        try {
                            await fetch("/api/auth/logout", { method: "POST" });
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        } catch (err) {
                            console.error("Logout failed", err);
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
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white border-r border-slate-100 h-[calc(100vh-80px)] sticky top-20">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[110] md:hidden shadow-2xl flex flex-col"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
