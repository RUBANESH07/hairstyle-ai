"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Hairstyles", href: "/#hairstyles" },
  { label: "AI Try-On", href: "/#tryon" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
    setOpen(false);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled ? "rgba(10,10,10,0.82)" : "#0A0A0A",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.1)" : "transparent"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span
            aria-label="RH logo"
            style={{ width: 36, height: 36, borderRadius: 9, background: "var(--gold)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.04em", flexShrink: 0 }}
          >
            RH
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>
            Hairstyle<span style={{ color: "var(--gold)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center" style={{ gap: 4 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="nav-link-x">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center" style={{ gap: 10 }}>
          {user ? (
            <>
              <Link href="/analyze" className="btn btn-gold btn-sm">Analyze</Link>
              <span style={{ fontSize: 13, color: "var(--muted-dark)", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline-dark btn-sm">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-dark btn-sm">Log in</Link>
              <Link href="/register" className="btn btn-gold btn-sm">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, width: 42, height: 42, color: "#fff", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {open ? (
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px 24px" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "14px 0", color: "#fff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 16 }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {user ? (
              <>
                <Link href="/analyze" onClick={() => setOpen(false)} className="btn btn-gold">Analyze</Link>
                <button onClick={handleLogout} className="btn btn-outline-dark">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-outline-dark">Log in</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn btn-gold">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-link-x{position:relative;padding:8px 14px;font-size:14px;font-weight:500;color:#b5b5b5;text-decoration:none;transition:color .2s}
        .nav-link-x::after{content:"";position:absolute;left:14px;right:14px;bottom:2px;height:1px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
        .nav-link-x:hover{color:#fff}
        .nav-link-x:hover::after{transform:scaleX(1)}
      `}</style>
    </header>
  );
}
