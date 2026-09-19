import { NextResponse, type NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "@/server/modules/auth/session";

const PUBLIC_PATHS = ["/login", "/signup"];

/**
 * Gatekeeps page navigation only. API routes do their own check via
 * requireUser(), because they need to return 401 JSON rather than redirect.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(COOKIE_NAME)?.value);
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!session && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.svg|opengraph.jpg|robots.txt).*)"],
};
