"use client";

import { useState, useEffect } from "react";
import { Navigation, MapPin, CheckCircle, Package } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/track/LiveMap"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center">Loading Map...</div>
});

export default function RiderDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [activeTask, setActiveTask] = useState<any>(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyDeliveries();
    }, []);

    const fetchMyDeliveries = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/delivery/my", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setDeliveries(data);
                const active = data.find((d: any) => d.status !== 'DELIVERED');
                if (active) {
                    setActiveTask(active);
                    setStatus(active.status.toLowerCase());
                } else {
                    setActiveTask(null);
                    setStatus("");
                }
            }
        } catch (err) {
            console.error("Fetch deliveries failed", err);
        } finally {
            setLoading(false);
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
        <div className="space-y-8 max-w-5xl mx-auto py-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Deliveries</h1>
                <p className="text-slate-500">Manage your current and past deliveries.</p>
            </div>

            {loading ? (
                <div className="h-64 bg-white rounded-[3rem] animate-pulse" />
            ) : activeTask ? (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <Navigation size={24} className="text-primary" />
                            <span>Active Order: {activeTask.trackingId}</span>
                        </h2>
                        <div className="h-[400px] w-full rounded-2xl overflow-hidden mb-6">
                            <LiveMap order={activeTask} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
                                <p className="font-bold text-sm">{activeTask.pickupAddress}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Drop-off</p>
                                <p className="font-bold text-sm">{activeTask.deliveryAddress}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl text-white flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <CheckCircle className="text-secondary" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50 font-bold uppercase">Status</p>
                                    <p className="font-bold capitalize">{status.replace("_", " ")}</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={updateStatus}
                                disabled={status === 'delivered'}
                            >
                                {status === 'accepted' ? 'Confirm Pickup' : status === 'picked_up' ? 'Start Journey' : status === 'on_the_way' ? 'Mark Delivered' : 'Completed'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No active deliveries. Go to "Available Tasks" to find work!</p>
                </div>
            )}
        </div>
    );
}
