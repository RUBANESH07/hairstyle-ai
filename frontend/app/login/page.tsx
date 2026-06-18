"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-4xl">✂️</span>
            <h1 className="mt-3 text-2xl font-bold text-zinc-900">Welcome back</h1>
            <p className="mt-1 text-sm text-zinc-500">Sign in to your Hairstyle AI account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-12 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                  tabIndex={-1}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-200" />
            <span className="text-xs text-zinc-400">OR</span>
            <div className="flex-1 border-t border-zinc-200" />
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-zinc-900 hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
