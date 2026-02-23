import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const deliveries = await prisma.delivery.findMany({
            where: {
                status: "PENDING",
                riderId: null,
            },
            include: {
                customer: { select: { name: true, phone: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Fetch available deliveries error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
