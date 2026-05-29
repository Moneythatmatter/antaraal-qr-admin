import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { LOGIN_PATH } from "@/lib/auth-session";
import { verifyAdminToken } from "@/lib/jwt";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!(await verifyAdminToken(token))) {
    cookieStore.delete(SESSION_COOKIE);
    redirect(`${LOGIN_PATH}?expired=1`);
  }

  return <AdminShell>{children}</AdminShell>;
}
