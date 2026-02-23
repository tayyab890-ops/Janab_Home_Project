import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getAuthSession();

    if (!session) {
        redirect("/login");
    }

    // Redirect to the appropriate dashboard
    redirect(`/dashboard/${session.role.toLowerCase()}`);
}
