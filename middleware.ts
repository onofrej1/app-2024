import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        console.log(request.nextUrl);
        const { pathname } = request.nextUrl;
        const { token } = request.nextauth;

        if (pathname.startsWith('/test') && token?.role !== 'user') {
            //return NextResponse.rewrite(new URL('/access-denied', request.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        }
    }
)

export const config = { matcher: ['/test', '/dashboard'] }; 