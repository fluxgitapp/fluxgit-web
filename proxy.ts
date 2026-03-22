import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("fb-session")?.value;
  const role = request.cookies.get("fb-role")?.value;

  // Protect Admin Console
  if (pathname.startsWith("/admin/console")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Prevent logged-in admins from going to admin login
  if (pathname === "/admin/login" && session && role === "admin") {
    return NextResponse.redirect(new URL("/admin/console", request.url));
  }

  // Protect regular dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
