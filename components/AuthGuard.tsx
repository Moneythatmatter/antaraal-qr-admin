"use client";

import { useEffect } from "react";
import axios from "axios";
import { redirectToLogin, setupAxiosAuthInterceptor } from "@/lib/axios-auth";

const SESSION_CHECK_MS = 60 * 1000; // re-check every minute

async function checkSession(): Promise<boolean> {
  try {
    const res = await axios.get("/api/auth/session");
    return res.data?.authenticated === true;
  } catch {
    return false;
  }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosAuthInterceptor();

    const verify = async () => {
      const valid = await checkSession();
      if (!valid) {
        redirectToLogin(true);
      }
    };

    verify();

    const interval = setInterval(verify, SESSION_CHECK_MS);

    const onFocus = () => {
      verify();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        verify();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return <>{children}</>;
}
