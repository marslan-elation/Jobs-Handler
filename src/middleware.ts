import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/signin", "/api/signin"];

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (err) {
        console.log(err);
        return NextResponse.redirect(new URL("/signin", req.url));
    }
}

// ✅ Apply to these routes
export const config = {
    matcher: ["/dashboard/:path*", "/dashboard", "/api/protected/:path*"],
};
