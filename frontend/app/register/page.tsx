"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPw) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10
      ? 2
      : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-emerald-500"][strength];

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-4xl">✂️</span>
            <h1 className="mt-3 text-2xl font-bold text-zinc-900">Create your account</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Free forever · No credit card needed
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Full name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
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
              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength >= lvl ? strengthColor : "bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Confirm password
              </label>
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={`w-full rounded-xl border bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 ${
                  confirmPw && confirmPw !== password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200"
                }`}
              />
              {confirmPw && confirmPw !== password && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
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
                  Creating account…
                </span>
              ) : (
                "Create Account"
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
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
