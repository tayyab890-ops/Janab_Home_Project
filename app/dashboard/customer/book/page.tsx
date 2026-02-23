"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Send } from "lucide-react";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function BookDeliveryPage() {
    const [weight, setWeight] = useState("");
    const [price, setPrice] = useState(0);
    const [pickup, setPickup] = useState("");
    const [delivery, setDelivery] = useState("");
    const [itemType, setItemType] = useState("Document");
    const [loading, setLoading] = useState(false);

    const calculatePrice = (val: string) => {
        setWeight(val);
        const w = parseFloat(val);
        if (!isNaN(w)) {
            setPrice(Math.max(150, w * 50));
        } else {
            setPrice(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading("Booking delivery...");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/delivery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pickupAddress: pickup,
                    deliveryAddress: delivery,
                    itemType,
                    weight: parseFloat(weight),
                    price,
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Booking failed");

            toast.success(`Booking confirmed! Tracking ID: ${result.trackingId}`, { id: loadingToast });
            setPickup("");
            setDelivery("");
            setWeight("");
            setPrice(0);
        } catch (err: any) {
            toast.error(err.message, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100"
            >
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-secondary/10 p-3 rounded-2xl">
                        <Package className="text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold">Book a New Delivery</h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Pickup Address"
                            placeholder="Street 5, KTS Sector 1"
                            icon={<MapPin size={18} />}
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            required
                        />
                        <Input
                            label="Delivery Address"
                            placeholder="Main Bazaar, Haripur"
                            icon={<MapPin size={18} />}
                            value={delivery}
                            onChange={(e) => setDelivery(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="w-full space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Item Type</label>
                            <select
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 outline-none transition-all"
                                value={itemType}
                                onChange={(e) => setItemType(e.target.value)}
                            >
                                <option>Document</option>
                                <option>Food / Grocery</option>
                                <option>Electronic</option>
                                <option>Cloth / Parcel</option>
                            </select>
                        </div>
                        <Input
                            label="Weight (kg)"
                            placeholder="2.5"
                            type="number"
                            value={weight}
                            onChange={(e) => calculatePrice(e.target.value)}
                            required
                        />
                        <div className="w-full space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Estimated Price</label>
                            <div className="px-5 py-3 rounded-2xl bg-slate-100 font-bold text-lg text-primary flex items-center">
                                Rs. {price > 0 ? price : "---"}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full gradient-btn py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                    >
                        <Send size={20} />
                        <span>{loading ? "Processing..." : "Confirm Booking"}</span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
