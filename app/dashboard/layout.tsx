import DashboardShell from "@/components/dashboard/DashboardShell";
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
        <DashboardShell role={session.role.toLowerCase() as any}>
            {children}
        </DashboardShell>
    );
}
