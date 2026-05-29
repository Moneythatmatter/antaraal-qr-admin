"use client";

import axios from "axios";

let interceptorInstalled = false;

export function redirectToLogin(expired = true) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (expired) params.set("expired", "1");
  const query = params.toString();
  window.location.href = query ? `/login?${query}` : "/login";
}

export function setupAxiosAuthInterceptor() {
  if (interceptorInstalled) return;
  interceptorInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const url = error.config?.url ?? "";
        if (!url.includes("/api/auth/login")) {
          redirectToLogin(true);
        }
      }
      return Promise.reject(error);
    }
  );
}
