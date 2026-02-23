import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Start a transaction to ensure atomic deletion
        await prisma.$transaction(async (tx) => {
            // 1. Find all deliveries where this user is the customer
            const deliveries = await tx.delivery.findMany({
                where: { customerId: id },
                select: { id: true }
            });
            const deliveryIds = deliveries.map(d => d.id);

            // 2. Delete locations for these deliveries
            if (deliveryIds.length > 0) {
                await tx.location.deleteMany({
                    where: { deliveryId: { in: deliveryIds } }
                });
            }

            // 3. Delete the deliveries where user is the customer
            await tx.delivery.deleteMany({
                where: { customerId: id }
            });

            // 4. Update deliveries where user is a rider (set riderId to null)
            await tx.delivery.updateMany({
                where: { riderId: id },
                data: { riderId: null }
            });

            // 5. Finally, delete the user
            await tx.user.delete({
                where: { id },
            });
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
