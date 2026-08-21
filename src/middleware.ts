import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Hanya membaca Shadow Cookie yang sangat aman dan didukung penuh oleh Edge Runtime
  const userRole = request.cookies.get("user_role")?.value;
  const path = request.nextUrl.pathname;

  // 1. Jika pengguna mencoba ke halaman login ("/"), tapi sudah punya role, arahkan ke berandanya
  if (path === "/") {
    if (userRole === "investor") {
      return NextResponse.redirect(new URL("/investor/portofolio", request.url));
    }
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/user/beranda", request.url));
    }
  }

  // 2. Cegah akses tanpa izin ke rute Investor
  if (path.startsWith("/investor") && userRole !== "investor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Cegah akses tanpa izin ke rute User
  if (path.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika lolos semua pemeriksaan di atas, biarkan lewat!
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/investor/:path*", "/user/:path*"],
};