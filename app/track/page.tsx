"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, MapPin, Truck, CheckCircle, Navigation } from "lucide-react";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

import PageWrapper from "@/components/shared/PageWrapper";
import Button from "@/components/ui/Button";

// Dynamically import map to avoid SSR issues with Leaflet
const LiveMap = dynamic(() => import("@/components/track/LiveMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center">Loading Map...</div>
});

const statuses = [
    { id: "pending", label: "Pending", icon: <Package size={18} /> },
    { id: "picked", label: "Picked Up", icon: <CheckCircle size={18} /> },
    { id: "way", label: "On the Way", icon: <Truck size={18} /> },
    { id: "delivered", label: "Delivered", icon: <Navigation size={18} /> },
];

export default function TrackPage() {
    const [trackingId, setTrackingId] = useState("");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/delivery/track/${trackingId}`);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Order not found");
                setOrder(null);
            } else {
                setOrder({
                    id: data.trackingId,
                    status: data.status.toLowerCase(),
                    currentLocation: { lat: 33.998, lng: 72.933 }, // Default for now
                    origin: { lat: 34.008, lng: 72.913, name: data.pickupAddress },
                    destination: { lat: 33.988, lng: 72.953, name: data.deliveryAddress },
                    rider: data.rider ? { name: data.rider.name, phone: data.rider.phone } : null
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Delivery</h1>
                    <p className="text-slate-500">Enter your tracking ID to see real-time updates of your parcel.</p>
                </div>

                <div className="max-w-2xl mx-auto mb-16">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label=""
                                placeholder="Enter Tracking ID (e.g. JD-12345)"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="text-lg py-4"
                            />
                        </div>
                        <Button
                            type="submit"
                            loading={loading}
                            size="lg"
                            className="h-[58px] mt-2 shadow-lg shadow-primary/20"
                        >
                            {!loading && <Search size={24} />}
                            <span className="hidden md:inline">Track</span>
                        </Button>
                    </form>
                </div>

                <AnimatePresence>
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid lg:grid-cols-3 gap-12"
                        >
                            {/* Status & Details */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                                    <h3 className="font-bold text-xl mb-8">Delivery Status</h3>

                                    <div className="space-y-10 relative">
                                        {/* Progress Line */}
                                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

                                        {statuses.map((s, i) => {
                                            const isCompleted = ["pending", "picked", "way", "delivered"].indexOf(s.id) <= ["pending", "picked", "way", "delivered"].indexOf(order.status);
                                            const isCurrent = s.id === order.status;

                                            return (
                                                <div key={s.id} className="flex items-center space-x-6 relative z-10">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-primary text-white scale-110 shadow-lg" : "bg-slate-100 text-slate-400"
                                                        }`}>
                                                        {s.icon}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                                                            {s.label}
                                                        </p>
                                                        {isCurrent && <p className="text-xs text-primary font-bold uppercase animate-pulse">In Progress</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {order.rider ? (
                                    <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl">
                                        <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
                                            <Truck size={20} />
                                            <span>Rider Information</span>
                                        </h3>
                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                                                {order.rider.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{order.rider.name}</p>
                                                <p className="text-blue-200 text-sm">Active Now</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full">
                                            Call Rider
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-100 text-slate-500 p-8 rounded-[2rem] text-center">
                                        <p className="font-bold">No rider assigned yet</p>
                                        <p className="text-sm">Rider will be assigned shortly.</p>
                                    </div>
                                )}
                            </div>

                            {/* Live Map */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden h-[500px] relative">
                                    <LiveMap order={order} />
                                    <div className="absolute top-8 left-8 z-[1000] space-y-2">
                                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Current Location</p>
                                            <p className="font-bold text-slate-800">Heading towards {order.destination.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <LocationCard type="Pickup" name={order.origin.name} time="10:30 AM" color="blue" />
                                    <LocationCard type="Drop-off" name={order.destination.name} time="Estimated 11:15 AM" color="orange" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageWrapper>
    );
}

function LocationCard({ type, name, time, color }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-50 flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                <MapPin size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">{type}</p>
                <p className="font-bold text-slate-800">{name}</p>
                <p className="text-xs text-slate-500 mt-1">{time}</p>
            </div>
        </div>
    );
}
