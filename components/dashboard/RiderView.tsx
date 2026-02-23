"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Bike, Navigation, MapPin, CheckCircle as CheckIcon, Package, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} width={24} height={24}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

const LiveMap = dynamic(() => import("@/components/track/LiveMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center">Loading Map...</div>
});

export default function RiderView() {
    const [availableTasks, setAvailableTasks] = useState<any[]>([]);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [user, setUser] = useState<any>(null);
    const [earnings, setEarnings] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchAvailableTasks();
        fetchMyDeliveries();
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
        }
    };

    const fetchMyDeliveries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/delivery/my", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                const active = data.find((d: any) => d.status !== 'DELIVERED');
                const completed = data.filter((d: any) => d.status === 'DELIVERED');
                if (active) {
                    setActiveTask(active);
                    setStatus(active.status.toLowerCase());
                }
                setCompletedCount(completed.length);
                setEarnings(completed.reduce((acc: number, curr: any) => acc + curr.price, 0));
            }
        } catch (err) {
            console.error("Fetch my deliveries failed", err);
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
                fetchMyDeliveries();
                fetchAvailableTasks();
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to accept task");
            }
        } catch (err: any) {
            toast.error(err.message, { id: loadingToast });
        }
    };

    const updateStatus = async () => {
        const nextStatusMap: any = {
            'accepted': 'PICKED_UP',
            'picked_up': 'ON_THE_WAY',
            'on_the_way': 'DELIVERED'
        };
        const nextStatus = nextStatusMap[status.toLowerCase()];
        if (!nextStatus) return;

        const loadingToast = toast.loading(`Updating status to ${nextStatus}...`);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/delivery/status/${activeTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                toast.success("Status updated!", { id: loadingToast });
                if (nextStatus === 'DELIVERED') {
                    setActiveTask(null);
                    setStatus("");
                }
                fetchMyDeliveries();
            } else {
                const err = await res.json();
                throw new Error(err.error || "Update failed");
            }
        } catch (err: any) {
            toast.error(err.message, { id: loadingToast });
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Ready to ride, {user?.name || "Rider"}? 🏍️</h1>
                    <p className="text-slate-500">You are currently <span className="text-green-500 font-bold">Online</span></p>
                </div>
                <div className="bg-primary/5 text-primary px-4 py-2 rounded-full font-bold text-sm">
                    Rider Account
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {!activeTask ? (
                        <>
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <Package size={24} className="text-primary" />
                                <span>Available Deliveries Nearby</span>
                            </h2>

                            <div className="space-y-4">
                                {availableTasks.length === 0 ? (
                                    <p className="text-slate-400 text-center py-10 bg-white rounded-3xl border-2 border-dashed">No tasks available right now.</p>
                                ) : availableTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 p-4 rounded-2xl h-fit">
                                                <Bike className="text-primary" />
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="font-bold text-lg">To: {task.deliveryAddress}</h3>
                                                    <p className="text-xs text-slate-400">ID: #{task.trackingId} • {task.itemType}</p>
                                                </div>
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin size={14} className="text-secondary" />
                                                        <span className="text-sm text-slate-600">From: {task.pickupAddress}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center gap-4">
                                            <div className="text-primary font-bold text-xl px-4 py-1">
                                                Rs. {task.price}
                                            </div>
                                            <Button onClick={() => acceptTask(task)}>
                                                Accept Task
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <Navigation size={24} className="text-primary" />
                                <span>Active Delivery: {activeTask.trackingId}</span>
                            </h2>

                            <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden h-[400px]">
                                <LiveMap order={activeTask} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Pickup</p>
                                    <p className="font-bold">{activeTask.pickupAddress}</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Drop-off</p>
                                    <p className="font-bold">{activeTask.deliveryAddress}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/10 rounded-2xl">
                                        <CheckIcon className="text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold">CURRENT STATUS</p>
                                        <p className="font-bold text-lg capitalize">{status.replace("_", " ")}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={updateStatus}
                                    disabled={status === 'delivered'}
                                >
                                    {status === 'accepted' ? 'Picked Up?' : status === 'picked_up' ? 'Start Journey' : status === 'on_the_way' ? 'Delivered?' : 'Completed'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
                        <h3 className="font-bold mb-4">Total Earnings</h3>
                        <p className="text-3xl font-bold text-slate-800">Rs. {earnings}</p>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-sm">
                            <span className="text-slate-500 font-medium">Completed</span>
                            <span className="font-bold text-primary">{completedCount} Orders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
