"use client";

import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster position="top-right" />
            <AnimatePresence mode="wait">
                {children}
            </AnimatePresence>
        </>
    );
}
