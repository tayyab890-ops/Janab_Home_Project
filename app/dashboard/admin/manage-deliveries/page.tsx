"use client";

import { useState, useEffect } from "react";
import { Package, Truck, Search, MoreHorizontal, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ManageDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/deliveries", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setDeliveries(data);
        } catch (err) {
            console.error("Fetch deliveries failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Manage Deliveries</h1>
                    <p className="text-slate-500">Monitor and manage all system deliveries.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tracking ID..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-sm w-48"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-[2rem] border border-slate-100 h-96 animate-pulse" />
            ) : (
                <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-xs font-bold uppercase border-b border-slate-50">
                                    <th className="py-6 px-8">Order</th>
                                    <th className="py-6 px-4">Customer</th>
                                    <th className="py-6 px-4">Rider</th>
                                    <th className="py-6 px-4">Status</th>
                                    <th className="py-6 px-4 text-right">Route</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {deliveries.map((order, idx) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="text-sm hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="py-5 px-8">
                                            <div>
                                                <p className="font-bold text-slate-800">#{order.trackingId}</p>
                                                <p className="text-[10px] text-slate-400">{order.itemType}</p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <p className="font-medium text-slate-600">{order.customer?.name}</p>
                                        </td>
                                        <td className="py-5 px-4">
                                            {order.rider ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                                                        {order.rider.name[0]}
                                                    </div>
                                                    <span className="font-medium text-slate-600">{order.rider.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                order.status === "DELIVERED" ? "bg-green-100 text-green-600" :
                                                    order.status === "ON_THE_WAY" ? "bg-blue-100 text-blue-600" :
                                                        order.status === "PICKED_UP" ? "bg-purple-100 text-purple-600" :
                                                            order.status === "ACCEPTED" ? "bg-cyan-100 text-cyan-600" : "bg-orange-100 text-orange-600"
                                            )}>
                                                {order.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <div className="inline-flex flex-col items-end">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">To</p>
                                                <p className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{order.deliveryAddress}</p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
