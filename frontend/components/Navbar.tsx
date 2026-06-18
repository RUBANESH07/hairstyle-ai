"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✂️</span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Hairstyle<span className="text-emerald-500">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition"
          >
            Home
          </Link>
          {user && (
            <Link
              href="/analyze"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition"
            >
              Analyze
            </Link>
          )}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-zinc-500 sm:inline">
                Hi, <span className="font-medium text-zinc-800">{user.name.split(" ")[0]}</span>
              </span>
              <Link
                href="/analyze"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition"
              >
                Analyze →
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
