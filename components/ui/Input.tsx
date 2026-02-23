"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent transition-all outline-none",
                            "focus:border-primary/20 focus:bg-white focus:shadow-lg focus:shadow-primary/5",
                            icon ? "pl-12" : "",
                            error ? "border-red-500 bg-red-50" : "",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
