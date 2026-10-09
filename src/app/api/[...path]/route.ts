import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { callBot, createSession, isConfigured, SESSION_COOKIE, sessionCookieOptions } from "@/lib/bot-api";

// AI resept axtarışı 20–40 saniyə çəkə bilər.
export const maxDuration = 60;

const SEGMENT = /^[a-z0-9-]{1,40}$/;
const MAX_BODY_BYTES = 6 * 1024 * 1024;

function error(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
}

/** Brauzerdən başqa saytın adından göndərilən sorğuları (CSRF) bloklayır. */
function isSameOrigin(request: NextRequest) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

async function handle(request: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params;
  if (path.length > 4 || !path.every((part) => SEGMENT.test(part)) || path[0] === "session") {
    return error(404, "not_found", "Tapılmadı.");
  }
  if (request.method !== "GET" && !isSameOrigin(request)) {
    return error(403, "forbidden", "Sorğu rədd edildi.");
  }
  if (!isConfigured()) {
    return error(503, "not_configured", "Web versiyası hələ qoşulmayıb. Bir az sonra yenidən cəhd et.");
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return error(413, "too_large", "Fayl çox böyükdür.");
  const body = request.method === "GET" || request.method === "HEAD" ? null : await request.arrayBuffer();
  if (body && body.byteLength > MAX_BODY_BYTES) return error(413, "too_large", "Fayl çox böyükdür.");

  const ip = clientIp(request);
  const jar = await cookies();
  let token = jar.get(SESSION_COOKIE)?.value;
  let issued: string | null = null;
  const target = `/${path.join("/")}${request.nextUrl.search}`;

  try {
    if (!token) {
      issued = await createSession(ip);
      if (!issued) return error(429, "rate_limited", "Çox sorğu göndərildi. Bir az sonra yenidən cəhd et.");
      token = issued;
    }

    const send = (sessionToken: string) =>
      callBot({
        method: request.method,
        path: target,
        token: sessionToken,
        clientIp: ip,
        body,
        contentType: request.headers.get("content-type"),
      });

    let upstream = await send(token);

    // Sessiya silinib və ya etibarsızdırsa, yeni anonim sessiya ilə bir dəfə təkrar cəhd.
    if (upstream.status === 401 && !issued) {
      const data = (await upstream.clone().json().catch(() => null)) as { code?: string } | null;
      if (data?.code === "session_invalid") {
        issued = await createSession(ip);
        if (issued) upstream = await send(issued);
      }
    }

    const payload = await upstream.text();
    const response = new NextResponse(payload, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
    });

    if (target.startsWith("/account") && request.method === "DELETE" && upstream.ok) {
      response.cookies.delete(SESSION_COOKIE);
    } else if (issued) {
      response.cookies.set(SESSION_COOKIE, issued, sessionCookieOptions);
    }
    return response;
  } catch {
    return error(503, "unavailable", "Serverə qoşulmaq alınmadı. Bir az sonra yenidən cəhd et.");
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
