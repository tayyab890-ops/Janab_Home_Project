"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, MapPin, Package, Navigation, X } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const LiveMap = dynamic(() => import("@/components/track/LiveMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function RiderMapViewPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const fetchAllTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            // Fetch both available and my deliveries to show on map
            const [availRes, myRes] = await Promise.all([
                fetch("/api/delivery/available", { headers: { "Authorization": `Bearer ${token}` } }),
                fetch("/api/delivery/my", { headers: { "Authorization": `Bearer ${token}` } })
            ]);

            const availData = await availRes.json();
            const myData = await myRes.json();

            if (availRes.ok && myRes.ok) {
                // Combine them
                const combined = [
                    ...availData.map((t: any) => ({ ...t, type: 'available' })),
                    ...myData.filter((t: any) => t.status !== 'DELIVERED').map((t: any) => ({ ...t, type: 'active' }))
                ];
                setTasks(combined);
            }
        } catch (err) {
            console.error("Fetch tasks failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-[500px] md:h-full relative overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl bg-white mb-6">
            <div className="absolute top-6 left-6 z-20 space-y-2">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/20">
                    <h1 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                        <Navigation size={20} className="text-primary" />
                        <span>Rider Map View</span>
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">Viewing {tasks.length} tasks in Haripur</p>
                </div>
            </div>

            {/* In a real app, LiveMap would take an array of tasks. 
                For now, we'll use it to show the selected task or a default view.
                I'll enhance LiveMap if needed, but for the MVP I'll show a "Select a task" overlay. 
            */}
            <div className="h-full w-full">
                <LiveMap order={selectedTask || (tasks.length > 0 ? tasks[0] : null)} />
            </div>

            {/* Task List Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 z-20">
                <AnimatePresence>
                    {!selectedTask ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white/50 max-h-64 overflow-y-auto scrollbar-hide"
                        >
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Nearby Tasks</h3>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <button
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10 bg-white"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-xl ${task.type === 'active' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                                                <Bike size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-800 truncate w-32">{task.deliveryAddress}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{task.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary">Rs. {task.price}</p>
                                        </div>
                                    </button>
                                ))}
                                {tasks.length === 0 && !loading && (
                                    <p className="text-center text-slate-400 py-4 text-sm">No tasks found nearby.</p>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl text-white relative"
                        >
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20">
                                    <Bike size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selected Task</p>
                                    <h3 className="font-bold text-lg">#{selectedTask.trackingId}</h3>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start space-x-3">
                                    <MapPin size={18} className="text-secondary shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold">DESTINATION</p>
                                        <p className="text-sm font-medium">{selectedTask.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Package size={18} className="text-secondary shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold">ITEM TYPE</p>
                                        <p className="text-sm font-medium">{selectedTask.itemType} ({selectedTask.weight}kg)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold">EARNING</p>
                                    <p className="text-2xl font-bold text-primary">Rs. {selectedTask.price}</p>
                                </div>
                                {selectedTask.type === 'available' ? (
                                    <Button onClick={async () => {
                                        const loadingToast = toast.loading("Accepting task...");
                                        try {
                                            const token = localStorage.getItem("token");
                                            const res = await fetch(`/api/delivery/accept/${selectedTask.id}`, {
                                                method: "PUT",
                                                headers: { "Authorization": `Bearer ${token}` }
                                            });
                                            if (res.ok) {
                                                toast.success("Task accepted!", { id: loadingToast });
                                                fetchAllTasks();
                                                setSelectedTask(null);
                                            }
                                        } catch (err) {
                                            toast.error("Failed to accept task", { id: loadingToast });
                                        }
                                    }}>
                                        Accept This Task
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10"
                                        onClick={() => window.location.href = '/dashboard/rider'}
                                    >
                                        Go to dashboard
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
