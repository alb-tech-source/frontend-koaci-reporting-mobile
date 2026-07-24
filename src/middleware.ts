import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const PROTECTED_PREFIX = "/investor";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  if (path === "/" && token) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role === "investor") {
        return NextResponse.redirect(new URL("/investor/portofolio", request.url));
      }
    } catch {
      // token rusak, tetap di halaman login
    }
  }

  if (!token && path.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && path.startsWith(PROTECTED_PREFIX)) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "investor") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",                  
    "/investor/:path*",   
    "/unauthorized"       
  ],
};