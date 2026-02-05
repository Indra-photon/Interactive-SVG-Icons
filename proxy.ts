import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)'])
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth()

  if (!isAuthenticated && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn()
  }
},)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};