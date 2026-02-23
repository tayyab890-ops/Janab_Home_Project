import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.split(" ")[1];

    // 1. Allow public paths and static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname.startsWith("/public") ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json)$/)
    ) {
        return NextResponse.next();
    }

    // 2. Check for token
    if (!token) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // 3. Verify JWT using jose (Edge compatible)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        const role = payload.role as string;
        const userId = payload.userId as string;

        // 4. Role-Based Access Control for Dashboards
        if (pathname.startsWith("/dashboard")) {
            // Root dashboard redirect
            if (pathname === "/dashboard") {
                return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
            }

            // Role specific restrictions
            if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
                return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
            }
            if (pathname.startsWith("/dashboard/customer") && role !== "CUSTOMER") {
                return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
            }
            if (pathname.startsWith("/dashboard/rider") && role !== "RIDER") {
                return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
            }
        }

        // 5. Role-Based Access Control for API routes
        if (pathname.startsWith("/api/admin") && role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }
        if (pathname.startsWith("/api/delivery/available") && role !== "RIDER") {
            return NextResponse.json({ error: "Forbidden: Rider access required" }, { status: 403 });
        }

        // 6. Pass user info to downstream request
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("user-id", userId);
        requestHeaders.set("user-role", role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error("Middleware JWT Verification Error:", error);
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/delivery/:path*", "/api/admin/:path*"],
};
