import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/setting';
import { NextResponse } from 'next/server';

const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher:createRouteMatcher([route]),
  allowedRules: routeAccessMap[route]
}))

export default clerkMiddleware(async (auth, req) => {
  // if (isProtectedRoute(req)) await auth.protect()

  const { sessionClaims, userId } = await auth();
  // if (!userId) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }

  const role = (sessionClaims?.metadata as {role?: string})?.role;
  for(const {matcher, allowedRules} of matchers){
    if(matcher(req) && !allowedRules.includes(role!)){
      if(!role) return;
      return NextResponse.redirect(new URL(`/${role}`, req.url))
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

