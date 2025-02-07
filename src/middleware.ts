import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/auth/login']

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')
    const systemId = request.cookies.get('systemId')
    const { pathname } = request.nextUrl

    console.log('Middleware check:', {
        pathname,
        authToken: !!authToken,
        systemId: !!systemId
    });

    // Allow login page
    if (publicPaths.includes(pathname)) {
        return NextResponse.next()
    }

    // Allow OTP verification page if systemId exists
    if (pathname === '/auth/otp-verification') {
        if (!systemId) {
            // Redirect to login if no systemId
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.next()
    }

    // For all other routes, require auth token
    if (!authToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - .svg (SVG assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
    ],
}