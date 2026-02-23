"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { Bike, User, Mail, Phone, Lock, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import Button from "@/components/ui/Button";

const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["customer", "rider"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: "customer",
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        const loadingToast = toast.loading("Creating your account...");

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    password: data.password,
                    role: data.role.toUpperCase(),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Signup failed");
            }

            toast.success("Account created successfully!", { id: loadingToast });
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.", { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid md:grid-cols-2"
                >
                    {/* Left Side - Design */}
                    <div className="hidden md:flex flex-col justify-between p-10 bg-primary text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <Link href="/" className="flex items-center space-x-2 mb-8">
                                <Bike className="text-secondary h-8 w-8" />
                                <span className="text-2xl font-bold">Janab</span>
                            </Link>
                            <h2 className="text-3xl font-bold mb-4 leading-tight">Join the fastest delivery network.</h2>
                            <p className="text-blue-100/70">Whether you're sending items or delivering them, we've got you covered.</p>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <CheckCircle className="text-secondary h-5 w-5" />
                                <span className="text-sm">Real-time tracking for all orders</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <CheckCircle className="text-secondary h-5 w-5" />
                                <span className="text-sm">Flexible earnings for riders</span>
                            </div>
                        </div>

                        {/* Abstract background objects */}
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                    </div>

                    {/* Right Side - Form */}
                    <div className="p-8 md:p-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-800">Sign Up</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login</Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    {...register("fullName")}
                                    error={errors.fullName?.message}
                                />
                                <Input
                                    label="Phone"
                                    placeholder="+92 300 1234567"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                />
                            </div>

                            <Input
                                label="Email Address"
                                placeholder="john@example.com"
                                type="email"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">I want to join as a</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            className="peer sr-only"
                                            value="customer"
                                            {...register("role")}
                                        />
                                        <div className="p-3 text-center rounded-xl border-2 border-slate-100 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-sm font-medium text-slate-600 peer-checked:text-primary">
                                            Customer
                                        </div>
                                    </label>
                                    <label className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            className="peer sr-only"
                                            value="rider"
                                            {...register("role")}
                                        />
                                        <div className="p-3 text-center rounded-xl border-2 border-slate-100 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-sm font-medium text-slate-600 peer-checked:text-primary">
                                            Rider
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    placeholder="••••••"
                                    type="password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <Input
                                    label="Confirm"
                                    placeholder="••••••"
                                    type="password"
                                    {...register("confirmPassword")}
                                    error={errors.confirmPassword?.message}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                loading={isLoading}
                                className="w-full mt-6 rounded-2xl"
                            >
                                <span>Create Account</span>
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
