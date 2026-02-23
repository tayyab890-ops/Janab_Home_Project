"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/delivery/my", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (err) {
            console.error("Fetch orders failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Order History</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No orders found in your history.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={order.id}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="bg-slate-50 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-bold text-lg">#{order.trackingId}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">To: {order.deliveryAddress}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-primary">Rs. {order.price}</p>
                                <p className="text-xs text-slate-400 flex items-center justify-end space-x-1">
                                    <Clock size={12} />
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
