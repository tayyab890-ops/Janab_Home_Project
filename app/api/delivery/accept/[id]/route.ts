import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = (await headers()).get("user-id");
        const userRole = (await headers()).get("user-role");

        if (!userId || userRole !== "RIDER") {
            return NextResponse.json({ error: "Unauthorized: Only riders can accept deliveries" }, { status: 403 });
        }

        const { id } = await params;

        const delivery = await prisma.delivery.findUnique({
            where: { id },
        });

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        if (delivery.status !== "PENDING" || delivery.riderId !== null) {
            return NextResponse.json({ error: "Delivery not available" }, { status: 400 });
        }

        const updatedDelivery = await prisma.delivery.update({
            where: { id },
            data: {
                riderId: userId,
                status: "ACCEPTED",
            },
        });

        return NextResponse.json(updatedDelivery);
    } catch (error) {
        console.error("Accept delivery error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
