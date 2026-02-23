import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";

const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = (await headers()).get("user-id");
        const userRole = (await headers()).get("user-role");

        if (!userId || userRole !== "RIDER") {
            return NextResponse.json({ error: "Unauthorized: Only riders can update location" }, { status: 403 });
        }

        const { id } = await params; // id is deliveryId
        const body = await req.json();
        const { latitude, longitude } = locationSchema.parse(body);

        const delivery = await prisma.delivery.findUnique({
            where: { id },
        });

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        if (delivery.riderId !== userId) {
            return NextResponse.json({ error: "Forbidden: Not assigned to this delivery" }, { status: 403 });
        }

        const updatedLocation = await prisma.location.upsert({
            where: { deliveryId: id },
            update: { latitude, longitude },
            create: {
                deliveryId: id,
                latitude,
                longitude,
            },
        });

        return NextResponse.json(updatedLocation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Update location error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
