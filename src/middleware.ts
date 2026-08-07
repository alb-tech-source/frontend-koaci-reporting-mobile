import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  // Redirect dari halaman root berdasarkan role
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
      // token rusak, tetap di login
    }
  }

  // Protect /investor/* untuk investor saja
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

  // Protect /user/* untuk user saja
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