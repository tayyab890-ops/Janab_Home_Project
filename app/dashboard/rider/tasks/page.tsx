"use client";

import { useState, useEffect } from "react";
import { Bike, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AvailableTasksPage() {
    const [availableTasks, setAvailableTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableTasks();
    }, []);

    const fetchAvailableTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/delivery/available", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setAvailableTasks(data);
        } catch (err) {
            console.error("Fetch available failed", err);
        } finally {
            setLoading(false);
        }
    };

    const acceptTask = async (task: any) => {
        const loadingToast = toast.loading("Accepting task...");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/delivery/accept/${task.id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Task accepted!", { id: loadingToast });
                fetchAvailableTasks();
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to accept task");
            }
        } catch (err: any) {
            toast.error(err.message, { id: loadingToast });
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Available Tasks</h1>
                <p className="text-slate-500">Earn more by accepting nearby deliveries.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : availableTasks.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                    <Bike size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No tasks available right now. Check back later!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {availableTasks.map((task, idx) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="bg-primary/10 p-4 rounded-2xl h-fit">
                                    <Bike className="text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg">To: {task.deliveryAddress}</h3>
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                                            <MapPin size={14} className="text-secondary" />
                                            <span>From: {task.pickupAddress}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                                            <Package size={14} />
                                            <span>{task.itemType} • {task.weight} kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col items-center gap-4">
                                <span className="text-primary font-bold text-2xl">
                                    Rs. {task.price}
                                </span>
                                <Button onClick={() => acceptTask(task)}>
                                    Accept Task
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
