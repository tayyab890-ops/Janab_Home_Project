import DashboardSidebar from "@/components/dashboard/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex bg-slate-50 min-h-screen pt-20">
            <DashboardSidebar role={session.role.toLowerCase() as any} />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
