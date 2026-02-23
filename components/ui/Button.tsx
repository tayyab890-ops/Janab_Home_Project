"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    loading?: boolean;
    children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
        const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

        const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();
            setRipples((prev) => [...prev, { x, y, id }]);
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== id));
            }, 600);
        };

        const variants = {
            primary: "gradient-btn shadow-lg shadow-primary/20",
            secondary: "bg-white text-primary border-2 border-transparent hover:border-primary/10 hover:bg-slate-50",
            outline: "border-2 border-slate-200 text-slate-700 hover:border-primary/20 hover:bg-primary/5",
            ghost: "text-slate-600 hover:bg-slate-100",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3",
            lg: "px-8 py-4 text-lg",
            xl: "px-10 py-5 text-xl font-bold",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addRipple}
                className={cn(
                    "relative overflow-hidden rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        children
                    )}
                </span>

                <AnimatePresence>
                    {ripples.map((ripple) => (
                        <motion.span
                            key={ripple.id}
                            initial={{ scale: 0, opacity: 0.5 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute bg-white/30 rounded-full pointer-events-none"
                            style={{
                                top: ripple.y - 10,
                                left: ripple.x - 10,
                                width: 20,
                                height: 20,
                            }}
                        />
                    ))}
                </AnimatePresence>
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export default Button;
