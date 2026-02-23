import { cookies } from "next/headers";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function getAuthSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        return {
            userId: payload.userId as string,
            role: payload.role as string,
            email: payload.email as string,
        };
    } catch (error) {
        return null;
    }
}
