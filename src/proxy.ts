import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

const intlMiddleware = createMiddleware(routing);

const legacyHosts = new Set([
  "getstackprep.vercel.app",
  "stackprep-fawn.vercel.app",
]);

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host && legacyHosts.has(host)) {
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      siteUrl,
    );
    return NextResponse.redirect(target, 301);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|icon|apple-icon|.*\\..*).*)"],
};
