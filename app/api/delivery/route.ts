import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { headers } from "next/headers";

const deliverySchema = z.object({
    pickupAddress: z.string(),
    deliveryAddress: z.string(),
    itemType: z.string(),
    weight: z.number(),
    price: z.number(),
});

export async function POST(req: Request) {
    try {
        const userId = (await headers()).get("user-id");
        const userRole = (await headers()).get("user-role");

        if (!userId || userRole !== "CUSTOMER") {
            return NextResponse.json({ error: "Unauthorized: Only customers can create deliveries" }, { status: 403 });
        }

        const body = await req.json();
        const validatedData = deliverySchema.parse(body);

        const trackingId = `JANAB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const delivery = await prisma.delivery.create({
            data: {
                ...validatedData,
                customerId: userId,
                trackingId,
                status: "PENDING",
            },
        });

        // Create initial location
        await prisma.location.create({
            data: {
                deliveryId: delivery.id,
                latitude: 0,
                longitude: 0,
            }
        });

        return NextResponse.json(delivery, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Create delivery error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
