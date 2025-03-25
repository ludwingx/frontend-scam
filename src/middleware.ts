// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Rutas públicas (no requieren autenticación)
    const publicPaths = ['/signin'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // Si no hay token y la ruta no es pública, redirigir a /signin
    // if (!token && !isPublicPath) {
    //     return NextResponse.redirect(new URL('/signin', request.url));
    // }

    // Si hay token y está en una ruta pública, redirigir al dashboard
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si hay token y está en la ruta raíz, redirigir al dashboard
    if (token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};