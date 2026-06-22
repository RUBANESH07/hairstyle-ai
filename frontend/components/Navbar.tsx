"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "About",      href: "#about" },
  { label: "Hairstyles", href: "#hairstyles" },
  { label: "AI Try-On",  href: "#tryon" },
  { label: "Gallery",    href: "#gallery" },
  { label: "Contact",    href: "#contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
    setOpen(false);
  }

  const navBase: React.CSSProperties = {
    padding: "7px 14px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.18s, background 0.18s",
    fontFamily: "var(--font-body)",
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(11, 13, 23, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34,
            height: 34,
            background: "linear-gradient(135deg, #C8A96A 0%, #7C5CBF 100%)",
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            color: "#fff",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            ✂
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}>
            Hairstyle<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...navBase,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  background: active ? "var(--accent-low)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                Hi,{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>
                  {user.name.split(" ")[0]}
                </span>
              </span>
              <Link
                href="/analyze"
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#0B0D17",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  transition: "opacity 0.18s, transform 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.87";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Analyze →
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
              >
                Login
              </Link>
              <Link
                href="/register"
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#0B0D17",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  transition: "opacity 0.18s, transform 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.87";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text)",
            cursor: "pointer",
            padding: "7px 9px",
            lineHeight: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="6"  x2="17" y2="6"  />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "16px 20px 24px",
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "11px 0",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-muted)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border)",
                fontFamily: "var(--font-body)",
                transition: "color 0.15s",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {user ? (
              <>
                <Link
                  href="/analyze"
                  onClick={() => setOpen(false)}
                  style={{ textAlign: "center", padding: 12, borderRadius: 10, background: "var(--accent)", color: "#0B0D17", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}
                >
                  Analyze My Face →
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  style={{ textAlign: "center", padding: 12, borderRadius: 10, background: "var(--accent)", color: "#0B0D17", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-body)" }}
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  style={{ textAlign: "center", padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 14, textDecoration: "none", fontFamily: "var(--font-body)" }}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
