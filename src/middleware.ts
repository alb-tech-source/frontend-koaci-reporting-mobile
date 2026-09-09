import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userRole = request.cookies.get("user_role")?.value;
  const path = request.nextUrl.pathname;

  if (path === "/") {
    if (userRole === "investor") {
      return NextResponse.redirect(new URL("/investor/portofolio", request.url));
    }
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/user/beranda", request.url));
    }
  }

  // Cegah akses tanpa izin ke rute Investor
  if (path.startsWith("/investor") && userRole !== "investor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Cegah akses tanpa izin ke rute User
  if (path.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/investor/:path*", "/user/:path*"],
};