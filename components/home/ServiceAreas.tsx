"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const areas = [
    "KTS Sector 1", "KTS Sector 2", "KTS Sector 3", "KTS Sector 4",
    "Haripur City", "Khalabat Township", "Baldher", "Serai Saleh",
    "TIP Housing Colony", "Shah Maqsood", "Hattar Road", "Sultanpur"
];

export default function ServiceAreas() {
    return (
        <section className="py-16 md:py-24 bg-primary text-white relative overflow-hidden">
            {/* Decorative Map Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16">
                    <div className="text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Areas We Serve</h2>
                        <p className="text-primary-foreground/70 max-w-lg text-sm md:text-base">
                            We are expanding rapidly! Currently, we cover all major sectors of KTS and Haripur.
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center space-x-4"
                    >
                        <div className="bg-secondary p-3 rounded-full">
                            <MapPin className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium opacity-70">Active Riders</p>
                            <p className="text-2xl font-bold">50+ Near You</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {areas.map((area, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-colors cursor-default"
                        >
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <span className="font-medium">{area}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
