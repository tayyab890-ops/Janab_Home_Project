"use client";

import { motion } from "framer-motion";
import { ClipboardList, Navigation, CheckCircle } from "lucide-react";

const steps = [
    {
        title: "Book Delivery",
        desc: "Fill in the details and book your delivery in seconds.",
        icon: <ClipboardList className="w-10 h-10" />,
    },
    {
        title: "Rider Picks Up",
        desc: "Our nearest rider will pick up your item immediately.",
        icon: <Navigation className="w-10 h-10" />,
    },
    {
        title: "Delivered Safely",
        desc: "Your item is delivered to the destination safely.",
        icon: <CheckCircle className="w-10 h-10" />,
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-slate-500 text-sm md:text-base">Simple three-step process to get anything delivered.</p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-primary shadow-xl mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative">
                                    {step.icon}
                                    <div className="absolute -top-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-slate-500 max-w-xs">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
