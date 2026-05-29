import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function unauthorizedJson(message = "Session expired. Please log in again.") {
  return clearSessionCookie(
    NextResponse.json({ message, code: "SESSION_EXPIRED" }, { status: 401 })
  );
}

export const LOGIN_PATH = "/login";

export function loginRedirect(requestUrl: string, fromPath?: string, expired = true) {
  const loginUrl = new URL(LOGIN_PATH, requestUrl);
  if (fromPath && fromPath !== LOGIN_PATH) {
    loginUrl.searchParams.set("from", fromPath);
  }
  if (expired) {
    loginUrl.searchParams.set("expired", "1");
  }
  return clearSessionCookie(NextResponse.redirect(loginUrl));
}
