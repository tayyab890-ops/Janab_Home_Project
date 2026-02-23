import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
    try {
        const userId = (await headers()).get("user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deliveries = await prisma.delivery.findMany({
            where: {
                OR: [
                    { customerId: userId },
                    { riderId: userId }
                ]
            },
            include: {
                customer: { select: { name: true, phone: true } },
                rider: { select: { name: true, phone: true } },
                location: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Fetch deliveries error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
