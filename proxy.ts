import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)'])
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

// Check if Clerk is disabled via environment variable
const isClerkDisabled = process.env.NEXT_PUBLIC_CLERK_DISABLED === 'true';

// No-op middleware that just passes through without auth checks
const noOpMiddleware = (req: NextRequest) => {
  // Do nothing, just pass through
  return undefined;
};

// Default Clerk middleware with auth checks
const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    return redirectToSignIn()
  }
});

// Export the appropriate middleware based on NEXT_PUBLIC_CLERK_DISABLED
export default isClerkDisabled ? noOpMiddleware : clerkAuthMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
