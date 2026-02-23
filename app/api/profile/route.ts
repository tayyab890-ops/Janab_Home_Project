import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { headers } from "next/headers";

const profileSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    password: z.string().min(6).optional(),
});

export async function GET() {
    try {
        const headerList = await headers();
        const userId = headerList.get("user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const headerList = await headers();
        const userId = headerList.get("user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = profileSchema.parse(body);

        const updateData: any = {};
        if (validatedData.name) updateData.name = validatedData.name;
        if (validatedData.phone) updateData.phone = validatedData.phone;
        if (validatedData.password) {
            updateData.password = await bcrypt.hash(validatedData.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error("Profile PUT error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
