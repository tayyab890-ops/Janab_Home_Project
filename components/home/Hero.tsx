"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bike, Shield, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const riderY = useTransform(scrollYProgress, [0, 1], [0, 400]);
    const riderOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-28 pb-12 md:pt-20 md:pb-0">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent rounded-l-full hidden md:block" />
            <div className="absolute top-40 -left-20 -z-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center w-full">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center md:text-left flex flex-col items-center md:items-start order-1 md:order-1"
                >
                    <div className="inline-flex items-center space-x-2 bg-accent/50 px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-secondary rounded-full animate-ping" />
                        <span className="text-sm font-semibold text-primary">Now serving KTS & Haripur</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Fast & Reliable <br />
                        <span className="text-primary italic">Delivery</span> in <br />
                        <span className="text-secondary">KTS & Haripur</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 mb-8 max-w-lg">
                        Whether it's food, documents, or parcels - we deliver anything, anytime. Experience the most trusted delivery service in your city.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <Link
                            href="/dashboard"
                            className="gradient-btn px-8 py-4 rounded-full font-bold flex items-center justify-center space-x-2 text-lg shadow-primary/20 shadow-xl"
                        >
                            <span>Book Delivery</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/track"
                            className="px-8 py-4 rounded-full font-bold flex items-center justify-center space-x-2 border-2 border-slate-200 hover:border-primary/20 hover:bg-primary/5 transition-all text-lg"
                        >
                            Track Order
                        </Link>
                    </div>
                </motion.div>

                {/* Animated Rider Illustration */}
                <div className="relative h-[300px] md:h-[450px] flex items-center justify-center order-2 md:order-2">
                    <motion.div
                        style={{
                            y: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : riderY,
                            opacity: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : riderOpacity
                        }}
                        animate={{ x: [0, 20, 0] }}
                        transition={{
                            x: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                        }}
                        className="relative z-10"
                    >
                        <div className="relative">
                            {/* Rider Shape */}
                            <div className="w-48 h-48 md:w-64 md:h-64 bg-primary/10 rounded-3xl flex items-center justify-center glass shadow-2xl overflow-hidden group border border-white/20">
                                <Bike className="w-24 h-24 md:w-32 md:h-32 text-primary group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -bottom-4 right-4 bg-secondary p-3 md:p-4 rounded-2xl shadow-lg">
                                    <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                            </div>

                            {/* Dynamic Path Lines */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ x: [0, -100], opacity: [0, 0.5, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: i * 0.5,
                                    }}
                                    className="absolute h-1 bg-gradient-to-r from-secondary/50 to-transparent rounded-full"
                                    style={{
                                        top: `${30 + i * 20}%`,
                                        left: "100%",
                                        width: "60px md:80px",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Background Decor */}
                    <div className="absolute inset-x-0 bottom-0 md:inset-0 bg-primary/5 rounded-full blur-3xl -z-10 scale-150 md:scale-100" />
                </div>
            </div>
        </section>
    );
}
