import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { verifyAdminToken } from "@/lib/jwt";
import { clearSessionCookie } from "@/lib/auth-session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const valid = await verifyAdminToken(token);

  if (!valid) {
    return clearSessionCookie(
      NextResponse.json({ authenticated: false, expired: Boolean(token) }, { status: 401 })
    );
  }

  return NextResponse.json({ authenticated: true });
}
