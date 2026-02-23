import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ trackingId: string }> }
) {
    try {
        const { trackingId } = await params;

        const delivery = await prisma.delivery.findUnique({
            where: { trackingId },
            include: {
                customer: { select: { name: true } },
                rider: { select: { name: true, phone: true } },
                location: true,
            },
        });

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        return NextResponse.json(delivery);
    } catch (error) {
        console.error("Track delivery error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
