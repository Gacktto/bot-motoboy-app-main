import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Authentication middleware
export function middleware(request: NextRequest) {
  // Get the token from cookies instead of headers
  const token = request.cookies.get(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || "auth_token"
  )?.value;

  // Redirect to dashboard if token exists and path is / or /cadastro
  if (
    token &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/cadastro")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Check if the path starts with /dashboard
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // If no token is present for dashboard routes
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If token exists, verify it here
  try {
    // TODO: Add your token verification logic here
    // Example: verify JWT token

    // For invalid tokens, return unauthorized
    if (false /* replace with actual token validation */) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // If all checks pass, continue to the next middleware or route handler
  return NextResponse.next();
}

// Configure which routes should be protected
export const config = {
  matcher: [
    // Match root, cadastro and dashboard routes
    "/",
    "/cadastro",
    "/dashboard/:path*",
  ],
};
