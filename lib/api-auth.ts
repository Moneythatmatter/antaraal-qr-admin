import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/jwt";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { unauthorizedJson } from "@/lib/auth-session";

export async function requireAdminApi() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyAdminToken(token))) {
    return unauthorizedJson();
  }
  return null;
}
