"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Menu } from "lucide-react";

interface DashboardShellProps {
    children: React.ReactNode;
    role: "customer" | "rider" | "admin";
}

export default function DashboardShell({ children, role }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen pt-20">
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-20 left-0 right-0 h-14 bg-white border-b border-slate-100 flex items-center px-4 z-40 shadow-sm">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                    <Menu size={20} />
                </button>
                <span className="ml-4 font-bold text-slate-800 capitalize">{role} Dashboard</span>
            </div>

            <DashboardSidebar
                role={role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto h-full flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
