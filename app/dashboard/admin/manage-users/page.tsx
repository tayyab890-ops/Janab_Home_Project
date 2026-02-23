"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Mail, Phone, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) {
            console.error("Fetch users failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
                    <p className="text-slate-500">Manage all registered customers, riders, and admins.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-sm w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user, idx) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${user.role === 'ADMIN' ? 'bg-red-50 text-red-600' :
                                        user.role === 'RIDER' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {user.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{user.name}</h3>
                                    <div className="flex items-center space-x-1">
                                        <Shield size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">{user.role}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <Mail size={14} />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <Phone size={14} />
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                            <button className="w-full py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                                View Full Profile
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
