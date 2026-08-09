import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  if (path === "/" && token) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role === "investor") {
        return NextResponse.redirect(new URL("/investor/portofolio", request.url));
      }
      if (decoded.role === "user") {
        return NextResponse.redirect(new URL("/user/beranda", request.url));
      }
    } catch {
      // Token rusak, biarkan di halaman login
    }
  }

  // Proteksi rute /investor/* hanya untuk role "investor"
  if (path.startsWith("/investor")) {
    if (!token) return NextResponse.redirect(new URL("/", request.url));
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "investor") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Proteksi rute /user/* hanya untuk role "user"
  if (path.startsWith("/user")) {
    if (!token) return NextResponse.redirect(new URL("/", request.url));
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "user") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/investor/:path*", "/user/:path*"],
};