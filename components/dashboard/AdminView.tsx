"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Truck, DollarSign, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminView() {
    const [users, setUsers] = useState<any[]>([]);
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeRiders: 0,
        totalDeliveries: 0,
        revenue: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [usersRes, deliveriesRes] = await Promise.all([
                fetch("/api/admin/users", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("/api/admin/deliveries", { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            const usersData = await usersRes.json();
            const deliveriesData = await deliveriesRes.json();

            if (usersRes.ok) setUsers(usersData);
            if (deliveriesRes.ok) setDeliveries(deliveriesData);

            if (usersRes.ok && deliveriesRes.ok) {
                setStats({
                    totalUsers: usersData.length,
                    activeRiders: usersData.filter((u: any) => u.role === 'RIDER').length,
                    totalDeliveries: deliveriesData.length,
                    revenue: deliveriesData.filter((d: any) => d.status === 'DELIVERED').reduce((acc: number, curr: any) => acc + curr.price, 0)
                });
            }
        } catch (err) {
            console.error("Fetch admin data failed", err);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const loadingToast = toast.loading("Deleting user...");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/user/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("User deleted", { id: loadingToast });
                fetchData();
            } else {
                throw new Error("Delete failed");
            }
        } catch (err: any) {
            toast.error(err.message, { id: loadingToast });
        }
    };

    const adminStats = [
        { label: "Total Users", value: stats.totalUsers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Riders", value: stats.activeRiders, icon: <Truck />, color: "text-green-600", bg: "bg-green-50" },
        { label: "Total Deliveries", value: stats.totalDeliveries, icon: <Package />, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Revenue", value: `Rs. ${stats.revenue}`, icon: <DollarSign />, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
                    <p className="text-slate-500">System performance and management dashboard</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-50"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Recent Deliveries</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-xs font-bold uppercase border-b border-slate-50">
                                    <th className="pb-4 px-2">Order ID</th>
                                    <th className="pb-4 px-2">Customer</th>
                                    <th className="pb-4 px-2">Status</th>
                                    <th className="pb-4 px-2 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {deliveries.slice(0, 10).map((order) => (
                                    <tr key={order.id} className="text-sm">
                                        <td className="py-4 px-2 font-bold">#{order.trackingId}</td>
                                        <td className="py-4 px-2">{order.customer?.name}</td>
                                        <td className="py-4 px-2">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                                order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                                                    order.status === "PENDING" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right font-bold">Rs. {order.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                        <h3 className="text-xl font-bold mb-6">Active Users</h3>
                        <div className="space-y-4">
                            {users.slice(0, 8).map((u) => (
                                <div key={u.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{u.role}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HealthItem({ label, value, status }: { label: string; value: string; status: string }) {
    return (
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <span className="text-sm font-medium text-slate-600">{label}</span>
            <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-800">{value}</span>
                <ArrowUpRight size={14} className="text-slate-400" />
            </div>
        </div>
    );
}
