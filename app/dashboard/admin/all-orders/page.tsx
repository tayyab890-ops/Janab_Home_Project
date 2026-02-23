"use client";

import { useState, useEffect } from "react";
import { History, Search, Filter, Download } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AllOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/deliveries", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (err) {
            console.error("Fetch all orders failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">System Order History</h1>
                    <p className="text-slate-500">View and audit all historical delivery data.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all text-sm font-bold">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by tracking ID, customer, or rider..."
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-4 py-3 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 text-sm">
                            <Filter size={18} />
                            <span>Filter by Date</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 rounded-2xl overflow-hidden">
                                <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                    <th className="py-4 px-6 rounded-l-2xl">Date</th>
                                    <th className="py-4 px-4">Tracking ID</th>
                                    <th className="py-4 px-4">Customer</th>
                                    <th className="py-4 px-4">Rider</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-6 text-right rounded-r-2xl">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order, idx) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="text-sm group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-4 px-6 text-slate-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-800">
                                            #{order.trackingId}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700">{order.customer?.name}</span>
                                                <span className="text-[10px] text-slate-400">{order.customer?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {order.rider ? (
                                                <span className="text-slate-600">{order.rider.name}</span>
                                            ) : (
                                                <span className="text-slate-300 italic">No Rider</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                                order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                                                    order.status === "PENDING" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-primary">
                                            Rs. {order.price}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
