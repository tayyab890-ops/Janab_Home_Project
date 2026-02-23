"use client";

import { motion } from "framer-motion";
import { Clock, Shield, MapPin, Headphones, Smartphone, Zap } from "lucide-react";

const features = [
    {
        title: "Same-Day Delivery",
        description: "Get your items delivered within hours across KTS and Haripur.",
        icon: <Clock className="w-8 h-8 text-white" />,
        color: "bg-blue-600",
    },
    {
        title: "Live Tracking",
        description: "Know exactly where your rider is with real-time GPS tracking.",
        icon: <MapPin className="w-8 h-8 text-white" />,
        color: "bg-orange-500",
    },
    {
        title: "Secure Payments",
        description: "Multiple pay options with end-to-end security protocols.",
        icon: <Shield className="w-8 h-8 text-white" />,
        color: "bg-green-600",
    },
    {
        title: "24/7 Support",
        description: "Our team is always here to help you with your deliveries.",
        icon: <Headphones className="w-8 h-8 text-white" />,
        color: "bg-purple-600",
    },
    {
        title: "Mobile Friendly",
        description: "Book and manage deliveries easily from your smartphone.",
        icon: <Smartphone className="w-8 h-8 text-white" />,
        color: "bg-indigo-600",
    },
    {
        title: "Express Service",
        description: "Prioritized delivery for your most urgent documents.",
        icon: <Zap className="w-8 h-8 text-white" />,
        color: "bg-yellow-500",
    },
];

export default function Features() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Why Choose <span className="text-primary italic">Janab?</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                        We offer premium delivery services tailored for the local community with modern technology and reliability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                        >
                            <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-normal">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
