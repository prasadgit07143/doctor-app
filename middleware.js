import { NextResponse } from "next/server";

export function middleware(req) {
  const doctorCookie = req.cookies.get("doctor");
  const isAuthenticated = !!doctorCookie;
  const reqPath = req.nextUrl.pathname;

  if (!isAuthenticated && reqPath.startsWith("/doctors/home")) {
    const loginUrl = new URL("/doctors/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctors/home/:path*"],
};
