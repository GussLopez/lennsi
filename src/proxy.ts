import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const { pathname } = request.nextUrl;

  const isGoSubdomain =
    hostname === "go.lennsi.com" || hostname === "go.localhost";

  if (isGoSubdomain) {
    const url = request.nextUrl.clone();

    url.pathname = `/go${pathname}`;

    return NextResponse.rewrite(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
