import "server-only";

/** Bot backend-i (FastAPI /web/v1) ilə yalnız serverdən danışılır; secret brauzerə getmir. */
export const SESSION_COOKIE = "nb_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

function config() {
  const base = process.env.BOT_API_URL?.replace(/\/$/, "");
  const secret = process.env.INTERNAL_WEB_API_SECRET;
  if (!base || !secret) return null;
  return { base: `${base}/web/v1`, secret };
}

export function isConfigured() {
  return config() !== null;
}

type CallOptions = {
  method: string;
  path: string;
  token?: string;
  clientIp?: string;
  body?: BodyInit | null;
  contentType?: string | null;
};

export async function callBot({ method, path, token, clientIp, body, contentType }: CallOptions) {
  const cfg = config();
  if (!cfg) throw new Error("BOT_API_URL və ya INTERNAL_WEB_API_SECRET təyin olunmayıb");

  const headers: Record<string, string> = { Authorization: `Bearer ${cfg.secret}` };
  if (token) headers["X-Web-Session"] = token;
  if (clientIp) headers["X-Client-IP"] = clientIp;
  if (contentType) headers["Content-Type"] = contentType;

  return fetch(`${cfg.base}${path}`, { method, headers, body, cache: "no-store" });
}

export async function createSession(clientIp?: string): Promise<string | null> {
  const response = await callBot({ method: "POST", path: "/session", clientIp });
  if (!response.ok) return null;
  const data = (await response.json()) as { token?: string };
  return data.token ?? null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
