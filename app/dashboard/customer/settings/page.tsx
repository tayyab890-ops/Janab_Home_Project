"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Lock, Save, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        phone: "",
        email: "", // email is usually not changeable without extra verification
    });
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            if (res.ok) {
                setProfile({
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                });
            }
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                }),
            });
            if (res.ok) {
                toast.success("Profile updated successfully");
                fetchProfile();
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: passwords.newPassword,
                }),
            });
            if (res.ok) {
                toast.success("Password changed successfully");
                setPasswords({ newPassword: "", confirmPassword: "" });
            } else {
                throw new Error("Failed to change password");
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500">Manage your account and preferences</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
                >
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <User className="text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">Profile Details</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <Input
                            label="Full Name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            placeholder="Your name"
                        />
                        <Input
                            label="Email Address"
                            value={profile.email}
                            disabled
                            className="bg-slate-50 opacity-70"
                        />
                        <Input
                            label="Phone Number"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="+92 300 1234567"
                        />
                        <Button type="submit" loading={saving} className="w-full rounded-2xl">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </form>
                </motion.div>

                {/* Password Change */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
                >
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-secondary/10 p-3 rounded-2xl">
                            <Lock className="text-secondary" />
                        </div>
                        <h2 className="text-xl font-bold">Security</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <Input
                            label="New Password"
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                        <Button type="submit" variant="secondary" loading={saving} className="w-full rounded-2xl">
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
