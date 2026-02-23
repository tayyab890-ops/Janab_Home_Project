import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(["PENDING", "ACCEPTED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"]),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = (await headers()).get("user-id");
        const userRole = (await headers()).get("user-role");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status } = statusSchema.parse(body);

        const delivery = await prisma.delivery.findUnique({
            where: { id },
        });

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        // Only assigned rider or admin can update status
        if (userRole !== "ADMIN" && delivery.riderId !== userId) {
            return NextResponse.json({ error: "Forbidden: Not authorized to update this delivery" }, { status: 403 });
        }

        const updatedDelivery = await prisma.delivery.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(updatedDelivery);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Update status error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
