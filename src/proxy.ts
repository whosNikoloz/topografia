import { NextResponse, type NextRequest } from "next/server";

// ponytail: only job is to tell the root layout which language the URL is in,
// so <html lang> is correct for Google and screen readers.
export function proxy(req: NextRequest) {
  const locale = req.nextUrl.pathname.split("/")[1] ?? "";
  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|uploads|logo).*)"],
};
