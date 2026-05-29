"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Lock, Mail, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionExpired = searchParams.get("expired") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/login", { email, password });
      const from = searchParams.get("from") || "/";
      router.replace(from);
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#17281e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 overflow-hidden">
            <Image src="/images/buddha.png" alt="Antaraal" width={64} height={64} className="object-cover" />
          </div>
          <h1 className="font-serif font-semibold text-2xl text-white tracking-tight">
            Antaraal <span className="text-white/70">Admin</span>
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-bold mt-2">Staff login only</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] p-8 shadow-2xl border border-white/10 space-y-5"
        >
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-0.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin@antaraal.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-0.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          {sessionExpired && !error && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 font-medium">
              Your session has expired. Please sign in again.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#17281e] text-white py-3 rounded-xl font-bold text-sm hover:bg-zinc-900 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#17281e]" />}>
      <LoginForm />
    </Suspense>
  );
}
