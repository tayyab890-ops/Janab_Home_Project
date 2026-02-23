"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { Bike, ChevronRight, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import Button from "@/components/ui/Button";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        const loadingToast = toast.loading("Logging in...");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Login failed");
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            toast.success("Welcome back!", { id: loadingToast });
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Invalid credentials", { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
                        <div className="text-center mb-10">
                            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                                <div className="bg-primary p-2 rounded-xl">
                                    <Bike className="text-white h-6 w-6" />
                                </div>
                                <span className="text-2xl font-bold text-primary">Janab</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
                            <p className="text-slate-500 mt-2">Please enter your details to login</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Email Address"
                                placeholder="name@example.com"
                                type="email"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <div className="space-y-1">
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    {...register("password")}
                                    error={errors.password?.message}
                                />
                                <div className="flex justify-end pr-1">
                                    <Link href="#" className="text-sm font-semibold text-primary hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 ml-1">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                    {...register("remember")}
                                />
                                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">
                                    Remember me for 30 days
                                </label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                loading={isLoading}
                                className="w-full rounded-2xl"
                            >
                                <span>Login</span>
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-500">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
}
