import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //redigir al dashboard si no tiene token de session, de lo contrario redirigir al login

  // if (request.nextUrl.pathname.startsWith("/login")) {
  //   const token = request.cookies.get("token");
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }

  //si estas en "/" redigiri al dashboard

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  //redirigir al login si no tiene token de session, de lo contrario redirigir al dashboard

  // if (request.nextUrl.pathname.startsWith("/login")) {
  //   const token = request.cookies.get("token");
  //   if (token) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }


  return NextResponse.next();
}