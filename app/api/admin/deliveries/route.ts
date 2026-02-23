import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const deliveries = await prisma.delivery.findMany({
            include: {
                customer: { select: { name: true, email: true } },
                rider: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(deliveries);
    } catch (error) {
        console.error("Fetch all deliveries error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
